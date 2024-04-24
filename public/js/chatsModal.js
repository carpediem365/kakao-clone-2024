const newChatModal = document.getElementById('newChatModal');
const closeButtons = document.getElementsByClassName('ncm_close');

// 모달 여는 버튼
document.querySelector('.fa-comment-medical').onclick = function() {
  console.log("모달클릭")
    newChatModal.style.display = 'block';
  };

  // 모달 닫는 버튼
for (const btn of closeButtons) {
    btn.onclick = function() {
      newChatModal.style.display = 'none';
    };
  }
  
// 채팅방 생성 및 이동
document.getElementById('confirmNewChat').onclick = function() {
  const selectedRadio = document.querySelector('input[name="friend"]:checked');
  if (selectedRadio) {
    const selectedFriendId = selectedRadio.value;
    fetch('/chats/create-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ friendId: selectedFriendId })
    })
    .then(response => response.json())
    .then(data => {
      if(data.id) {
        window.location.href = `/chat/${data.id}`;
      } else {
        console.error('채팅방 생성에 실패했습니다.');
      }
    })
    .catch(error => console.error('Error:', error));
  } else {
    alert('친구를 선택해주세요.');
  }
  newChatModal.style.display = 'none';
};

document.getElementById('searchUser').addEventListener('input', searchFriend);

function searchFriend() {
  let input = document.getElementById('searchUser');
  let filter = input.value.toLowerCase();
  if (filter === '') {
    filter = 'ALL_FRIENDS';  // 입력값이 비어있을 경우, 'ALL_FRIENDS'라는 값 전송
  }
  console.log("Sending query:", filter);
  fetch(`/chats/search?query=${filter}`)
      .then(response => response.json())
      .then(data => {
        console.log("친구정보입니다 data",data);
          displayFriends(data.friendsList, data.totalFriends);
      })
      .catch(error => console.error('Error:', error));
}

function displayFriends(friends,totalFriends) {
  let friendsList = document.querySelector('.newChatModal_form ul');
  let friendsCounterElement = document.querySelector('.newChatModal_section h6');
  friendsList.innerHTML = '';  // 기존 목록을 비웁니다.

  friends.forEach(friend => {
      friendsList.innerHTML += `
          <label>
              <li>
                  <img src="${friend.profile_img_url}" alt="profile Image">
                  <p>${friend.friend_name}</p>
                  <input type="radio" name="friend" value="${friend.friend_id}">
              </li>
          </label>
      `;
  });
  friendsCounterElement.textContent = `친구 ${totalFriends}`;
}