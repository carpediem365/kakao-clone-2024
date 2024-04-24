const socket = io(); // 소켓 연결 초기화

// 시간 포맷팅 함수 추가
function formatChatTime(updatedAt) {
    const chatDate = new Date(updatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let formattedTime;

    if (chatDate.toDateString() === today.toDateString()) {
        formattedTime = chatDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } else if( chatDate.toDateString() === yesterday.toDateString()) {
        formattedTime = '어제';
    } else {
        formattedTime = chatDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    return formattedTime;
}

socket.on('updateChatsRoom', (updatedRoom) => {
    const roomElement = document.querySelector(`#room-${updatedRoom.roomId}`);
    if (!roomElement) {
      console.log("No room element found for ID:", updatedRoom.roomId);
      return;
    }
    console.log("Room element",roomElement)
    const formattedTime = formatChatTime(updatedRoom.time);
    console.log("Room element1",formattedTime)
    roomElement.querySelector('.user-component__subtitle').textContent = updatedRoom.message;
    const time = roomElement.querySelector('.user-component__time').textContent = formattedTime;
    console.log("Room element time:",time)
    const unreadCountBadge = roomElement.querySelector('.badge');
    console.log("Room element badge:",unreadCountBadge)
    if (!unreadCountBadge) {
        console.log("No badge element found for room ID:", updatedRoom.roomId);
      } else if (updatedRoom.unread_chat_count > 0) {
        unreadCountBadge.textContent = updatedRoom.unread_chat_count;
        unreadCountBadge.style.visibility = 'visible';
      } else {
        unreadCountBadge.style.visibility = 'hidden';
      }
  });