# Documentación Técnica - Beers Papas Backend

## 1. Introducción

Este documento describe la arquitectura y funcionamiento del backend de la aplicación Beers Papas, desarrollado como parte de un Trabajo de Fin de Grado (TFG). La aplicación está construida utilizando Spring Boot, un framework de Java que facilita el desarrollo de aplicaciones web.

## 2. Arquitectura del Sistema

### 2.1 ¿Qué es una Arquitectura en Capas?

Una arquitectura en capas es una forma de organizar el código de una aplicación separándolo en diferentes niveles o "capas", donde cada una tiene una responsabilidad específica. Esto hace que el código sea más organizado, mantenible y fácil de entender.

### 2.2 Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas principales:

```
src/main/java/com/example/beerspapasbackend/
├── config/         # Configuraciones de la aplicación
├── controller/     # Controladores REST
├── dto/           # Objetos de Transferencia de Datos
├── model/         # Entidades del dominio
├── repository/    # Capa de acceso a datos
├── service/       # Lógica de negocio
└── DemoApplication.java  # Punto de entrada de la aplicación
```

## 3. Explicación Detallada de Cada Capa

### 3.1 Modelos (Models)

#### ¿Qué son los Modelos?
Los modelos son clases Java que representan las tablas de la base de datos. Cada modelo corresponde a una tabla y sus propiedades corresponden a las columnas de la tabla.

#### Ejemplo de un Modelo:
```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    // ... otros campos
}
```

#### ¿Para qué sirven?
- Definen la estructura de los datos
- Establecen relaciones entre diferentes tablas
- Contienen las reglas de validación básicas
- Son la base para la creación de la base de datos

### 3.2 Repositorios (Repositories)

#### ¿Qué son los Repositorios?
Los repositorios son interfaces que manejan la comunicación con la base de datos. En Spring Boot, extendemos `JpaRepository` que nos proporciona métodos básicos para operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

#### Ejemplo de un Repositorio:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByName(String name);
    List<Product> findByPriceLessThan(Double price);
}
```

#### ¿Para qué sirven?
- Proporcionan métodos para acceder a la base de datos
- Permiten crear consultas personalizadas
- Manejan la persistencia de datos
- Abstraen la complejidad de la base de datos

### 3.3 Servicios (Services)

#### ¿Qué son los Servicios?
Los servicios contienen la lógica de negocio de la aplicación. Son clases que coordinan las operaciones entre diferentes repositorios y aplican las reglas de negocio.

#### Ejemplo de un Servicio:
```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProductsByCategory(Long categoryId) {
        // Lógica de negocio aquí
        return productRepository.findByCategoryId(categoryId);
    }
}
```

#### ¿Para qué sirven?
- Implementan la lógica de negocio
- Coordinan operaciones entre diferentes repositorios
- Manejan transacciones
- Aplican reglas de negocio
- Realizan cálculos y transformaciones de datos

### 3.4 Controladores (Controllers)

#### ¿Qué son los Controladores?
Los controladores son clases que manejan las peticiones HTTP entrantes. Son el punto de entrada de la aplicación para las peticiones del frontend.

#### Ejemplo de un Controlador:
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
}
```

#### ¿Para qué sirven?
- Reciben peticiones HTTP
- Validan los datos de entrada
- Llaman a los servicios apropiados
- Devuelven respuestas HTTP
- Manejan errores y excepciones

### 3.5 DTOs (Data Transfer Objects)

#### ¿Qué son los DTOs?
Los DTOs son objetos que se utilizan para transferir datos entre diferentes capas de la aplicación. Son especialmente útiles para controlar qué datos se envían al frontend.

#### Ejemplo de un DTO:
```java
public class ProductDTO {
    private Long id;
    private String name;
    private Double price;
    // Solo los campos necesarios para el frontend
}
```

#### ¿Para qué sirven?
- Controlan qué datos se envían al frontend
- Reducen el tamaño de las respuestas
- Evitan exponer datos sensibles
- Facilitan la transformación de datos

## 4. Flujo de Datos en la Aplicación

