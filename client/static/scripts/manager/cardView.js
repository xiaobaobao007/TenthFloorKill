function updateMyHandCard() {
    const player = ALL_PLAYER[ACCOUNT];

    const myHandCard = $("#myHandCardPanel");
    myHandCard.html("");

    for (const one of player.handArray) {
        addHandCard(one);
    }
}

function addHandCard(cardModel) {
    addCard("#myHandCardPanel", cardModel);
}

function addCard(divSelect, cardModel) {
    let html = "";
    html += "<div class='card " + cardModel.getColorClass() + "' cardid='" + cardModel.allId + "' cardtype='" + cardModel.cardId + "'>";
    html += cardModel.getNameDiv();
    html += cardModel.getOperationDiv(true);
    html += cardModel.getTipsDiv();
    html += cardModel.getAccountDiv();
    html += cardModel.getOtherTipsDiv();
    html += "</div>";

    $(divSelect).append(html);

    setDivClickEvent("[cardid=" + cardModel.allId + "]", cardClick, cardPress);
}

function removeHandCard(cardModel) {
    for (let i = 0; i < SELECTED_CARD_DIVS.length; i++) {
        if ($(SELECTED_CARD_DIVS[i]).attr("cardid") == cardModel.allId) {
            SELECTED_CARD_DIVS.splice(i, 1);
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

    removeDivClickEvent(".me-box");

    const $1 = $(div);

    const cardType = $1.attr("cardtype");

    if (IN_ROUNDING) {
        resetSelectPlayer();

        if (!ROUND_USE_CARD.includes(cardType)) {
            for (const selectedDiv of SELECTED_CARD_DIVS) {
                $(selectedDiv).children('.my-card-select').remove();
            }
            SELECTED_CARD_DIVS.length = 0;
            updateButton();
            $(".operation-select").remove();
            return;
        }
    }

    if (CAN_USE_CARD) {
        if (USE_CARD_NEED_CHOOSE_PEOPLE.includes(cardType)) {
            if (USE_CARD_NEED_CHOOSE_PEOPLE_WITH_ME.includes(cardType)) {
                setDivClickEvent(".me-box", selectPlayerBox, emptyFunction);
            }
            SELECTED_PLAYER_NUM = 1;
        } else {
            SELECTED_PLAYER_NUM = -1;
        }
    } else if (SEND_INTELLIGENCE) {
        SELECTED_PLAYER_NUM = 1;
    }

    for (const s of SELECTED_CARD_DIVS) {
        if (s === div) {
            SELECTED_CARD_DIVS.splice(SELECTED_CARD_DIVS.indexOf(s), 1);
            $1.children('.my-card-select').remove();
            updateButton();
            $(".operation-select").remove();
            return;
        }
    }

    while (SELECTED_CARD_DIVS.length >= SELECTED_CARD_NUM) {
        $(SELECTED_CARD_DIVS.shift()).children('.my-card-select').remove();
    }
    $1.append("<div class='my-card-select'></div>");
    SELECTED_CARD_DIVS.push(div);

    updateButton();

    showSelect(div);
}

function showSelect(div) {
    const cardType = $(div).attr("cardtype");

    const select = $(".operation-select");

    if (OTHER_SELECT[cardType] && OTHER_SELECT[cardType].length > 0) {
        if (select.length > 0) {
            if (select.attr("selecttype") === cardType) {
                return;
            }
            select.remove();
        } else {
            let html = "";
            html += "<select class='operation-select' selecttype='" + cardType + "'>";
            for (const one of OTHER_SELECT[cardType]) html += "<option value='" + one.value + "'>" + one.name + "</option>";
            html += "</select>";
            $('.operation-button-father').children().first().before(html);
        }
    } else if (select.length > 0) {
        select.remove();
    }
}

function resetSelectCard() {
    SELECTED_CARD_DIVS = [];
    $('.my-card-select').remove();
    SELECTED_CARD_NUM = -1;
}

function cardPress(div) {
    openFloating($(div).attr("cardid"));
}

function showIntelligence(div) {
    const account = $(div).parent().children(".box-account:first").html();

    openOtherCardPanel(account + "收到的情报展示", ALL_PLAYER[account].intelligenceArray);
}

function openOtherCardPanel(tips, cardArray, buttonTips = undefined) {
    const $1 = $("[tips=" + tips + "]");
    if ($1.length > 0) {
        $1.remove();

        if (buttonTips == undefined || buttonTips.length == 0) {
            return;
        }
    }

    let html = "";
    html += "<div class='other-panel' tips='" + tips + "' onClick='closeOtherCardPanel(event,this)'>";
    html += "    <div class='other-card-panel-tips'>" + tips + "</div>";
    html += "    <div class='my-card other-card clear'></div>";
    if (buttonTips && buttonTips.length > 0) html += "<div class='other-card-button' onclick='otherCardPanelButton(event)'>" + buttonTips + "</div>";
    html += "</div>";

    $("#body-room").append(html);

    for (const card of cardArray) {
        addCard($('.other-panel:last').children(".my-card:last")[0], card);
    }
}

function otherCardPanelButton(event) {
    event.stopPropagation();
    clickSubmit("game/clickChooseOtherCardButton");
}

function closeOtherCardPanel(event, div) {
    event.stopPropagation();

    if ($(div).children(".other-card-button").length > 0) {
        return;
    }

    $(div).remove();
}