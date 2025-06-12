<?php
include("con_db.php");
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}

$user = $_SESSION['user'];

// Eliminar amigo si se presionó el botón
if (isset($_POST['eliminar_amigo'])) {
    $amigo_a_eliminar = mysqli_real_escape_string($conex, $_POST['amigo']);
    
    // Obtener el id del usuario actual
    $id_user = mysqli_fetch_assoc(mysqli_query($conex, "SELECT id FROM usuario WHERE user = '$user'"))['id'];
    
    // Obtener el id del amigo
    $id_amigo = mysqli_fetch_assoc(mysqli_query($conex, "SELECT id FROM usuario WHERE user = '$amigo_a_eliminar'"))['id'];
    
    // Eliminar relación de amistad bidireccional
    $eliminar_amigo = "DELETE FROM amigos WHERE (id_user1 = $id_user AND id_user2 = $id_amigo) OR (id_user1 = $id_amigo AND id_user2 = $id_user)";
    if (mysqli_query($conex, $eliminar_amigo)) {
        echo "<script>alert('Amigo eliminado correctamente');</script>";
    } else {
        echo "<script>alert('Hubo un error al eliminar al amigo');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amigos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background-color: rgb(60, 60, 60);
            color: #e0e0e0;
        }

        .navbar, .list-group-item, .card {
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

        .container {
            margin-top: 30px;
        }

        .amigo {
            background-color: rgb(50, 50, 50);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .amigo h3 {
            font-size: 1.5em;
        }

        .amigo button {
            background-color: #b8860b;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }

        .amigo button:hover {
            background-color:rgb(128, 94, 8);
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <a class="navbar-brand" href="#"><i class="fa fa-users"></i> Mis Amigos</a>
        <div class="ms-auto">
            <a href="inicio.php" class="btn btn-outline-light me-2"><i class="fa fa-home"></i> Inicio</a>
            <a href="perfil.php" class="btn btn-outline-light me-2"><i class="fa fa-user"></i> Perfil</a>
            <a href="logout.php" class="btn btn-outline-danger"><i class="fa fa-sign-out-alt"></i> Cerrar Sesión</a>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <aside class="col-md-3 mb-4">
                <ul class="list-group">
                    <li class="list-group-item">
                        <a href="personas_no_amigos.php"><i class="fa fa-user-friends"></i> Personas que quizás conozcas</a>
                    </li>
                    <li class="list-group-item">
                        <a href="amigo.php"><i class="fa fa-users"></i> Amigos</a>
                    </li>
                    <li class="list-group-item">
                        <a href="chat.php"><i class="fa fa-comments"></i> Mensajes</a>
                    </li>
                    <li class="list-group-item">
                        <a href="#"><i class="fa fa-bell"></i> Notificaciones</a>
                    </li>
                </ul>
            </aside>

            <section class="col-md-9">
                <h2 class="mb-4">Amigos</h2>
                <?php
                $consulta = "SELECT usuario.user FROM usuario INNER JOIN amigos ON usuario.id = amigos.id_user2 WHERE amigos.id_user1 = (SELECT id FROM usuario WHERE user = '" . mysqli_real_escape_string($conex, $user) . "')";
                $resultado = mysqli_query($conex, $consulta);

                if ($resultado && mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_assoc($resultado)) {
                        $nombre = htmlspecialchars($fila['user']);
                ?>
                        <div class="amigo">
                            <h3><i class="fa fa-user"></i> <?php echo $nombre; ?></h3>
                            <form method="POST" action="">
                                <input type="hidden" name="amigo" value="<?php echo $nombre; ?>">
                                <button type="submit" name="eliminar_amigo" class="btn btn-danger">Eliminar Amigo</button>
                            </form>
                        </div>
                <?php
                    }
                } else {
                    echo "<p class='text-center'>No tienes amigos aún.</p>";
                }
                ?>
            </section>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
