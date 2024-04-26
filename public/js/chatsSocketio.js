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
    const totalUnreadCountElement = document.querySelector('.nav_notification');
    if (!roomElement && !totalUnreadCountElement) {
      console.log("No room element found for ID:", updatedRoom.roomId);
      return;
    }
    console.log("Room element",roomElement)
    const formattedTime = formatChatTime(updatedRoom.time);
    console.log("Room element1",formattedTime)
    roomElement.querySelector('.user-component__subtitle').textContent = updatedRoom.message;
    const time = roomElement.querySelector('.user-component__time').textContent = formattedTime;
    console.log("Room element time:",time)
    const unreadCountBadge = roomElement.querySelector('.unread_chat_count');
    console.log("Room element badge:",unreadCountBadge)
    if (!unreadCountBadge) {
        console.log("No badge element found for room ID:", updatedRoom.roomId);
      } else if (updatedRoom.unread_chat_count > 0) {
        unreadCountBadge.textContent = updatedRoom.unread_chat_count;
        unreadCountBadge.style.visibility = 'visible';
      } else {
        unreadCountBadge.style.visibility = 'hidden';
      }

      
    // 전체 읽지 않은 메시지 수 업데이트
    let totalUnreadCount = Array.from(document.querySelectorAll('.unread_chat_count'))
    .filter(unread_chat_count => unread_chat_count.style.visibility !== 'hidden')
    .reduce((acc, unread_chat_count) => acc + parseInt(unread_chat_count.textContent, 10) || 0, 0);
    localStorage.setItem('totalUnread', totalUnreadCount);
    
    console.log("읽지않은 메시지수",totalUnreadCount)
    if (totalUnreadCount > 0) {
        console.log("읽지않은 메시지수1",totalUnreadCount)
        totalUnreadCountElement.textContent = totalUnreadCount;
        totalUnreadCountElement.style.visibility = 'visible';
    } else {
        totalUnreadCountElement.style.visibility = 'hidden';
    }
    console.log("읽지않은 currentUserId",updatedRoom.receiverId,totalUnreadCount);
    socket.emit('requestUnreadUpdate', { receiverId: updatedRoom.receiverId, count: totalUnreadCount });
  });

  socket.on('chatRoomRead'), ({roomId, unread_Count,totalUnreadCount}) => {
    const roomElement = document.querySelector(`#room-${roomId}`);
    const totalUnreadCountElement = document.querySelector('.nav_notification');
    if (!roomElement && !totalUnreadCountElement) {
      console.log("No room element found for ID:", roomId);
      return;
    }
    console.log("Room element",roomElement,unread_Count)
    const unreadCountBadge = roomElement.querySelector('.unread_chat_count');
    console.log("Room element badge:",unreadCountBadge)
    if (!unreadCountBadge) {
        console.log("No badge element found for room ID:", roomId);
      } else if (unread_Count > 0) {
        unreadCountBadge.textContent = unread_Count;
        unreadCountBadge.style.visibility = 'visible';
      } else {
        unreadCountBadge.style.visibility = 'hidden';
      }

      
    // 전체 읽지 않은 메시지 수 업데이트
    console.log("읽지않은 메시지수",totalUnreadCount)
    if (totalUnreadCount > 0) {
        console.log("읽지않은 메시지수1",totalUnreadCount)
        totalUnreadCountElement.textContent = totalUnreadCount;
        totalUnreadCountElement.style.visibility = 'visible';
    } else {
        totalUnreadCountElement.style.visibility = 'hidden';
    }
    // console.log("읽지않은 currentUserId",updatedRoom.receiverId,totalUnreadCount);
    // socket.emit('requestUnreadUpdate', { receiverId: updatedRoom.receiverId, count: totalUnreadCount });
  }