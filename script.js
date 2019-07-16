"use strict"

let latitude;
let longitude;
let searchDefaultURL;

function geoFindMe() {

    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000
    };

    function success(position) {
        latitude  = position.coords.latitude.toFixed(6).toString();
        longitude = position.coords.longitude.toFixed(6).toString(); 
       
        searchDefaultURL = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&expand=venue,organizer&location.latitude=" + latitude + "&location.longitude=" + longitude;
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


const searchNewInputURL = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&expand=venue,organizer";

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => 
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}
        `)
        return queryItems.join("&");
}

function displayResults(responseJson) {
    console.log(responseJson);

    $("#js-search-results").empty();

    for (let i = 0; i < responseJson.events.length; i++) {
        
        if (responseJson.events.length === 0) {
            console.log("here")
            $("#js-search-results").append(
                `<h2>No events found</h2>`
            );
        } else {

            const startDateFromAPI = responseJson.events[i].start.local;       
            const startDate = new Date(startDateFromAPI); 
            const dateAsNiceString1 = startDate.toLocaleString([], {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'});

            let isFree;
            if (responseJson.events[i].is_free) {
                isFree = "Free";
            }  else {
                isFree = `<i class="material-icons" style="color: #EC4D3C; padding-left: 3px">&#xe227;</i>`;
            }

            let venueName;        
            if (responseJson.events[i].venue.name) {
                venueName = responseJson.events[i].venue.name +",";
            } else {
                venueName = ""
            }

            let venueAddressCity;
            if (responseJson.events[i].venue.address.city) {
                venueAddressCity = responseJson.events[i].venue.address.city +",";
            } else {
                venueAddressCity = ""
            }

            let venueAddressRegion;
            if (responseJson.events[i].venue.address.region) {
                venueAddressRegion = responseJson.events[i].venue.address.region;
            } else {            
                venueAddressRegion = ""
            }
            
            let logo;
            if (responseJson.events[i].logo.original.url) {            
                logo = responseJson.events[i].logo.original.url;
            } else {
                logo = `<img src="images/question-mark.png">`                    
            }

                        
            $("#js-search-results").append(
                `<section class="event-card">
                    <a href="${responseJson.events[i].url}">
                        <div class="card">
                            <img src="${logo}" id="js-logo-url">
                            <div class="container">
                                <h2>${responseJson.events[i].name.text}</h2>
                                <div class="inner-container">
                                    <i class="material-icons" style="font-size: 26px">&#xe7f1;</i> 
                                    <h5>${venueName} ${venueAddressCity} ${venueAddressRegion}</h5>
                                    <i class='fa' style="padding-left: 3px">&#xf073;</i>                                                       
                                    <h5>${dateAsNiceString1}</h5>                            
                                    <h5 style="color: #EC4D3C">${isFree}</h5>
                                </div>
                            </div>
                        </div>
                    </a>
                </section>`);
        }
    }        
}

function getDefaultEvents(miles) {

    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",             
        })
      };

      const params = {
        "location.within": miles
    }

    const queryString = formatQueryParams(params);
    const url = searchDefaultURL + "&" + queryString;   

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

function getEvents(query, miles) {

    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",                      
        })
      };

    const params = {
        "location.address": query,
        "location.within": miles
    }

    const queryString = formatQueryParams(params);
    const url = searchNewInputURL + "&" + queryString;    

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

    var slider = document.getElementById("js-slider");
    var output = document.getElementById("js-within-value");
    output.innerHTML = slider.value; // Display the default slider value

    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    $("form").submit(e => {
        e.preventDefault(); 

        let searchInput = $("#js-search-input").val();
        
        let sliderValue = slider.value+"mi";      

        if (!(searchInput)) {
            getDefaultEvents(sliderValue);
        } else {
            getEvents(searchInput, sliderValue);
        }

    })
}

$(watchForm);




