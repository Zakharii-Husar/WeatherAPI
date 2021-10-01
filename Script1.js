// JavaScript source code
let range = document.getElementById("range");
let submitBtn = document.getElementById("submit");
let city;
let cityInput = document.getElementById("cityInput");
const cityOptions = document.getElementById("cityOptions");
let placeInfo;
let key = "9c9d1043468f7eab855d753a0e934247";
let lang = "eng"; //de, ua/uk
let units = "metric";
let limit = 5;

const changeVisibility = (obj, display) =>{
    obj.style.display = display
};

const showCities = () => {
    city = cityInput.value;
    changeVisibility(cityOptions, "flex");
    fetchData();
};
submitBtn.addEventListener("click", showCities);
cityInput.addEventListener("click", changeVisibility(cityOptions, "flex"));


const fetchData = () => {

fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`)
    .then(response => response.json())
    .then(data => {
        let lat;
        let lon;
        const cities = cityOptions.children;
        for (let i = 0; i < data.length; i++){
            let state = data[i].state;
            if(!state) state = " ";
            let currentPlace = `${data[i].name} ${state} ${data[i].country}`;
            cities[i].innerHTML = currentPlace;

            const setCity = () =>{
                changeVisibility(cityOptions, "none");
                changeVisibility(range, "flex");
                lat = data[i].lat;
                lon = data[i].lon;
                placeInfo = currentPlace;
                showWeather()

            };

            cities[i].addEventListener("click", setCity);
        };

const showWeather = () =>{
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${key}`)
            .then(response => response.json())
            .then(data => {

                const update = () =>{
                    let indexHourly = range.value;
                        
                    const hourly = {
                        time: data.hourly[indexHourly].dt,
                        timeZone: data.timezone_offset,
                        temperature: data.hourly[indexHourly].temp,
                        feels: data.hourly[indexHourly].feels_like,
                        hPaPressure: data.hourly[indexHourly].pressure,
                        humidity: data.hourly[indexHourly].humidity,
                        clouds: data.hourly[indexHourly].clouds,
                        windSpeed: data.hourly[indexHourly].wind_speed,
                        probabilityOfPrecipitation: data.hourly[indexHourly].pop,
                        icon: data.hourly[indexHourly].weather[0].icon,
                        description: data.hourly[indexHourly].weather[0].description
                    };

                    const clothes = {
                        tshirt: "tshirt",
                        shirt: "shirt",
                        jacket: "jacket",
                        raincoat: "raincoat",
                        winterCoat: "wintercoat"

                    }

                    let item = clothes.tshirt;


                    const conditionalDress = () =>{
                        if(hourly.temperature < 20) item = clothes.shirt;
                        if(hourly.temperature < 15) item = clothes.jacket;
                        if(hourly.temperature < 10) item = clothes.raincoat;
                        if(hourly.temperature < 5) item = clothes.winterCoat;
                    };
                    conditionalDress();

                    let clothesCurrentPicture = `img/${item}.png`;

                    const timeStamp = new Date(hourly.time * 1000);
                    let month = 1 + timeStamp.getMonth();
                    if (month < 10) month = "0" + month;
                    let date = timeStamp.getDate();
                    if (date < 10) date = "0" + date;
                    let hours = timeStamp.getHours();
                    if (hours < 10) hours = "0" + hours;

                        const currentIcon = document.getElementById('icon');
                        currentIcon.src = `http://openweathermap.org/img/wn/${hourly.icon}@2x.png`;
                        const clothesIcon = document.getElementById('clothesItem');
                        clothesIcon.src = clothesCurrentPicture;
                        const umbrellaIcon = document.getElementById('umbrella');
                        hourly.description.indexOf("rain") == -1? changeVisibility(umbrellaIcon, "none") : changeVisibility(umbrellaIcon, "flex");
                        const glassesIcon = document.getElementById('glasses');
                        hourly.icon === "01d"? changeVisibility(glassesIcon, "flex") : changeVisibility(glassesIcon, "none");
                        const place = document.getElementById("place");
                        place.innerHTML = placeInfo;
                        const timeIcon = document.getElementById("time");
                        timeIcon.innerHTML = `${month}/${date} ${hours}:00`;
                        const temperature = document.getElementById("temperature");
                        temperature.innerHTML = `${hourly.temperature}°C`
                        const description = document.getElementById("description");
                        description.innerHTML = hourly.description;
                        const clouds = document.getElementById("clouds");
                        clouds.innerHTML = `clouds: ${hourly.clouds}%`;
                        const humidity = document.getElementById("humidity");
                        humidity.innerHTML = `humidity: ${hourly.humidity}%`;
                    };
                update()

                range.addEventListener('mousemove', () => {
                update();});
                range.addEventListener('touchmove', () => {
                    update();});
                range.addEventListener('change', () => {
                update();});


            })
        };
    });
}