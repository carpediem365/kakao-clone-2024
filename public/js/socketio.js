const socket = io(); // 소켓 연결 초기화
const chatScreen = document.getElementById('chat-screen');
const currentUserId = chatScreen.getAttribute('data-user-id');
const currentRoomId = chatScreen.getAttribute('data-room-id');

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.fa-bars'); // 메뉴 토글 버튼 선택
    const optionChoice = document.querySelector('.alt-header__column_option_choice'); // 옵션 메뉴 선택

    menuToggle.addEventListener('click', function() {
        // display 상태 토글
        optionChoice.style.display = optionChoice.style.display === 'block' ? 'none' : 'block';
    });

    // 메뉴 외부 클릭 시 메뉴 숨기기
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !optionChoice.contains(e.target)) {
            optionChoice.style.display = 'none';
        }
    });
});
// // 알림 권한 요청
// function requestNotificationPermission() {
//     console.log("알림메시지1")
//     if (!("Notification" in window)) {
//         console.error("This browser does not support desktop notification");
//     } else if (Notification.permission === "default") {
//         Notification.requestPermission(function(result){
//             if(result=='denied'){alert('알림을차단하셨습니다.\n브라우저의사이트설정에서변경하실수있습니다.');
//             returnfalse;}});

//     }
// }


