# Kakao Clone 2024 Update

<p>카카오톡 클론 프로젝트는 실시간 메시징 기능을 구현하고자 하는 목적으로 시작되었습니다.</p> 
<p>HTML, CSS, JavaScript를 기반으로 한 클라이언트 사이드와 Node.js, Express, MySQL을 사용한 서버 사이드, <br>
그리고 Socket.io를 활용한 실시간 양방향 통신을 통해 사용자 간의 메시지 교환 기능을 구현하였습니다.</p>

## 목차
1.기술스택
2.프로젝트 실행방법
3.주요 기능
4.UI/UX
5.프로젝트 구조

## 1. 기술 스택
### 클라이언트
+ HTML
+ CSS
+ JavaScript

### 서버
+ Node.js: 서버 사이드 JavaScript 실행 환경
+ Express: Node.js 웹 애플리케이션 프레임워크
+ MySQL: 관계형 데이터베이스 관리 시스템
+ Socket.io: 실시간, 양방향, 이벤트 기반 통신
+ bcrypt: 패스워드 해싱을 위한 라이브러리

## 2. 프로젝트 실행방법

1.레포지토리 클론:
git clone https://github.com/yourusername/kakaotalk-clone.git
cd kakaotalk-clone

2.의존성 설치:
npm install

3.애플리케이션 실행:
npm start

## 3. 주요기능
### 인증
+ 회원가입: bcrypt를 사용하여 비밀번호를 안전하게 암호화하고 계정을 생성할 수 있습니다.
+ 로그인
+ 로그아웃

### 사용자 프로필
+ 프로필 커스터마이징: 사용자 프로필 페이지에서 프로필 사진, 배경 이미지, 상태 메시지, 이름을 변경할 수 있습니다.
+ 친구 프로필 커스터 마이징: 친구의 표시 이름을 변경할 수 있습니다.

### 친구 관리
+ 친구 검색: 친구의 이름으로 친구를 검색할 수 있습니다.
+ 친구 추가: 새로운 친구를 친구 목록에 추가할 수 있습니다.
+ 친구 삭제: 기존의 친구를 친구 목록에서 삭제할 수 있습니다.

### 실시간 채팅
+ 1:1 채팅방: 1:1 대화를 위한 채팅방을 만들 수 있습니다.
+ 읽지 않은 메시지 수: 읽지 않은 메시지는 채팅 목록과 총 읽지 않은 메시지 수 가 화면 하단에 숫자로 표시됩니다.
+ 읽음 확인: 각 메시지 옆에 읽지 않은 참가자 수가 표시되어 메시지를 몇 명이 읽지 않았는지 확인할 수 있습니다.
+ 채팅방 검색: 채팅방 이름으로 특정 채팅방을 검색할 수 있습니다.
+ 채팅방 삭제: 채팅목록에 있는 채팅방을 삭제할 수 있습니다.
+ 채팅 내용 검색: 채팅 내용을 검색하여 특정 메시지를 찾아 직접 이동할 수 있습니다.

## 4.UI/UX
### 1.회원가입
<p>아이디, 비밀번호, 비밀번호 재확인, 폰 번호, 이름을 통해 회원가입이 가능합니다. </p>
<p>아이디 중복체크 , 비밀번호 확인기능</p>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/2b3c786f-c870-4da8-a6b3-f2fb8782d912"/>

### 2.로그인
<p>회원가입한 정보로 로그인 할 수 있습니다.</p>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/68e1542b-deea-4d6f-8855-0a98d425b531 "/>


### 3.Friends 페이지
+ 해당 메뉴에서는 친구 목록 확인 및 친구 추가, 검색이 가능합니다.
+ Friends 페이지에서 사용자를 클릭 시 프로필 창이 등장합니다. 해당 창에서 사용자의 정보를 변경할 수 있습니다.
+ Friends 페이지에서 친구를 클릭 시 친구 프로필 창이 등장하고, 이름만 변경 가능합니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/0463f277-a373-4a8a-9376-67d6bbf50cf7"/>

