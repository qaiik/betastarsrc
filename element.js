$("body").append('<div class="loadingModal"><img class="loadingAnimation" src="/image/blaxLogo.png"/></div>');
$(document).ready(function reset() {
    $.get('/api/lcheck', function(data) {
        if (data === 'LOGGED OUT') {
            window.location = '/login/';
        }
    });
    $.get('/api/elements', function(data) {
        elementList = JSON.parse(data);
    });
    $.get('/api/user/elements', function(data) {
        if (data === "") {
            document.getElementById("#elementRarity").innerText = "Common";
            document.getElementById("#elementRarity").style.color = "white";
            document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px white";
            document.getElementById("#elementImage").src = "/image/elements/blax.png";
            document.getElementById("#elementName").innerText = "Betastar";
            document.getElementById("#elementPrice").innerText = "Can't be sold.";
            return;
        }
        document.getElementById("#elementRarity").innerText = "Common";
        document.getElementById("#elementRarity").style.color = "white";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px white";
        document.getElementById("#elementImage").src = "/image/elements/blax.png";
        document.getElementById("#elementName").innerText = "Betastar";
        document.getElementById("#elementPrice").innerText = "Can't be sold.";
        userElements = JSON.parse(data);
        if (typeof elementList === 'undefined') {
            reset();
            return;
        }
        Object.entries(userElements).forEach((entry)=>{
            const [key,value] = entry;
            if (typeof elementList[key] === 'undefined') {
                $(`<img id="error" src="/image/elements/error.png" onclick="showElementError()" class="bottomElement">`).appendTo(".elementList");
            } else {
                $(`<img id="${key}" src="${elementList[key].imageURL}" onclick="viewElement('${key}')" class="bottomElement">`).appendTo(".elementList");
            }
        }
        );
    });
    document.getElementById("#headerText").addEventListener("click", function() {
        window.location.href = "/";
    });
    document.getElementById("#logoutButton").addEventListener("click", function() {
        window.location.href = "/logout/";
    });
    document.getElementById("#settingsButton").addEventListener("click", function() {
        window.location.href = "/settings/";
    });
    document.getElementById("#cratesButton").addEventListener("click", function() {
        window.location.href = "/crates/";
    });
    document.getElementById("#chatButton").addEventListener("click", function() {
        window.location.href = "/chat/";
    });
    document.getElementById("#leaderboardButton").addEventListener("click", function() {
        window.location.href = "/leaderboard/";
    });
    document.getElementById("#homeButton").addEventListener("click", function() {
        window.location.href = "/stats/";
    });
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        if (event.target.id === "#elementImage") {
            if (window.currentQuantity == -1) {
                $(`<div style="top:${event.pageY - 10}px;left:${event.pageX - 40}px" class="elementRightClickMenu"><p onclick="setAvatar()">Set Avatar</p></div>`).appendTo("body");
                $("body").append(`<div class="loadingModal" style="background-color: rgba(0,0,0,0);" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();"></div>`);
            } else {
                $(`<div style="top:${event.pageY - 10}px;left:${event.pageX - 40}px" class="elementRightClickMenu"><p onclick="openSellMenu()">Sell Element</p><p onclick="setAvatar()">Set Avatar</p></div>`).appendTo("body");
                $("body").append(`<div class="loadingModal" style="background-color: rgba(0,0,0,0);" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();"></div>`);
            }
        }
    });
    document.addEventListener('click', function(event) {
        event.preventDefault();
        if (event.target.id === "#elementImage") {
            if (window.currentQuantity == -1) {
                $(`<div style="top:${event.pageY - 10}px;left:${event.pageX - 40}px" class="elementRightClickMenu"><p onclick="setAvatar()">Set Avatar</p></div>`).appendTo("body");
                $("body").append(`<div class="loadingModal" style="background-color: rgba(0,0,0,0);" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();"></div>`);
            } else {
                $(`<div style="top:${event.pageY - 10}px;left:${event.pageX - 40}px" class="elementRightClickMenu"><p onclick="openSellMenu()">Sell Element</p><p onclick="setAvatar()">Set Avatar</p></div>`).appendTo("body");
                $("body").append(`<div class="loadingModal" style="background-color: rgba(0,0,0,0);" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();" onclick="$('.loadingModal').remove();$('.elementRightClickMenu').remove();"></div>`);
            }
        }
    });
    window.currentElement = "blax";
    window.currentQuantity = -1;
    $(".loadingModal").remove();
});

function openSellMenu() {
    $('.loadingModal').remove();
    $('.elementRightClickMenu').remove();
    $("body").append(`<div class="sellModal"><div class="sellPopup"><text class="sellText">How much ${elementList[window.currentElement].name} would you like to sell?</text><form style="display: inline-block;"><input type="text" class="inputField" oninput="checkInput(this.value)" id="#inputFieldAmount"></input><input type="submit" id="#blockSubmit" hidden="true"></input>
</form><text class="sellOutOf">/ ${window.currentQuantity}</text><button id="#sellButton" class="okayButton">Sell</button><button id="#cancelButton" class="cancelButton">Cancel</button></div></div>`);
    document.getElementById("#inputFieldAmount").focus();
    document.getElementById("#sellButton").addEventListener("click", function() {
        sellElement();
    });
    document.getElementById("#blockSubmit").addEventListener("click", function(event) {
        event.preventDefault();
        sellElement();
    }, false);
    document.getElementById("#cancelButton").addEventListener("click", function() {
        $(".sellModal").remove();
        $(".sellPopup").remove();
    });
}

