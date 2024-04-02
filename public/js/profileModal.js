// 페이지 로드 완료 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', initializeEventListeners);


function initializeEventListeners() {
    console.log('DOM fully loaded and parsed');
    setupImageChangeTriggers();
    setupModalContentClick();
    editProfileKeyup();

}

// 페이지 로드 시 모달을 열고, 세션 정보로 입력 필드를 채우는 함수입니다.
// 모달 열기 함수
function openProfileEditModal() {
    document.getElementById('profileEditModal').style.display = 'block';
}

// 모달 닫기 함수
function closeProfileEditModal() {
    document.getElementById('profileEditModal').style.display = 'none';
    // 이미지 선택 옵션 숨김
    document.querySelector('.profileEditModal-header_img_choice').style.display = 'none';
    document.querySelector('.profileEditModal-body_img_choice').style.display = 'none';
    

}


// 모달 바깥쪽 클릭 시 모달 닫기
window.onclick = function(event) {
    const profileEditModal = document.getElementById('profileEditModal');
    if (event.target == profileEditModal) {
        closeProfileEditModal();
        document.querySelector('.profileEditModal-body_edit').style.display = 'none';
    }

}

    // 닫기 버튼 클릭 이벤트
    document.querySelector('.profileEditModal-close-button').addEventListener('click', closeProfileEditModal);

