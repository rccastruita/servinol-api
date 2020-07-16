CREATE DATABASE IF NOT EXISTS onlineStore;
use onlineStore;
CREATE TABLE users(
    email varchar(150) NOT NULL,
    password varchar(500) NOT NULL,
    name varchar(150) NOT NULL,
    role INT(1) NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
    name varchar(200) NOT NULL,
    description text NOT NULL,
    price DOUBLE(8,2) NOT NULL,
    slug varchar(500) NOT NULL,
    image varchar(200) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE carts(
	id INT NOT NULL AUTO_INCREMENT,
    user_email varchar(150) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TYPE user_object AS OBJECT(
	email varchar(150),
    password varchar(500),
    name varchar(150),
    role INT(1)
);

DELIMITER //
CREATE PROCEDURE userAddOrEdit (
	IN _email varchar(150),
	IN _password varchar(500),
    IN _name varchar(150),
    IN _role INT(1),
    OUT _user INT
)
BEGIN
	IF _email NOT IN (SELECT email from users) THEN
		INSERT INTO users (email, password, name, role)
		VALUES(_email, _password, _name, _role);
	ELSE
		UPDATE users
        SET
            password = _password,
            name = _name,
            role = _role
			WHERE email = _email;
	END IF;
    SELECT * FROM users where email like _email;
END;
DELIMITER;

