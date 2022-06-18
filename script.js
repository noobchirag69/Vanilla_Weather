const apiKey = "60e6a50272af81d3cffa81bc0dadf7f9";
const wrapper = document.querySelector('.wrapper');
const inputPart = wrapper.querySelector('.input-part');
const infoTxt = inputPart.querySelector('.info-txt');
const inputField = inputPart.querySelector('input');
const locationBtn = inputPart.querySelector("button");
const wIcon = wrapper.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");

let apiURL;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser doesn't support geolocation api!");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            weatherDetails(result);
        })
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name!`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const final_description = description[0].toUpperCase() + description.slice(1);
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            wIcon.src = "img/clear.png";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "img/storm.png";
        } else if (id >= 500 && id <= 531) {
            wIcon.src = "img/rainy.png";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "img/snow.png";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "img/haze.png";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "img/cloudy.png";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = final_description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});