### 4.1 Ejemplo de Flujo Completo

1. **Petición HTTP llega al Controlador**
   ```http
   GET /api/products/1
   ```

2. **El Controlador procesa la petición**
   ```java
   @GetMapping("/{id}")
   public ResponseEntity<Product> getProduct(@PathVariable Long id) {
       return productService.getProduct(id);
   }
   ```

3. **El Servicio aplica la lógica de negocio**
   ```java
   public Product getProduct(Long id) {
       return productRepository.findById(id)
           .orElseThrow(() -> new ProductNotFoundException(id));
   }
   ```

4. **El Repositorio accede a la base de datos**
   ```java
   // JpaRepository proporciona este método automáticamente
   Optional<Product> findById(Long id);
   ```

5. **La respuesta fluye de vuelta**
   - Repositorio → Servicio → Controlador → Frontend

## 5. Conexión con la Base de Datos

### 5.1 Configuración
La aplicación utiliza Spring Data JPA para la persistencia de datos. La configuración se realiza en el archivo `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/beers_papas
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```

### 5.2 ¿Cómo funciona JPA?
- JPA (Java Persistence API) es una especificación para manejar datos relacionales
- Hibernate es la implementación de JPA que usa Spring Boot
- Las anotaciones como `@Entity`, `@Id`, `@Column` definen la estructura de la base de datos
- JPA traduce las operaciones Java a consultas SQL

## 6. Conexión con el Frontend

### 6.1 API REST
La aplicación expone endpoints REST que el frontend puede consumir:

```http
GET    /api/products     - Obtener todos los productos
POST   /api/products     - Crear un nuevo producto
GET    /api/products/1   - Obtener un producto específico
PUT    /api/products/1   - Actualizar un producto
DELETE /api/products/1   - Eliminar un producto
```

### 6.2 Formato de Datos
- Las peticiones y respuestas usan formato JSON
- Ejemplo de respuesta:
```json
{
    "id": 1,
    "name": "Cerveza Artesanal",
    "price": 5.99,
    "description": "Cerveza artesanal local"
}
```

## 7. Seguridad

### 7.1 Autenticación JWT
- JWT (JSON Web Token) se usa para la autenticación
- El token contiene información del usuario
- Se envía en el header de las peticiones
- Se verifica en cada petición protegida

### 7.2 Protección de Endpoints
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/products")
public List<Product> getAdminProducts() {
    // Solo accesible por administradores
}
```

## 8. Consideraciones Técnicas

### 8.1 Manejo de Errores
```java
@ExceptionHandler(ProductNotFoundException.class)
public ResponseEntity<ErrorResponse> handleProductNotFound(ProductNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ErrorResponse("Producto no encontrado"));
}
```

### 8.2 Logging
```java
private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

@GetMapping
public List<Product> getAllProducts() {
    logger.info("Obteniendo todos los productos");
    return productService.getAllProducts();
}
```

## 9. Conclusión

Esta arquitectura en capas proporciona una base sólida y mantenible para la aplicación. Cada capa tiene una responsabilidad específica y se comunica con las demás de manera clara y organizada. Esta estructura facilita:
- El mantenimiento del código
- La adición de nuevas funcionalidades
- La prueba de componentes individuales
- La escalabilidad de la aplicación 

## 10. Frontend y su Interacción con el Backend

### 10.1 Arquitectura del Frontend

#### 10.1.1 Tecnologías Principales
- Framework: React.js
- Gestión de Estado: Redux/Context API
- Estilos: CSS/SCSS con enfoque en diseño responsive
- Routing: React Router
- Peticiones HTTP: Axios/Fetch API

#### 10.1.2 Estructura de Carpetas
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── services/      # Servicios de API
├── store/         # Gestión de estado
├── hooks/         # Custom hooks
├── utils/         # Utilidades
└── assets/        # Recursos estáticos
```

### 10.2 Comunicación Frontend-Backend

