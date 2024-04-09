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
  
  // 확인 버튼을 눌렀을 때의 이벤트 핸들러
  document.getElementById('confirmNewChat').onclick = function() {
    const selectedRadio = document.querySelector('input[name="friend"]:checked');
    if (selectedRadio) {
      const selectedFriendId = selectedRadio.value;
      console.log("선택된 친구",selected);
      console.log("선택된 친구1",selectedRadio);
      // 나머지 코드...
    } else {
      alert('친구를 선택해주세요.');
    }
  
    fetch('/chats/create-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ friendId: selectedFriendId })
    })
    .then(response => response.json())
    .then(chatRoom => {
      window.location.href = `/chat/${chatRoom.id}`;
    })
    .catch(error => console.error('Error:', error));
  
    newChatModal.style.display = 'none';
  };