function login() {
    const account = document.getElementById("account").value.replace(/[^a-zA-Z0-9]/g, '');
    localStorage.setItem(ALL_PARAM.ACCOUNT, account);
    if (account.length <= 0) {
        addTips("请输入有效账号");
        return;
    }
    initWs();
}