#### 10.2.1 Flujo de Datos
1. **Inicio de Sesión**
   - El usuario ingresa credenciales
   - Frontend envía petición al endpoint `/api/auth/login`
   - Backend valida y devuelve JWT
   - Frontend almacena token en localStorage/Redux

2. **Peticiones Autenticadas**
   - Frontend incluye JWT en header de peticiones
   - Backend valida token
   - Si es válido, procesa la petición
   - Si no es válido, devuelve error 401

3. **Manejo de Respuestas**
   - Frontend recibe datos en formato JSON
   - Actualiza el estado de la aplicación
   - Renderiza nuevos datos
   - Maneja errores apropiadamente

### 10.3 Características del Frontend

#### 10.3.1 Gestión de Estado
- Estado global para datos compartidos
- Estado local para componentes específicos
- Persistencia de datos importantes
- Sincronización con backend

#### 10.3.2 Interfaz de Usuario
- Diseño responsive
- Navegación intuitiva
- Feedback visual de acciones
- Manejo de errores amigable

#### 10.3.3 Características Específicas
1. **Búsqueda de Productos**
   - Búsqueda por nombre
   - Filtrado por categorías
   - Búsqueda por ubicación
   - Filtros de precio

2. **Sistema de Valoraciones**
   - Interfaz de calificación
   - Visualización de promedios
   - Historial de valoraciones
   - Comentarios y reseñas

3. **Gestión de Perfil**
   - Información personal
   - Historial de actividades
   - Preferencias
   - Configuración de cuenta

### 10.4 Seguridad en el Frontend

#### 10.4.1 Protección de Datos
- Almacenamiento seguro de tokens
- Encriptación de datos sensibles
- Validación de formularios
- Sanitización de inputs

#### 10.4.2 Manejo de Sesiones
- Control de tiempo de sesión
- Renovación automática de tokens
- Cierre de sesión seguro
- Persistencia de sesión

### 10.5 Optimización y Rendimiento

#### 10.5.1 Técnicas de Optimización
- Lazy loading de componentes
- Caché de datos
- Compresión de assets
- Optimización de imágenes

#### 10.5.2 Mejores Prácticas
- Código modular
- Reutilización de componentes
- Limpieza de recursos
- Manejo eficiente de memoria

### 10.6 Testing

#### 10.6.1 Tipos de Tests
- Tests unitarios
- Tests de integración
- Tests end-to-end
- Tests de rendimiento

#### 10.6.2 Herramientas
- Jest para tests unitarios
- React Testing Library
- Cypress para E2E
- Lighthouse para rendimiento

### 10.7 Despliegue

#### 10.7.1 Proceso de Build
- Compilación de código
- Optimización de assets
- Generación de bundles
- Configuración de variables de entorno

#### 10.7.2 Estrategias de Despliegue
- Despliegue continuo
- Versionado semántico
- Rollbacks
- Monitoreo de producción

### 10.8 Monitoreo y Mantenimiento

#### 10.8.1 Herramientas de Monitoreo
- Análisis de errores
- Métricas de rendimiento
- Análisis de uso
- Logs de usuario

#### 10.8.2 Proceso de Mantenimiento
- Actualizaciones regulares
- Corrección de bugs
- Mejoras de rendimiento
- Optimización de código

## 11. Conclusión

La arquitectura frontend-backend implementada proporciona una base sólida para una aplicación web moderna y escalable. La separación clara de responsabilidades y la comunicación eficiente entre capas permiten:

- Desarrollo ágil y mantenible
- Escalabilidad horizontal
- Experiencia de usuario óptima
- Seguridad robusta
- Rendimiento eficiente

## 12. Próximos Pasos y Mejoras Futuras

### 12.1 Mejoras Técnicas
- Implementación de WebSockets para tiempo real
- Optimización de consultas
- Mejora de caché
- Implementación de PWA

### 12.2 Mejoras de UX
- Mejora de accesibilidad
- Optimización de rendimiento
- Nuevas características
- Mejoras en la interfaz

### 12.3 Escalabilidad
- Preparación para mayor carga
- Optimización de recursos
- Mejora de infraestructura
- Planificación de crecimiento 