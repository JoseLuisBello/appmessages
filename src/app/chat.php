<?php
session_start();
include("con_db.php"); // Conexión a la base de datos

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}

$usuario = $_SESSION['user'];

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

// Consulta para obtener la lista de amigos con solo el nombre de usuario
$sql = "SELECT u.id, u.user 
        FROM amigos a 
        JOIN usuario u ON a.id_user2 = u.id 
        WHERE a.id_user1 = ?";
$stmt = $conex->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$resultado = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mensajes</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background-color: rgb(60, 60, 60);
            color: rgb(63, 63, 63);
        }

        .navbar,
        .list-group-item,
        .card {
            background-color: rgb(127, 127, 127);
            border: none;
        }

        .list-group-item a {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        a {
            color: rgb(0, 0, 0);
        }

        a:hover {
            color: #ffffff;
        }

        .card img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        .profile-header {
            background-color: #343a40;
            color: #fff;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .profile-header img {
            max-width: 120px;
            border-radius: 50%;
            margin-bottom: 20px;
        }

        .profile-header h2 {
            margin-bottom: 10px;
        }

        .post {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }

        .post h5 {
            margin-bottom: 10px;
            font-size: 1.25rem;
        }

        .post p {
            margin-top: 10px;
            font-size: 1.1rem;
        }

        .post img {
            max-width: 100%;
            border-radius: 10px;
            margin-top: 15px;
        }

        .container {
            margin-top: 30px;
        }

        .modal-body {
            background-color: rgb(240, 240, 240);
        }

        .messages {
            margin-top: 30px;
        }

        .message {
            background-color: #495057;
            color: #e9ecef;
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        .message h4 {
            color:rgb(255, 255, 255);
        }

        .search-bar input {
            background-color: #343a40;
            border: 1px solid #495057;
            color: #e9ecef;
        }

        .search-bar button {
            background-color: #b8860b;
            color: #fff;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        }

        .search-bar button:hover {
            background-color:rgb(118, 87, 11);
        }

        .form-control {
            background-color: #343a40;
            border: 1px solid #495057;
            color: #e9ecef;
        }

        .form-control:focus {
            background-color: #495057;
            border-color:rgb(117, 117, 117);
            color: #fff;
        }

        button[type="submit"] {
            background-color: #b8860b;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            color: white;
        }

        button[type="submit"]:hover {
            background-color:rgb(123, 90, 5);
        }
    </style>
    <script>
        // Función para filtrar amigos mientras se escribe en la barra de búsqueda
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('search').addEventListener('input', function() {
                let query = this.value;

                fetch('search_friends.php?q=' + query)
                .then(response => response.json())
                .then(data => {
                    let messagesDiv = document.querySelector('.messages');
                    messagesDiv.innerHTML = '';
                    data.forEach(friend => {
                        let friendDiv = document.createElement('div');
                        friendDiv.classList.add('message');
                        friendDiv.innerHTML = `<h4>${friend.user}</h4>
                            <form action="chat_individual.php" method="GET">
                                <input type="hidden" name="id_amigo" value="${friend.id}">
                                <button type="submit">Ver Chat</button>
                            </form>`;
                        messagesDiv.appendChild(friendDiv);
                    });
                });
            });
        });
    </script>
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <a class="navbar-brand" href="#"><i class="fa fa-comment"></i> Mensajes</a>
            <div class="ms-auto">
                <a href="inicio.php" class="btn btn-outline-light me-2"><i class="fa fa-home"></i> Inicio</a>
                <a href="perfil.php" class="btn btn-outline-light"><i class="fa fa-user"></i> Perfil</a>
                <a href="logout.php" class="btn btn-outline-danger"><i class="fa fa-sign-out-alt"></i> Cerrar Sesión</a>
            </div>
        </nav>
    </header>

    <main class="container">
        <div class="messages">
            <?php while ($amigo = $resultado->fetch_assoc()): ?>
                <div class="message">
                    <h4><?php echo htmlspecialchars($amigo['user']); ?></h4>
                    <form action="chat_individual.php" method="GET">
                        <input type="hidden" name="id_amigo" value="<?php echo $amigo['id']; ?>">
                        <button type="submit">Ver Chat</button>
                    </form>
                </div>
            <?php endwhile; ?>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

<?php
// Cerrar la conexión
$stmt->close();
$conex->close();
?>
