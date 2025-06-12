<?php
session_start();
include("con_db.php"); // Conexión a la base de datos

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}

$usuario = $_SESSION['user'];
$id_chat = isset($_POST['id_chat']) ? $_POST['id_chat'] : null;
$contenido = isset($_POST['contenido']) ? $_POST['contenido'] : null;

// Verificar si el id_chat y el contenido están presentes
if (!$id_chat || !$contenido) {
    echo "Faltan datos.";
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

// Obtener el id del amigo a partir del id_chat
$sql_chat = "SELECT id_user1, id_user2 FROM chats WHERE id_chat = ?";
$stmt_chat = $conex->prepare($sql_chat);
$stmt_chat->bind_param("i", $id_chat);
$stmt_chat->execute();
$result_chat = $stmt_chat->get_result();

if ($result_chat->num_rows === 0) {
    echo "Chat no encontrado.";
    exit();
}

$chat = $result_chat->fetch_assoc();
$id_amigo = ($chat['id_user1'] == $id_usuario) ? $chat['id_user2'] : $chat['id_user1'];

// Insertar el mensaje en la base de datos
$sql_insert_mensaje = "INSERT INTO mensaje (id_chat, id_user, contenido, fecha) VALUES (?, ?, ?, NOW())";
$stmt_insert_mensaje = $conex->prepare($sql_insert_mensaje);
$stmt_insert_mensaje->bind_param("iis", $id_chat, $id_usuario, $contenido);
$stmt_insert_mensaje->execute();

// Redirigir al chat con el amigo
header("Location: chat_individual.php?id_amigo=$id_amigo");
exit();
?>
