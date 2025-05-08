async function searchNearbyProducts() {
    const searchTerm = document.getElementById('searchTerm').value;
    const radius = document.getElementById('radius').value;
    const resultsDiv = document.getElementById('results');

    // Obtener la ubicación actual del usuario
    if (!userMarker) {
        alert('Esperando obtener tu ubicación...');
        return;
    }

    const position = userMarker.getPosition();
    const request = {
        searchTerm: searchTerm || null,
        latitude: position.lat(),
        longitude: position.lng(),
        radiusInKm: parseFloat(radius)
    };

    try {
        const response = await fetch('http://localhost:8080/api/products/nearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }

        const products = await response.json();
        
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
        console.error('Error:', error);
        resultsDiv.innerHTML = '<p>Error al buscar productos. Por favor, intenta de nuevo.</p>';
    }
} 