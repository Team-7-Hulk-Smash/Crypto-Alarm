// DISPLAY CURRENT DATE IN HEADER
var showTime = function () {
    $("#currentDate").text(moment().format('MM DD YYYY'));
    $("#time").text(moment().format('hh:mm a'));
}
setInterval(showTime, 60000);

var historyArr = [];
var searchFormEl = document.querySelector("#form-input");
var coinInputEl = document.querySelector("#base");
var pairDisplayName = document.querySelector("#pair");
var iconEl = document.querySelector("#icon");
var currentPrice = document.querySelector("#price");
var listItemEl = document.querySelectorAll(".list-item");

// MAKE SEARCH HISTORY CLICKABLE
var hxListSearch = function (index) {
    listItemEl.forEach(function (coin) {

        if (coin.id == "hxItem" + index) {
            coinSearch(coin.textContent);
        }
    })
};

// ENABLE SEARCH TEXT INPUT
var formSubmitHandler = function (event) {
    event.preventDefault();

    // GET VALUE FROM INPUT ELEMENT
    // var pairName = coinInputEl.value.trim().toUpperCase();
    var baseName = coinInputEl.value.trim().toUpperCase();
    var quoteName = document.getElementById("quote").value;
    var pairName = baseName + quoteName;

    if (pairName) {
        coinSearch(pairName);
        coinInputEl.value = "";
    } else {
        alert("Please enter a pair name.");
    }
};

// SAVE SEARCH TERM IN LOCAL STORAGE
var storeHistory = function (pairName) {
    if (localStorage.getItem('Symbols') === null) {
        historyArr.unshift(pairName);
        console.log(pairName);
        localStorage.setItem('Symbols', historyArr);
        return false;

    } else {
        historyArr = [];
        historyArr.push(localStorage.getItem('Symbols'));
        newHistoryArr = historyArr[0].split(',');
        if (newHistoryArr.includes(pairName)) {
            return false;
        } else {
            historyArr.unshift(pairName);
            localStorage.setItem('Symbols', historyArr);
        }
    }
};

// RETRIEVE SEARCH HISTORY FROM LOCAL STORAGE
var getHistory = function (pairName) {
    if (localStorage.getItem('Symbols') === null) {
        return false;

    } else {
        historyArr = [];
        historyArr.push(localStorage.getItem('Symbols'));
        newHistoryArr = historyArr[0].split(',');


        for (var i = 0; i < 8; i++) {
            var hxItemEl = document.querySelector("#hxItem" + i);
            hxItemEl.textContent = newHistoryArr[i];

            if (hxItemEl.textContent === "" || hxItemEl.textContent === null) {
                hxItemEl.setAttribute("class", "searchTerm invisible list-item list-group-item list-group-item-action border pt-2 pb-2");
            } else {
                hxItemEl.setAttribute("class", "searchTerm list-item list-group-item list-group-item-action border pt-2 pb-2");
            }
        }
    }
}

// SEARCH API AND FETCH CURRENT PRICE DATA
var coinSearch = function (pairName) {
    var apiUrl = `https://api.binance.com` + `/api/v3/avgPrice` + `?symbol=${pairName}`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            storeHistory(pairName);
            getHistory();
            response.json().then(function (data) {
                console.log(data);
                displayPrice(data, pairName);
                symbolFetch(pairName)

            })
        } else {
            alert("Coin not found. Try again!");
            return false;
        }
    })
};
// setInterval(coinSearch, 1000); 

// FETCH SYMBOL PAIR NAME DATA
var symbolFetch = function (pairName) {
    var symbolQuery = `https://api.binance.com/api/v3/exchangeInfo`;
    fetch(symbolQuery).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(pairName);
                console.log(data);
                console.log(data.symbols);

                for (var i = 0; i < data.symbols.length; i++) {
                    var base = data.symbols[i].baseAsset;
                    var quote = data.symbols[i].quoteAsset;
                    if (pairName === data.symbols[i].baseAsset + data.symbols[i].quoteAsset) {
                        pairDisplayName.textContent = base + '/' + quote;
                        var baseLow = base.toLowerCase();
                        iconEl.setAttribute("src", `https://cryptoicons.org/api/icon/${baseLow}/50`);

                        // https://rest.coinapi.io/
                        // /v1/exchanges/icons/{iconSize}
                        // ?apikey=66EFA5BB-5B71-4555-B453-8A8B096C6BBD
                    }
                }
            })
        }
    })
}
// var iconFetch = function () {
//     var iconUrl = `https://rest.coinapi.io//v1/exchanges/icons/600?apikey=66EFA5BB-5B71-4555-B453-8A8B096C6BBD`;
//     fetch(iconUrl).then(function (response) {
//         response.json().then(function (data) {
//             console.log(data);
//         })
//     })
// }
// iconFetch();

// DISPLAY CURRENT price DATA ON PAGE
var displayPrice = function (data, coin) {

    // pairDisplayName.textContent = coin;
    currentPrice.textContent = "$" + data.price;

};

getHistory();
showTime();

searchFormEl.addEventListener("submit", formSubmitHandler);

// var burl = "https://cryptoicons.org";

// var query = "/api/icon/eth/200";

// // // query += '?symbol=BTCUSDT';

// var url = burl + query;

// var ourRequest = new XMLHttpRequest();

// ourRequest.open('GET', url, true);

// ourRequest.onload = function () {
//     // console.log(ourRequest.responseText);
// }
// ourRequest.send();