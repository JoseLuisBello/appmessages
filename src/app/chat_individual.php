<?php
session_start();
include("con_db.php"); // Conexión a la base de datos

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}

$usuario = $_SESSION['user'];
$id_amigo = isset($_GET['id_amigo']) ? $_GET['id_amigo'] : null;

// Verificar si se ha proporcionado un ID de amigo válido
if (!$id_amigo) {
    echo "Amigo no válido.";
    exit();
}

// Obtener el id del usuario basado en su nombre de usuario
$sql_usuario = "SELECT id FROM usuario WHERE user = ?";
$stmt_usuario = $conex->prepare($sql_usuario);
$stmt_usuario->bind_param("s", $usuario);
$stmt_usuario->execute();
$result_usuario = $stmt_usuario->get_result();

if ($result_usuario->num_rows === 0) {
    echo "Usuario no encontrado.";
    exit();
}

$id_usuario = $result_usuario->fetch_assoc()['id'];

// Obtener el chat entre los dos usuarios (si existe)
$sql_chat = "SELECT id_chat FROM chats WHERE (id_user1 = ? AND id_user2 = ?) OR (id_user1 = ? AND id_user2 = ?)";
$stmt_chat = $conex->prepare($sql_chat);
$stmt_chat->bind_param("iiii", $id_usuario, $id_amigo, $id_amigo, $id_usuario);
$stmt_chat->execute();
$result_chat = $stmt_chat->get_result();

if ($result_chat->num_rows > 0) {
    $chat = $result_chat->fetch_assoc();
    $id_chat = $chat['id_chat'];
} else {
    // Si no existe el chat, lo creamos
    $sql_create_chat = "INSERT INTO chats (id_user1, id_user2) VALUES (?, ?)";
    $stmt_create_chat = $conex->prepare($sql_create_chat);
    $stmt_create_chat->bind_param("ii", $id_usuario, $id_amigo);
    $stmt_create_chat->execute();
    $id_chat = $conex->insert_id;  // Obtener el ID del chat recién creado
}

// Obtener los mensajes del chat
$sql_mensajes = "SELECT m.contenido, m.fecha, u.user 
                 FROM mensaje m 
                 JOIN usuario u ON m.id_user = u.id
                 WHERE m.id_chat = ? 
                 ORDER BY m.fecha ASC";
$stmt_mensajes = $conex->prepare($sql_mensajes);
$stmt_mensajes->bind_param("i", $id_chat);
$stmt_mensajes->execute();
$result_mensajes = $stmt_mensajes->get_result();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat con <?php echo htmlspecialchars($usuario); ?></title>
    <!-- Agregar Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./Estilos/estilos4.css">
    <style>
        body {
            background-color: #1f1f1f;
            color: #f5f5f5;
            font-family: 'Arial', sans-serif;
        }

        .navbar {
            background-color: #2e2e2e;
            border-bottom: 1px solid #444;
        }

        .navbar a {
            color: #f5f5f5;
            font-size: 1.2rem;
            text-decoration: none;
        }

        .navbar a:hover {
            color: #fff;
        }

        .navbar .btn {
            background-color: #b8860b;
            color: #fff;
        }

        .navbar .btn:hover {
            background-color:rgb(138, 102, 12);
        }

        .messages {
            margin-top: 30px;
        }

        .message {
            background-color: #333;
            color: #e1e1e1;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .message h4 {
            font-size: 1.3rem;
            margin-bottom: 10px;
        }

        .message button {
            background-color: #b8860b;
            color: #fff;
            border: none;
            padding: 8px 15px;
            cursor: pointer;
            border-radius: 5px;
        }

        .message button:hover {
            background-color:rgb(143, 106, 13);
        }

        .search-bar input {
            background-color: #444;
            border: 1px solid #555;
            color: #f5f5f5;
            padding: 8px;
            width: 80%;
        }

        .search-bar button {
            background-color: #b8860b;
            color: #fff;
            border: none;
            padding: 8px 15px;
            cursor: pointer;
            border-radius: 5px;
        }

        .search-bar button:hover {
            background-color:rgb(148, 108, 7);
        }

        .form-control {
            background-color: #444;
            border: 1px solid #555;
            color: #f5f5f5;
        }

        .form-control:focus {
            background-color: #555;
            border-color:rgb(222, 91, 91);
        }

        button[type="submit"] {
            background-color: #b8860b;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        button[type="submit"]:hover {
            background-color:rgb(148, 108, 7);
        }

        .profile-header {
            background-color: #343a40;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .profile-header h2 {
            margin-bottom: 10px;
        }

        .profile-header img {
            max-width: 120px;
            border-radius: 50%;
            margin-bottom: 20px;
        }

        .message.right {
            background-color: #333;
            color: #e1e1e1;
            text-align: right;
        }

        .message.left {
            background-color: #333;
            color: #e1e1e1;
            text-align: left;
        }

        .user {
            font-weight: bold;
            color:rgb(207, 152, 14);
        }
    </style>
</head>
<body>

    <header>
        <h1 class="text-center text-white">Chat con <?php echo htmlspecialchars($usuario); ?></h1>
        <nav class="text-center">
            <a href="inicio.php">Inicio</a>
            <a href="perfil.php">Perfil</a>
            <a href="chat.php">Mensajes</a>
            <a href="#">Notificaciones</a>
            <a href="logout.php">Cerrar Sesión</a>
        </nav>
    </header>

    <main class="container mt-5">
        <div class="chat-container">
            <div class="messages">
                <?php while ($mensaje = $result_mensajes->fetch_assoc()): ?>
                    <div class="message <?php echo $mensaje['user'] == $usuario ? 'right' : 'left'; ?>">
                        <p>
                            <?php if ($mensaje['user'] == $usuario): ?>
                                <span class="user">Yo:</span>
                            <?php else: ?>
                                <span class="user"><?php echo htmlspecialchars($mensaje['user']); ?>:</span>
                            <?php endif; ?>
                            <?php echo nl2br(htmlspecialchars($mensaje['contenido'])); ?>
                        </p>
                        <small><?php echo $mensaje['fecha']; ?></small>
                    </div>
                <?php endwhile; ?>
            </div>

            <form action="enviar_mensaje.php" method="POST">
                <input type="hidden" name="id_chat" value="<?php echo $id_chat; ?>">
                <div class="mb-3">
                    <textarea name="contenido" class="form-control" rows="4" placeholder="Escribe tu mensaje..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
        </div>
    </main>

    <!-- Agregar Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
</body>
</html>

<?php
// Cerrar la conexión
$stmt_usuario->close();
$stmt_chat->close();
$stmt_mensajes->close();
$conex->close();
?>
