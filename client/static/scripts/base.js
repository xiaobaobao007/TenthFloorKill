function judgeAccount() {
    if (typeof localStorage.getItem(ALL_PARAM.ACCOUNT) == "undefined") {
        window.location.href = "login.html";
    }
}

ALL_PARAM = {
    ACCOUNT: "account"
}