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

    let id = 'card-' + card.allId;
    html += "<div class='" + class_ + "' id='" + id + "'>";
    html += "<div class='card-name  card-name-" + name.length + "'>" + name + "</div>";

    let operation = "";
    let tips = "";
    if (card.operation === "ope_z") {
        operation = EMOJI_CONFIG.ope_z;
    } else {
        if (card.direction === "dir_") tips += EMOJI_CONFIG.dir_;
        if (card.operation === "ope_m") operation = EMOJI_CONFIG.ope_m;
        else if (card.operation === "ope_w") operation = EMOJI_CONFIG.ope_w;
        else if (card.operation === "ope_") operation = EMOJI_CONFIG.ope_;
    }

    if (card.lock) tips += EMOJI_CONFIG.lock;

    html += "<div class='card-operation'>" + operation + "</div>";
    html += "<div class='card-tips'>" + tips + "</div>";
    html += "</div>";

    $(".my-card:first").append(html);

    updateCardClickEvent(id, cardClick, cardPress);
}

const maxSelection = 2;

function cardClick(div) {
    for (const s of SELECTED_CARD_DIVS) {
        if (s === div) {
            SELECTED_CARD_DIVS.splice(s, 1);
            $(div).children('.my-card-select').remove();
            return;
        }
    }

    while (SELECTED_CARD_DIVS.length >= maxSelection) {
        $(SELECTED_CARD_DIVS.shift()).children('.my-card-select').remove();
    }
    $(div).append("<div class='my-card-select'></div>");
    SELECTED_CARD_DIVS.push(div);
}

function cardPress(div) {
    let id = $(div).attr("id");
    openFloating(id.split("-")[1]);
}