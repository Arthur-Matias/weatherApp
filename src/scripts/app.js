// const weather_API_key = '780822957a50980f5edcfbca2c332084';
const weather_API_key = 'b0570eba20b3401e97479a4aa77c7568';

const google_API_key = 'AIzaSyCRA0WH9h5WVxUmz2GoUyUSvHfEquU2Nno';
const weather_API_url = 'https://api.openweathermap.org/data/2.5/forecast/daily';
const google_API_url = `https://maps.googleapis.com/maps/api/js?key=${google_API_key}&libraries=places&callback=initMap`;

const weatherMap = new Map([
    [300, 'rain'],
    [301, 'rain'],
    [302, 'rain'],
    [500, 'rain'],
    [501, 'rain'],
    [502, 'rain'],
    [511, 'rain'],
    [520, 'rain'],
    [521, 'rain'],
    [522, 'rain'],
    [900, 'rain'],
    [200, 'storm'],
    [201, 'storm'],
    [202, 'storm'],
    [230, 'storm'],
    [231, 'storm'],
    [232, 'storm'],
    [233, 'storm'],
    [600, 'snow'],
    [601, 'snow'],
    [602, 'snow'],
    [610, 'snow'],
    [611, 'snow'],
    [621, 'snow'],
    [622, 'snow'],
    [623, 'snow'],
    [700, 'cloudy'],
    [711, 'cloudy'],
    [721, 'cloudy'],
    [731, 'cloudy'],
    [941, 'cloudy'],
    [751, 'cloudy'],
    [804, 'cloudy'],
    [800, 'sunny-day'],
    [801, 'sun-with-clouds'],
    [802, 'sun-with-clouds'],
    [803, 'sun-with-clouds'],
])

const WEATHER_PICS = {
    defaultPath: 'https://raw.githubusercontent.com/Arthur-Matias/weatherApp/main/src/assets/images',
    num: Math.round((Math.random()*2)),
    getImageNum(){
        return this.num
    },
    getPicPath(value, num){
         return `${this.defaultPath}/weather/${weatherMap.get(value)}/${num}.jpg`
        },
    getIconPath(value, num){
        return `${this.defaultPath}/icons/${weatherMap.get(value)}.svg`
    }
}

let USER_LOCATION;
let forecastForTheWeek;


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const shortenWeekDay = (day) => {
    return day.substring(0, 3)
}

const script = document.createElement('script');
script.src = google_API_url;
script.defer = true;

const coords = { latitute: '', longitude: '' }
document.head.appendChild(script);

let weatherProps;

let CARDS = '';

//setting autocomplete from places API
window.initMap = function () {
    const input = document.querySelector('#cityInput')
    let options = {
        fields: ["address_components", "geometry"]
    }
    let autocomplete = new google.maps.places.Autocomplete(
        input,
        options,
    );
    autocomplete.setFields(['address_components', 'geometry']);
    autocomplete.addListener('place_changed', () => {
        self.autocomplete = autocomplete.getPlace();
        coords.latitute = self.autocomplete.geometry.location.lat();
        coords.longitude = self.autocomplete.geometry.location.lng();
        setUserLocation(coords.latitute, coords.longitude)
    });
};

//get user location
$(window).ready(() => {
    try {
        if ('geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' })
                .then((geoLocationPermission) => {
                    console.log(geoLocationPermission.state)
                    if (geoLocationPermission.state === 'granted' || geoLocationPermission.state === 'prompt') {
                        navigator.geolocation.getCurrentPosition(async (position) => {await getWeather(position.coords.latitude, position.coords.longitude)});
                    } else {
                        toggleModalOpen();
                        $('#cityInput').focus();
                    }
                })
                .then(async ()=>{
                })
        }
        else {
            toggleModalOpen();
            $('#cityInput').focus();
        }
    } catch (error) {
        console.log(error)
        alert('Ocorreu um erro, tente novamente')
    }
}
)

const toggleModalOpen = () => {
    $('.modal').toggleClass('open')
}

