-- Datos de ejemplo para la tabla de usuarios
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'ADMIN'),
('user1', 'user1@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER'),
('user2', 'user2@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER');

-- Datos de ejemplo para la tabla de cervezas
INSERT INTO beers (name, description, alcohol_content, price, image_url) VALUES
('Corona Extra', 'Cerveza lager clara y refrescante', 4.5, 2.50, 'corona.jpg'),
('Heineken', 'Cerveza lager premium', 5.0, 2.80, 'heineken.jpg'),
('Guinness', 'Cerveza stout irlandesa', 4.2, 3.50, 'guinness.jpg');

-- Datos de ejemplo para la tabla de pedidos
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(1, 5.30, 'COMPLETED', NOW()),
(2, 3.50, 'PENDING', NOW());

-- Datos de ejemplo para la tabla de detalles de pedido
INSERT INTO order_items (order_id, beer_id, quantity, price) VALUES
(1, 1, 2, 2.50),
(1, 2, 1, 2.80),
(2, 3, 1, 3.50); 