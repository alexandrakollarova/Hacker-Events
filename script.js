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
       
        searchURL = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&expand=venue,organizer&location.latitude=" + latitude + "&location.longitude=" + longitude;
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


const searchURLByNewInput = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons&expand=venue,organizer";

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

        const startDateFromAPI = responseJson.events[i].start.local;       
        const startDate = new Date(startDateFromAPI); 
        const dateAsNiceString1 = startDate.toLocaleString([], {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});

        let isFreeString;
        if (responseJson.events[i].is_free) {
            isFreeString = "Free";
        }  else {
            isFreeString = "";
        }

        if (responseJson.events[i].logo === null) {            
            $("#js-logo-url").hide();
            $("#s-backup-img").append(
                `<img src="images/question-mark.png">`
            )         
        }

                      
        $("#js-search-results").append(
            `<section class="event-card">
                <a href="${responseJson.events[i].url}">
                    <div class="card">
                        <img src="${responseJson.events[i].logo.original.url}" id="js-logo-url">
                        <div class="container">
                            <h2>${responseJson.events[i].name.text}</h2>
                            <div class="inner-container">
                                <i class="material-icons" style="font-size: 26px">&#xe7f1;</i> 
                                <h5>${responseJson.events[i].venue.name}, ${responseJson.events[i].venue.address.city}, ${responseJson.events[i].venue.address.region} </h5>
                                <i class='fa' style="padding-left: 3px">&#xf073;</i>                                                       
                                <h5>${dateAsNiceString1}</h5>                            
                                <h5 style="color: #EC4D3C">${isFreeString}</h5>
                            </div>
                        </div>
                    </div>
                </a>
            </section>`);
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
    const url = searchURLByNewInput + "&" + queryString;   

    fetch(searchURL, options)    
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
    const url = searchURLByNewInput + "&" + queryString;    

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

    $('#js-slider').on('change', (event) => {
        let sliderValue  = event.currentTarget.value 
        $('#js-within-value')[0].innerHTML = 0;
        })

    $("form").submit(e => {
        e.preventDefault(); 

        let searchInput = $("#js-search-input").val();
        
        let slider = document.getElementById("js-slider"); 
        let sliderValue = slider.value;
        $('#js-within-value')[0].innerHTML = 0;

        if (!(searchInput)) {
            console.log(sliderValue)
            getDefaultEvents(sliderValue);
        } else {
            console.log(sliderValue)
            getEvents(searchInput, sliderValue);
        }

    })
}

$(watchForm);




