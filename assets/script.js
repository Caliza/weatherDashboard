const apiKey = '20af441b60a31762e228b7f3d4eae566';
const searchVal = document.querySelector('input');
const searchBtn = document.querySelector('#search-button');
const cityEl = document.querySelector('#city');
const currentEl = document.querySelector('#current');
const currentTemp = document.querySelector('#currentTemp');
const currentHmd = document.querySelector('#currentHmd');
const currentWind = document.querySelector('#currentWind');
const iconEl = document.querySelector('#icon');
const historyEl = document.querySelector('#history');

function handleSearchSubmit() {
    if (!searchVal.value) {
        return
    }
    let city = searchVal.value;
    fetchCurrentWeather(city)
    saveSearch(city)
}

function handleHistorySubmit(event) {
    event.preventDefault()
    console.log('event');
    console.log(this);
    console.log(event.target.innerHTML);
    let city = event.target.innerHTML;
    fetchCurrentWeather(city)
}

function fetchCurrentWeather(city) {
    let apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=imperial`;
    fetch(apiUrlWeather).then(function (response) {
        console.log(response);
        return response.json()
    }).then(function (data) {
        //console.log(data);
        displayCurrentWeather(data)
        fetchCurrentForecast(data.coord.lat, data.coord.lon)
    })
}

function displayCurrentWeather(data) {
    console.log(data);
    cityEl.textContent = data.name
    currentTemp.textContent = 'Temp: ' + data.main.temp + '° F';
    currentHmd.textContent = 'Humidity: ' + data.main.humidity + '%';
    currentWind.textContent = 'Wind: ' + data.wind.speed + ' MPH';
    //finish, add city name
}

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

function displayCurrentForecast(data) {
    currentEl.innerHTML = ''
    for (let index = 3; index < data.list.length; index += 8) {
        let card = document.createElement('div');
        card.classList.add('card', 'col-2', 'm-2', 'bg-light');
        let cardHeader = document.createElement('ul');
        let cardBody = document.createElement('ul');
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

function saveSearch(city) {
    let searchHistory = localStorage.getItem('history') || []
    if (searchHistory.length > 0) {
        searchHistory = JSON.parse(searchHistory)
    }
    if (searchHistory.includes(city)) {
        return
    }
    searchHistory.push(city)
    if (searchHistory.length > 4) {
        searchHistory.shift()
    }
    localStorage.setItem('history', JSON.stringify(searchHistory))
    loadSearch()
}

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

loadSearch()

historyEl.addEventListener('click',  handleHistorySubmit)


searchBtn.addEventListener('click', handleSearchSubmit);
