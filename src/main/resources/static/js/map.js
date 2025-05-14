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

    // Usar la función de api.js para la búsqueda
    window.searchNearbyProducts();
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

window.initMap = initMap; 