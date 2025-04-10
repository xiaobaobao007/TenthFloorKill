function addTips(tips) {
    const popup = document.createElement('div');
    popup.classList.add('floating-popup');
    popup.classList.add('show');

    const message = document.createElement('p');
    message.textContent = tips;
    popup.appendChild(message);

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    }, 1500);
}