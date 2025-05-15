document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const registerLink = document.getElementById('registerLink');
    const rateLink = document.getElementById('rateLink');
    const searchLink = document.getElementById('searchLink');
    const contributeLink = document.getElementById('contributeLink');
    const mapContainer = document.getElementById('map-container');
    const homeLink = document.getElementById('homeLink');
    const logoutLink = document.getElementById('logoutLink');
    const registerPage = document.getElementById('registerPage');
    const loginPage = document.getElementById('loginPage');
    const heroSection = document.querySelector('.hero-section');
    const rateModal = document.getElementById('rateModal');
    const contributeModal = document.getElementById('contributeModal');
    const closeRateModal = document.getElementById('closeRateModal');
    const closeContributeModal = document.getElementById('closeContributeModal');
    const closeRegisterPage = document.getElementById('closeRegisterPage');
    const closeLoginPage = document.getElementById('closeLoginPage');
    const contributeForm = document.getElementById('contributeForm');
    const contributeMessage = document.getElementById('contributeMessage');

    // Manejar opciones de bebida
    const contributeDrinkType = document.getElementById('contributeDrinkType');
    const drinkOptions = document.getElementById('drinkOptions');
    const drinkVolume = document.getElementById('drinkVolume');
    const drinkSubtype = document.getElementById('drinkSubtype');

    // Configuración de opciones para cada tipo de bebida
    const drinkOptionsConfig = {
        'Cerveza': {
            volumes: [
                { value: '0.2', label: '0.2L (Caña)' },
                { value: '0.2', label: '0.2L (Botellín)' },
                { value: '0.3', label: '0.3L (Tercio)' },
                { value: '0.4', label: '0.4L (Doble)' },
                { value: '0.5', label: '0.5L (Jarra)' }
            ],
            subtypes: [
                { value: 'Rubia', label: 'Rubia' },
                { value: 'Negra', label: 'Negra' },
                { value: 'Tostada', label: 'Tostada' },
                { value: 'Especial', label: 'Especial' }
            ]
        },
        'Sidra': {
            volumes: [
                { value: '0.2', label: '0.2L (Culín)' },
                { value: '0.3', label: '0.3L (Tercio)' },
                { value: '0.5', label: '0.5L (Jarra)' }
            ],
            subtypes: [
                { value: 'Natural', label: 'Natural' },
                { value: 'Espumosa', label: 'Espumosa' },
                { value: 'Dulce', label: 'Dulce' }
            ]
        },
        'Tinto': {
            volumes: [
                { value: '0.4', label: '0.4L (Doble)' },
                { value: '0.5', label: '0.5L (Jarra)' },
                { value: '1.0', label: '1.0L (Jarra Grande)' }
            ],
            subtypes: [
                { value: 'Normal', label: 'Normal' },
                { value: 'Con Limón', label: 'Con Limón' },
                { value: 'Con Frutas', label: 'Con Frutas' }
            ]
        },
        'Vino': {
            volumes: [
                { value: '0.1', label: '0.1L (Copa)' },
                { value: '0.75', label: '0.75L (Botella)' }
            ],
            subtypes: [
                { value: 'Tinto', label: 'Tinto' },
                { value: 'Blanco', label: 'Blanco' },
                { value: 'Rosado', label: 'Rosado' }
            ]
        },
        'Refresco': {
            volumes: [], // No volumes for refrescos
            subtypes: [
                { value: 'CocaCola', label: 'CocaCola' },
                { value: 'Aquarius', label: 'Aquarius' },
                { value: 'Fanta', label: 'Fanta' },
                { value: 'Nestea', label: 'Nestea' },
                { value: 'Kas', label: 'Kas' }
            ]
        }
    };

    // Función para actualizar las opciones de volumen y tipo
    function updateDrinkOptions(drinkType) {
        const options = drinkOptionsConfig[drinkType];
        if (options) {
            // Actualizar opciones de volumen
            if (options.volumes.length > 0) {
                drinkVolume.innerHTML = options.volumes.map(vol => 
                    `<option value="${vol.value}">${vol.label}</option>`
                ).join('');
                drinkVolume.parentElement.classList.remove('hidden');
            } else {
                drinkVolume.parentElement.classList.add('hidden');
            }

            // Actualizar opciones de tipo
            drinkSubtype.innerHTML = options.subtypes.map(sub => 
                `<option value="${sub.value}">${sub.label}</option>`
            ).join('');

            drinkOptions.classList.remove('hidden');
        } else {
            drinkOptions.classList.add('hidden');
            drinkVolume.innerHTML = '';
            drinkSubtype.innerHTML = '';
        }
    }

    // Event listener para el cambio de tipo de bebida
    contributeDrinkType.addEventListener('change', function() {
        updateDrinkOptions(this.value);
    });

    // Toggle del menú móvil
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Mostrar/ocultar logout según login
    function updateAuthUI() {
        if (isLoggedIn()) {
            logoutLink.style.display = '';
            rateLink.style.display = '';
            contributeLink.style.display = '';
        } else {
            logoutLink.style.display = 'none';
            rateLink.style.display = '';
            contributeLink.style.display = '';
        }
    }
    updateAuthUI();

    // Navegación entre páginas
    function showPage(page) {
        // Oculta todas las secciones principales
        registerPage.classList.add('hidden');
        loginPage.classList.add('hidden');
        heroSection.classList.add('hidden');
        mapContainer.classList.add('hidden');
        rateModal.classList.add('hidden');
        contributeModal.classList.add('hidden');
        
        // Muestra la que toca
        if (page === 'register') registerPage.classList.remove('hidden');
        else if (page === 'login') loginPage.classList.remove('hidden');
        else if (page === 'map') mapContainer.classList.remove('hidden');
        else if (page === 'hero') heroSection.classList.remove('hidden');
    }

    // Botón Inicio
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('hero');
    });

    // Botón logout
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        updateAuthUI();
        showPage('hero');
    });

    // Mostrar página de registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('register');
    });

    // Mostrar modal de valoración
    rateLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            showPage('login');
        } else {
            rateModal.classList.remove('hidden');
        }
    });

    // Mostrar modal de contribución
    contributeLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            showPage('login');
        } else {
            contributeModal.classList.remove('hidden');
        }
    });

    // Mostrar mapa
    searchLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('map');
        if (typeof map === 'undefined') {
            initMap();
        }
    });

    // Cerrar modales
    if (closeRateModal) {
        closeRateModal.addEventListener('click', function() {
            rateModal.classList.add('hidden');
        });
    }

    if (closeContributeModal) {
        closeContributeModal.addEventListener('click', function() {
            contributeModal.classList.add('hidden');
        });
    }

    if (closeRegisterPage) {
        closeRegisterPage.addEventListener('click', function() {
            showPage('hero');
        });
    }

    if (closeLoginPage) {
        closeLoginPage.addEventListener('click', function() {
            showPage('hero');
        });
    }

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === rateModal) {
            rateModal.classList.add('hidden');
        }
        if (event.target === contributeModal) {
            contributeModal.classList.add('hidden');
        }
        if (event.target === loginPage) {
            showPage('hero');
        }
    });

    // Botón de búsqueda
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function() {
        performSearch();
    });

    // Enviar contribución
    contributeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        contributeMessage.textContent = '';
        const drinkType = document.getElementById('contributeDrinkType').value;
        const price = document.getElementById('contributePrice').value;
        const placeName = document.getElementById('contributePlaceName').value.trim();
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            contributeMessage.style.color = '#d32f2f';
            contributeMessage.textContent = 'Debes iniciar sesión para contribuir.';
            return;
        }

        const contributionData = {
            drinkType: drinkType,
            price: parseFloat(price),
            placeName: placeName
        };

        // Añadir opciones adicionales para todas las bebidas
        if (drinkType) {
            const selectedVolume = drinkVolume.options[drinkVolume.selectedIndex];
            contributionData.volume = drinkVolume.value;
            contributionData.volumeLabel = selectedVolume.text.split(' ')[1].replace(/[()]/g, ''); // Extract label from option text
            contributionData.subtype = drinkSubtype.value;
        }

        fetch('/api/products/contribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(contributionData)
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            contributeMessage.style.color = '#388e3c';
            contributeMessage.textContent = '¡Contribución enviada!';
            setTimeout(() => {
                contributeModal.classList.add('hidden');
                contributeForm.reset();
                contributeMessage.textContent = '';
                drinkOptions.classList.add('hidden');
            }, 1500);
        })
        .catch(err => {
            contributeMessage.style.color = '#d32f2f';
            contributeMessage.textContent = 'Error: ' + (err.message || 'No se pudo enviar la contribución');
        });
    });

    // Función para saber si el usuario está logueado
    function isLoggedIn() {
        return !!localStorage.getItem('jwtToken');
    }

    // --- Registro ---
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        registerMessage.textContent = '';
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            registerMessage.style.color = '#388e3c';
            registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            setTimeout(() => {
                showPage('login');
                registerForm.reset();
                registerMessage.textContent = '';
            }, 1500);
        })
        .catch(err => {
            registerMessage.style.color = '#d32f2f';
            registerMessage.textContent = 'Error: ' + (err.message || 'No se pudo registrar');
        });
    });

    // --- Login ---
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loginMessage.textContent = '';
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            localStorage.setItem('jwtToken', data.token);
            loginMessage.style.color = '#388e3c';
            loginMessage.textContent = '¡Login exitoso!';
            setTimeout(() => {
                showPage('hero');
                loginForm.reset();
                loginMessage.textContent = '';
                updateAuthUI();
            }, 1000);
        })
        .catch(err => {
            loginMessage.style.color = '#d32f2f';
            loginMessage.textContent = 'Error: ' + (err.message || 'No se pudo iniciar sesión');
        });
    });

    // --- Valoración ---
    const rateForm = document.getElementById('rateForm');
    const rateMessage = document.getElementById('rateMessage');

    // Enviar valoración
    rateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        rateMessage.textContent = '';
        const productName = document.getElementById('rateProductName').value.trim();
        const placeName = document.getElementById('ratePlaceName').value.trim();
        const score = document.getElementById('rateScore').value;
        const comment = document.getElementById('rateComment').value.trim();
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            rateMessage.style.color = '#d32f2f';
            rateMessage.textContent = 'Debes iniciar sesión para valorar.';
            return;
        }

        // Buscar el producto por nombre y local
        fetch(`/api/products/search?name=${encodeURIComponent(productName)}&place=${encodeURIComponent(placeName)}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(products => {
            if (!products || products.length === 0) {
                throw new Error('No se encontró el producto con ese nombre y local.');
            }
            // Tomamos el primer producto encontrado
            const product = products[0];
            // Enviar valoración
            return fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    productId: product.productId,
                    rating: parseInt(score),
                    comment: comment
                })
            });
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            rateMessage.style.color = '#388e3c';
            rateMessage.textContent = '¡Valoración enviada!';
            setTimeout(() => {
                rateModal.classList.add('hidden');
                rateForm.reset();
                rateMessage.textContent = '';
            }, 1500);
        })
        .catch(err => {
            rateMessage.style.color = '#d32f2f';
            rateMessage.textContent = 'Error: ' + (err.message || 'No se pudo enviar la valoración');
        });
    });

    // Al cargar, mostrar la pantalla principal
    showPage('hero');
}); 