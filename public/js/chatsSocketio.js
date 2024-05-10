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
  console.log("updateChatsRoom", updatedRoom);
  let roomElement = document.querySelector(`#room-${updatedRoom.roomId}`);
  if (!roomElement) {
      roomElement = createRoomElement(updatedRoom);
      document.querySelector('main.main-screen').appendChild(roomElement);
  }

  updateRoomDetails(roomElement, updatedRoom);

    // 채팅방을 목록의 맨 위로 이동
    const mainScreen = document.querySelector('main.main-screen');
    mainScreen.insertBefore(roomElement, mainScreen.firstChild);
});

function createRoomElement(roomData) {
  const roomElement = document.createElement('div');
  roomElement.id = `room-${roomData.roomId}`;
  roomElement.className = 'user-component';
  roomElement.innerHTML = `
      <a href="chat/${roomData.roomId}">
          <div class="user-component__column">
          <img src="${roomData.friend_profileImgUrl || '/images/basic_profile.jpg'}" class="user-component__avatar">
              <div class="user-component__text">
                  <h4 class="user-component__title">${roomData.senderName || updatedRoom.userId}</h4>
                  <h6 class="user-component__subtitle">${roomData.message}</h6>
              </div>
          </div>
          <div class="user-component__column">
              <span class="user-component__time">${formatChatTime(roomData.time)}</span>
              <div class="unread_chat_count badge" style="visibility: hidden;">0</div>
          </div>
      </a>
  `;
  return roomElement;
}

function updateRoomDetails(roomElement, updatedRoom) {
  const formattedTime = formatChatTime(updatedRoom.time);
  roomElement.querySelector('.user-component__subtitle').textContent = updatedRoom.message;
  roomElement.querySelector('.user-component__time').textContent = formattedTime;
  const unreadCountBadge = roomElement.querySelector('.unread_chat_count');
  if (updatedRoom.unread_chat_count > 0) {
      unreadCountBadge.textContent = updatedRoom.unread_chat_count;
      unreadCountBadge.style.visibility = 'visible';
  } else {
      unreadCountBadge.style.visibility = 'hidden';
  }
  updateTotalUnreadCount();
}

function updateTotalUnreadCount() {
  const totalUnreadCount = Array.from(document.querySelectorAll('.unread_chat_count'))
      .reduce((acc, badge) => acc + (badge.style.visibility !== 'hidden' ? parseInt(badge.textContent, 10) : 0), 0);
  const totalUnreadCountElement = document.querySelector('.nav_notification');
  if (totalUnreadCount > 0) {
      totalUnreadCountElement.textContent = totalUnreadCount;
      totalUnreadCountElement.style.visibility = 'visible';
  } else {
      totalUnreadCountElement.style.visibility = 'hidden';
  }
}

// socket.on('updateChatsRoom', (updatedRoom) => {
//     const roomElement = document.querySelector(`#room-${updatedRoom.roomId}`);
//     const totalUnreadCountElement = document.querySelector('.nav_notification');
//     if (!roomElement && !totalUnreadCountElement) {
//       console.log("No room element found for ID:", updatedRoom.roomId);
//       return;
//     }
//     console.log("Room element",roomElement)
//     const formattedTime = formatChatTime(updatedRoom.time);
//     console.log("Room element1",formattedTime)
//     roomElement.querySelector('.user-component__subtitle').textContent = updatedRoom.message;
//     const time = roomElement.querySelector('.user-component__time').textContent = formattedTime;
//     console.log("Room element time:",time)
//     const unreadCountBadge = roomElement.querySelector('.unread_chat_count');
//     console.log("Room element badge:",unreadCountBadge)
//     if (!unreadCountBadge) {
//         console.log("No badge element found for room ID:", updatedRoom.roomId);
//       } else if (updatedRoom.unread_chat_count > 0) {
//         unreadCountBadge.textContent = updatedRoom.unread_chat_count;
//         unreadCountBadge.style.visibility = 'visible';
//       } else {
//         unreadCountBadge.style.visibility = 'hidden';
//       }

      
//     // 전체 읽지 않은 메시지 수 업데이트
//     let totalUnreadCount = Array.from(document.querySelectorAll('.unread_chat_count'))
//     .filter(unread_chat_count => unread_chat_count.style.visibility !== 'hidden')
//     .reduce((acc, unread_chat_count) => acc + parseInt(unread_chat_count.textContent, 10) || 0, 0);
//     localStorage.setItem('totalUnread', totalUnreadCount);
    
//     console.log("읽지않은 메시지수",totalUnreadCount)
//     if (totalUnreadCount > 0) {
//         console.log("읽지않은 메시지수1",totalUnreadCount)
//         totalUnreadCountElement.textContent = totalUnreadCount;
//         totalUnreadCountElement.style.visibility = 'visible';
//     } else {
//         totalUnreadCountElement.style.visibility = 'hidden';
//     }
//     console.log("읽지않은 currentUserId",updatedRoom.receiverId,totalUnreadCount);
//     socket.emit('requestUnreadUpdate', { receiverId: updatedRoom.receiverId, count: totalUnreadCount });
//   });

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

  function toggleSearch(event) {
    console.log("검색창 클릭");
    var searchInput = document.getElementById('searchInput_chats');
    if (searchInput.style.display === 'none') {
      searchInput.style.display = 'block'; // 검색 필드를 보여줍니다.
      searchInput.focus(); // 입력을 받기 위해 검색 필드에 포커스를 줍니다.
      window.addEventListener('click', closeSearchOnClickOutside);
    } else {
      searchInput.style.display = 'none'; // 검색 필드를 숨깁니다.
      window.removeEventListener('click', closeSearchOnClickOutside);
    }
    event.stopPropagation(); // 이벤트 버블링을 중단
  };

  function closeSearchOnClickOutside(event) {
    var searchInput = document.getElementById('searchInput_chats');
    if (searchInput.style.display === 'block' && !searchInput.contains(event.target)) {
        searchInput.style.display = 'none';
        // 이벤트 리스너 제거
        window.removeEventListener('click', closeSearchOnClickOutside);
    }
};

// function filterFriends() {
//   var searchInput = document.getElementById('searchInput_friends');
//   const filter = searchInput.value.toUpperCase();

//   if (searchInput.style.display === 'block' && filter.length >= 0) {
//       socket.emit('searchChats', { searchTerm: filter, userId: currentUserId });
//   }
// }

socket.on('updateFriendsList', (data) => {
  console.log("친구정보 소켓",data);
  displayFriends(data); // 검색 결과를 화면에 표시
});

window.onload = function() {
  document.getElementById('searchInput_chats').style.display = 'none';
};