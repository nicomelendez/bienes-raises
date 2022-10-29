(function() {

    const lat = document.querySelector('#lat').value || -34.37589;
    const lng = document.querySelector('#lng').value || -55.23771;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    
    //Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin
    marker = new L.marker([lat, lng],{
        draggable:true,
        autoPan:true
    })
    .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target

        console.log(marker)

        const posicion = marker.getLatLng();

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        // Obtener la información de las calles del pin
        geocodeService.reverse().latlng(posicion,16).run(function(error,resultado){

            marker.bindPopup(resultado.address.LongLabel)
            console.log("🚀 ~ file: mapa.js ~ line 36 ~ geocodeService.reverse ~ resultado", resultado)
            
            document.querySelector('.calle').textContent = `Calle: ${resultado?.address?.Address ?? ''}`;
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })

    })

})()