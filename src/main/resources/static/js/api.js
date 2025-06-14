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
        categorySelect.innerHTML = '<option value="">Todas las categorías</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.productCategoryId;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
        console.log('Categorías cargadas correctamente');
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
    const categoryId = document.getElementById('categoryInput').value;
    const resultsDiv = document.getElementById('results');

    console.log('Término de búsqueda:', searchTerm);
    console.log('Radio:', radius);
    console.log('Precio mínimo:', minPrice);
    console.log('Precio máximo:', maxPrice);
    console.log('Categoría:', categoryId);

    // Obtener la ubicación del usuario
    if (!window.userLocation) {
        console.log('No se ha obtenido la ubicación del usuario');
        alert('Esperando obtener tu ubicación... Por favor, asegúrate de que la geolocalización está activada.');
        
        // Intentar obtener la ubicación nuevamente
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Nueva ubicación obtenida:', position);
                    window.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('Nueva ubicación del usuario establecida:', window.userLocation);
                    // Intentar la búsqueda nuevamente
                    searchNearbyProducts();
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
        }
        return;
    }

    console.log('Posición actual:', window.userLocation.lat, window.userLocation.lng);

    // Validar y convertir los valores numéricos
    const minPriceValue = minPrice.trim() !== '' ? parseFloat(minPrice) : null;
    const maxPriceValue = maxPrice.trim() !== '' ? parseFloat(maxPrice) : null;
    const categoryIdValue = categoryId.trim() !== '' ? parseInt(categoryId) : null;

    // Validar que el precio mínimo no sea mayor que el máximo
    if (minPriceValue !== null && maxPriceValue !== null && minPriceValue > maxPriceValue) {
        alert('El precio mínimo no puede ser mayor que el precio máximo');
        return;
    }

    // Validar que los precios sean números válidos
    if (minPriceValue !== null && isNaN(minPriceValue)) {
        alert('El precio mínimo debe ser un número válido');
        return;
    }
    if (maxPriceValue !== null && isNaN(maxPriceValue)) {
        alert('El precio máximo debe ser un número válido');
        return;
    }

    const request = {
        searchTerm: searchTerm.trim() !== '' ? searchTerm : null,
        latitude: window.userLocation.lat,
        longitude: window.userLocation.lng,
        radiusInKm: parseFloat(radius),
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        categoryId: categoryIdValue
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
        if (typeof clearMarkers === 'function') {
            clearMarkers();
        }
        
        // Limpiar resultados anteriores
        if (resultsDiv) {
            resultsDiv.innerHTML = '';

            if (products.length === 0) {
                resultsDiv.innerHTML = '<p>No se encontraron productos cercanos.</p>';
                return;
            }

            // Mostrar resultados
            products.forEach(product => {
                console.log('Procesando producto:', product);
                // Añadir marcador al mapa
                if (typeof addProductMarker === 'function') {
                    addProductMarker(product);
                }

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
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        if (resultsDiv) {
            resultsDiv.innerHTML = `<p>Error al buscar productos: ${error.message}</p>`;
        }
    }
}

// Cargar categorías cuando se carga la página y cuando se muestra el mapa
document.addEventListener('DOMContentLoaded', loadCategories);

// Añadir listener para cargar categorías cuando se muestra el mapa
document.getElementById('searchLink').addEventListener('click', function(e) {
    e.preventDefault();
    loadCategories();
}); 