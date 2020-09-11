// DISPLAY CURRENT DATE IN HEADER
var showTime = function () {
    $("#currentDate").text(moment().format('MM/DD/YYYY'));
    $("#time").text(moment().format('hh:mm a'));
}
setInterval(showTime, 60000);

var historyArr = [];
var searchFormEl = document.querySelector("#form-input");
var coinInputEl = document.querySelector("#base");
var pairDisplayName = document.querySelector("#pair");
var iconEl = document.getElementById("icon");
var priceIcon = document.getElementById("icon2");
var startPriceEl = document.querySelector("#startPrice");
var startPrice;
var tickerPrice;
var container = document.querySelector("#response-container");
var error404 = "Coin pair not found. Try again!"
var error202 = "Please enter a valid coin abbreviation (Ex: 'BTC' for Bitcoin)."
var listItemEl = document.querySelectorAll(".list-item");
var pairName;
var bearUrl = "https://api.giphy.com/v1/gifs/search?q=bear&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN";
var bullUrl = "https://api.giphy.com/v1/gifs/search?q=bull&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN";

// MAKE SEARCH HISTORY CLICKABLE
var hxListSearch = function (index) {
    listItemEl.forEach(function (coin) {

        if (coin.id == "hxItem" + index) {
            pairName = coin.textContent;
            startPriceFetch();
            console.log(coin.textContent);
        }
    })
};

// ENABLE SEARCH TEXT INPUT
var formSubmitHandler = function (event) {
    event.preventDefault();

    // GET VALUE FROM INPUT ELEMENTS
    var baseName = coinInputEl.value.trim().toUpperCase();
    var quoteName = document.getElementById("quote").value;
    pairName = baseName + quoteName;

    if (baseName) {
        startPriceFetch();
        coinInputEl.value = "";
    } else {
        modal.style.display = "block";
        document.getElementById("errorMsg").innerHTML = error202
    }
};
// SAVE SEARCH TERM IN LOCAL STORAGE
var storeHistory = function () {
    if (localStorage.getItem('Symbols') === null) {
        historyArr.unshift(pairName);
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
var getHistory = function () {
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
};

// SEARCH API AND FETCH START PRICE DATA
var startPriceFetch = function () {
    var apiUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${pairName}`;

    fetch(apiUrl).then(function (response) {
        if (response) {
            storeHistory(pairName);
            getHistory();
            response.json().then(function (data) {
                startPrice = data.price;
                startPrice = parseFloat(startPrice);
                startPriceEl.textContent = "Start Price: $" + startPrice;
                priceTickerFetch();
                clearInterval(myTicker);
                myTicker = setInterval(priceTickerFetch, 10000);
                symbolFetch()
            })
        }
    }).catch(function (error) {
        {
            console.log(error);
            modal.style.display = "block";
            document.getElementById("errorMsg").innerHTML = error404;
        }
    })
    
};

// FETCH SYMBOL PAIR NAME DATA
var symbolFetch = function () {
    var symbolQuery = `https://api.binance.com/api/v3/exchangeInfo`;
    fetch(symbolQuery).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                // DISPLAY START TIME
                var milliseconds = data.serverTime;
                var dateObject = new Date(milliseconds);
                var options = {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                };
                var timeStamp = dateObject.toLocaleDateString('en-US', options);
                var startTime = document.getElementById("time-stamp");
                startTime.textContent = "Start Time: " + timeStamp;

                // MAKE MAIN DISPLAY MORE LEGIBLE
                for (var i = 0; i < data.symbols.length; i++) {
                    var base = data.symbols[i].baseAsset;
                    var quote = data.symbols[i].quoteAsset;
                    if (pairName === data.symbols[i].baseAsset + data.symbols[i].quoteAsset) {
                        pairDisplayName.textContent = base + '/' + quote;
                        var baseLow = base.toLowerCase();
                        var quoteLow = quote.toLowerCase();
                        iconEl.setAttribute("src", `https://cryptoicons.org/api/icon/${baseLow}/50`);
                        priceIcon.setAttribute("src", `https://cryptoicons.org/api/icon/${quoteLow}/25`);
                    }
                }
            })
        }

        // priceChangeDataFetch();
    })
};
// FETCH PRICE CHANGE DATA
// var priceChangeDataFetch = function () {
//     var dataUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${pairName}`;
//     fetch(dataUrl).then(function (response) {
//         response.json().then(function (data) {
//             var priceChange = document.getElementById("priceChange");
//             console.log(data)
//             priceChange.textContent = "24h Price Change: " + data.priceChange;
//             var priceChangePercent = document.getElementById("priceChangePercent");
//             priceChangePercent.textContent = "24h Percent Change " + data.priceChangePercent + "%";
//             priceTickerFetch(pairName);


//             clearInterval(myTicker);
//             myTicker = setInterval(priceTickerFetch, 10000);

//         })
//     })
// };

var myTicker;
// FETCH PRICE TICKER 
var priceTickerFetch = function () {
    var tickerUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${pairName}`;
    fetch(tickerUrl).then(function (response) {
        response.json().then(function (data) {
            // DISPLAY DOLLAR SIGN AND ROUND PRICE
            var tickerPriceEl = document.getElementById("priceTicker");
            tickerPrice = data.price;
            tickerPriceEl.textContent = tickerPrice;
            tickerPrice = parseFloat(tickerPrice);
            comparePrices();
            if (pairName.includes('USDT')) {
                tickerPriceEl.textContent = "$" + tickerPrice;
            }
            if (tickerPrice > 1) {
                roundTickerPrice = tickerPrice.toFixed(2);
                tickerPriceEl.textContent = "$" + roundTickerPrice;
            }
        })
    })

};

var comparePrices = function () {
    console.log(startPrice);
    console.log(tickerPrice);
    var percentChange = ((tickerPrice - startPrice) / startPrice * 100).toFixed(2);
    console.log(percentChange);
    var percentChangeEl = document.getElementById("percentChange");
    percentChangeEl.textContent = "Percent Change: " + percentChange + "%";

    if (percentChange >= 0.01) {
        console.log("THE PRICE IS RISING!");
        fetch(bullUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                container.textContent = "";
                var gifImg = document.createElement("img");
                gifImg.setAttribute("src", response.data[0].images.fixed_height.url);
                container.appendChild(gifImg);
            })
    } else if (percentChange <= -0.01) {
        console.log("THE PRICE IS FALLING!")
        fetch(bearUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log(response.data[0]);
                container.textContent = "";
                var gifImg = document.createElement("img");
                gifImg.setAttribute("src", response.data[0].images.fixed_height.url);
                container.appendChild(gifImg);
            })
    } else {
        container.innerHTML = "";
    }
};

getHistory();
showTime();

searchFormEl.addEventListener("submit", formSubmitHandler);

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}