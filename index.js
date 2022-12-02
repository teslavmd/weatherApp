const d = document,
    $city = d.getElementById("search-city"),
    $cityName = d.querySelector(".climate-city-name"),
    $cityStats = d.querySelector(".climate-stats"),
    $cityStatsField = d.querySelector(".climate-stats-field");

let key = "f74883d22c17c0b34a7e3ded967d447a"





d.addEventListener('click', e => {
    if(e.target.matches("#search-btn") || e.target.matches(`#search-btn *`)){
        getCity($city.value, key).then(
            data => {
                data.forEach(
                    el => {
                        $cityName.innerHTML = `<h2>Clima en ${el.name}</h2>`
                        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${el.lat}&lon=${el.lon}&appid=${key}&lang=sp`;
                        getClimateStats(url);
                    }
                );
            }
        );
    }
})



async function getCity(city, key){
    try{
        let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`),
        json = await response.json();

        if(json.length === 0){
            alert("Ciudad no encontrada... Intente nuevamente.");
        }

        return json;
    }catch (err){
        console.log(err)
    }
}

async function getClimateStats(url){
    try{
        let response = await fetch(url),
        json = await response.json();

        let celciusG = kelvinToCelcius(json.main.temp),
        windSpeed =  Math.trunc((json.wind.speed/1000) * 3600),
        humidity = json.main.humidity,
        tempMin = kelvinToCelcius(json.main.temp_min),
        tempMax = kelvinToCelcius(json.main.temp_max),
        feels = kelvinToCelcius(json.main.feels_like);

        json.weather.forEach(el => {
            icon = el.icon;
            description = firstLetterToUpper(el.description);
        })
            

        $cityStats.innerHTML = `
                                <div class="climate-stats-temp">
                                    <img src=" https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"><h1>${celciusG}°C</h1>
                                </div>
                                <h4>${description}</h4>
                                <h4>Humendad : ${humidity}%</h4>
                                <h4>Velocidad del viento : ${windSpeed} km/h</h4>`;


        $cityStatsField.innerHTML = `<div class="min">
                                            ${tempMin}°C 
                                            <small>mínima</small>
                                        </div>
                                        <div class="feels">
                                            ${feels}°C
                                            <small>sensación</small>
                                        </div>
                                        <div class="max">
                                            ${tempMax}°C
                                            <small>máxima</small>
                                        </div>`
        
    }catch (err){
        console.log(err);
    }
}


//Poner la primer letra en mayuscula de la descripcion obtedina del respose;
function firstLetterToUpper(str){
    let firstLetter = str.charAt(0).toUpperCase();
    return firstLetter + str.slice(1);
}

//Conversor de grados kelvin a Celcius;
function kelvinToCelcius(temp){
    return Math.trunc(temp - 273.15);
}