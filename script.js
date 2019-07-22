"use strict"

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scroll-to-top").style.display = "block";
  } else {
    document.getElementById("scroll-to-top").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

$("#coffee-menu").on("click", e => {
    $("#coffee-menu").hide();
    $("#nav").show();
})

$("#arrow-close").on("click", e => {
    $("#nav").hide();
    $("#coffee-menu").show();
})

function whatsHackathonFunction() {
    var elmnt = document.getElementById("whats-hackathon");
    elmnt.scrollIntoView();
}

function getInspired() {
    var elmnt = document.getElementById("youtube-results");
    elmnt.scrollIntoView();
}

let latitude;
let longitude;
let searchDefaultURLFromEventBrite;

function geoFindMe() {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000
    };

    function success(position) {
        latitude  = position.coords.latitude.toFixed(6).toString();
        longitude = position.coords.longitude.toFixed(6).toString(); 
       
        searchDefaultURLFromEventBrite = "https://cors-anywhere.herokuapp.com/https://www.eventbriteapi.com/v3/events/search/?q=hackathons&sort_by=date&expand=venue,organizer&location.latitude=" + latitude + "&location.longitude=" + longitude;
    }

    function error() {
        console.log('Unable to retrieve your location');

        $("#js-unabled-location").append(
            `<div>
            <i style='font-size:24px' class='far'>&#xf119;</i>
            <h5>Sorry! We're unable to retrieve your location. Please, type in your location above and hit search.</h5>
            </div>`
        );
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
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}
        `)
        return queryItems.join("&");
}

function displayResultsFromEventBrite(responseJson) {
    console.log(responseJson);

    $("#js-event-results").empty();

    for (let i = 0; i <= responseJson.events.length; i++) {
        
        if (responseJson.events.length === 0) {
            $("#js-event-results").append(
                `<div style="color: white">
                    <i style='font-size:24px' class='far'>&#xf119;</i>
                    <h2>No hackathons found in this search.</h2>
                </div>`
            );
            $("#js-event-results").css("padding", "20px");
        } else {
            let numChars = responseJson.events[i].name.text.length; 
            let title = `<h2>${responseJson.events[i].name.text}</h2>`;
            if (numChars <= 60) {
                title = `<h2 style="font-size: 1.2em">${responseJson.events[i].name.text}</h2>`
            }       
            else if (numChars >= 61) {
                title = `<h2 style="font-size: 0.9em">${responseJson.events[i].name.text}</h2>`
            }
            
            const startDateFromAPI = responseJson.events[i].start.local;       
            const startDate = new Date(startDateFromAPI); 
            const dateAsNiceString = startDate.toLocaleString([], {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'});

            let isFree;
            if (responseJson.events[i].is_free) {
                isFree = "Free";
            }  else {
                isFree = `<i class="material-icons" style="color: #EC4D3C; margin-top: -10px">&#xe227;</i>`;
            }

            let venueName = "TBA"
            let venueAddressCity = ""
            let venueAddressRegion = ""
            if (responseJson.events[i].venue !== null) {      

                if (responseJson.events[i].venue.name) {
                    venueName = responseJson.events[i].venue.name;
                } else {
                    venueName = "TBA"
                }

                if (responseJson.events[i].venue.address.city) {
                    venueAddressCity = ", " + responseJson.events[i].venue.address.city;
                } else {
                    venueAddressCity = ""
                }

                if (responseJson.events[i].venue.address.region) {
                    venueAddressRegion =  ", " + responseJson.events[i].venue.address.region;
                } else {            
                    venueAddressRegion = ""
                }
            }
            
            let logo;
            if (responseJson.events[i].logo && responseJson.events[i].logo.original && responseJson.events[i].logo.original.url) {            
                logo = responseJson.events[i].logo.original.url;                   
            } else {
                logo = "images/question-mark.png";
            }

                        
            $("#js-event-results").append(
                `<section class="event-card">
                    <a href="${responseJson.events[i].url}" target="_blank">
                        <div class="card">
                            <img src="${logo}" id="js-logo-url">
                            <div class="container">
                                ${title}
                                <div class="inner-container">
                                    <i class="material-icons" style="font-size: 28px">&#xe7f1;</i> 
                                    <h5>${venueName}${venueAddressCity}${venueAddressRegion}</h5>
                                    <i class='fa' style="padding-left: 3px">&#xf073;</i>                                                       
                                    <h5 style="padding-left: 38px">${dateAsNiceString}</h5>                            
                                    <h5 style="color: #EC4D3C">${isFree}</h5>
                                </div>
                            </div>
                        </div>
                    </a>
                </section>`);
        }
    }        
}