// 프로필 사진 변경
function handleProfileImageChange(event) {
    // FileReader 객체 사용하여 업로드된 이미지를 읽기
    const reader = new FileReader();
    reader.onload = function(e) {
        document.querySelector('.profileEditModal-profile-img').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// 배경 사진 변경
function handleBackgroundImageChange(event) {
    // FileReader 객체 사용하여 업로드된 이미지를 읽기
    const reader = new FileReader();
    reader.onload = function(e) {
        // 배경사진 업데이트하는 로직 추가 (예시: 배경 이미지를 보여주는 div의 배경으로 설정)
        document.querySelector('.profileEditModal-content').style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// 파일 입력 필드에 이벤트 리스너 추가
document.getElementById('profileImageInput').addEventListener('change', handleProfileImageChange);
document.getElementById('backgroundImageInput').addEventListener('change', handleBackgroundImageChange);

// 기본 이미지 설정 버튼에 이벤트 리스너 추가
document.querySelector('.profileEditModal-header .img_upload').addEventListener('click', function() {
    document.querySelector('.profileEditModal-content').style.backgroundImage = `url('/images/default_background.png')`;
});
document.querySelector('.profileEditModal-body .img_upload').addEventListener('click', function() {
    document.querySelector('.profileEditModal-profile-img').src = '/images/basic_profile.jpg';
});

// 이벤트 리스너를 추가하는 함수
function setupImageChangeTriggers() {
    // 배경 이미지 변경 아이콘 클릭 이벤트
    document.querySelector('.profileEditModal-header .fas.fa-image').addEventListener('click', function() {
        const headerChoice = document.querySelector('.profileEditModal-header_img_choice');
        headerChoice.style.display = headerChoice.style.display === 'none' ? 'block' : 'none'; // 토글 기능
    });

    // 프로필 이미지 클릭 이벤트
    document.querySelector('.profileEditModal-profile-img').addEventListener('click', function() {
        const bodyChoice = document.querySelector('.profileEditModal-body_img_choice');
        bodyChoice.style.display = bodyChoice.style.display === 'none' ? 'block' : 'none'; // 토글 기능
    });
}

// 모달 콘텐츠 클릭 이벤트를 설정하는 함수
function setupModalContentClick() {
    document.querySelector('.profileEditModal-content').addEventListener('click', function(event) {
        const headerChoice = document.querySelector('.profileEditModal-header_img_choice');
        const bodyChoice = document.querySelector('.profileEditModal-body_img_choice');

        // 이벤트 대상이 이미지 선택 옵션 또는 이미지 아이콘이 아닌 경우에만 선택 옵션을 닫습니다.
        if (!headerChoice.contains(event.target) && !event.target.closest('.fas.fa-image')) {
            headerChoice.style.display = 'none';
        }
        if (!bodyChoice.contains(event.target) && !event.target.closest('.profileEditModal-profile-img')) {
            bodyChoice.style.display = 'none';
        }
    });
}

    // 프로필 편집 아이콘 클릭 이벤트
    document.querySelector('.edit-profile-name').addEventListener('click', function() {
        // 현재 프로필 이름 가져오기
        var currentName = document.querySelector('.profileEditModal-edit-profile').textContent;
        console.log("currentName:",currentName);
        // 편집 모달에 현재 프로필 이름 설정
        document.getElementById('editProfile').value = currentName;
        // 편집 모달 열기
        document.querySelector('.profileEditModal-body_edit').style.display = 'block'
        const editProfileInput = document.getElementById('editProfile');
        const length = editProfileInput.value.length;
        const maxLength = editProfileInput.getAttribute('maxlength');
        document.querySelector('.editProfile-counter').textContent = `${length}/${maxLength}`; 
      });
      
      // 상태 메시지 편집 아이콘 클릭 이벤트
      document.querySelector('.edit-statusMessage').addEventListener('click', function() {
        // 현재 상태 메시지 가져오기
        var currentStatusMessage = document.querySelector('.profileEditModal-edit-statusMessage').textContent;
        // 편집 모달에 현재 상태 메시지 설정
        document.getElementById('editProfile').value = currentStatusMessage;
        // 편집 모달 열기
        document.querySelector('.profileEditModal-body_edit').style.display = 'block'
        const editProfileInput = document.getElementById('editProfile');
        const length = editProfileInput.value.length;

        const maxLength = editProfileInput.getAttribute('maxlength');
        document.querySelector('.editProfile-counter').textContent = `${length}/${maxLength}`; 
      });

      document.querySelector('.profileEditModal-body_edit-close-button').addEventListener('click', function() {
        document.querySelector('.profileEditModal-body_edit').style.display = 'none';
      });


      // 이름,상태메시지 수정 입력 필드에 키업 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    
});
function editProfileKeyup()
{
    const editProfileInput = document.getElementById('editProfile');
    const counter = document.querySelector('.editProfile-counter');
  
    // 입력 필드에 글자 입력 시 실행되는 함수
    editProfileInput.addEventListener('keyup', function() {
        const length = this.value.length;
        const maxLength = this.getAttribute('maxlength');
        counter.textContent = `${length}/${maxLength}`;
    });
}

    // 프로필 이미지 클릭 시 모달 표시
document.getElementById('profileImg').addEventListener('click', openProfileEditModal);
// 내 프로필에 대한 이벤트 리스너
document.querySelector('.my-profile').addEventListener('click', function() {
        const myId = this.dataset.userId;
        console.log(myId);
        fetch(`/friends/${myId}`)
        .then(response => response.json())
            .then(friendData => {
                console.log("friendData임:",friendData);
                // 모달창 데이터 업데이트
                const profileImg = friendData.profile_img_url || '/images/basic_profile.jpg';
                document.querySelector('.profileEditModal-profile-img').src = profileImg;
                document.querySelector('.profileEditModal-edit-profile').textContent = friendData.name;
                document.querySelector('.profileEditModal-edit-statusMessage').textContent = friendData.status_message;

                // 배경 이미지 URL 처리
                var backgroundImageUrl = friendData.background_img_url || '/images/default_background.png';
                document.querySelector('.profileEditModal-content').style.backgroundImage = `url(${backgroundImageUrl})`;

                // 모달창 열기
                openProfileEditModal();
                document.querySelector('.profileEditModal_icon').style.display = 'block';
                document.querySelector('.edit-statusMessage').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching friend data:', error);
            });
    });


// 모든 친구 프로필 요소에 대해 이벤트 리스너 추가
document.querySelectorAll('.friend-profile').forEach(function(profile) {
    profile.addEventListener('click', function() {
        var friendId = this.dataset.userId;
        console.log(friendId)
        fetch(`/friends/${friendId}`)
            .then(response => response.json())
            .then(friendData => {
                console.log("friendData임:",friendData);
                // 모달창 데이터 업데이트
                const profileImg = friendData.profile_img_url || '/images/basic_profile.jpg';
                document.querySelector('.profileEditModal-profile-img').src = profileImg;
                document.querySelector('.profileEditModal-edit-profile').textContent = friendData.name;
                document.querySelector('.profileEditModal-edit-statusMessage').textContent = friendData.status_message;

                // 배경 이미지 URL 처리
                var backgroundImageUrl = friendData.background_img_url || '/images/default_background.png';
                document.querySelector('.profileEditModal-content').style.backgroundImage = `url(${backgroundImageUrl})`;

                // 모달창 열기
                openProfileEditModal();
                document.querySelector('.profileEditModal_icon').style.display = 'none';
                document.querySelector('.edit-statusMessage').style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching friend data:', error);
            });
    });
});
