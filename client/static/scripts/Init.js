function login() {
    account = document.getElementById("account").value.replace(/[^a-zA-Z0-9]/g, '');
    if (account.length <= 0) {
        addTips("请输入有效账号");
        return;
    }
    initWs();
}