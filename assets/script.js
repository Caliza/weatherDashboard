const apiKey = '20af441b60a31762e228b7f3d4eae566';
const searchVal = document.querySelector('input');
const searchBtn = document.querySelector('#search-button');
const clearBtn = document.querySelector('#clear-button');
const cityEl = document.querySelector('#city');
const currentEl = document.querySelector('#current');
const currentTemp = document.querySelector('#currentTemp');
const currentHmd = document.querySelector('#currentHmd');
const currentWind = document.querySelector('#currentWind');
const currentDateEl = document.querySelector('#date');
const iconEl = document.querySelector('#icon');
const imgEl = document.querySelector('img');
const historyEl = document.querySelector('#history');

//Handles user's input (city) and sets it as a parameter in fnc. fetchCurrentWeather and saveSearch.
function handleSearchSubmit() {
    if (!searchVal.value) {
        return
    }
    let city = searchVal.value;
    city = capitalizeFirstLetter(city)
    fetchCurrentWeather(city)
    // saveSearch(city)
}

//Capitalizes first letter of each word in city's name.
function capitalizeFirstLetter(city) {
    let tempArr = city.split(' ')
    let res = []
    tempArr.forEach((cityName) => {
        let capitalChar = cityName.split('', 1)[0].toUpperCase()
        let cityRemaining = cityName.substring('1')

        cityName = capitalChar += cityRemaining
        res.push(cityName)
    })
    return res.join(' ')
}

function handleHistorySubmit(event) {
    event.preventDefault()
    console.log('event');
    console.log(this);
    console.log(event.target.innerHTML);
    let city = event.target.innerHTML;   
    fetchCurrentWeather(city)
}

//Fetches api and passes data to fnc. displayCurrentWeather and fetchCurrentForecast.
function fetchCurrentWeather(city) {
    let apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=imperial`;
    fetch(apiUrlWeather).then(function (response) {
        console.log(response);
        if (response.status == 404) {
            alert('City not found with that name!')
        }
        return response.json()
    }).then(function (data) {
        //console.log(data);
        displayCurrentWeather(data)
        fetchCurrentForecast(data.coord.lat, data.coord.lon)
        saveSearch(city)
    })
}

//Displays current weather to browser.
function displayCurrentWeather(data) {
    console.log(data);
    cityEl.textContent = data.name
    currentDateEl.textContent = dayjs.unix(data.dt).format('M/D/YYYY')
    let iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    imgEl.setAttribute('src', iconUrl);
    currentTemp.textContent = 'Temp: ' + data.main.temp + '° F';
    currentHmd.textContent = 'Humidity: ' + data.main.humidity + '%';
    currentWind.textContent = 'Wind: ' + data.wind.speed + ' MPH';
    //finish, add city name
}

//Fetches api and passes data to fnc. displayCurrentForecast.
function fetchCurrentForecast(lat, lon) {
    let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(apiUrlForecast).then(function (response) {
        console.log(response);
        return response.json()
    }).then(function (data) {
        console.log(data);
        displayCurrentForecast(data)
    })
}

//Displays 5 day forecast to browser.
function displayCurrentForecast(data) {
    currentEl.innerHTML = ''
    for (let index = 5; index < data.list.length; index += 8) {
        let card = document.createElement('div');
        card.classList.add('card', 'col-2', 'm-2', 'bg-light', 'w-x', 'ps-2');
        let cardHeader = document.createElement('div');
        let cardBody = document.createElement('div');
        let dateEl = document.createElement('h3');
        let iconUrl = `https://openweathermap.org/img/w/${data.list[index].weather[0].icon}.png`;
        let icon = document.createElement('img')
        icon.setAttribute('src', iconUrl)
        dateEl.textContent = dayjs.unix(data.list[index].dt).format('M/D/YYYY')
        cardHeader.append(dateEl, icon)
        let tempEL = document.createElement('p')
        let humidityEl = document.createElement('p')
        let windEl = document.createElement('p')
        tempEL.textContent = 'Temp: ' + data.list[index].main.temp + '° F'
        humidityEl.textContent = 'Humidity: ' + data.list[index].main.humidity + '%';
        windEl.textContent = 'Wind: ' + data.list[index].wind.speed + ' MPH'
        cardBody.append(tempEL, windEl, humidityEl)
        card.append(cardHeader, cardBody)
        currentEl.append(card)
    }
}

//Pulls and saves previous search to localStorage.
function saveSearch(city) {
    let searchHistory = localStorage.getItem('history') || []
    if (searchHistory.length > 0) {
        searchHistory = JSON.parse(searchHistory)
    }
    if (searchHistory.includes(city)) {
        return
    }
    searchHistory.push(city)
    if (searchHistory.length > 8) {
        searchHistory.shift()
    }
    localStorage.setItem('history', JSON.stringify(searchHistory))
    loadSearch()
}

//Gets and loads previous search from localStorage and creates past-search buttons.
function loadSearch() {
    historyEl.textContent = ''
    let searchHistory = localStorage.getItem('history') || []
    if (searchHistory.length > 0) {
        searchHistory = JSON.parse(searchHistory)
    }
    searchHistory.forEach(e => {
        const cityBtn = document.createElement('button')
        cityBtn.classList.add('historyBtns')
        cityBtn.textContent = e
        historyEl.append(cityBtn)
    })
}

function clearHistory(event) {
    event.preventDefault()
    historyEl.textContent = ''
    let searchHistory = localStorage.getItem('history') || []
    if (searchHistory.length > 0) {
        searchHistory = JSON.parse(searchHistory)
    }
    searchHistory = []
    localStorage.setItem('history', JSON.stringify(searchHistory))
    loadSearch()
}

loadSearch()

historyEl.addEventListener('click', handleHistorySubmit)

searchBtn.addEventListener('click', handleSearchSubmit);

clearBtn.addEventListener('click', clearHistory);