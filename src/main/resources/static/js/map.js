let map;
let userMarker;
let productMarkers = [];

function initMap() {
    console.log('Inicializando mapa...');
    // Inicializar el mapa centrado en Madrid
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.4168, lng: -3.7038 },
        zoom: 13
    });
    console.log('Mapa inicializado');

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        console.log('Solicitando ubicación del usuario...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Ubicación obtenida:', position.coords);
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Centrar el mapa en la ubicación del usuario
                map.setCenter(userLocation);
                console.log('Mapa centrado en la ubicación del usuario');

                // Crear marcador para la ubicación del usuario
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Tu ubicación',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });
                console.log('Marcador de usuario creado');
            },
            (error) => {
                console.error('Error al obtener la ubicación:', error);
                alert('No se pudo obtener tu ubicación. Por favor, asegúrate de que la geolocalización está activada.');
            }
        );
    } else {
        console.error('Geolocalización no soportada');
        alert('Tu navegador no soporta geolocalización.');
    }
}

function addProductMarker(product) {
    console.log('Añadiendo marcador para producto:', product);
    const marker = new google.maps.Marker({
        position: { lat: product.latitude, lng: product.longitude },
        map: map,
        title: product.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#FF5252',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });

    // Crear ventana de información
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div>
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <p>Precio: ${product.price}€</p>
                <p>Lugar: ${product.placeName}</p>
                <p>Distancia: ${product.distanceInKm.toFixed(2)} km</p>
            </div>
        `
    });

    // Mostrar ventana de información al hacer clic en el marcador
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    productMarkers.push(marker);
    console.log('Marcador añadido correctamente');
    return marker;
}

function clearProductMarkers() {
    console.log('Limpiando marcadores de productos');
    productMarkers.forEach(marker => marker.setMap(null));
    productMarkers = [];
} 