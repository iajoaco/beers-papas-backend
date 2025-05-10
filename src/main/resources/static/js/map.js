let map;
let userMarker;
let productMarkers = [];

async function initMap() {
    console.log('Inicializando mapa...');
    
    // Asegurarse de que el elemento del mapa existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('No se encontró el elemento del mapa');
        return;
    }

    // Inicializar el mapa centrado en Madrid
    map = new google.maps.Map(mapElement, {
        center: { lat: 40.4168, lng: -3.7038 },
        zoom: 13,
        mapId: 'beers_papas_map' // Añadir un ID único para el mapa
    });
    console.log('Mapa inicializado');

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        console.log('Solicitando ubicación del usuario...');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log('Ubicación obtenida:', position.coords);
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Centrar el mapa en la ubicación del usuario
                map.setCenter(userLocation);
                console.log('Mapa centrado en la ubicación del usuario');

                try {
                    // Crear marcador para la ubicación del usuario usando AdvancedMarkerElement
                    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
                    userMarker = new AdvancedMarkerElement({
                        map,
                    position: userLocation,
                    title: 'Tu ubicación',
                        content: createMarkerContent('#4285F4')
                });
                console.log('Marcador de usuario creado');
                } catch (error) {
                    console.error('Error al crear el marcador:', error);
                }
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

function createMarkerContent(color) {
    const div = document.createElement('div');
    div.style.width = '20px';
    div.style.height = '20px';
    div.style.backgroundColor = color;
    div.style.borderRadius = '50%';
    div.style.border = '2px solid white';
    return div;
}

async function addProductMarker(product) {
    console.log('Añadiendo marcador para producto:', product);
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    
    const marker = new AdvancedMarkerElement({
        map,
        position: { lat: product.latitude, lng: product.longitude },
        title: product.name,
        content: createMarkerContent('#FF5252')
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
    productMarkers.forEach(marker => marker.map = null);
    productMarkers = [];
} 