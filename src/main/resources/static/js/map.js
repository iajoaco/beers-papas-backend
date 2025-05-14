let map;
let markers = [];
let userMarker;
window.userLocation = null;

// Evento personalizado para notificar cuando la ubicación esté disponible
const locationReadyEvent = new CustomEvent('locationReady');

// Asegurarnos de que initMap esté disponible globalmente
window.initMap = function() {
    console.log('Inicializando mapa...');
    
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
        console.log('Solicitando ubicación del usuario...');
        
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Ubicación obtenida:', position);
                
                window.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log('Ubicación del usuario establecida:', window.userLocation);

                // Centrar el mapa en la ubicación del usuario
                map.setCenter(window.userLocation);
                console.log('Mapa centrado en:', map.getCenter().toJSON());

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
                console.log('Evento locationReady disparado');

                // Buscar productos cercanos automáticamente
                performSearch();
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Se ha denegado el permiso para obtener tu ubicación. Por favor, permite el acceso a la ubicación en tu navegador.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("La información de ubicación no está disponible. Por favor, verifica tu conexión a internet.");
                        break;
                    case error.TIMEOUT:
                        alert("La solicitud para obtener tu ubicación ha expirado. Por favor, intenta de nuevo.");
                        break;
                    default:
                        alert("Ha ocurrido un error al obtener tu ubicación. Por favor, intenta de nuevo.");
                        break;
                }
            },
            options
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
};

function performSearch() {
    if (!window.userLocation) {
        console.log('No hay ubicación del usuario disponible para la búsqueda');
        alert("Esperando obtener tu ubicación...");
        return;
    }

    console.log('Realizando búsqueda desde:', window.userLocation);

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

    console.log('Añadiendo marcador para producto:', product.name, 'en posición:', position);

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
            <p class="place-name">${product.placeName}</p>
            <p>${product.description || ''}</p>
            <p class="price">${product.price}€</p>
            <p class="rating">⭐ ${product.averageRating ? product.averageRating.toFixed(1) : '0.0'} (${product.ratingCount || 0} valoraciones)</p>
            ${product.website ? `<p class="website"><a href="${product.website}" target="_blank">Visitar web</a></p>` : ''}
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