function showGoogleMap(map,latInput,lngInput){
    
    if(!map) return;
    map.style.width="840px";
    map.style.height="300px";
    map.style.margin="0 auto";
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var latitude=latInput.value;
    var longitude=lngInput.value;
    var chicago = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
    var mapOptions = {
        zoom: 16,
        center: chicago
    }
    var gmap = new google.maps.Map(map, mapOptions);
    var marker = new google.maps.Marker({position: chicago, map: gmap});
    directionsDisplay.setMap(gmap);
}
export default showGoogleMap