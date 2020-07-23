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
    slug varchar(500) DEFAULT '/slugs',
    image varchar(500) NOT NULL,
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
    FOREIGN KEY(product_id) REFERENCES product(id),
    FOREIGN KEY(genre_id) REFERENCES genre(id)
);

CREATE TABLE platform(
    id INT NOT NULL,
    name varchar(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE product_on_platform(
    product_id INT NOT NULL,
    platform_id INT NOT NULL,
    PRIMARY KEY(product_id, platform_id),
    FOREIGN KEY(product_id) REFERENCES product(id),
    FOREIGN KEY(platform_id) REFERENCES platform(id)
);

CREATE TABLE cart_item(
	id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE purchase(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
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

/* TRIGGERS -------------------------------------------------------*/

DELIMITER $$

CREATE TRIGGER before_user_insert
BEFORE INSERT ON user FOR EACH ROW
BEGIN 
    IF NEW.email IN (SELECT email FROM user) THEN
        SET NEW.email = NULL;
    END IF;

END$$

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

CREATE TRIGGER genre_inserts
AFTER INSERT ON product FOR EACH ROW
BEGIN 
    INSERT INTO product_is_genre(product_id, genre_id)
        (SELECT NEW.id product, g.id genre FROM 
            (SELECT @n:=(SELECT id FROM product LIMIT 1 OFFSET 0)) 
        initvars, genre g ORDER BY RAND() LIMIT 3);
END$$

DELIMITER ;

INSERT INTO user (email, password, name, role) VALUES
("elpatron@mail.com", "$2b$10$A/WC2vawMxpr2iyTXSgNMuVmMZlYoWaNOSBWn2UmzmeWizx4U4tbq", "El patron", "admin"),
("Owen.J0@mail.com", "$2b$10$OByuMLmdmIJ1S8AmZnSdre2y8dAjucWshDxNeN58G23uRNrEl/6VC", "Owen Johniken", "client"),
("Zetta.P1@mail.com", "$2b$10$Jn556uVBTC5VpAzpuBiTz.72R6uarC5kvhzAN7F43FtqcVU5Tp3Fy", "Zetta Ponsler", "client"),
("Clara.S2@mail.com", "$2b$10$mzqP8.vBCr2PtCuhQuH0N.9.2Olrfh1rYeXNoj1Ova7QNJVD3NK0e", "Clara Saka", "client"),
("Manual.N3@mail.com", "$2b$10$IbugTapoiSF8VAAp2GDP1OqB07jqF1wtkcnWOtrS29BaC9rPAxlHm", "Manual Nahm", "client"),
("Rudolf.A4@mail.com", "$2b$10$wtODrvqgk3b0Ea70nzxAj.8ddd7kd2TNpCb9/X0s78uIrVHARPk0e", "Rudolf Axelsen", "client"),
("Jimmy.G5@mail.com", "$2b$10$0vfGHQIYVcMhmHtXzFKSm.rEG7PU3.WVq5wGSgZx./7P/nxWHzN8y", "Jimmy Goins", "client"),
("Winston.M6@mail.com", "$2b$10$tPlqixZ7SW.DxBR.GAvoWeXZJ9mTj8YP2u47.PCDiPSVXVTECwU5e", "Winston Maziarz", "client"),
("Rueben.M7@mail.com", "$2b$10$dwU4NFUiSaQ6YDVIFK3Aiur.39qsIEgmmHKsnSSpnFs6rBJ0.78Ye", "Rueben Marinaro", "client"),
("Jacinta.R8@mail.com", "$2b$10$oB59bL3yxxBL6QLw89J45e8aPMGQeprp1c0V7KUFIttw0QrFnzCZC", "Jacinta Rather", "client"),
("Gaylord.B9@mail.com", "$2b$10$lTNpuqBeOkWXt5kiz4Pxn.vBEZ.p2wb2p4q6an3hRXJIzZCdCCPhu", "Gaylord Biddulph", "client"),
("Bridgette.L10@mail.com", "$2b$10$HWxyo0h/3n/8I0JZXRQ3FOB5btPDQJE2uRuWJTM2eeCKO3bRA02ui", "Bridgette Leaton", "client"),
("Dyan.S11@mail.com", "$2b$10$jFYha3C7V1SXCcMoQn1gx.vxusZ.9Q9HGGh0rpFxbp/jF/hgJCweW", "Dyan Scallon", "client"),
("Willis.E12@mail.com", "$2b$10$Dt85yn4qdK3RVJO1iQsJa.MqQ6TUuJoq7J5dmBTpseBP9D2paS8da", "Willis Eaglin", "client"),
("Donny.B13@mail.com", "$2b$10$eDQyuRL70WXMZkAg4BD5Q.TYL7imjYj9WTlfHK41U6avjWJe.6gcm", "Donny Broadwater", "client"),
("Fredric.S14@mail.com", "$2b$10$gaU92IxfcYHdVa3XBVANWuWQgaTibw4he1q8R9f9lXVWzqYI1y8XC", "Fredric Shaker", "client"),
("Eloy.G15@mail.com", "$2b$10$hOojS5Ije/eEXcmKYGCY2ur/Y769O2iXWi/xd5lVyEHhc/qC3/VZu", "Eloy Gervin", "client"),
("Maynard.S16@mail.com", "$2b$10$bAM607wYwGSCGHRIfUz9BOahIlf77r5f6pMy76GWI9/45Js/uSxL6", "Maynard Sandburg", "client"),
("Aja.S17@mail.com", "$2b$10$rNb8s59ljxUf.BoNFojk.e5CumTYd6vXnt6Ffo74sxOaS3KZ6.CfG", "Aja Salstrom", "client"),
("Arnulfo.G18@mail.com", "$2b$10$UlqnD/VdRihgMPGTws1xpuenNAEPb/LT9xXu3XloRg6CaC8UlDAXC", "Arnulfo Goold", "client"),
("Gerardo.M19@mail.com", "$2b$10$kz9GBDmZCw9wUU3Wsll.ruvXIXkOzDc22vC82Bm99mjik23nwcfSO", "Gerardo Melrose", "client");

INSERT INTO genre(name) VALUES
('FPS'),
('Acción'),
('RTS'),
('Aventura'),
('Simulación'),
('Casual'),
('Indie'),
('Terror'),
('Rompecabezas'),
('Estrategia por turnos'),
('Carreras'),
('MMORPG');

INSERT INTO product(name, description, price, image)
VALUES
(
    "Cyberpunk 2077",
    "Cyberpunk 2077 es el nuevo videojuego de rol en primera persona con estructura de mundo abierto de CD Projekt RED. Los padres de The Witcher nos presentan para Xbox One, PC y PS4 una aventura de corte futurista y ciberpunk en la que encarnaremos a un personaje diseñado a nuestra medida y en la que tendremos que sobrevivir en una peligrosa urbe plagada de corporaciones, ciborgs, bandas y las más variadas amenazas tecnológicas.",
    349.99,
    "https://media.vandal.net/m/20029/cyberpunk-2077-201961217172698_1.jpg"
),
(
    "Star Citizen",
    "Star Citizen es un videojuego de simulación espacial para PC, aunque se desconoce si saldrá en PS4 o Xbox. El juego está siendo desarrollado por el estudio Cloud Imperium Games con su diseñador: Chris Roberts a la cabeza, conocido por ser el creador de los exitosos Wing Commander y Freelancer. 
    Se trata de un videojuego que se presenta como la revolución de los juegos espaciales ya que permitirá explorar una gigantesca galaxia con más de 150 sistemas solares, aterrizar y descubrir planetas 100% explorables y de un tamaño de mapa colosal, combatir en conflictos espaciales, relacionarnos con otros jugadores o hasta descubrir alienígenas u otras formas de vida. En resumen Star Citizen pretende ofrecer todas las posibilidades imaginables para tratar de convertirse en el simulador de vida y exploración espacial definitivo.",
    159.99,
    "https://media.vandal.net/m/20118/star-citizen-201837182459_1.jpg"
),
(
    "Mount & Blade II: Bannerlord",
    "Precuela de la saga Mount and Blade, el nuevo videojuego de acción, rol y diplomacia de TaleWorlds pretende trasladar en PC el mundo medieval de fantasía realista más grande jamás diseñado. Con un nuevo aspecto gráfico en tres dimensiones más detallado y con nuevas opciones de juego, esta segunda parte nos trasladará 200 años antes del original y nos contará la historia de la caída del Imperio Calradian del primer título.",
    429.99,
    "https://media.vandal.net/m/30053/mount-blade-ii-bannerlord-20204315561168_11.jpg"
),
(
    "Blockade 3D",
    "Blockade 3D es un videojuego de acción en primera persona de planteamiento gratuito o free-to-play, en el que el jugador podrá, a través de un planteamiento similar del de Minecraft, construir y destruir a sus rivales y los cubos que se irán distribuyendo por los escenarios. Usando armas reales y futuristas, los usuarios tienen a su disposición múltiples posibilidades en sus combates multijugador.",
    49.99,
    "https://media.vandal.net/m/27754/blockade-3d-20193221040939_10.jpg"
),
(
    "Praey for the Gods",
    "Praey of the Gods es un videojuego de aventura, rol y exploración desarrollado por No Matter Studios en el que deberemos encarnar a un nativo que se tendrá que enfrentar a las inclemencias del tiempo en un entorno hostil, helado y muy peligroso, mientras combate y hace frente a gigantescos seres que son los causantes de un invierno sin final. Financiado a través de Kickstarter, llega a consolas y PC.
    También conocido como Præy for the Gods, Prey for the Gods.",
    639.99,
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcdxgames.com%2Fpraey-for-the-gods%2F&psig=AOvVaw1q1zQ-TMuKtl1O8SQqu-En&ust=1595562925537000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIDs8Zy94uoCFQAAAAAdAAAAABAD"
),
(
    "Biomutant",
    "Biomutant es un título de rol y acción de mundo abierto, con especial énfasis en la exploración y el combate cuerpo a cuerpo. Llevándonos a un universo de ciencia ficción lejano, plagado de planetas selváticos y de climas extremos, en Biomutant encarnaremos a un animal capaz de mutar, añadir habilidades y viajar por distintos escenarios con los más variados vehículos, que irán desde mechas a globos y jetpacks. Colorido y especial, Biomutant es un juego de THQ Nordic y Experiment 101.",
    850.00,
    "https://media.vandal.net/m/51499/biomutant-201922212314718_1.jpg"
),
(
    "The Witcher 3: Wild Hunt ",
    "The Witcher 3 es la tercera entrega de la saga The Witcher desarrollada por CD Projekt para PS4, Xbox One y Pc. Se trata de un videojuego que mezcla elementos de aventura, acción y rol en un mundo abierto épico basado en la fantasía. El jugador controlará una vez más a Geralt de Rivia, el afamado cazador de monstruos, (también conocido como el Lobo Blanco) y se enfrentará a un diversificadísimo bestiario y a unos peligros de unas dimensiones nunca vistas hasta el momento en la serie, mientras recorre los reinos del Norte. Durante su aventura, tendrá que hacer uso de un gran arsenal de armas, armaduras y todo tipo de magias para enfrentarse al que hasta ahora ha sido su mayor desafío, la cacería salvaje. Este videojuego ha sido galardonado como el mejor juego del año 2015 tanto por críticos especializados como por galas de premios como los “Golden Joystick Awards”, “Game Developers Choice Awards” y “The Game Awards”. Además cuenta con 2 DLC o Expansiones: Blood and wine, y Hearts of Stone.",
    1350.50,
    "https://media.vandal.net/m/15596/the-witcher-3-wild-hunt-201551495951_1.jpg"
),
(
    "Grand Theft Auto V",
    "La quinta parte de Grand Theft Auto para PC vuelve a la costa oeste americana, ambientándose en la ciudad de Los Santos (Los Ángeles) y sus alrededores, con una historia ambientada en la actualidad, especialmente en las consecuencias de la crisis económica. Está protagonizada por Michael, Franklin y Trevor, tres criminales con diferentes habilidades, pudiendo cambiar de personaje en todo momento y vivir cada una de sus vidas, así como aprovechar sus habilidades en las misiones.",
    899.99,
    "https://media.vandal.net/m/15192/grand-theft-auto-v-2015413122229_1.jpg"
),
(
    "Star Wars Jedi: Fallen Order",
    "Star Wars Jedi: Fallen Order es un juego de acción y aventura para un jugador en tercera persona que nos trasladará a una época convulsa en la cronología de Star Wars. Desarrollado por EA y Respawn Entertainment, nos invita a encarnar a un Jedi que ha permanecido oculto a la exterminación de su religión tras la Orden 66. Nuestra misión será la de sobrevivir al recién fundado Imperio Galáctico, combatiendo contra los Inquisidores y descubriendo más de la fragmentada y proscrita Orden Jedi.",
    1099.99,
    "https://media.vandal.net/m/61899/star-wars-jedi-fallen-order-20198231284940_1.jpg"
),
(
    "Grand Theft Auto IV",
    "El cuatro Grand Theft Auto y primero de su generación vuelve a Liberty City para contarnos en PC la historia de Niko Belic, un veterano de la Guerra de los Balcanes que llega a América en busca de una nueva vida. Más libertad de movimiento y misiones secundarias, gráficos más realistas, conducción cercana a la simulación, tiroteos con coberturas y un modo de juego online son las principales novedades de GTA 4, que cuenta con dos episodios extra: The Lost and the Damned y The Ballad of Gay Tony.",
    349.99,
    "https://media.vandal.net/m/9322/200891173520_1.jpg"
),
(
    "Doom Eternal",
    "DOOM Eternal es la secuela del éxito de 2016, DOOM. Ahondando de nuevo en las raíces clásicas del género de acción en primera persona, la segunda parte desarrollada por id Software y Bethesda sigue apostando por la guerra sin cuartel contra los demonios en Xbox One, PS4, PC y Nintendo Switch.",
    659.99,
    "https://media.vandal.net/m/61939/doom-eternal-2018618194333_1.jpg"
),
(
    "ARK: Survival Evolved",
    "ARK: Survival Evolved para PC es un nuevo juego de supervivencia y mundo abierto. A lo largo de la aventura tendremos que cazar para sobrevivir, crear objetos, mejorar nuestra tecnología, construir refugios, etcétera. Todo ello mientras exploramos una gigantesca isla repleta de dinosaurios, lo que se perfila como uno de sus mayores atractivos.",
    439.99,
    "https://media.vandal.net/m/30865/ark-survival-evolved-2016109123516_1.jpg"
),
(
    "Red Dead Redemption 2",
    "Red Dead Redemption 2 es la secuela del aclamado Red Dead Redemption de 2010 y tercera parte de la saga Red Dead, que se inició en 2004 con Red Dead Revolver. De nuevo nos lleva al salvaje oeste para proponernos convertirnos en un pistolero forajido en un gran escenario de juego. El título está previsto para Xbox One y PS4.",
    1399.99,
    "https://media.vandal.net/m/42944/red-dead-redemption-2-2019101812583956_1.jpg"
),
(
    "Hollow Knight",
    "Hollow Knight, desarrollado por Team Cherry, ofrecerá una aventura de estilo bidimensional que combinará acción y plataformas en un mundo de fantasía medieval, el reino de Hallownest. Incluirá animaciones hechas con estilo tradicional, retos para el jugador, coleccionables por desbloquear y una banda sonora única.",
    434.29,
    "https://media.vandal.net/m/45493/hollow-knight-201861810941_11.jpg"
),
(
    "Sid Meier's Civilization VI",
    "Sid Meier's Civilization VI es la sexta parte de la aclamada serie de estrategia por turnos Civilization, que vuelve una vez más a retarnos a construir la civilización más poderosa de la Tierra y o bien acabar con las demás o bien llegar de primeros a Alfa Centauri. La gran novedad de esta sexta parte es la presencia de los distritos, áreas que rodean a la ciudad que podremos configurar.",
    534.49,
    "https://media.vandal.net/m/39032/sid-meiers-civilization-vi-2016511172747_1.jpg"
),
(
    "Desperados III",
    "Desperados III es la tercera entrega de la saga de estrategia y acción táctica desarrollada por THQ Nordic y Mimimi Games para PC y consolas. Considerada el ‘Commandos del Oeste’, nos permitirá liderar un grupo de forajidos y cowboys de distinta naturaleza en el Lejano Oeste mientras combatimos contra bandidos y otros peligros en escenarios llenos de detalles.",
    730.25,
    "https://media.vandal.net/m/64561/desperados-iii-202058146619_1.jpg"
),
(
    "No Man's Sky",
    "No Man's Sky es un juego de ciencia ficción y aventura desarrollado por Hello Games. Contará con niveles generados proceduralmente, y nos dejará explorar planetas, océanos, batallas en el espacio y luchar contra depredadores. Cada mundo tendrá su propio ecosistema, con mundos de todo tipo, desde entornos desérticos hasta lugares boscosos.",
    424.99,
    "https://media.vandal.net/m/59242/no-mans-sky-2018725111647_1.jpg"
),
(
    "Forza Horizon 4",
    "Forza Horizon 4 es la cuarta parte de la saga de conducción en mundo abierto de Microsoft y PlayGround Games. Trasladándonos a un enorme mapeado que recrea Reino Unido casi en su totalidad, la nueva entrega apuesta por incluir más coches, más eventos y competiciones, mejorar los gráficos y ofrecer un sistema de estaciones en tiempo real que nos ofrece la posibilidad de pilotar en verano, otoño, invierno y primavera. Está disponible en Xbox One y PC.",
    999.98,
    "https://media.vandal.net/m/59799/forza-horizon-4-2018102103227_1.jpg"
),
(
    "Playerunknown's Battlegrounds",
    "Playerunknown's Battlegrounds, también conocido como PUBG es un videojuego de acción multijugador que nos trasladará a una enorme extensión de terreno en el que el objetivo primario será básico: sobrevivir y matar a nuestros competidores. Enmarcado dentro de la modalidad battle royale, en el juego ganará el último jugador que quede en pie sobre el escenario. Para ello podemos usar cientos de armas que iremos encontrarnos, cooperar con otros jugadores hasta el mismo final o equiparnos con lo que encontremos.",
    349.99,
    "https://media.vandal.net/m/55019/playerunknowns-battlegrounds-mobile-2018322112352_6.jpg"
),
(
    "Minecraft",
    "Minecraft para PC es un juego independiente creado por Markus Persson y el equipo de Mojang que está en constante evolución. Combina mundo abierto y aventuras tanto en modo para un solo jugador como en multijugador, obteniendo recursos en el mundo del juego y construyendo con ellos casas y otras estructuras. Tras su exitosísimo paso por diferentes plataformas, llega ahora a las consolas de Sony.",
    60.99,
    "https://store-images.s-microsoft.com/image/apps.17382.13510798887677013.afcc99fc-bdcc-4b9c-8261-4b2cd93b8845.49beb011-7271-4f15-a78b-422c511871e4"
);

DROP TRIGGER genre_inserts;