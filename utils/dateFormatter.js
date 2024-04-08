function formatChatTime(updatedAt) {
    const chatDate = new Date(updatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let formattedTime;

    if (chatDate.toDateString() === today.toDateString()) {
        formattedTime = chatDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } else if( chatDate.toDateString() === yesterday.toDateString()) {
        formattedTime = '어제';
    } else {
        formattedTime = chatDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    return formattedTime;
}

module.exports = formatChatTime;