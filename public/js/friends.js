const socket = io();
const userProfileElement  = document.querySelector('.my-profile');
const currentUserId = userProfileElement .getAttribute('data-user-id');
console.log("frineds.js user_id",currentUserId)
socket.emit('setup', {currentUserId});

socket.on('updateTotalUnread', (totalUnread) => {
    console.log("frineds.js user_id1",totalUnread)
    const totalUnreadCountElement = document.querySelector('.nav_notification');
        if (totalUnread > 0) {
            totalUnreadCountElement.textContent = totalUnread;
            totalUnreadCountElement.style.visibility = 'visible';
        } else {
            totalUnreadCountElement.style.visibility = 'hidden';
        }
    });

// document.addEventListener('DOMContentLoaded', () => {
//     const totalUnreadCount = localStorage.getItem('totalUnread') || 0;
//     const totalUnreadCountElement = document.querySelector('.nav_notification');
//     if (totalUnreadCount > 0) {
//         totalUnreadCountElement.textContent = totalUnreadCount;
//         totalUnreadCountElement.style.visibility = 'visible';
//     } else {
//         totalUnreadCountElement.style.visibility = 'hidden';
//     }
// });

window.onclick = function(event) {
    console.log("검색닫아");
    var searchInput = document.getElementById('searchInput');
    if (searchInput.style.display === 'block' && !searchInput.contains(event.target)) {
        console.log("검색닫아1");
        searchInput.style.display = 'none';
      }
    };

function toggleSearch(event) {
    var searchInput = document.getElementById('searchInput');
    console.log("검색열어");
    if (searchInput.style.display === 'none') {
      searchInput.style.display = 'block'; // 검색 필드를 보여줍니다.
      searchInput.focus(); // 입력을 받기 위해 검색 필드에 포커스를 줍니다.
    } else {
      searchInput.style.display = 'none'; // 검색 필드를 숨깁니다.
    }
    event.stopPropagation(); // 이벤트 버블링을 중단
  }

// 친구 목록을 필터링하는 함수
function filterFriends() {
    const searchInput = document.getElementById('searchInput');
    if(searchInput.style.display === 'block'){
        const filter = searchInput.value.toUpperCase();
    const filteredFriends = friendsList.filter(friend => {
      return friend.friend_name.toUpperCase().includes(filter);
    });
    displayFriends(filteredFriends); // 필터링된 친구 목록을 화면에 표시하는 함수
    }
  }

  // 친구 목록을 받아 HTML로 변환하여 화면에 표시하는 함수
function displayFriends(friends) {
    const friendsContainer = document.querySelector('.friends-screen__list');
    const totalFriendsCountElement = document.querySelector('.total-friends-count');

    // 현재 표시된 친구 목록을 지움
    friendsContainer.innerHTML = '';

    // 총 친구 수를 업데이트하는 헤더 생성 및 추가
    const listHeader = document.createElement('div');
    listHeader.className = 'friends-screen__list-header';
    listHeader.innerHTML = `
        <span>친구</span>
        <span class="total-friends-count">${friends.length}</span>
    `;
    friendsContainer.appendChild(listHeader);


    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.className = 'user-component friend-profile';
        friendElement.setAttribute('data-user-id', friend.friend_id);
        friendElement.innerHTML = `
            <div class="user-component__column">
                <img src="${friend.profile_img_url || '/images/basic_profile.jpg'}" alt="Friend Image" class="user-component__avatar user-component__avatar--sm">
                <div class="user-component__text">
                    <h4 class="user-component__title">${friend.friend_name}</h4>
                    <p class="user-component__status-message">${friend.status_message || ''}</p> <!-- status_message가 없으면 빈칸 표시 -->
                </div>
            </div>
        `;
        friendsContainer.appendChild(friendElement);
    });
}

  // 페이지가 로드될 때 실행
window.onload = function() {
    displayFriends(friendsList); // 전체 친구 목록을 화면에 표시
    document.getElementById('searchInput').style.display = 'none';
  };
