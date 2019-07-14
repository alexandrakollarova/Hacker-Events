"use strict"

var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 4000); 
}

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

const searchURLByNewInput = "https://www.eventbriteapi.com/v3/events/search/?q=hackathons";

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
        
        $("#js-search-results").append(
            `<section class="event-card">
                <a href="${responseJson.events[i].url}">
                    <div class="card">
                        <img src="${responseJson.events[i].logo.original.url}">
                        <div class="container">
                            <h2>${responseJson.events[i].name.text}</h2>                                                        
                            <h5>${responseJson.events[i].start.local}</h5>                            
                            <h5>${responseJson.events[i].end.local}</h5>
                        </div>
                    </div>
                </a>
            </section>`);
    }    
}

function getDefaultEvents() {

    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",             
        })
      };

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

function getEvents(query) {

    const options = {
        headers: new Headers({
            Authorization: "Bearer QOAVPXW65GZI6MSN4HL4",                         
        })
      };

    const params = {
        "location.address": query
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
    $("form").submit(e => {
        e.preventDefault();

        let searchInput = $("#js-search-input").val();

        if (!(searchInput)) {
            getDefaultEvents();
        } else {
            getEvents(searchInput);
        }

    })
}

$(watchForm);




// SLIDER STUFF

// const rangeSliderController = (function(){
// 	const slider = document.getElementById("slider-js");
// 	const sliderHandle = document.getElementById("slider-handle");
// 	const sliderCounter = document.getElementById("slider-counter");
// 	const sliderValue = 7; // give any slider value, result will be n+1
// 	let sliderOffset = slider.offsetLeft;
// 	let sliderWidth = slider.offsetWidth;
// 	let isMoving = false;
// 	let handlePosition = null;
// 	let valueStops = (function(){
// 	  let array = [];
// 	  let fraction = sliderWidth / sliderValue;
// 	  for (let i = 0; i <= sliderValue; i++) {
// 			array.push(fraction * i);
// 		  };
// 		return(array)
// 	  }());
// 	let skipPoint = valueStops[1]/2;

// 	window.addEventListener("resize", function() {
// 		isMoving = false;
// 		handlePosition = null;
// 		valueStops = (function(){
// 			let array = [];
// 			let fraction = sliderWidth / sliderValue;
// 			for (let i = 0; i <= sliderValue; i++) {
// 				array.push(fraction * i)
// 			};
// 			return(array);
// 		}());
// 		skipPoint = valueStops[1]/2;
// 		sliderOffset = slider.offsetLeft;
// 		sliderWidth = slider.offsetWidth;
// 	});

// 	slider.addEventListener("mousedown", function(event){
// 		event.preventDefault();
// 		isMoving = true;
// 		handlePosition = event.pageX - sliderOffset;
// 		valueStops.forEach(function(stop, i){
// 			if ( handlePosition >= (stop - skipPoint ) ) {
// 				sliderHandle.style.left = stop + "px";
// 				sliderCounter.style.left = stop + "px";
// 				sliderCounter.innerHTML = i + 1;
// 			}
// 		})

// 	});

// 	window.addEventListener("mousemove", function(event){
// 		if (isMoving) {
// 			handlePosition = event.pageX - sliderOffset;
// 			handlePosition = Math.min(Math.max(parseInt(handlePosition), 0), sliderWidth);
// 			valueStops.forEach(function(stop, i){
// 				if ( handlePosition >= (stop - skipPoint ) ) {
// 					sliderHandle.style.left = stop + "px";
// 					sliderCounter.style.left = stop + "px";
// 					sliderCounter.innerHTML = i + 1;
// 				}
// 			})
// 		}
// 	})

// 	window.addEventListener("mouseup", function(event){
// 		isMoving = false;
// 	})
// })()