function displayResultsFromYoutube(responseJson) {

    let tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
    
        console.log(responseJson);

        for (let i = 0; i < responseJson.items.length; i++) {
            
            new YT.Player(`player${i}`, {
                height: '210',
                width: '375',
                enablejsapi: 1,
                videoId: responseJson.items[i].id.videoId,  
                host: "https://www.youtube.com",       
                playerVars: {
                    origin: "https://alexandrakollarova.github.io"
                },
                events: {
                    // 'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
           
        }
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
    }

    function stopVideo() {
        player.stopVideo();
    }
}

function getDefaultEventsFromEventBrite(miles) {
    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",             
        })
      };

      const params = {
        "location.within": miles
    }

    const queryString = formatQueryParams(params);
    const url = searchDefaultURLFromEventBrite + "&" + queryString;   

    fetch(url, options)    
        .then(response => {  
            if (response.ok) {                
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsFromEventBrite(responseJson))
        .catch(err => {
            console.log(err.message);
        });
}

const searchNewInputURLFromEventBrite = "https://cors-anywhere.herokuapp.com/https://www.eventbriteapi.com/v3/events/search/?q=hackathons&sort_by=date&expand=venue,organizer";

function getEventsFromEventBrite(query, miles) {
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
    const url = searchNewInputURLFromEventBrite + "&" + queryString;    

    fetch(url, options)    
        .then(response => {         
            if (response.ok) {                
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsFromEventBrite(responseJson))
        .catch(err => {
            console.log(err.message);
        });
}

const getBestHackathonsURL = "https://cors-anywhere.herokuapp.com/https://www.eventbriteapi.com/v3/events/search/?q=hackathons&sort_by=best&expand=venue,organizer";

function getBestHackathons() { 

    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",                      
        })
    };

    fetch(getBestHackathonsURL, options)    
        .then(response => {         
            if (response.ok) {                
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsFromEventBrite(responseJson))
        .catch(err => {
            console.log(err.message);
        });
}

getBestHackathons();

const searchHackathonVideos = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&order=relevance&q=hackathon&type=video&videoDefinition=high&videoEmbeddable=true&key=AIzaSyD8npOvMraf7uV-1NEeGJMhs6ihtPL6_-0";

function getVideosFromYoutube() {
    
    fetch(searchHackathonVideos)    
        .then(response => {         
            if (response.ok) {                
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsFromYoutube(responseJson))
        .catch(err => {
            console.log(err.message);
        });
}

getVideosFromYoutube();

function watchForm() {
    var slider = document.getElementById("js-slider");
    var output = document.getElementById("js-within-value");
    output.innerHTML = slider.value; // Display the default slider value

    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    function scrollDownToResults() {
        var elmnt = document.getElementById("js-scroll-results");
        elmnt.scrollIntoView({behavior: "smooth"});
    }

    $("form").submit(e => {
        e.preventDefault(); 
        let searchInput = $("#js-search-input").val();        
        let sliderValue = slider.value+"mi";   
              
        if (!(searchInput)) {
            getDefaultEventsFromEventBrite(sliderValue);
        } else {
            getEventsFromEventBrite(searchInput, sliderValue);
        }
        scrollDownToResults();
    })
}

$(watchForm);

  