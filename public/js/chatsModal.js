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