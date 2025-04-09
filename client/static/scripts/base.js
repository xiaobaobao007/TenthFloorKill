function judgeAccount() {
    if (typeof localStorage.getItem(ALL_PARAM.ACCOUNT) == "undefined") {
        // if (typeof localStorage.getItem(ALL_PARAM.ACCOUNT) == "undefined" || typeof ws == "undefined") {
        window.location.href = "login.html";
    }
}

ALL_PARAM = {
    ACCOUNT: "account"
}

function random(number) {
    return Math.floor(Math.random() * number);
}