### 3.1 친구 추가
+ 친구 ID를 입력하여 친구를 추가할 수 있습니다. 만약 이미 친구상태라면 1:1 채팅 버튼이 나옵니다.
<br>
<img width="70%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/573a3b0e-5212-44ad-9a3e-e4386182ccfd"/>
<img width="70%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/646abd25-4660-4f7b-a399-b7edf5396551"/>

### 3.2 친구 검색
+ 검색 창에 입력한 단어가 이름에 있는 친구들을 찾아 보여줍니다.
<br>
<img width="70%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/fba9c377-685f-4eb0-b621-b074903bdea9"/>

### 3.3 나의 프로필
+ Friends페이지에서 나의 프로필을 클릭시 프로필 창이 등장합니다. 해당 창에서 프로필 사진, 배경사진, 이름, 상태메시지를 변경할 수 있고, 나와의 채팅이 가능합니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/393c4f7b-dc09-4109-8b37-b67852f9d585"/>

### 3.4 친구 프로필
+ Friends페이지에서 친구 프로필을 클릭시 프로필 창이 등장합니다. 친구의 경우 이름 변경만 가능합니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/43b0f1e3-4850-4615-b2b8-bd3a26f33fae"/>

### 4.채팅메뉴
+ 해당 메뉴에서는 채팅방 목록 확인 및 검색, 채팅방 추가가 가능합니다.
+ 채팅방은 최근 수신한 채팅 날짜 순으로 정렬되어 있으며, 읽지 않은 채팅 수가 표시됩니다.
+ 채팅방은 클릭시 채팅방에 입장하게 됩니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/adb15590-704b-4036-a40f-6e9c10f78a18"/>

### 4.1 새로운 채팅
+ 친구목록에서 채팅 할 대상을 선택하여 대화를 시작합니다.
+ 검색을 통해 대화할 친구를 찾을 수 있습니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/4a233f80-8059-49d4-bb05-2261347afef6"/>

### 4.2 채팅방 검색
+ 검색 단어가 방 참가자 또는 방 이름에 있는 채팅방들을 나타냅니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/337bfedd-0731-4381-b0ff-d1957f711bc2"/>

### 4.2 채팅방 검색
+ 검색 단어가 방 참가자 또는 방 이름에 있는 채팅방들을 나타냅니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/337bfedd-0731-4381-b0ff-d1957f711bc2"/>

### 5.채팅창
+ 채팅창에서 다른 사용자와 대화를 할 수 있고, 읽지 않은 채팅수를 표시합니다.
+ 스크롤이 위로 올라가 있을 때, 상대방이 메시지를 보내면 자동으로 최신채팅으로 이동합니다.
+ 채팅창에서 검색을 통해 채팅을 찾아볼 수 있고, 이동버튼을 통해 이동할 수 있습니다.
+ 또한 검색된 단어의 상위요소로 이동하여 검은색 배경으로 구분하여 손쉽게 알아볼수 있습니다.
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/374b78c6-20a8-4109-bdf8-3cb3504fe0d1"/>
<br>
<img width="80%" src="https://github.com/carpediem365/kakao-clone-2024/assets/136786274/0166f47e-1ff6-41ad-b702-4c785db2a4aa"/>

### 6.실시간 채팅(Socket.io)
+ 채팅의 실시간 양방향 통신을 위해서 Socket.io를 사용하였습니다.
+ 채팅의 전반적인 기능(메시지 송수신,알림 등)에 사용하여 실시간 채팅이 이뤄지게 구현하였습니다.
<p>실시간 채팅</p>
<video width="600" controls>
  <source src="https://github.com/your-username/your-repo-name/raw/main/assets/demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

[![Watch the video](https://img.youtube.com/vi/THE_VIDEO_ID/maxresdefault.jpg)](https://github.com/carpediem365/kakao-clone-2024/assets/136786274/eea92049-13ec-4a7f-bf46-88e3d9487563)

<p>채팅 알림</p>

[![Watch the video](https://img.youtube.com/vi/THE_VIDEO_ID/maxresdefault.jpg)](
https://github.com/carpediem365/kakao-clone-2024/assets/136786274/76f9dc4c-ed31-4589-a24c-3ba254e20812)

