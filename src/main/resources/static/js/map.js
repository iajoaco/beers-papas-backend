let map;
let markers = [];
let userMarker;
let userLocation = null;

function initMap() {
    // Inicializar el mapa centrado en Madrid
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.4168, lng: -3.7038 },
        zoom: 13,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Centrar el mapa en la ubicación del usuario
                map.setCenter(userLocation);

                // Crear marcador para la ubicación del usuario
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                    },
                    title: "Tu ubicación"
                });

                // Buscar productos cercanos automáticamente
                searchNearbyProducts();
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                alert("No se pudo obtener tu ubicación. Por favor, asegúrate de que la geolocalización está activada.");
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}

function searchNearbyProducts(searchTerm = '', radius = 1) {
    if (!userLocation) {
        alert("Esperando obtener tu ubicación...");
        return;
    }

    // Limpiar marcadores anteriores
    clearMarkers();

    // Realizar la búsqueda
    fetch('/api/products/nearby', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            searchTerm: searchTerm,
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            radiusInKm: parseFloat(radius)
        })
    })
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            const position = {
                lat: product.latitude,
                lng: product.longitude
            };

            const marker = new google.maps.Marker({
                position: position,
                map: map,
                title: product.name
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="info-window">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Precio: ${product.price}€</p>
                        <p>Lugar: ${product.placeName}</p>
                        <p>Dirección: ${product.placeAddress}</p>
                        <p>Distancia: ${product.distanceInKm.toFixed(2)} km</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            markers.push(marker);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al buscar productos cercanos');
    });
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

window.initMap = initMap; 