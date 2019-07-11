"use strict"

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

$(getLocation);

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
}

const searchURL = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&location.latitude=" + latitude + "&location.longitude=" + longitude;

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
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4"
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
        .then(responseJson => displayResults(responseJson))
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