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
    }
}
    // 프로필 이미지 클릭 시 모달 표시
    document.getElementById('profileImg').addEventListener('click', openProfileEditModal);

    // 닫기 버튼 클릭 이벤트
    document.querySelector('.profileEditModal-close-button').addEventListener('click', closeProfileEditModal);

    // 배경 이미지 기본값으로 변경
    document.getElementById('defaultBackgroundImage').addEventListener('click', function() {
        document.getElementById('backgroundPreview').src = '/images/default_background.jpg';
    });

    // 프로필 이미지 기본값으로 변경
    document.querySelector('.profileEditModal-profile-img').addEventListener('click', function() {
        document.querySelector('.profileEditModal-profile-img').src = '/images/basic_profile.jpg';
    });

    // 변경 사항 저장 버튼 이벤트
    document.getElementById('saveProfileChanges').addEventListener('click', function() {
        // FormData 객체 생성 및 필드 추가
        var formData = new FormData();
        formData.append('name', document.getElementById('profileName').value);
        formData.append('statusMessage', document.getElementById('statusMessage').value);
        formData.append('profileImg', document.getElementById('profileImageInput').files[0]);
        formData.append('backgroundImg', document.getElementById('backgroundImageInput').files[0]);

        // 서버에 프로필 변경 요청 전송
        fetch('/update-profile', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('프로필이 성공적으로 업데이트되었습니다.');
                window.location.reload();
            } else {
                throw new Error('프로필 업데이트에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('프로필 업데이트 중 에러:', error);
        });
    });

