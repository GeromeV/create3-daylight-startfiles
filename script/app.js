// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updatesun =(sun,left,bottom,today)=>{
	sun.style.setProperty('--local-sun-position-left',`${left}%`)
	sun.style.setProperty('--local-sun-position-bottom',`${bottom}%`)

	sun.setAttribute('data-time',`${today.getHours()}:${today.getMinutes()}`)
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sun = document.querySelector('.js-sun'),
	minutesleft = document.querySelector('.js-time-left');

	let today = new Date();
	const sunriseDate = new Date(sunrise *1000);

	// Bepaal het aantal minuten dat de zon al op is.

	const minutsup =today.getHours() *60 + today.getMinutes() - (sunriseDate.getHours() *60 +sunriseDate.getMinutes());
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	minutesleft.innerText = totalMinutes - minutsup;
	console.log(minutsup)
	const percentage = (100/totalMinutes)*minutsup,
	sunLeft=percentage,
	sunbottom = percentage <50? percentage*2 : (100 - percentage)*2;

	updatesun(sun,sunLeft,sunbottom,today);

	document.querySelector('body').classList.add('is-loaded');

	const t = setInterval(()=>{
		today = new Date();

		if(minutsup <0 || minutsup > totalMinutes){
			clearInterval(t);
		}
	}
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	const sunrise = document.querySelector('.js-sunrise'),
	sunset= document.querySelector('.js-sunset'),
	location = document.querySelector('.js-location');

	sunrise.innerHTML= _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	sunset.innerHTML=_parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
	location.innerHTML = `${queryResponse.city.name},${queryResponse.city.country}`;

	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	const timediff = new Date(queryResponse.city.sunset *1000 - queryResponse.city.sunrise *1000);
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	placeSunAndStartMoving(timediff.getHours()*60 + timediff.getMinutes(), queryResponse.city.sunrise);
};
const get = (url) => fetch(url).then((r) => r.json());
// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
	const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=7c7a2a51bcda513cc8bcbeb34ae53b64&units=metric&lang=nl&cnt=1`
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	const wheatherresponse = await get(endpoint);
	// Als dat gelukt is, gaan we naar onze showResult functie.
	showResult(wheatherresponse)
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
