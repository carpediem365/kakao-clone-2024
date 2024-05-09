const socket = io();
const userProfileElement  = document.querySelector('.my-profile');
const currentUserId = userProfileElement .getAttribute('data-user-id');
socket.emit('setup', {currentUserId});

// 읽지 않은 채팅개수 NAV바 업데이트
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

function filterFriends() {
    var searchInput = document.getElementById('searchInput_friends');
    const filter = searchInput.value.toUpperCase();
    if (searchInput.style.display === 'block' && filter.length >= 0) {
        socket.emit('searchFriends', { searchTerm: filter, userId: currentUserId });
    }
}

// 검색한 친구정보 표시
socket.on('updateFriendsList', (data) => {
    displayFriends(data); // 검색 결과를 화면에 표시
});

function toggleSearch(event) {
    var searchInput = document.getElementById('searchInput_friends');
    if (searchInput.style.display === 'none') {
      searchInput.style.display = 'block'; // 검색 필드를 보여줍니다.
      searchInput.focus(); // 입력을 받기 위해 검색 필드에 포커스를 줍니다.
      window.addEventListener('click', closeSearchOnClickOutside);
    } else {
      searchInput.style.display = 'none'; // 검색 필드를 숨깁니다.
      window.removeEventListener('click', closeSearchOnClickOutside);
    }
    event.stopPropagation(); // 이벤트 버블링을 중단, 안그러면 돋보기 눌러도 검색창이 안나오고 바로 사라짐 body요소까지 클릭되어서 문제 (바깥쪽 클릭 감지로직과 충돌 방지)
  };

  function closeSearchOnClickOutside(event) {
    var searchInput = document.getElementById('searchInput_friends');
    if (searchInput.style.display === 'block' && !searchInput.contains(event.target)) {
        searchInput.style.display = 'none';
        // 이벤트 리스너 제거
        window.removeEventListener('click', closeSearchOnClickOutside);
    }
};

  // 친구 목록을 받아 HTML로 변환하여 화면에 표시하는 함수
function displayFriends(friends) {
    const friendsContainer = document.querySelector('.friends-screen__list');
    // 현재 표시된 친구 목록을 지움
    friendsContainer.innerHTML = '';

    // 총 친구 수를 업데이트하는 헤더 생성 및 추가
    const listHeader = document.createElement('div');
    listHeader.className = 'friends-screen__list-header';
    listHeader.innerHTML = `
        <span>친구</span>
        <span class="total-friends-count">${friends.totalFriends}</span>
    `;
    friendsContainer.appendChild(listHeader);

    friends.friendsList.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.className = 'user-component friend-profile';
        friendElement.setAttribute('data-user-id', friend.friend_id);
        friendElement.innerHTML = `
            <div class="user-component__column">
                <img src="${friend.profile_img_url || '/images/basic_profile.jpg'}" alt="Friend Image" class="user-component__avatar user-component__avatar--sm">
                <div class="user-component__text">
                    <h4 class="user-component__title">${friend.friend_name}</h4>
                    <p class="user-component__status-message">${friend.status_message || ''}</p> 
                </div>
            </div>
        `;
        friendsContainer.appendChild(friendElement);
    });
};
  // 페이지가 로드될 때 실행
window.onload = function() {
    document.getElementById('searchInput_friends').style.display = 'none';
};
