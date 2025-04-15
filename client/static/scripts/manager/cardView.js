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
    html += "<div class='card " + card.getColorClass() + "' cardid='" + card.allId + "'>";
    html += card.getNameDiv();
    html += card.getOperationDiv(true);
    html += card.getTipsDiv();
    html += "</div>";
    $(".my-card:first").append(html);
}

function cardClick(div) {
    if (SELECTED_CARD_NUM <= 0) {
        return;
    }

    for (const s of SELECTED_CARD_DIVS) {
        if (s === div) {
            SELECTED_CARD_DIVS.splice(SELECTED_CARD_DIVS.indexOf(s), 1);
            $(div).children('.my-card-select').remove();
            updateButton();
            return;
        }
    }

    while (SELECTED_CARD_DIVS.length >= SELECTED_CARD_NUM) {
        $(SELECTED_CARD_DIVS.shift()).children('.my-card-select').remove();
    }
    $(div).append("<div class='my-card-select'></div>");
    SELECTED_CARD_DIVS.push(div);

    updateButton();
}

function resetSelectCard() {
    SELECTED_CARD_DIVS = [];
    $('.my-card-select').remove();
}

function cardPress(div) {
    openFloating($(div).attr("cardid"));
}

function changeOperation(div) {
    let array = ["ope_z", "ope_m", "ope_w"];
    const jq = $(div);
    let index = array.indexOf(jq.attr("ope"));
    if (index < 0 || ++index >= array.length) {
        index = 0;
    }
    jq.attr("ope", array[index])
    div.innerHTML = STRING_CONFIG[array[index]];
}