// Función para obtener el token JWT del localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Función para hacer peticiones autenticadas
async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return fetch(url, options);
}

async function searchNearbyProducts() {
    console.log('Iniciando búsqueda de productos...');
    const searchTerm = document.getElementById('searchTerm').value;
    const radius = document.getElementById('radius').value;
    const resultsDiv = document.getElementById('results');

    console.log('Término de búsqueda:', searchTerm);
    console.log('Radio:', radius);

    // Obtener la ubicación actual del usuario
    if (!userMarker) {
        console.log('No se ha obtenido la ubicación del usuario');
        alert('Esperando obtener tu ubicación...');
        return;
    }

    const position = userMarker.getPosition();
    console.log('Posición actual:', position.lat(), position.lng());

    const request = {
        searchTerm: searchTerm || null,
        latitude: position.lat(),
        longitude: position.lng(),
        radiusInKm: parseFloat(radius)
    };

    console.log('Enviando petición:', request);

    try {
        const response = await fetch('/api/products/nearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        console.log('Respuesta recibida:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en la búsqueda: ${response.status}`);
        }

        const products = await response.json();
        console.log('Productos encontrados:', products);
        
        // Limpiar marcadores anteriores
        clearProductMarkers();
        
        // Limpiar resultados anteriores
        resultsDiv.innerHTML = '';

        if (products.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron productos cercanos.</p>';
            return;
        }

        // Mostrar resultados
        products.forEach(product => {
            console.log('Procesando producto:', product);
            // Añadir marcador al mapa
            addProductMarker(product);

            // Crear tarjeta de producto
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <p class="price">${product.price}€</p>
                <p>${product.placeName}</p>
                <p>${product.placeAddress}</p>
                <p class="distance">A ${product.distanceInKm.toFixed(2)} km</p>
            `;
            resultsDiv.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        resultsDiv.innerHTML = `<p>Error al buscar productos: ${error.message}</p>`;
    }
} 