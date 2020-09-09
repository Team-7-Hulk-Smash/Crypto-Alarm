var today = new Date();
var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date + ' ' + time;

document.getElementById("date").textContent = dateTime;

var historyArr = [];
var searchFormEl = document.querySelector("#form-input");
var coinInputEl = document.querySelector("#searchTerm");
var pairDisplayName = document.querySelector("#pair");
var iconEl = document.querySelector("#icon");
var temp = document.querySelector("#temp");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind");
var uvIndex = document.querySelector("#uv");
var currentPrice = document.querySelector("#price");

var fiveDay = {
    price: "11/05/1955",
    icon: "elvis",
    temp: "980",
    humidity: "500"
}
var fiveDayArr = [];
var listItemEl = document.querySelectorAll(".list-item");

// MAKE SEARCH HISTORY CLICKABLE
var hxListSearch = function (index) {
    listItemEl.forEach(function (coin) {

        // for (var i = 0; i < 8; i++) {
        if (coin.id == "hxItem" + index) {
            coinSearch(coin.textContent);
        }
        // }

    })
};

// ENABLE SEARCH TEXT INPUT
var formSubmitHandler = function (event) {
    event.preventDefault();


    // GET VALUE FROM INPUT ELEMENT
    var pairName = coinInputEl.value.trim().toUpperCase();

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
        console.log(newHistoryArr);
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
                    if (pairName === data.symbols[i].baseAsset + data.symbols[i].quoteAsset) {
                        pairDisplayName.textContent = data.symbols[i].baseAsset + '/' + data.symbols[i].quoteAsset;
                    }
                }
            })
        }
    })
}

// DISPLAY CURRENT price DATA ON PAGE
var displayPrice = function (data, coin) {

    // pairDisplayName.textContent = coin;
    currentPrice.textContent = "$" + data.price;

};

getHistory();

searchFormEl.addEventListener("submit", formSubmitHandler);

// var burl = "https://api.binance.com";

// var query = "/api/v3/exchangeInfo";

// // query += '?symbol=BTCUSDT';

// var url = burl + query;

// var ourRequest = new XMLHttpRequest();

// ourRequest.open('GET', url, true);

// ourRequest.onload = function () {
//     // console.log(ourRequest.responseText);
// }
// ourRequest.send();