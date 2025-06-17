
CREATE DATABASE appmessages;

//crear usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(10) NOT NULL UNIQUE,
  correo VARCHAR(254) NOT NULL UNIQUE,
  rol INT NOT NULL
);

//insertar usuarios
INSERT INTO usuarios (nombre, contrasena, correo, rol) VALUES 
('Luis Pedro', '12345678', 'diaz040605@gs.utm.mx', 3),
('Jose Luis', '159753123', 'rablo102516@gs.utm.mx', 1),
('Abdiel Cervantes', '789456123', 'cera131516@gs.utm.mx', 2);

//creacion de preguntas
CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  materia VARCHAR(30),          -- 'bd', 'web', 'so'
  tipo VARCHAR(20),             -- 'abierta' o 'opcion'
  pregunta TEXT NOT NULL
);

//creacion de tabla respuestas_abiertas
CREATE TABLE respuestas_abiertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pregunta INT NOT NULL,
  respuesta TEXT NOT NULL,
  FOREIGN KEY (id_pregunta) REFERENCES preguntas(id) ON DELETE CASCADE
);

//creacion de tabla respuestas_opciones
CREATE TABLE respuestas_opciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pregunta INT NOT NULL,
  opcion TEXT NOT NULL,
  respuesta INT NOT NULL,
  FOREIGN KEY (id_pregunta) REFERENCES preguntas(id) ON DELETE CASCADE
);

//insercion de preguntas
INSERT INTO preguntas (materia, tipo, pregunta) VALUES 
('bd', 'opcion', '¿Cuál es la función principal de una clave primaria en una tabla?'),
('bd', 'opcion', '¿Qué comando SQL se usa para eliminar una tabla completa?'),
('bd', 'opcion', '¿Qué tipo de relación se representa entre una tabla Clientes y una tabla Pedidos?'),
('bd', 'opcion', '¿Cuál es el tipo de dato más adecuado para almacenar un correo electrónico?'),
('bd', 'opcion', '¿Qué hace la cláusula WHERE en SQL?'),
('bd', 'opcion', '¿Qué significa NULL en una base de datos?'),
('bd', 'opcion', '¿Cuál es la diferencia entre DELETE y TRUNCATE?'),
('bd', 'opcion', '¿Qué comando se usa para mostrar todas las bases de datos?'),
('bd', 'opcion', '¿Qué significa la normalización en bases de datos?'),
('bd', 'opcion', '¿Qué es una clave foránea (foreign key)?'),
('bd', 'abierta', 'Escribe una consulta SQL que devuelva solo los correos electrónicos de la tabla clientes.'),
('bd', 'abierta', '¿Cómo defines una columna id como clave primaria al crear una tabla llamada productos?'),
('bd', 'abierta', '¿Qué instrucción SQL usarías para cambiar el tipo de dato de la columna telefono a VARCHAR(15) en la tabla empleados?'),
('bd', 'abierta', '¿Cuál es la diferencia práctica entre VARCHAR(100) y CHAR(100) en términos de almacenamiento?'),
('bd', 'abierta', '¿Cómo se define una clave foránea que conecte la columna id_cliente en la tabla pedidos con la columna id en la tabla clientes?'),
('web', 'opcion', '¿Cuál de estos es un lenguaje de marcado usado para estructurar contenido web?'),
('web', 'opcion', '¿Qué hace CSS en una página web?'),
('web', 'opcion', '¿Qué función tiene JavaScript en la web?'),
('web', 'opcion', '¿Cuál es el rol de un servidor web?'),
('web', 'opcion', '¿Qué significa HTTP?'),
('web', 'opcion', '¿Qué etiqueta HTML se usa para crear un enlace?'),
('web', 'opcion', '¿Qué significa el atributo action en un formulario HTML?'),
('web', 'opcion', '¿Qué hace npm en proyectos web?'),
('web', 'opcion', '¿Cuál es una buena práctica en desarrollo web?'),
('web', 'opcion', '¿Qué hace responsive design?'),
('web', 'abierta', '¿Qué etiqueta HTML utilizarías para insertar un video en una página web?'),
('web', 'abierta', '¿Qué diferencia hay entre las etiquetas <input type="radio"> y <input type="checkbox">?'),
('web', 'abierta', '¿Cómo se define un formulario en HTML que envía datos por método POST al archivo procesar.php?'),
('web', 'abierta', '¿Para qué se utiliza fetch() en JavaScript moderno?'),
('web', 'abierta', '¿Qué propiedad CSS usarías para centrar un elemento horizontalmente con margin?'),
('so', 'opcion', ' ¿Cuál es la función principal de un sistema operativo?'),
('so', 'opcion', '¿Qué sistema operativo es basado en UNIX?'),
('so', 'opcion', '¿Qué es un proceso en un sistema operativo?'),
('so', 'opcion', '¿Cuál es el objetivo de la memoria virtual?'),
('so', 'opcion', '¿Qué comando en Linux muestra el contenido de un directorio?'),
('so', 'opcion', '¿Qué es un sistema de archivos?'),
('so', 'opcion', '¿Cuál de los siguientes NO es un sistema operativo?'),
('so', 'opcion', '¿Qué comando en Windows muestra la configuración de red?'),
('so', 'opcion', '¿Qué es una interrupción en sistemas operativos?'),
('so', 'opcion', '¿Qué tipo de sistema permite que varios usuarios trabajen simultáneamente?'),
('so', 'abierta', '¿Qué comando de Linux usarías para ver cuánta memoria RAM está en uso?'),
('so', 'abierta', '¿Qué significa que un proceso esté en estado "zombie"?'),
('so', 'abierta', '¿Qué archivo en Linux contiene información sobre los usuarios del sistema?'),
('so', 'abierta', '¿Qué utilidad tiene el comando top en sistemas Unix/Linux?'),
('so', 'abierta', '¿Qué hace el comando kill -9 1234 en Linux?');

