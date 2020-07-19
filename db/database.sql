DROP DATABASE onlineStore;
CREATE USER 'adminTienda'@'localhost' IDENTIFIED BY 'passwordTienda';

CREATE DATABASE onlineStore;
use onlineStore;

CREATE TABLE user(
    email varchar(150) NOT NULL,
    password varchar(60) NOT NULL,
    name varchar(150) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    PRIMARY KEY (email)
);

CREATE TABLE product(
	id INT NOT NULL AUTO_INCREMENT,
    name varchar(200) NOT NULL,
    description text NOT NULL,
    price DOUBLE(8,2) NOT NULL,
    slug varchar(500) NOT NULL,
    image varchar(200) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE cart(
	id INT NOT NULL AUTO_INCREMENT,
    user_email varchar(150) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_email) REFERENCES user(email),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE purchase(
    id INT NOT NULL AUTO_INCREMENT,
    user_email varchar(150) NOT NULL,
    purchase_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_email) REFERENCES user(email)
);

CREATE TABLE purchase_item(
    purchase_id int NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (purchase_id, product_id),
    FOREIGN KEY (purchase_id) REFERENCES purchase(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

GRANT ALL PRIVILEGES ON onlineStore.* TO 'adminTienda'@'localhost';