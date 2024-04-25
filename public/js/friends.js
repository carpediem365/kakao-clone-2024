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

