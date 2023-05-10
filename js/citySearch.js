import SEARCH_USER from "./SearchUser.js";
import buildReqGPS from "./app.js";

class City {
    constructor() {
        this.formated,
        this.category,
        this.name,
        this.country,
        this.lng,
        this.lat
    }
};

let cities = [];
let coords = [];


const updateSuggest = (data) => {
    coords = [];
    const divSuggest = document.querySelector('#suggest');
    let chaine = '';

    data.forEach(elt => {
        if (elt.name != undefined) {
            chaine += '<div class="autocomplete">' + 
                        '<span class="suggestIcon">';
            elt.category == 'site' ? chaine+='<img src="img/location.svg" />' : chaine+='<img src="img/building.svg" />';
            chaine+='</span><span class="cityName">' + elt.formated.slice(0, 40) + '</span></div>';
        }
    });

    divSuggest.innerHTML = chaine;

    let suggestCitiesList = divSuggest.querySelectorAll('.autocomplete');
    suggestCitiesList.forEach((elt, idx) => elt.addEventListener('click', (e) => {
        document.querySelector('#location').value = data[idx].name + ' (' + data[idx].country +
            ')';
        divSuggest.innerHTML = "";
        suggestCitiesList = [];
        // résultat 
        coords.push(data[idx].lat, data[idx].lng);
    }))
}

const searchAPI = async (key) => {
    if (key.key == 'Enter')
        console.log('-> Validé');
    else {
        let chaine = key.target.value;
        if (chaine.length > 2) {

            try {
                const result = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${chaine}&format=json&apiKey=${SEARCH_USER}`
                );

                const rawData = await result.json();

                const data = rawData.results;
                cities = [];
                data.forEach(elt => {
                    if (elt.city != undefined) {
                        let city = new City;
                        city.formated = elt.formatted;
                        city.category = elt.category != undefined ? elt.category : 'site';
                        city.name = elt.city;
                        city.country = elt.country;
                        city.lng = elt.lon;
                        city.lat = elt.lat;
                        cities.push(city);
                    }
                });
                updateSuggest(cities);
            } catch (err) {
                console.error(err);
            }
        }
    }
}

const populateCity = () => {
    buildReqGPS(coords);
};

const searchInput = document.querySelector('#location');
searchInput.addEventListener('keyup', searchAPI);
const searchIcon = document.querySelector('#searchEmoji');
searchIcon.addEventListener('click', populateCity);