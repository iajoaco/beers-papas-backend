-- Crear tablas principales
CREATE TABLE IF NOT EXISTS place_categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS places (
    place_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id BIGINT,
    address VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    opening_hours VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES place_categories(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_categories (
    product_category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id BIGINT,
    name VARCHAR(100) NOT NULL,
    product_category_id BIGINT,
    description TEXT,
    price DECIMAL(10,2),
    latitude DOUBLE,
    longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(place_id),
    FOREIGN KEY (product_category_id) REFERENCES product_categories(product_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    place_id BIGINT,
    rating DECIMAL(2,1) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (place_id) REFERENCES places(place_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_place_category ON places(category_id);
CREATE INDEX IF NOT EXISTS idx_product_place ON products(place_id);
CREATE INDEX IF NOT EXISTS idx_product_category ON products(product_category_id);
CREATE INDEX IF NOT EXISTS idx_rating_user ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_rating_place ON ratings(place_id);

-- Crear triggers para mantener el promedio de valoraciones
CREATE TRIGGER IF NOT EXISTS update_place_rating_avg
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE places p
    SET p.average_rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE place_id = NEW.place_id
    )
    WHERE p.place_id = NEW.place_id;
END;

CREATE TRIGGER IF NOT EXISTS update_place_rating_count
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE places p
    SET p.rating_count = (
        SELECT COUNT(*)
        FROM ratings
        WHERE place_id = NEW.place_id
    )
    WHERE p.place_id = NEW.place_id;
END; 