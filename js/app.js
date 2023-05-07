import pollutionScale from "./PollutionScale.js";
import API_KEY from "./ApiKey.js";

const loader = document.querySelector('#loader');
const emojiLogo = document.querySelector('#emojiLogo');
const userInfo = document.querySelector('#userInformation');



const reqIP = `http://api.airvisual.com/v2/nearest_city?key=${API_KEY}`;
let reqGPS;


const buildReqGPS = (coords) => {
    reqGPS = `http://api.airvisual.com/v2/nearest_city?lat=${coords[0]}&lon=${coords[1]}&key=${API_KEY}`;
    getPollutionData(reqGPS);
};

export default buildReqGPS;

const getPollutionData = async (req) => {
    req == 'reqIP' ? reqIP : reqGPS;

    try {
        const response = await fetch(req == 'reqIP' ? reqIP : reqGPS).catch(err => {
            throw new Error(err);
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}, ${response.statusText}`);
        }

        const respData = await response.json();
        const aqi = respData.data.current.pollution.aqius;
        const temp = respData.data.current.weather.tp;
        const icone = respData.data.current.weather.ic;
        const sortedData = {
            city: respData.data.city,
            aqi,
            temp,
            icone,
            ...pollutionScale.find(obj => aqi >= obj.scale[0] && aqi <= obj.scale[1])
        }
        populateUI(sortedData);
    } catch(err) {
        console.error(err);
        loader.classList.remove('active');
        emojiLogo.src = '../img/networkDown.svg';
        userInfo.textContent = err.message;
    }
};

const title = document.querySelector('h1');
const cityName = document.querySelector('#cityName');
const pollutionInfo = document.querySelector('#pollutionInfo');
const pollutionValue = document.querySelector('#pollutionValue');
const backgroundLayer = document.querySelector('#backgroundLayer');
const locationPointer = document.querySelector('#locationPointer');

const weatherLogo = document.querySelector('#weatherLogo');
const temp = document.querySelector('#temperature');

const populateUI = (data) => {
    title.textContent = data.city + ' Air Quality.';
    emojiLogo.src = `../img/${data.src}.svg`;
    userInfo.textContent = `Air quality for ${data.city} :`;
    // cityName.textContent = data.city;
    temp.textContent = data.temp;
    weatherLogo.style.backgroundImage = `url(../img/weatherIcons/${data.icone}.svg)`;
    pollutionInfo.textContent = data.quality;
    pollutionValue.textContent = data.aqi;
    backgroundLayer.style.backgroundImage = data.background;
    loader.classList.remove('active');
    pointerPlacement(data.aqi);
};

const pointerPlacement = (aqiValue) => {
    const parentWidth = locationPointer.parentElement.scrollWidth;
    locationPointer.style.transform = `translateX(${(aqiValue / 500) * parentWidth}px) rotate(180deg)`
};

getPollutionData('reqIP');