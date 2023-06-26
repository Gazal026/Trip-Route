let n = 1;
var clickedPlacesArray = [];
let markers = [];
let path = null;
let modeTravel = "car";

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
    // clickedPlacesArray.push(clickedPlace);
    // var marker = new google.maps.Marker({
    //   position: e.latLng,
    //   map: map,
    // });

    // Retrieve address and assign it to input field
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${clickedPlace.lat}&lon=${clickedPlace.lng}&format=json`;
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

  $(".vehicle").on("click", function () {
    $(".vehicle").css("color", "#67676c");
    modeTravel = $(this).attr("id");
    $("#" + modeTravel).css("color", "black");
  });

  $("#route").on("click", async function () {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    if (path) {
      path.setMap(null);
    }
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
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
          });
          markers.push(marker);
          coordinatesArray.push([latLng.lng, latLng.lat]);
          if (index === 0) {
            map.setCenter(latLng);
            map.setZoom(6);
          }
          processPlaceholderAddresses(index + 1, callback);
        });
      } else {
        callback();
      }
    }
    await processPlaceholderAddresses(0, async function () {
      //await processClickedPlaces(async function () {
      console.log(coordinatesArray);

      const requestBody = JSON.stringify({
        points: coordinatesArray,
        vehicle: modeTravel,
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
      function convertCoordinates(data) {
        var coordinates = data.map(function (coordinate) {
          return {
            lat: coordinate[1],
            lng: coordinate[0],
          };
        });

        return coordinates;
      }
      let pathcoordinateslatlng = [];
      const data = await resp.json();
      console.log(data);
      const distance = data.paths[0].distance;
      const time = data.paths[0].time;

      let days = Math.floor(time / (1000 * 60 * 60 * 24));
      let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((time % (1000 * 60)) / 1000);

      $("#Distance").text("Distance: " + distance / 1000 + " km");
      let estimatedTime = "Estimated Time: ";
      if (days > 0) {
        estimatedTime += days + " days ";
      }
      if (hours > 0) {
        estimatedTime += hours + " hours ";
      }
      if (minutes > 0) {
        estimatedTime += minutes + " minutes ";
      }
      if (seconds > 0) {
        estimatedTime += seconds + " seconds ";
      }
      $("#Estimated_time").text(estimatedTime.trim());

      let pathcoordinates = [];
      data.paths[0].points.coordinates.forEach((element) => {
        pathcoordinates.push(element);
      });
      // console.log(pathcoordinates);
      let i = 0;
      pathcoordinates.forEach((element) => {
        // console.log(element);
        // // console.log(element[0] + " " + element[1]);
        pathcoordinateslatlng.push({ lat: element[1], lng: element[0] });
        // i++;
      });
      // console.log(pathcoordinateslatlng);
      function drawPath(coordinates) {
        var pathCoordinates = coordinates.map(function (coordinate) {
          return new google.maps.LatLng(coordinate.lat, coordinate.lng);
        });
        path = new google.maps.Polyline({
          path: pathCoordinates,
          geodesic: true,
          strokeColor: "#0000FF",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        path.setMap(map);
      }
      drawPath(pathcoordinateslatlng);

      // Process the response data from GraphHopper API here
      //});
    });
  });
});
