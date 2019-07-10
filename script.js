"use strict"


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(usePosition);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function usePosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
}

$(getLocation);


const searchURL = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&location.latitude= + latitude + &location.longitude= + longitude + &categories=102";

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => 
        `${encodeURIComponent(key)} = ${encodeURIComponent(params[key])}
        `)
        return queryItems.join("&");
}

function displayResults(responseJson) {
    console.log(responseJson);
}

function getEvents(query) {

    Access-Control-Allow-Headers: Bearer;

    const options = {
        headers: new Headers({
          "Bearer": "QOAVPXW65GZI6MSN4HL4"
        })
      };

    const params = {
        location: location
    }

    const queryString = formatQueryParams(params);
    const url = searchURL + "?" + queryString;    

    fetch(url, options)
        .then(response => {
            
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => console.log(JSON.stringify(responseJson)))
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $("form").submit(e => {
        e.preventDefault();

        const searchInput = $("js-search-input").val();
        getEvents(searchInput);
    })
}

$(watchForm);