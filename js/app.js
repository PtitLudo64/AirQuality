import pollutionScale from "./PollutionScale.js";
import API_KEY from "./ApiKey.js";

const loader = document.querySelector('#loader');
const emojiLogo = document.querySelector('#emojiLogo');
const userInfo = document.querySelector('#userInformation');

const getPollutionData = async () => {
    try {
        const response = await fetch(`http://api.airvisual.com/v2/nearest_city?key=${API_KEY}`).catch(err => {
            throw new Error(err);
        });

        if(!response.ok) {
            throw new Error(`Error ${response.status}, ${response.statusText}`);
        }

        const resData = await response.json();
        const aqi = resData.data.current.pollution.aqius;
        const sortedData = {
            city: resData.data.city,
            aqi,
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

const cityName = document.querySelector('#cityName');
const pollutionInfo = document.querySelector('#pollutionInfo');
const pollutionValue = document.querySelector('#pollutionValue');
const backgroundLayer = document.querySelector('#backgroundLayer');
const locationPointer = document.querySelector('#locationPointer');

const populateUI = (data) => {
    emojiLogo.src = `../img/${data.src}.svg`;
    userInfo.textContent = `Air quality for ${data.city} :`;
    cityName.textContent = data.city;
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

getPollutionData();