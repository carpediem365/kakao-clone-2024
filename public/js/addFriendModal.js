// 모달 열기 함수
function openAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'block';
}

// 모달 닫기 함수
function  closeAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'none';
}

// 모달 바깥쪽 클릭 시 모달 닫기
window.onclick = function(event) {
    if (event.target == document.getElementById('addFriendModal')) {
        closeAddFriendModal();
    }
}

// 친구 추가 모달 열기 버튼에 이벤트 리스너 추가
document.querySelector('.fa-user-plus').addEventListener('click', openAddFriendModal);

// 모달 닫기 버튼에 이벤트 리스너 추가
document.querySelector('#addFriendModal .close-button').addEventListener('click', closeAddFriendModal);

// 친구 ID 입력 필드에 키업 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const friendIdInput = document.getElementById('friendId');
    const counter = document.querySelector('.addFriendForm-counter');
  
    // 입력 필드에 글자 입력 시 실행되는 함수
    friendIdInput.addEventListener('keyup', function() {
        const length = this.value.length;
        const maxLength = this.getAttribute('maxlength');
        counter.textContent = `${length}/${maxLength}`;
    });
});

// 친구 추가 폼 이벤트 리스너
document.getElementById('addFriendForm').addEventListener('submit', function(e) {
    const friendId = document.getElementById('friendId').value;
    e.preventDefault(); // 폼의 기본 제출 동작 막기
    checkUserAndShowAddButton(friendId);
});

// 사용자 존재 여부 확인 및 친구 추가 버튼 표시 함수
function checkUserAndShowAddButton(friendId) {
    fetch(`/friends/check-user/${friendId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.exists){
            if(data.message ==="본인의 ID로는 친구 추가를 할 수 없습니다." || data.message ==="이미 친구로 등록된 ID입니다."){
                displayUserInfo(data.userInfo, true); // 채팅 버튼 표시
                document.querySelector('.user-info-display_chat-button').onclick = function(){
                    initiateChat(friendId)
                }
            }else{
                displayUserInfo(data.userInfo);
                document.querySelector('.add-friend-button').onclick = function() {
                    performAddFriend(friendId); // 친구 추가 실행
                };
            }
            
        } else {
            displayError(data.message);
        }
    })
    .catch(error => {
        console.error('Error check:', error);
        displayError(error.message);
    });
}

// 사용자 정보 표시 및 친구 추가 버튼 활성화 함수
function displayUserInfo(userInfo, displayChat = false) {
    // 사용자 정보 표시 로직
    const userInfoDisplay = document.querySelector('.user-info-display');
    userInfoDisplay.innerHTML = `<img src="${userInfo.profile_img_url ? userInfo.profile_img_url : '/images/basic_profile.jpg'}" alt="Profile Image" />
                                <p>${userInfo.name}</p>
                                `;
    // 채팅 또는 친구 추가 버튼 표시
    if (displayChat) {
        // '1대1 채팅하기' 버튼 표시
        userInfoDisplay.innerHTML += `<button class="user-info-display_chat-button">1대1 채팅하기</button>`;
    } else {
        // '친구 추가' 버튼 표시
        userInfoDisplay.innerHTML += `<button class="add-friend-button">친구 추가</button>`;
    }                           
    // 에러메시지 none처리
    const errorMsgElement = document.querySelector('.add-friend_error-msg');
    errorMsgElement.style.display = 'none';
}

// 채팅 시작 또는 채팅방 생성
function initiateChat(friendId) {
    // 서버에 공통 채팅방 존재 여부 확인 요청
    fetch('/chats/create-chat',{
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId: friendId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.id) {
            window.location.href = `/chat/${data.id}`;
          } else {
            alert('채팅방 생성 또는 접근에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('채팅방 확인 또는 생성 중 오류 발생:', error);
        alert('채팅방을 확인하거나 생성하는 동안 오류가 발생했습니다.');
    });
}

// 친구 추가 실행 함수
function performAddFriend(friendId) {
    fetch('/friends/add-friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId: friendId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            alert('친구가 추가되었습니다.');
            closeAddFriendModal();
            window.location.reload(); // 페이지 새로고침
        }else{
            displayError(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayError('친구 추가 중 오류가 발생했습니다.');
    });
}

// 에러 메시지 표시 함수
function displayError(message) {
     // 오류 메시지 표시
    const errorMsgElement = document.querySelector('.add-friend_error-msg');
    errorMsgElement.style.display = 'flex';
    errorMsgElement.textContent = message;

    // 사용자 정보 영역 초기화
    const userInfoDisplay = document.querySelector('.user-info-display');
    userInfoDisplay.innerHTML = '';

    // 친구 추가 버튼을 찾고, 있으면 숨김
    const addFriendButton = document.querySelector('.add-friend-button');
    if (addFriendButton) {
        addFriendButton.style.display = 'none';
    }
}

// 친구 추가 함수
function addFriend() {
    const friendId = document.getElementById('friendId').value;
    fetch('/friends/add-friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId: friendId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            alert('친구가 추가되었습니다.');
            closeAddFriendModal();
            window.location.reload(); // 페이지 새로고침
        }else{
           // 친구 추가 실패 메시지 표시
           const errorMsgElement = document.querySelector('.add-friend_error-msg');
           errorMsgElement.textContent = data.message;
        }
        
    })
    .catch(error => {
        console.log('Error modal5:', error); // 에러 처리
        const errorMsgElement = document.querySelector('.add-friend_error-msg');
        errorMsgElement.textContent = '친구 추가 요청 처리 중 오류가 발생했습니다.';
    });
}