function sellElement() {
    var currentQuantity = document.getElementById("#inputFieldAmount").value;
    $(".sellModal").remove();
    $(".sellPopup").remove();
    $("body").append('<div class="loadingModal"><img class="loadingAnimation" src="/image/blaxLogo.png"/></div>');
    var postData = `element=${window.currentElement}&quantity=${currentQuantity}`;
    $.post(`/api/sell/`, postData, function(data) {
        if (data === "SUCCESS") {
            userElements[window.currentElement] = userElements[window.currentElement] - currentQuantity;
            document.getElementById("#elementQuantity").innerText = userElements[window.currentElement];
            window.currentQuantity = userElements[window.currentElement];
            if (userElements[window.currentElement] == 0) {
                document.getElementById(`${window.currentElement}`).remove();
                document.getElementById("#elementRarity").innerText = "Common";
                document.getElementById("#elementRarity").style.color = "white";
                document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px white";
                document.getElementById("#elementImage").src = "/image/elements/blax.png";
                document.getElementById("#elementName").innerText = "Betastar";
                document.getElementById("#elementPrice").innerText = "Can't be sold.";
                document.getElementById("#elementQuantity").innerText = "1";
            }
            $('.loadingModal').remove();
        } else {
            $('.loadingModal').remove();
        }
    });
}

function setAvatar() {
    $('.loadingModal').remove();
    $('.elementRightClickMenu').remove();
    $("body").append('<div class="loadingModal"><img class="loadingAnimation" src="/image/blaxLogo.png"/></div>');
    var postData = `element=${window.currentElement}`;
    $.post(`/api/setavatar/`, postData, function(data) {
        if (data === "SUCCESS") {
            $('.loadingModal').remove();
        }
    });
}

function checkInput(sellAmount) {
    if (parseInt(window.currentQuantity, 10) <= parseInt(sellAmount, 10)) {
        document.getElementById("#inputFieldAmount").value = `${window.currentQuantity}`;
    }
    if (/[a-z]/.test(sellAmount)) {
        document.getElementById("#inputFieldAmount").value = ``;
    }
    if (/[A-Z]/.test(sellAmount)) {
        document.getElementById("#inputFieldAmount").value = ``;
    }
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>`~\/?]+/.test(sellAmount)) {
        document.getElementById("#inputFieldAmount").value = ``;
    }
    if (/[\s]/.test(sellAmount)) {
        document.getElementById("#inputFieldAmount").value = ``;
    }
}

function showElementError() {
    $("body").append(`<div class="errorElementModal"><div class="errorElementPopup"><text class="errorText">Error</text><text class="errorReason">There was a problem while loading this element. Contact Xotic.</text><button id="#okayButton" class="okayButtonElement">Okay</button></div></div>`);
    document.getElementById("#okayButton").addEventListener("click", function() {
        $(".errorElementModal").remove();
    });
    document.getElementById("#okayButton").focus();
}

function viewElement(element) {
    window.currentElement = element;
    window.currentQuantity = userElements[element];
    if (element === "blax") {
        document.getElementById("#elementRarity").innerText = "Common";
        document.getElementById("#elementRarity").style.color = "white";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px white";
        document.getElementById("#elementImage").src = "/image/elements/blax.png";
        document.getElementById("#elementName").innerText = "Betastar";
        document.getElementById("#elementPrice").innerText = "Can't be sold.";
        document.getElementById("#elementQuantity").innerText = "1";
        return;
    }
    var elementName = elementList[element].name;
    var elementRarity = elementList[element].rarity;
    var elementPrice = elementList[element].price;
    var elementImageURL = elementList[element].imageURL;
    document.getElementById("#elementRarity").innerText = elementRarity;
    document.getElementById("#elementImage").src = elementImageURL;
    document.getElementById("#elementName").innerText = elementName;
    document.getElementById("#elementPrice").innerText = `${elementPrice.toLocaleString()} Atoms`;
    document.getElementById("#elementQuantity").innerText = userElements[element];
    if (elementRarity === "Common") {
        document.getElementById("#elementRarity").style.color = "white";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px white";
    } else if (elementRarity === "Uncommon") {
        document.getElementById("#elementRarity").style.color = "#4bc22e";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #4bc22e";
    } else if (elementRarity === "Rare") {
        document.getElementById("#elementRarity").style.color = "#0a14fa";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #0a14fa";
    } else if (elementRarity === "Epic") {
        document.getElementById("#elementRarity").style.color = "#be0000";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #be0000";
    } else if (elementRarity === "Legendary") {
        document.getElementById("#elementRarity").style.color = "#ff910f";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #ff910f";
    } else if (elementRarity === "Fabled") {
        document.getElementById("#elementRarity").style.color = "#0c7500";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #0c7500";
    } else if (elementRarity === "Perfect") {
        document.getElementById("#elementRarity").style.color = "#fffacd";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #fffacd";
    } else if (elementRarity === "Mythical") {
        document.getElementById("#elementRarity").style.color = "#a335ee";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #a335ee";
    } else if (elementRarity === "Divine") {
        document.getElementById("#elementRarity").style.color = "#ee82ee";
        document.getElementById("#elementRarity").style.textShadow = "0px 0px 25px #ee82ee";
    }
    if (element === "blax") {
        document.getElementById("#elementPrice").innerText = "Can't be sold.";
    }
}
