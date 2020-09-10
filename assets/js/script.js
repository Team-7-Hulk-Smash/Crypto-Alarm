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
var iconEl = document.querySelector("#icon");
var currentPrice = document.querySelector("#price");
var error404 = "Coin not found. Try again!"
var error202 = "Please enter a valid coin abbreviation (Ex: 'BTC' for Bitcoin)."

var listItemEl = document.querySelectorAll(".list-item");

// MAKE SEARCH HISTORY CLICKABLE
var hxListSearch = function (index) {
    listItemEl.forEach(function (coin) {

        if (coin.id == "hxItem" + index) {
            avgPriceFetch(coin.textContent);
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

    // GET VALUE FROM INPUT ELEMENT
    var baseName = coinInputEl.value.trim().toUpperCase();
    
    if (baseName) {
        avgPriceFetch(pairName);
        coinInputEl.value = "";
    } else {
            modal.style.display = "block";
            document.getElementById("errorMsg").innerHTML = error202
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

var myVar = setInterval(avgPriceFetch, 1000);

// SEARCH API AND FETCH CURRENT PRICE DATA
var avgPriceFetch = function (pairName) {
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
        } 
        else {
    
            modal.style.display = "block";
            document.getElementById("errorMsg").innerHTML = error404;
            console.log(data);
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
        } priceDataFetch(pairName);
    })
}

var priceDataFetch = function(pairName) {
    var dataUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${pairName}`;
    fetch(dataUrl).then(function (response) {
        response.json().then(function (data) {
            console.log(data);
            var priceChange = document.getElementById("priceChange");
            priceChange.textContent = "24h Price Change: " + data.priceChange;
            var priceChangePercent = document.getElementById("priceChangePercent");
            priceChangePercent.textContent = "24h Price Change Percentage " + data.priceChangePercent + "%";
        })
    })
}

getHistory();
showTime();

searchFormEl.addEventListener("submit", formSubmitHandler);

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
