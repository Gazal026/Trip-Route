let n = 1;
var clickedPlacesArray = [];
function initMap() {
  let location = { lat: 26.924150519735488, lng: 80.95402479171754 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });

  map.addListener("click", function (e) {
    var clickedPlace = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    clickedPlacesArray.push(clickedPlace);
    var marker = new google.maps.Marker({
      position: e.latLng,
      map: map,
    });

    // Retrieve address and assign it to input field
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${marker
      .getPosition()
      .lat()}&lon=${marker.getPosition().lng()}&format=json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const address = data.display_name;
        assignAddress(address);
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

window.initMap = initMap;

// initMap();

// Function to assign address to input field
function assignAddress(address) {
  var inputId = "inputdiv_" + n;
  var input = $(
    '<div class="inputTag" id="' +
      inputId +
      '"><input type="text" placeholder="In Between" value="' +
      address +
      '"><span class="material-icons remove-icon">-</span></div>'
  );
  $("#innerContainer").append(input);
  n++;
}

$(function () {
  let textArray = []; // Array to store the text values

  $("#stops").on("click", function () {
    var inputId = "inputdiv_" + n;
    var input = $(
      '<div class="inputTag" id="' +
        inputId +
        '"><input type="text" placeholder="In Between"><span class="remove-icon">-</span></div>'
    );
    $("#innerContainer").append(input);
    n++;
  });

  $("#innerContainer").on("click", ".remove-icon", function () {
    var inputTagId = $(this).parent(".inputTag").attr("id");
    $("#" + inputTagId).remove();
  });

  $("#route").on("click", async function () {
    textArray = []; // Clear the array before populating it again
    $("#textbox input").each(function () {
      textArray.push($(this).val()); // Add the text value to the array
    });

    console.log(textArray); // Display the array in the browser console

    // Find latitudes and longitudes using Leaflet and OpenStreetMap API
    var coordinatesArray = [];
    var geocoder = L.Control.Geocoder.nominatim();

    function geocodeAddress(address, callback) {
      geocoder.geocode(address, function (results) {
        var latLng = results[0].center;
        callback(latLng);
      });
    }

    // Function to process placeholder addresses
    function processPlaceholderAddresses(index, callback) {
      if (index < textArray.length) {
        var address = textArray[index];
        geocodeAddress(address, function (latLng) {
          coordinatesArray.push([latLng.lng, latLng.lat]);
          processPlaceholderAddresses(index + 1, callback);
        });
      } else {
        callback();
      }
    }

    // // Function to process clicked places
    // function processClickedPlaces(callback) {
    //   clickedPlacesArray.forEach(function (clickedPlace) {
    //     coordinatesArray.push([clickedPlace.lng, clickedPlace.lat]);
    //   });
    //   callback();
    // }

    await processPlaceholderAddresses(0, async function () {
      //await processClickedPlaces(async function () {
      console.log(coordinatesArray);

      const requestBody = JSON.stringify({
        points: coordinatesArray,
        vehicle: "car",
        locale: "en",
        instructions: true,
        calc_points: true,
        points_encoded: false,
      });

      const query = new URLSearchParams({
        key: "dffb203e-899b-4120-ac06-611b61e580f0",
      }).toString();

      const resp = await fetch(`https://graphhopper.com/api/1/route?${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const data = await resp.json();
      console.log(data);

      // Process the response data from GraphHopper API here
      //});
    });
  });
});
