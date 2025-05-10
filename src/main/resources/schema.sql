-- Crear tablas principales
CREATE TABLE IF NOT EXISTS place_categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS places (
    place_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    opening_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES place_categories(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_categories (
    product_category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    product_category_id BIGINT,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(place_id),
    FOREIGN KEY (product_category_id) REFERENCES product_categories(product_category_id),
    UNIQUE KEY unique_product_per_place (place_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating_count INT DEFAULT 0,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (place_id) REFERENCES places(place_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_place_category ON places(category_id);
CREATE INDEX idx_product_place ON products(place_id);
CREATE INDEX idx_product_category ON products(product_category_id);
CREATE INDEX idx_rating_user ON ratings(user_id);
CREATE INDEX idx_rating_place ON ratings(place_id);
CREATE INDEX idx_rating_product ON ratings(product_id);
CREATE INDEX idx_rating_created_at ON ratings(created_at);

-- Trigger para actualizar el rating promedio de un producto
CREATE TRIGGER after_rating_insert_product
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE products
    SET rating_count = (
        SELECT COUNT(*)
        FROM ratings
        WHERE product_id = NEW.product_id
    ),
    average_rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE product_id = NEW.product_id
    )
    WHERE product_id = NEW.product_id;
END;

-- Trigger para actualizar el contador de ratings del usuario
CREATE TRIGGER after_rating_insert_user
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE users
    SET rating_count = (
        SELECT COUNT(*)
        FROM ratings
        WHERE user_id = NEW.user_id
    )
    WHERE user_id = NEW.user_id;
END; 