function updateMyHandCard() {
    const player = ALL_PLAYER[ACCOUNT];

    const myHandCard = $("#myHandCardPanel");
    myHandCard.html("");

    for (const one of player.handArray) {
        addHandCard(one);
    }
}

function addShowIntelligenceCard(cardModel) {
    addCard(".other-card", cardModel);
}

function addHandCard(cardModel) {
    addCard("#myHandCardPanel", cardModel);
}

function addCard(divSelect, cardModel) {
    let html = "";
    html += "<div class='card " + cardModel.getColorClass() + "' cardid='" + cardModel.allId + "'>";
    html += cardModel.getNameDiv();
    html += cardModel.getOperationDiv(true);
    html += cardModel.getTipsDiv();
    html += cardModel.getAccountDiv();
    html += "</div>";

    $(divSelect).append(html);

    setDivClickEvent("[cardid=" + cardModel.allId + "]", emptyFunction, cardPress);
}

function removeHandCard(cardModel) {
    for (let i = 0; i < SELECTED_CARD_DIVS.length; i++) {
        if ($(SELECTED_CARD_DIVS[i]).attr("cardid") == cardModel.allId) {
            SELECTED_CARD_DIVS.splice(i, 1);
            SELECTED_CARD_NUM--;
            break;
        }
    }

    $("[cardid=" + cardModel.allId + "]").remove();
    updateButton();
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
    SELECTED_CARD_NUM = -1;
    $('.my-card-select').remove();
}

function cardPress(div) {
    openFloating($(div).attr("cardid"));
}

function changeOperation(event, div) {
    event.stopPropagation();
    let array = ["ope_z", "ope_m", "ope_w"];
    const jq = $(div);
    let index = array.indexOf(jq.attr("ope"));
    if (index < 0 || ++index >= array.length) {
        index = 0;
    }
    jq.attr("ope", array[index])
    div.innerHTML = STRING_CONFIG[array[index]];
}

function showIntelligence(div) {
    $(".other-card").html("");

    let chooseAccount = $(div).parent().children(".box-account:first").html();

    $(".other-card-panel-tips").html(chooseAccount + "收到的情报展示");

    const player = ALL_PLAYER[chooseAccount];

    for (const card of player.intelligenceArray) {
        addShowIntelligenceCard(card);
    }

    $("#otherCardPanel").css("display", "flex");
}

function closeIntelligence() {
    $("#otherCardPanel").css("display", "none");
}