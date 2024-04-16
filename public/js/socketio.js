const socket = io();
const chatScreen = document.getElementById('chat-screen');
const userId = chatScreen.getAttribute('data-user-id');
const currentUserId = chatScreen.getAttribute('data-user-id');
const roomId = chatScreen.getAttribute('data-room-id');
const imageElement = document.getElementById('chat-image');
const profileImgUrl =  imageElement ? imageElement.getAttribute('src') : '/images/basic_profile.jpg';
const senderName = document.querySelector(".message__author").textContent;
const participants = {};
document.querySelectorAll('.participant-info').forEach(el => {
    const userId = el.getAttribute('data-user-id');
    const name = el.getAttribute('data-name');
    const profileImgUrl = el.getAttribute('data-profile-img-url');
    const friendName = el.getAttribute('data-friend-name');
    participants[userId] = { name, profileImgUrl, friendName };
});
console.log("참가자",participants);
socket.emit('joinRoom', { roomId, userId });

// 메시지 전송 처리
document.querySelector('.reply').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.querySelector('#message-input');
    const message = messageInput.value;
    console.log("메시지전송",message);
    if(message){
        socket.emit('chatMessage', { roomId, userId, message,profileImgUrl,senderName});
        console.log("메시지 전송처리",roomId, userId, message,profileImgUrl,senderName);
        messageInput.value = '';
    }
});

 // 메시지 수신 처리
socket.on('message', ({ userId, message,time,profileImgUrl,senderName}) => {
    console.log("메시지 수신처리",userId, message);
    const messageContainer = document.querySelector('main.main-chat'); // 메시지를 표시할 컨테이너
    const isOwnMessage = userId === currentUserId; // 메시지가 자신의 것인지 판단
    const messageElement = document.createElement('div');
     // 시간 포맷팅
     const formattedTime = new Intl.DateTimeFormat('ko-kr', {
        hour: 'numeric', minute: 'numeric', hour12: true
    }).format(new Date(time));
    console.log("userId: ", userId, "currentUserId: ", currentUserId, "isOwnMessage: ", isOwnMessage, "senderName", senderName);
    if (isOwnMessage) {
        messageElement.classList.add('message-row--own');
        messageElement.innerHTML = `
            <div class="message-row__content">
                <div class="message__info">
                    <span class="message__bubble">${message}</span>
                    <span class="message__time">${formattedTime}</span>
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
            </div>
        </div>
    `;
    }

    messageContainer.appendChild(messageElement); // 메시지 컨테이너에 추가
    // 스크롤을 최신 메시지 위치로 이동
    messageContainer.scrollTop = messageContainer.scrollHeight;
});