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

async function loadCategories() {
    try {
        console.log('Cargando categorías...');
        const response = await fetch('/api/products/categories');
        console.log('Respuesta de categorías:', response.status);
        
        if (!response.ok) {
            throw new Error(`Error al cargar categorías: ${response.status}`);
        }
        
        const categories = await response.json();
        console.log('Categorías recibidas:', categories);
        
        const categorySelect = document.getElementById('categoryInput');
        // Limpiar el select excepto la primera opción
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        categories.forEach(category => {
            console.log('Añadiendo categoría:', category);
            const option = document.createElement('option');
            option.value = category.productCategoryId;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
        console.log('Categorías cargadas. Opciones actuales:', 
            Array.from(categorySelect.options).map(opt => ({value: opt.value, text: opt.text})));
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        alert('Error al cargar las categorías. Por favor, recarga la página.');
    }
}

async function searchNearbyProducts() {
    console.log('Iniciando búsqueda de productos...');
    const searchTerm = document.getElementById('searchInput').value;
    const radius = document.getElementById('radiusInput').value;
    const minPrice = document.getElementById('minPriceInput').value;
    const maxPrice = document.getElementById('maxPriceInput').value;
    const categorySelect = document.getElementById('categoryInput');
    const categoryId = categorySelect.value;
    const resultsDiv = document.getElementById('results');

    // Obtener la ubicación actual del usuario
    if (!userMarker) {
        console.log('No se ha obtenido la ubicación del usuario');
        alert('Esperando obtener tu ubicación...');
        return;
    }

    // Obtener la posición del marcador del usuario
    const position = userMarker.position;
    console.log('Posición actual:', position.lat, position.lng);

    // Validar y convertir los valores numéricos
    const minPriceValue = minPrice.trim() !== '' ? parseFloat(minPrice) : null;
    const maxPriceValue = maxPrice.trim() !== '' ? parseFloat(maxPrice) : null;
    const categoryIdValue = categoryId && categoryId !== '' ? parseInt(categoryId) : null;
    const radiusValue = parseFloat(radius);

    // Validar que el precio mínimo no sea mayor que el máximo
    if (minPriceValue !== null && maxPriceValue !== null && minPriceValue > maxPriceValue) {
        alert('El precio mínimo no puede ser mayor que el precio máximo');
        return;
    }

    const request = {
        searchTerm: searchTerm.trim() !== '' ? searchTerm : null,
        latitude: position.lat,
        longitude: position.lng,
        radiusInKm: radiusValue,
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        categoryId: categoryIdValue
    };

    console.log('Enviando petición con los siguientes valores:');
    console.log('- Término de búsqueda:', request.searchTerm);
    console.log('- Radio:', request.radiusInKm);
    console.log('- Precio mínimo:', request.minPrice);
    console.log('- Precio máximo:', request.maxPrice);
    console.log('- Categoría:', request.categoryId);
    console.log('- Latitud:', request.latitude);
    console.log('- Longitud:', request.longitude);

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
                <p class="category">${product.categoryName}</p>
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

// Cargar categorías cuando se carga la página y cuando se muestra el mapa
document.addEventListener('DOMContentLoaded', loadCategories);

// Añadir listener para cargar categorías cuando se muestra el mapa
document.getElementById('searchLink').addEventListener('click', function(e) {
    e.preventDefault();
    loadCategories();
}); 