// 페이지 로드 시 모달을 열고, 세션 정보로 입력 필드를 채우는 함수입니다.
// 모달 열기 함수
function openProfileEditModal() {
    document.getElementById('profileEditModal').style.display = 'block';
}

// 모달 닫기 함수
function closeProfileEditModal() {
    document.getElementById('profileEditModal').style.display = 'none';
}


// 모달 바깥쪽 클릭 시 모달 닫기
window.onclick = function(event) {
    if (event.target == document.getElementById('profileEditModal')) {
        closeProfileEditModal();
        setupImageChangeTriggers();
    }
}
    // 프로필 이미지 클릭 시 모달 표시
    document.getElementById('profileImg').addEventListener('click', openProfileEditModal);

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

// 기본 이미지로 변경
function setDefaultImage(isProfileImage) {
    if (isProfileImage) {
        document.querySelector('.profileEditModal-profile-img').src = '/images/basic_profile.jpg';
    } else {
        // 배경 이미지를 기본 이미지로 설정
        document.querySelector('.profileEditModal-content').style.backgroundImage = `url('/images/default_background.jpg')`;
    }
}

// 파일 입력 필드에 이벤트 리스너 추가
document.getElementById('profileImageInput').addEventListener('change', handleProfileImageChange);
document.getElementById('backgroundImageInput').addEventListener('change', handleBackgroundImageChange);

// 기본 이미지 설정 버튼에 이벤트 리스너 추가
document.querySelector('.profileEditModal-header .img_upload').addEventListener('click', function() {
    setDefaultImage(true);
});
document.querySelector('.profileEditModal-body .img_upload').addEventListener('click', function() {
    setDefaultImage(false);
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


// 페이지 로드 완료 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    setupImageChangeTriggers(); // 이미지 변경 이벤트 리스너 설정
    setupModalContentClick();
});
