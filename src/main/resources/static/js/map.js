let map;
let markers = [];
let userMarker;
window.userLocation = null;

// Evento personalizado para notificar cuando la ubicación esté disponible
const locationReadyEvent = new CustomEvent('locationReady');

// Asegurarnos de que initMap esté disponible globalmente
window.initMap = function() {
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
                window.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Centrar el mapa en la ubicación del usuario
                map.setCenter(window.userLocation);

                // Crear marcador para la ubicación del usuario
                userMarker = new google.maps.Marker({
                    position: window.userLocation,
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

                // Disparar evento cuando la ubicación esté lista
                document.dispatchEvent(locationReadyEvent);

                // Buscar productos cercanos automáticamente
                performSearch();
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                alert("No se pudo obtener tu ubicación. Por favor, asegúrate de que la geolocalización está activada.");
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
};

function performSearch() {
    if (!window.userLocation) {
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

function addProductMarker(product) {
    const position = {
        lat: product.latitude,
        lng: product.longitude
    };

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: product.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
        }
    });

    // Crear el contenido del InfoWindow
    const contentString = `
        <div class="info-window">
            <h3>${product.name}</h3>
            <p>${product.description || ''}</p>
            <p class="price">${product.price}€</p>
            <p class="category">${product.categoryName}</p>
            <p>${product.placeName}</p>
            <p>${product.placeAddress}</p>
            <p class="distance">A ${product.distanceInKm.toFixed(2)} km</p>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    // Añadir evento de clic al marcador
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
} 