socket.emit('joinRoom', { currentRoomId, currentUserId });
// socket.emit('setup',{currentUserId})
// 스크롤을 맨 아래로 내리는 함수 정의
function scrollToBottom() {
    const messageContainer = document.querySelector('main.main-chat');
    console.log("Scroll Height:", messageContainer.scrollHeight);
    console.log("Client Height:", messageContainer.clientHeight);
    console.log("Current Scroll Top:", messageContainer.scrollTop);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// 페이지 로드 시 스크롤 맨 아래로
window.onload = function() {
    console.log("페이지 로드시 스크롤")
    scrollToBottom();

};

const messageForm = document.getElementById('message-form');
// const roomId = document.body.getAttribute('data-room-id'); // 채팅방 ID를 body 태그의 데이터 속성에서 추출


    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        console.log("메시지 보냄 요청옴",messageInput)
        console.log("메시지 보냄 요청옴",message)
        if (message) {
            try {
                const response = await fetch(`/chat/send-message/${currentRoomId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Message sent successfully2:', result);
                    messageInput.value = ''; // 메시지 전송 후 입력 필드 초기화
                    socket.emit('chatMessage', { currentRoomId, userId:result.data.userId, message:result.data.message, messageId: result.data.messageId, profileImgUrl:result.data.profileImgUrl, friend_profileImgUrl:result.data.friend_profileImgUrl, senderName: result.data.senderName, unreadCount: result.data.unreadCount, unread_chat_count: result.data.unread_chat_count});
                    socket.emit('requestUnreadUpdate', { receiverId:result.data.receiverId, totalUnreadCount: result.data.totalUnreadCount });
                    scrollToBottom();
                  
                } else {
                    console.error('Failed to send message2');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    });

 // 메시지 수신 처리
socket.on('message', ({ roomId, userId, message,messageId,time,profileImgUrl,senderName,unreadCount}) => {
    console.log("메시지 수신처리",userId, currentUserId, message);
    const messageContainer = document.querySelector('main.main-chat'); // 메시지를 표시할 컨테이너
    const isOwnMessage = userId === currentUserId; // 메시지가 자신의 것인지 판단
    const messageElement = document.createElement('div');

     // 만약 채팅방에 있고, 메시지를 보낸 사람이 자신이 아니라면 읽음 처리 요청
     if (userId !== currentUserId) {
        console.log("메시지 수신처리 아이디다름,읽음처리 실행",messageId, roomId, currentUserId)
        socket.emit('messageReadCount', { messageId, roomId, currentUserId});
    }

     // 시간 포맷팅
     const formattedTime = new Intl.DateTimeFormat('ko-kr', {
        hour: 'numeric', minute: 'numeric', hour12: true
    }).format(new Date(time));
    console.log("userId: ", userId, "currentUserId: ", currentUserId, "isOwnMessage: ", isOwnMessage, "senderName", senderName, "unreadCount:" ,unreadCount);
    const unreadCountDisplay = unreadCount > 0 ? `<span class="unread-count-${messageId}">${unreadCount}</span>` : '';
    if (isOwnMessage) {
        messageElement.classList.add('message-row--own');
        messageElement.setAttribute('data-message-id', messageId);
        messageElement.innerHTML = `
            <div class="message-row__content">
                <div class="message__info">
                    <span class="message__bubble">${message}</span>
                    <span class="message__time">${formattedTime}</span>
                    ${unreadCountDisplay}
                </div>
            </div>
        `;
    } else {
        const senderImageUrl = profileImgUrl || '/images/basic_profile.jpg';
        messageElement.classList.add('message-row');
        messageElement.setAttribute('data-message-id', messageId);
        messageElement.innerHTML = `
        <img src="${senderImageUrl}" alt="">
        <div class="message-row__content">
        <span class="message__author">${senderName}</span>
            <div class="message__info">
                <span class="message__bubble">${message}</span>
                <span class="message__time">${formattedTime}</span>
                ${unreadCountDisplay}
            </div>
        </div>
    `;
    }

    messageContainer.appendChild(messageElement);
    scrollToBottom();
});

socket.on('messageRead', ({messageId,currentUserId,unread_Count}) => {
    console.log("messageRead 신호")
    const messageElements = document.querySelectorAll('.message-row, .message-row--own');
    messageElements.forEach(element => {
        console.log("messageRead1",element)
        const messageIds = parseInt(element.getAttribute('data-message-id'), 10); // 각 메시지 요소에서 messageId를 추출
        if (messageIds <= messageId) {
            console.log("messageRead1",messageIds)
            console.log("messageRead1",messageId)
            const unreadCountBadge = element.querySelector('.unread-count-' + messageIds);
            if (unreadCountBadge) {
                if (+unread_Count === 0) {
                    unreadCountBadge.classList.add('read'); // 읽음 표시를 숨김
                } else {
                    unreadCountBadge.textContent = unread_Count; // 업데이트된 읽지 않은 메시지 수
                }
            }
        }
    })
});

document.querySelector('.delete_chat').addEventListener('click', function() {
    if (!confirm('정말로 채팅방을 나가시겠습니까?')) {
        return;
    }
    fetch(`/chat/delete-chat/${currentRoomId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('친구가 성공적으로 삭제되었습니다.');
            window.location.href = '/chats'; // 페이지를 새로고침하여 변경사항 반영
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('친구 삭제 중 오류 발생:', error);
        alert('친구 삭제 과정에서 오류가 발생했습니다.');
    });
});

document.querySelector('.search-icon').addEventListener('click', () => {
    const input = document.getElementById('searchInput_chat');
    const  searchContainer = document.getElementById('search-container');
    const mainScreen = document.querySelector('.main-screen');
    if (searchContainer.style.display === 'none') {
        searchContainer.style.display = 'block';
        input.style.width = '95%';
        document.getElementById('search-buttons').style.display = 'none';
        mainScreen.style.paddingTop = '40px';
    } else {
        searchContainer.style.display = 'none';
        document.getElementById('search-buttons').style.display = 'none';
        mainScreen.style.paddingTop = '0px'; 
    }
});

let currentSearchIndex = 0;
let searchResults = [];

function searchChat(event) {
    if (event.keyCode === 13) {
        const input = document.getElementById('searchInput_chat');
        const filter = input.value.toUpperCase();
        const messages = document.querySelectorAll('.message__bubble');
        searchResults = [];
        currentSearchIndex = 0;

        if (filter.length > 0) {
            document.getElementById('search-buttons').style.display = 'inline-block';
            messages.forEach((msg, index) => {
                const text = msg.textContent || msg.innerText;
                if (text.toUpperCase().includes(filter)) {
                    searchResults.push(msg);
                    msg.innerHTML = text.replace(new RegExp(input.value, 'gi'), (match) => `<span class="highlight">${match}</span>`);
                } else {
                    msg.innerHTML = text; // Remove any existing highlights if the filter does not match
                }
            });

            if (searchResults.length > 0) {
                searchResults[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.style.width = '79%';
                document.getElementById('search-buttons').style.display = 'inline-block';
            } else {
                document.getElementById('search-buttons').style.display = 'none';
            }
        }
    }

}

function nextResult() {
    if (searchResults.length > 1) {
        currentSearchIndex = (currentSearchIndex + 1) % searchResults.length;
        searchResults[currentSearchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function previousResult() {
    if (searchResults.length > 1) {
        currentSearchIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        searchResults[currentSearchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearSearch() {
    document.getElementById('searchInput_chat').value = '';
    const messages = document.querySelectorAll('.message__bubble');
    messages.forEach(msg => {
        msg.innerHTML = msg.textContent || msg.innerText; // Restore original text
    });
    document.getElementById('search-buttons').style.display = 'none';
    document.getElementById('search-container').style.display = 'none';
}
// socket.on('messageRead', ({messageId,currentUserId,unread_Count}) => {
//     console.log("messageRead 신호")
//     const unreadCountElement = document.querySelector(`.unread-count-${messageId}`);
//     console.log("읽음처리 실행messageRead :",unreadCountElement,messageId,currentUserId,unread_Count )
//     if (unreadCountElement) {
//         if (+unread_Count === 0) {
//             unreadCountElement.classList.add('read'); // 읽음 표시를 숨김
//         } else {
//             unreadCountElement.textContent = unread_Count; // 업데이트된 읽지 않은 메시지 수
//         }
//     }
// })