//insercion de respuestas_opciones
INSERT INTO respuestas_opciones (id_pregunta, opcion, respuesta) VALUES
(1, 'Eliminar duplicados', 0),
(1, 'Ordenar los registros', 0),
(1, 'Identificar de forma única cada fila', 1),
(1, 'Crear índices', 0),
(2, 'REMOVE TABLE', 0),
(2, 'DELETE TABLE', 0),
(2, 'ERASE TABLE', 0),
(2, 'DROP TABLE', 1),
(3, 'Uno a muchos', 1),
(3, 'Muchos a uno', 0),
(3, 'Uno a uno', 0),
(3, 'Muchos a muchos', 0),
(4, 'TEXT', 0),
(4, 'VARCHAR', 1),
(4, 'INT', 0),
(4, 'EMAIL', 0),
(5, 'Agrupa resultados', 0),
(5, 'Filtra registros', 1),
(5, 'Ordena registros', 0),
(5, 'Crea tablas', 0),
(6, '0', 0),
(6, 'Valor desconocido o inexistente', 1),
(6, 'Cadena vacía', 0),
(6, 'Error', 0),
(7, 'DELETE es más rápido', 0),
(7, 'TRUNCATE no se puede deshacer', 1),
(7, 'TRUNCATE elimina filas una por una', 0),
(7, 'No hay diferencia', 0),
(8, 'SHOW TABLES', 0),
(8, 'LIST DATABASES', 0),
(8, 'SHOW DATABASES', 1),
(8, 'SELECT DATABASES', 0),
(9, 'Redundancia intencional', 0),
(9, 'Optimización de queries', 0),
(9, 'Eliminación de datos duplicados', 1),
(9, 'Encriptación de datos', 0),
(10, 'Una clave duplicada', 0),
(10, 'Una clave externa que vincula tablas', 1),
(10, 'Una clave de índice', 0),
(10, 'Una clave automática', 0),
(16, 'JavaScript', 0),
(16, 'PHP', 0),
(16, 'HTML', 1),
(16, 'CSS', 0),
(17, 'Agrega interactividad', 0),
(17, 'Conecta con bases de datos', 0),
(17, 'Da estilo visual', 1),
(17, 'Compila código', 0),
(18, 'Controlar servidores', 0),
(18, 'Crear animaciones e interactividad', 1),
(18, 'Aplicar estilos', 0),
(18, 'Administrar bases de datos', 0),
(19, 'Ejecutar scripts SQL', 0),
(19, 'Alojamiento de aplicaciones web', 1),
(19, 'Renderizar HTML', 0),
(19, 'Comprimir archivos', 0),
(20, 'HyperText Transfer Protocol', 1),
(20, 'HyperTool Transfer Process', 0),
(20, 'HighText Transfer Program', 0),
(20, 'Hosting Transfer Template', 0),
(21, '<link>', 0),
(21, '<a>', 1),
(21, '<href>', 0),
(21, '<url>', 0),
(22, 'Indica la función JavaScript a ejecutar', 0),
(22, 'Define la URL a la que se envía el formulario', 1),
(22, 'Especifica el método HTTP', 0),
(22, 'Valida los datos', 0),
(23, 'Administra paquetes y dependencias', 1),
(23, 'Compila HTML', 0),
(23, 'Conecta con bases de datos', 0),
(23, 'Minifica imágenes', 0),
(24, 'Escribir todo en un archivo', 0),
(24, 'Usar contraseñas en texto plano', 0),
(24, 'Separar HTML, CSS y JavaScript', 1),
(24, 'Deshabilitar validación', 0),
(25, 'Mejora el rendimiento', 0),
(25, 'Ajusta el sitio a distintos dispositivos', 1),
(25, 'Agrega seguridad', 0),
(25, 'Minimiza recursos', 0),
(31, 'Ejecutar aplicaciones directamente', 0),
(31, 'Gestionar hardware y recursos del sistema', 1),
(31, 'Compilar código', 0),
(31, 'Crear páginas web', 0),
(32, 'Windows', 0),
(32, 'Android', 0),
(32, 'Linux', 1),
(32, 'MS-DOS', 0),
(33, 'Un hilo de ejecución', 0),
(33, 'Un programa en ejecución', 1),
(33, 'Una carpeta del sistema', 0),
(33, 'Un virus', 0),
(34, 'Aumentar el espacio en disco', 0),
(34, 'Ejecutar más procesos que la RAM disponible', 1),
(34, 'Guardar archivos ocultos', 0),
(34, 'Ejecutar código Java', 0),
(35, 'show', 0),
(35, 'ls', 1),
(35, 'view', 0),
(35, 'dirlist', 0),
(36, 'Un tipo de virus', 0),
(36, 'La forma en que se organizan los datos en disco', 1),
(36, 'Un programa', 0),
(36, 'Un archivo comprimido', 0),
(37, 'Ubuntu', 0),
(37, 'macOS', 0),
(37, 'Python', 1),
(37, 'Windows', 0),
(38, 'ping', 0),
(38, 'ifconfig', 0),
(38, 'netstat', 0),
(38, 'ipconfig', 1),
(39, 'Una desconexión de red', 0),
(39, 'Una señal para detener el sistema', 0),
(39, 'Una señal al CPU para atender un evento', 1),
(39, 'Una pausa en el software', 0),
(40, 'Monousuario', 0),
(40, 'Tiempo real', 0),
(40, 'Multiusuario', 1),
(40, 'Monotarea', 0);