const setUserLocation = async (latitude, longitude) => {
    coords.longitude = longitude
    coords.latitute = latitude
}

const handleCardMouseOver = (e, code) => {
    let num = Math.round((Math.random()*2))
    if (!$(e).hasClass('active')) {
        $('.active').toggleClass('active')
        $(e).toggleClass('active')
        $('body').css('background-image', 'url(' + WEATHER_PICS.getPicPath(code, num) + ')')
        $('.app-content-container').css('background-image', 'url(' + WEATHER_PICS.getPicPath(code, num) + ')')
    }
}

function handleSearchButtonClick(){
    CARDS = '';
    $('#cityInput').prop('disabled', false)
    $('#cityButton').prop('disabled', false)
    toggleModalOpen();
}

async function getCurrTimeWithLocalization(){
    await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${coords.latitute},${coords.longitude}&timestamp=1331161200&key=${google_API_key}`)
        .then(data => {
            return data.json()
        })
        .then(response=>{
            console.log(response)
        })
}

const getWeatherCard = ({
    weather,
    temp, 
    wind_spd, 
    wind_dir,
    valid_date
    }, active) => {
        let weatherCode = weather.code,
            temperature = temp.toFixed(1),
            windSpeed = wind_spd.toFixed(1), 
            windAngle = wind_dir;
        
            let time = new Date(valid_date);
            let dayNumber = time.getDate();
            let currentDay = days[time.getDay()];
            
            function addZero(i) {
                if (i < 10) {
                  i = "0" + i;
                }
                return i;
            }
            
            function formatHour() {
                let currentHour =  new Date();
                let hour = addZero(currentHour.getHours())
                var minutes = addZero(currentHour.getMinutes());
                return hour + ":" + minutes;
              }

            $('#city-hour').html(formatHour())
            $('#city-country').html($('#cityInput').val())

        let iconPath = WEATHER_PICS.getIconPath(weatherCode)
        return (`
        <div onmouseover="handleCardMouseOver(this, ${weatherCode})" class="app-card-wrapper ${active?'open':''}">
            <div class="app-card open">
                <div class="card-section open">
                    <div class="card-temperature open">${temperature}<span>º</span></div>
                    <div class="card-icon open">
                        <img src="${iconPath}" alt="" /></div>
                    </div>
                    <div class="card-section open">
                        <div class="card-week-day open">
                            <p>${currentDay} ${dayNumber}</p><span>th</span>
                        </div>
                        <div class="wind open">${windSpeed}mph <span>/</span> ${windAngle}º</div>
                    </div>
                </div>
                <div class="app-card closed">
                    <div class="card-week-day">${shortenWeekDay(currentDay)}</div>
                    <div class="card-icon-closed">
                        <img src="${iconPath}" alt="Sky covered with clouds">
                    </div>
                    <div class="card-temperature">${temperature}º</div>
                </div>
            </div>
        </div>
    `)
} 
$('#cityButton').click(async ()=>{
    CARDS = '';
    await getCurrTimeWithLocalization()
    await getWeather(coords.latitute, coords.longitude);
    $('#cityInput').prop('disabled', true)
    $('#cityButton').prop('disabled', true)
    toggleModalOpen();
})
const getWeather = async (lat,lon) => {
    let modifiedURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weather_API_key}`
    await fetch(modifiedURL)
        .then(response => {
            if (!response.ok) { throw new Error() }
            return response.json();
        })
        .then(weatherData => {
            forecastForTheWeek = weatherData.data
            for (let i = 1; i <= 7; i++) {
                const element = forecastForTheWeek[i];
                if (CARDS === '') {
                    CARDS += getWeatherCard(element, true)
                }else{
                    CARDS += getWeatherCard(element, false)
                }
            } 
            $('main').html(CARDS)
        })
        .catch(err => {
            console.log(err.message)
            toggleModalOpen()
        })
}

// $('#city-country').html()
// $('#city-hour').html()
// $('.app-content-container').css()