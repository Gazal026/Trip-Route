// var clickedPlacesArray = [];
// function initMap() {
//   let location = { lat: 26.924150519735488, lng: 80.95402479171754 };
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: location,
//   });

//   map.addListener("click", function (e) {
//     var clickedPlace = {
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng(),
//     };
//     clickedPlacesArray.push(clickedPlace);
//     var marker = new google.maps.Marker({
//       position: e.latLng,
//       map: map,
//     });
//   });
// }
// var clickedPlacesArray = [];

// function initMap() {
//   let location = { lat: 26.924150519735488, lng: 80.95402479171754 };
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: location,
//   });

//   map.addListener("click", function (e) {
//     var clickedPlace = {
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng(),
//     };
//     clickedPlacesArray.push(clickedPlace);
//     var marker = new google.maps.Marker({
//       position: e.latLng,
//       map: map,
//     });

//     // Retrieve address and assign it to input field
//     const url = `https://nominatim.openstreetmap.org/reverse?lat=${marker
//       .getPosition()
//       .lat()}&lon=${marker.getPosition().lng()}&format=json`;
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         const address = data.display_name;
//         assignAddress(address);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   });
// }

// window.initMap = initMap;

// initMap();
