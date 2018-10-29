function autocomplete(input,latInput,lngInput){
    if(!input) return;//skip this fn from running
    const dropdown=new google.maps.places.Autocomplete(input);
    // 选择一个地点之后，自动填充经纬度值
    dropdown.addListener("place_changed",()=>{
        const place=dropdown.getPlace();
        latInput.value=place.geometry.location.lat();
        lngInput.value=place.geometry.location.lng();
    });
    //if someone hits enter on the address field, dont submit the form
    input.on("keydown",(e)=>{
        if(e.keyCode===13){
            e.preventDefault();
        }
    })
}
export default autocomplete;