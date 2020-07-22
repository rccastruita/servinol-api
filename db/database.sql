CREATE USER 'adminTienda'@'localhost' IDENTIFIED BY 'passwordTienda';

DROP DATABASE onlineStore;
CREATE DATABASE onlineStore;
GRANT ALL PRIVILEGES ON onlineStore.* TO 'adminTienda'@'localhost';

use onlineStore;

CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    email varchar(150) NOT NULL,
    password varchar(60) NOT NULL,
    name varchar(150) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    PRIMARY KEY (id)
);

ALTER TABLE user AUTO_INCREMENT = 1000;

CREATE TABLE product(
	id INT NOT NULL AUTO_INCREMENT,
    name varchar(200) NOT NULL,
    description text NOT NULL,
    price DOUBLE(8,2) NOT NULL,
    slug varchar(500), NOT NULL,
    image varchar(200) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE genre(
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE product_is_genre(
    product_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY(product_id, genre_id),
    FOREIGN KEY(product_id) REFERENCES product.id,
    FOREIGN KEY(genre_id) REFERENCES genre.id
);

CREATE TABLE platform(
    id INT NOT NULL,
    name varchar(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE product_on_platform(
    product_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY(product_id, platform_id),
    FOREIGN KEY(product_id) REFERENCES product.id,
    FOREIGN KEY(platform_id) REFERENCES platform.id
);

CREATE TABLE cart_item(
	id INT NOT NULL AUTO_INCREMENT,
    user_id varchar(150) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE purchase(
    id INT NOT NULL AUTO_INCREMENT,
    user_id varchar(150) NOT NULL,
    purchase_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE purchase_item(
    purchase_id int NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (purchase_id, product_id),
    FOREIGN KEY (purchase_id) REFERENCES purchase(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

DELIMITER $$

CREATE TRIGGER before_purchase_delete
BEFORE DELETE ON purchase FOR EACH ROW
BEGIN
	DELETE FROM purchase_item
	WHERE purchase_id = OLD.id;
END$$

CREATE TRIGGER before_user_delete
BEFORE DELETE ON user FOR EACH ROW
BEGIN
	DELETE FROM cart_item
	WHERE user_id = OLD.id;

	DELETE FROM purchase
	WHERE user_id = OLD.id;
END$$

DELIMITER ;