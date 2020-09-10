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

    // GET VALUE FROM INPUT ELEMENTS
    var baseName = coinInputEl.value.trim().toUpperCase();
    var quoteName = document.getElementById("quote").value;
    var pairName = baseName + quoteName;

    if (baseName) {
        coinSearch(pairName);
        coinInputEl.value = "";
    } else {
        alert("Please enter a coin name.");
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

        // LABEL SEARCH HISTORY TAGS WITH TEXT
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

var myVar = setInterval(coinSearch, 1000);

// SEARCH API AND FETCH CURRENT PRICE DATA
var coinSearch = function (pairName) {
    var apiUrl = `https://api.binance.com` + `/api/v3/avgPrice` + `?symbol=${pairName}`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            storeHistory(pairName);
            response.json().then(function (data) {
                getHistory(data);
                console.log(data);
                currentPrice.textContent = "$" + data.price;
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

                // MAKE MAIN DISPLAY MORE LEGIBLE
                for (var i = 0; i < data.symbols.length; i++) {
                    var base = data.symbols[i].baseAsset;
                    var quote = data.symbols[i].quoteAsset;
                    if (pairName === data.symbols[i].baseAsset + data.symbols[i].quoteAsset) {
                        pairDisplayName.textContent = base + '/' + quote;
                        var baseLow = base.toLowerCase();
                        iconEl.setAttribute("src", `https://cryptoicons.org/api/icon/${baseLow}/50`);

                        if (quote === 'USDT') {
                            console.log(currentPrice);
                            console.log(currentPrice.textContent);
                            usdPrice = currentPrice.textContent;
                            var numPrice = parseFloat(usdPrice);
                            console.log(usdPrice);
                            // .Math.round(100 * currentPrice / 100);
                            console.log(numPrice);
                            console.log(typeof(numPrice));

                            var roundPrice = Math.round(numPrice);
                            console.log(roundPrice);
                        }
                    }
                }
            })
        }
    })
}

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