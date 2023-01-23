const apiKey = '20af441b60a31762e228b7f3d4eae566';
const searchVal = document.querySelector('input');
const searchBtn = document.querySelector('#search-button');
const currentEl = document.querySelector('#current');
const currentTemp = document.querySelector('#currentTemp');
const iconEl = document.querySelector('#icon');

function handleSearchSubmit() {
    if (!searchVal.value) {
        return
    }
    let city = searchVal.value;
    fetchCurrentWeather(city)
}

function fetchCurrentWeather(city) {
    let apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=imperial`;
    fetch(apiUrlWeather).then(function (response) {
        console.log(response);
        return response.json()
    }).then(function (data) {
        console.log(data);
        displayCurrentWeather(data)
        fetchCurrentForecast(data.coord.lat, data.coord.lon)
        // response >> data
    })
}

function displayCurrentWeather(data) {
    currentTemp.textContent = data.main.temp;
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
    for (let index = 3; index < data.list.length; index += 8) {
        let card = document.createElement('div');
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
        tempEL.textContent = data.list[index].main.temp
        humidityEl.textContent = data.list[index].main.humidity
        windEl.textContent = data.list[index].wind.speed
        cardBody.append(tempEL, windEl, humidityEl)
        card.append(cardHeader, cardBody)
        currentEl.append(card)
    }
}
   







searchBtn.addEventListener('click', handleSearchSubmit);
