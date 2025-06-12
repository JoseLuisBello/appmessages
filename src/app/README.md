# Red-Social
Este es un proyecto realizado con los lenguajes JS (JavaScript), PHP (Hypertext Pre-Processor), y SQL (Structured Query Lenguage), usando apoyo de CSS, Bootstrap, HTML para
una visualización de los aspectos de la pagina web.

Este codigo se creo teniendo en mente y siendo inspirados en las redes sociales Instagram y X (Twitter antes)
partiendo de esto se crearon como primera instancia archivos .html, los cuales se usaron como la base de este
proyecto.

![image](https://github.com/user-attachments/assets/f8c73a3e-f972-4d47-85aa-1f0ccc87f25b)

Despues de esto se comenzo la realizacion de la conexion a la base de datos mediante PHP creando un archivo .php
este programa es la conexion.

Esta es una de muchas ideas de como realizar una conexion a una base de datos:

    <?php
    $conex = mysqli_connect("localhost","root","","redsocial");
    ?>

Otra idea para una conexion es esta.

    <?php
    $host = "localhost";
    $dbname = "database";
    $user = "root";
    $password = "root";
    
    try{
        $pdo = PDO("mysql:host=$host;dbname=$dbname", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
        die("Error en la conexion ". $e->getMessage());
    }
    ?>

A demas de generar codigos, ocupamos bootstrap, los cuales se muestran a continuacion.\
Aqui se muestra el link para bootstrap que ayuda en los estilos para las paginas.\
https://getbootstrap.com/docs/5.3/getting-started/download/ \
Aqui se muestra el link para utilizar iconos de bootstrap en las paginas.\
https://icons.getbootstrap.com/

Dicho comparto todos nuestros codigos para que puedan apoyarse para el desarrolo de una aplicacion y puede crecer aun mas.\
Podemos comenzar a mostrar el funcionamiento de nuestra version de una red social.\
La red social tiene dos formas de ingresar al inicio las cuales son las siguientes\

Recuerda que cada uno de los archivos debe siempre contener la conexion a la base de datos para evitar errores, toma como ejemplo el siguiente codigo para ser adaptado.

    <?php
    session_start();
    include("con_db.php");
    ?>

1.- El registro de un nuevo Usuario.

![image](https://github.com/user-attachments/assets/c2b0bd15-158e-4cb9-b171-b0d04fdc4aff)
Para este codigo se realizo el codigo llamado index2.php el cual ya se encuentra subido en este repositorio.\
2.- Esta parte es donde se configura el resto del perfil.

![image](https://github.com/user-attachments/assets/9012a45b-8a03-4d40-a49c-c7b1c4261aaf)

3.- El ingrespo mediante inicio de sesion.

![image](https://github.com/user-attachments/assets/994359d3-d1a1-448a-b4ed-48369007a477)

despues de esto, ingresamos al inicio de la aplicacion la cual es el Home donde se visualizan todas las publicaciones de los usuarios en la base de datos:

![image](https://github.com/user-attachments/assets/76570bff-e141-4cd9-8cfc-e99dccb01af2)

El perfil de cada usuario se ve de esta manera.

![image](https://github.com/user-attachments/assets/31822015-98a2-4c47-ab1d-13de525ea41e)

El recuadro dorado es un boton el cual permite crear una nueva publicacion, al precionarlo se ve de la siguiente manera.

![image](https://github.com/user-attachments/assets/46d3ad54-7e20-4264-9c9d-56b3dbb8bdd4)

Al regresar al inicio de la pagina web, y entrar a la opcion "personas que quizas conozcas" se muestra lo siguiente.\
Que aqui se muestran los usuarios que estan creados en la base de datos y no son tus amigos.

![image](https://github.com/user-attachments/assets/22e851e8-ea42-4c97-b3d9-1752cb927f20)

Esta parte permite agregar a un nuevo amigo al usuario logeado en ese momento.

Por otro lado al precionar la opcion "Amigos", muestra a los amigos del usuario logeado en ese momento.

![image](https://github.com/user-attachments/assets/bc5b87ab-5ebb-4db1-b41a-c93ab484acbb)

Aqui tambien da la opcion de poder eliminar a uno de los amigos que se tienen.

Por otro lado al ingresar a la opcion de "Mensajes", muestra los chats disponibles con los amigos que se tienen.

![image](https://github.com/user-attachments/assets/a2a642c3-00a7-4419-a335-25867ea337be)

Al ingresar en cualquiera de los chats disponibles se muestra lo siguiente si es que existe convensarcion, es decir se precargan los mensajes anteriores.

![image](https://github.com/user-attachments/assets/c824b3d0-d8f3-4623-ac51-ecb63bd7aa34)

Cuando no existen conversacion anterior se visualiza de la siguiente manera.

![image](https://github.com/user-attachments/assets/2a39abcd-ff65-41cc-9d56-ad4782f5763c)

AL precionar la opcion de cerrar sesion te redirige al regitro de un nuevo usuario.

![image](https://github.com/user-attachments/assets/f3d3a1e6-1fa1-4bd2-8531-ff3d9c502a90)

![image](https://github.com/user-attachments/assets/d4e2f31b-d521-4eb3-a281-46f49d11e7a8)









