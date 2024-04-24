const socket = io(); // 소켓 연결 초기화
const chatScreen = document.getElementById('chat-screen');
const currentUserId = chatScreen.getAttribute('data-user-id');
const currentRoomId = chatScreen.getAttribute('data-room-id');
// const senderName = document.querySelector(".message__author").textContent;
socket.emit('joinRoom', { currentRoomId, currentUserId });

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
                    socket.emit('chatMessage', { currentRoomId, userId:result.data.userId, message:result.data.message, messageId: result.data.messageId, profileImgUrl:result.data.profileImgUrl ,senderName: result.data.senderName, unreadCount: result.data.unreadCount, unread_chat_count: result.data.unread_chat_count});
                    scrollToBottom();
                  
                } else {
                    console.error('Failed to send message2');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    });


// // 메시지 전송 처리
// document.querySelector('.reply').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const messageInput = document.querySelector('#message-input');
//     const message = messageInput.value;
//     console.log("메시지전송",message);
//     if(message){
//         const { name, profileImgUrl,friendName } = participants[userId];
//         socket.emit('chatMessage', { roomId, userId, message,profileImgUrl,senderName:friendName,participantId});
//         console.log("메시지 전송처리",roomId, userId, message,profileImgUrl,friendName,participantId);
//         messageInput.value = '';
//     }
// });

 // 메시지 수신 처리
socket.on('message', ({ roomId, userId, message,messageId,time,profileImgUrl,senderName,unreadCount}) => {
    console.log("메시지 수신처리",userId, currentUserId, message);
    const messageContainer = document.querySelector('main.main-chat'); // 메시지를 표시할 컨테이너
    const isOwnMessage = userId === currentUserId; // 메시지가 자신의 것인지 판단
    const messageElement = document.createElement('div');

     // 만약 채팅방에 있고, 메시지를 보낸 사람이 자신이 아니라면 읽음 처리 요청
     if (userId !== currentUserId) {
        console.log("메시지 수신처리 아이디다름,읽음처리 실행",messageId, roomId, currentUserId)
        socket.emit('messageReadCount', { messageId, roomId, currentUserId });
    }

     // 시간 포맷팅
     const formattedTime = new Intl.DateTimeFormat('ko-kr', {
        hour: 'numeric', minute: 'numeric', hour12: true
    }).format(new Date(time));
    console.log("userId: ", userId, "currentUserId: ", currentUserId, "isOwnMessage: ", isOwnMessage, "senderName", senderName, "unreadCount:" ,unreadCount);
    const unreadCountDisplay = unreadCount > 0 ? `<span class="unread-count-${messageId}">${unreadCount}</span>` : '';
    if (isOwnMessage) {
        messageElement.classList.add('message-row--own');
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
    const unreadCountElement = document.querySelector(`.unread-count-${messageId}`);
    console.log("읽음처리 실행messageRead :",unreadCountElement,messageId,currentUserId,unread_Count )
    if (unreadCountElement) {
        if (+unread_Count === 0) {
            unreadCountElement.classList.add('read'); // 읽음 표시를 숨김
        } else {
            unreadCountElement.textContent = unread_Count; // 업데이트된 읽지 않은 메시지 수
        }
    }
});