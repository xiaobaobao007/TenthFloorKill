function login() {
    ACCOUNT = document.getElementById("account").value;
    if (ACCOUNT.length <= 0) {
        addTips("请输入有效账号");
        return;
    }
    initWs();
}