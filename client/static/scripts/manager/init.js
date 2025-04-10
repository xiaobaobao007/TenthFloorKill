function login() {
    const account = document.getElementById("account").value;
    localStorage.setItem(ALL_PARAM.ACCOUNT, account);
    if (account.length <= 0) {
        addTips("请输入有效账号");
        return;
    }
    initWs();
}