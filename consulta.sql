
CREATE DATABASE appmessages;

//crear usuarios
CREATE TABLE IF NOT EXISTS usuarios (   
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,   
  nombre VARCHAR(50) NOT NULL UNIQUE,   
  contrasena VARCHAR(10) NOT NULL UNIQUE,   
  correo VARCHAR(254) NOT NULL UNIQUE,   
  nacionalidad VARCHAR(10) NOT NULL,   
  descripcion TEXT 
  );
//insertar usuarios
INSERT INTO usuarios (nombre, contrasena, correo, nacionalidad, descripcion) VALUES
('Luis Pedro', '12345678', 'diaz040605@gs.utm.mx', 'mx','soy apasionado al gaming y a los bacardi con coca');



// creacion de la tabla de chat
CREATE TABLE IF NOT EXISTS chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_chat INT NOT NULL,
    user1 INT NOT NULL,
    user2 INT NOT NULL,
    FOREIGN KEY (user1) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (user2) REFERENCES usuarios(id_usuario)
);
//insertar chats
INSERT INTO chats (id,user1, user2) VALUES
(1,1,2);

//creacion de la tabla mensaje
CREATE TABLE IF NOT EXISTS mensaje(
  id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
  id_chat INT NOT NULL,
  id_emisor INT NOT NULL,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_emisor) REFERENCES usuarios(id_usuario)
  );