//insercion de respuestas_abiertas
INSERT INTO respuestas_abiertas (id_pregunta, respuesta) VALUES
(11, 'SELECT correo FROM clientes;'),
(12, 'CREATE TABLE productos (id INT PRIMARY KEY);'),
(13, 'ALTER TABLE empleados MODIFY telefono VARCHAR(15);'),
(14, 'VARCHAR(100) almacena solo los caracteres usados más un byte adicional, mientras que CHAR(100) reserva siempre 100 caracteres, aunque no se usen.'),
(15, 'FOREIGN KEY (id_cliente) REFERENCES clientes(id);'),
(26, '<video src="ruta/del/video.mp4" controls></video>'),
(27, 'La etiqueta <input type="radio"> permite seleccionar solo una opción de un grupo, mientras que <input type="checkbox"> permite seleccionar múltiples opciones.'),
(28, '<form action="procesar.php" method="POST">...</form>'),
(29, 'Se utiliza fetch() para hacer peticiones HTTP asincrónicas y obtener datos de servidores, generalmente en formato JSON.'),
(30, 'margin: 0 auto;'),
(41, 'free -h'),
(42, 'Un proceso "zombie" es uno que ha terminado su ejecución pero aún conserva una entrada en la tabla de procesos porque su padre no ha leído su estado de salida.'),
(43, '/etc/passwd'),
(44, 'El comando top muestra en tiempo real los procesos en ejecución, el uso de CPU, memoria y otros recursos del sistema.'),
(45, 'El comando kill -9 1234 fuerza la terminación inmediata del proceso con ID 1234 enviándole la señal SIGKILL.');


CREATE TABLE resultados_examenes (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  id_alumno INT, 
  materia VARCHAR(30), 
  calificacion DECIMAL(5,2), 
  fecha_examen DATETIME DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE respuestas_alumno (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  id_resultado_examen INT, 
  id_pregunta INT, 
  respuesta_usuario TEXT, 
  FOREIGN KEY (id_resultado_examen) REFERENCES resultados_examenes(id) ON DELETE CASCADE);




  CREATE TABLE resultados_examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    materia VARCHAR(30) NOT NULL,
    calificacion DECIMAL(5,2) NOT NULL,
    respuestas_json JSON, -- Guarda las respuestas del alumno a todas las preguntas como un JSON
    fecha_examen DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Opcional: Si tienes una tabla 'usuarios' donde guardas los alumnos
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);