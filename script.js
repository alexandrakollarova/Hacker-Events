"use strict"

let latitude;
let longitude;
let searchURL;

function geoFindMe() {

    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000
    };

    function success(position) {
        latitude  = position.coords.latitude.toFixed(6).toString();
        longitude = position.coords.longitude.toFixed(6).toString(); 
       
        searchURL = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&location.latitude=" + latitude + "&location.longitude=" + longitude;
    }

    function error() {
        console.log('Unable to retrieve your location')
    }

    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
    } else {
        navigator.geolocation.getCurrentPosition(success, error, options); 
  
    }
}

$(geoFindMe);


function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => 
        `${encodeURIComponent(key)} = ${encodeURIComponent(params[key])}
        `)
        return queryItems.join("&");
}

function displayResults(responseJson) {
    console.log(responseJson);

    for (let i = 0; i < responseJson.events.length; i++) {
        $("#js-search-results").append(
            `<section class="event-card">
                <a href="${responseJson.events[i].url}">
                    <div class="card">
                        <img src="${responseJson.events[i].logo.original.url}">

                        <div class="container">
                            <h2>${responseJson.events[i].name.text}</h2> 
                            <h5>${responseJson.location.augmented_location.city}</h5>                            
                            <h5>${responseJson.events[i].start.local}</h5>                            
                            <h5>${responseJson.events[i].end.local}</h5>
                        </div>
                    </div>
                </a>
            </section>`
        )
    }    
}

function getEvents(query) {

    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",
            // 'Access-Control-Allow-Credentials' : true,
            // 'Access-Control-Allow-Origin':'*',
            // 'Access-Control-Allow-Methods':'GET',
            // 'Access-Control-Allow-Headers':'application/json',              
        })
      };

    const params = {
        "location.address": location
    }

    // const queryString = formatQueryParams(params);
    // const url = searchURL + "?" + queryString;
    

    fetch(searchURL, options)
    
        .then(response => {            
            
            if (response.ok) {                
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
            
            

            // const searchInput = $("js-search-input").val();

        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}


function watchForm() {
    $("form").submit( e => {
        e.preventDefault();

        // const searchInput = $("js-search-input").val();
        getEvents();
    })
}

$(watchForm);