function updateMyHandCard() {
    const player = ALL_PLAYER[ACCOUNT];

    const myHandCard = $(".my-card:first");
    myHandCard.html("");

    for (const one of player.handArray) {
        addHandCard(one);
    }
}

function addHandCard(card) {
    let html = "";
    let class_ = "card";

    if (card.color === "r") class_ += " card-red";
    else if (card.color === "g") class_ += " card-grey";
    else if (card.color === "b") class_ += " card-blue";
    else if (card.color === "d") class_ += " card-double";

    const name = STRING_CONFIG[card.cardId + "_name"];
    class_ += " card-name-" + name.length;

    html += "<div class='" + class_ + "' onclick='openFloating(" + JSON.stringify(card) + ")'>";
    html += "<div class='card-name'>" + name + "</div>";

    let tips = "";
    if (card.ope === "ope_z") {
        tips += EMOJI_CONFIG.ope_z;
    } else {
        if (card.dir === "dir_") tips += EMOJI_CONFIG.dir_;
        if (card.ope === "ope_m") tips += EMOJI_CONFIG.ope_m;
        else if (card.ope === "ope_w") tips += EMOJI_CONFIG.ope_w;
        else if (card.ope === "ope_") tips += EMOJI_CONFIG.ope_;
    }

    if (card.lock) tips += EMOJI_CONFIG.lock;

    html += "<div class='card-tips' id='card-'" + card.allId + ">" + tips + "</div>";
    html += "</div>";

    $(".my-card:first").append(html);
}