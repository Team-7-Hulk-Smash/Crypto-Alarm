var today = new Date();
var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date + ' ' + time;

document.getElementById("date").textContent = dateTime;

var historyArr = [];
var searchFormEl = document.querySelector("#form-input");
var coinInputEl = document.querySelector("#searchTerm");
var coinDisplayName = document.querySelector("#coin");
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
    var coinName = coinInputEl.value.trim().toUpperCase();

    if (coinName) {
        coinSearch(coinName);
        coinInputEl.value = "";
    } else {
        alert("Please enter a pair name.");
    }
};

// SAVE SEARCH TERM IN LOCAL STORAGE
var storeHistory = function (coinName) {
    if (localStorage.getItem('Symbols') === null) {
        historyArr.unshift(coinName);
        console.log(coinName);
        localStorage.setItem('Symbols', historyArr);
        return false;

    } else {
        historyArr = [];
        historyArr.push(localStorage.getItem('Symbols'));
        newHistoryArr = historyArr[0].split(',');
        console.log(newHistoryArr);
        if (newHistoryArr.includes(coinName)) {
            return false;
        } else {
            historyArr.unshift(coinName);
            localStorage.setItem('Symbols', historyArr);
        }
    }
};

// RETRIEVE SEARCH HISTORY FROM LOCAL STORAGE
var getHistory = function (coinName) {
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



var symbolFetch = function () {
    var symbolQuery = `https://api.binance.com/api/v3/exchangeInfo`;
    fetch(symbolQuery).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(coin);
                if (coin.symbol === data.baseAsset + data.quoteAsset) {
                    
                }
            })
        }
    })
}




// SEARCH API FOR CURRENT AND FIVE-DAY price DATA
var coinSearch = function (coin) {
    var apiUrl = `https://api.binance.com` + `/api/v3/avgPrice` + `?symbol=${coin}`;


    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            storeHistory(coin);
            getHistory();
            response.json().then(function (data) {
                console.log(data);
                displayPrice(data, coin);
                symbolFetch(coin)

                // var apiFiveUrl = "https://api.openpricemap.org/data/2.5/forecast?q=" + coin + "&units=imperial&appid=c888bc87519e878c5cbb608278ea9713";
                // fetch(apiFiveUrl).then(function (fiveResponse) {
                //     fiveResponse.json().then(function (fiveData) {
                //         fiveDayCompiler(fiveData);

                //     })
                // })

            })
        } else {
            alert("Coin not found. Try again!");
            return false;
        }

    })

};

// DISPLAY CURRENT price DATA ON PAGE
var displayPrice = function (data, coin) {

    coinDisplayName.textContent = coin;
    currentPrice.textContent = "$" + data.price;
    //     var tempRound = Math.round(data.main.temp);
    //     var windRound = Math.round(data.wind.speed);
    //     // GET ICON
    //     iconEl.setAttribute("src", "https://openpricemap.org/img/wn/" + data.price[0].icon + "@2x.png");

    //     temp.textContent = "Temperature: " + tempRound + "℉";
    //     humidity.textContent = "Humidity: " + data.main.humidity + "%";
    //     windSpeed.textContent = "Wind Speed: " + windRound + "mph";

    // Convert UTC code to current price

};
//     // Get UV Index 
//     var lat = data.coord.lat
//     var lon = data.coord.lon
//     var uvUrl = "https://api.openpricemap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=c888bc87519e878c5cbb608278ea9713";

//     // Get 5-day data
//     var fiveApi = `https://api.openpricemap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=c888bc87519e878c5cbb608278ea9713`;
//     fetch(fiveApi).then(function(response) {
//         response.json().then(function (fiveData) {
//             fiveDayCompiler(fiveData)
//             console.log(fiveData);

//         }) 
//     })


//     fetch(uvUrl).then(function (response) {
//         response.json().then(function (data) {
//             displayUV(data);
//         })
//     })
// };

// DISPLAY COLOR-CODED UV-INDEX
// var displayUV = function (data) {
//     var uvRound = Math.round(data.value);
//     uvIndex.textContent = "UV Index: " + uvRound;
//     if (data.value < 3) {
//         uvIndex.setAttribute("class", 'forecast-data bg-success text-white rounded text-center');
//     } else if (data.value >= 3 && data.value < 8) {
//         uvIndex.setAttribute("class", 'forecast-data bg-warning text-white rounded text-center');
//     } else {
//         uvIndex.setAttribute("class", 'forecast-data bg-danger text-white rounded text-center');
//     }
// };

// COMPILE 5-DAY DATA INTO OBJECTS
// var fiveDayCompiler = function (data) {
//     console.log(data);
//     var fiveDayArr = [];
//     for (var i = 1; i < 6; i++) {

//             var fiveDay = {
//                 price: data.daily[i].dt,
//                 icon: data.daily[i].price[0].icon,
//                 temp: data.daily[i].temp.day,
//                 humidity: data.daily[i].humidity
//             }
//             console.log(fiveDay);
//             // Round temperature to nearest integer
//             var roundTemp = Math.round(data.daily[i].temp.day);
//             fiveDay.temp = roundTemp;
//             // Convert UTC code to current price
//             var milliseconds = data.daily[i].dt * 1000;
//             var priceObject = new price(milliseconds);
//             var options = {month: 'numeric', day: 'numeric'};
//             var newprice = priceObject.toLocalepriceString('en-US', options);
//             fiveDay.price = newprice;
//             fiveDayArr.push(fiveDay);
//         }


//     displayFiveDay(fiveDayArr);
// };

// DISPLAY 5-DAY FORECAST DATA
// var displayFiveDay = function (data) {
//     var fiveTitle = document.getElementById("fiveTitle");
//     fiveTitle.setAttribute("class", "col-12 ml-1 pl-2");
//     for (var i = 0; i < data.length; i++) {

//         var day = document.getElementById("day" + i);
//         day.setAttribute('class', 'future bg-primary rounded text-white col-md m-1 w-100');
//         day.innerHTML = '<p class="h4 text-center pt-3">' + data[i].price + '</p><img id="icon' + i + '"class="w-100" src="https://openpricemap.org/img/wn/' + data[i].icon + '@2x.png"></img><p>Temp: ' + data[i].temp + '℉</p><p>Humidity: ' + data[i].humidity + '%</p>';

//     }
//     return
// };

getHistory();


searchFormEl.addEventListener("submit", formSubmitHandler);