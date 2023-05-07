import SEARCH_USER from "./SearchUser.js";
import buildReqGPS from "./app.js";

class City {
    constructor() {
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
    let chaine = '<ul>';

    data.forEach(elt => {
        chaine += '<li><span class="cityName">' +
            elt.name.slice(0, 40) +
            '</span><span class="countryName">' +
            elt.country +
            '</span></li>';
    });

    chaine += '</ul>';
    suggest.innerHTML = chaine;

    let suggestCitiesList = suggest.querySelectorAll('li');
    suggestCitiesList.forEach((elt, idx) => elt.addEventListener('click', (e) => {
        document.querySelector('#location').value = data[idx].name + ' (' + data[idx].country +
            ')';
        suggest.innerHTML = "";
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
        if (chaine.length >= 2) {

            try {
                const result = await fetch(
                    `http://api.geonames.org/search?name_startsWith=${chaine}&maxRows=10&username=${SEARCH_USER}`
                );
                const rawData = xmlToJSON.parseString(await result.text());
                const data = rawData.geonames[0].geoname;
                cities = [];
                data.forEach(elt => {
                    let city = new City;
                    city.name = elt.toponymName[0]._text.trim();
                    city.country = elt.countryName[0]._text;
                    city.lng = elt.lng[0]._text;
                    city.lat = elt.lat[0]._text;
                    cities.push(city);
                });
                updateSuggest(cities);
            } catch (err) {
                console.error(err);
            }
        }
    }
}

const populateCity = () => {
    // console.log('PopulateCity : ', coords);
    buildReqGPS(coords);
};

const searchInput = document.querySelector('#location');
searchInput.addEventListener('keyup', searchAPI);
const searchIcon = document.querySelector('#searchEmoji');
searchIcon.addEventListener('click', populateCity)