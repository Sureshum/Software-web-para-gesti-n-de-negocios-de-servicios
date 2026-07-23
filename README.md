Software-web-para-gestion-de-negocios
LA CONTRASEÑA PARA INGRESAR AL ADMIN ES admin

Una plataforma web diseñada para que pequeños negocios (como talleres, centros técnicos, entre otros) administren sus operaciones diarias de forma centralizada. El sistema opera mediante módulos independientes que permiten gestionar de punta a punta el ciclo del negocio
Tecnologías y Diseño

Frontend: HTML5, JavaScript moderno
Estilos: Tailwind CSS para un diseño responsivo de interfaz oscura y profesional.
Despliegue: Cloudflare Pages 

Características Principales del Código
Navegación Dinámica por Pestañas: Permite alternar mediante el menú lateral entre las vistas de Negocios, Usuarios, Clientes, Inventario y Órdenes de Servicio sin necesidad de recargar la página.

Formularios con Notificaciones: Formularios interactivos para el registro de entidades que integran alertas visuales flotantes de éxito y campos de notas opcionales.
Control de Inventario en Tiempo Real: Las tablas de stock incorporan botones interactivos para incrementar (+), disminuir (-) o fijar cantidades de manera inmediata mediante peticiones PUT.
Gestión de Órdenes y Registros: El panel avanzado permite listar, filtrar por estados (pending, in_progress, completed, cancelled), editar y eliminar registros de forma segura.

Arquitectura de Funcionamiento
Peticiones REST: Utiliza la API Fetch para interactuar con los endpoints del backend, enviando métodos GET, POST, PUT y DELETE.
Renderizado Dinámico: Detecta la entidad activa mediante variables de estado (currentEntity) para construir y actualizar las filas y columnas de las tablas de datos de forma automatizada.

Despliegue Continuo
El repositorio se encuentra vinculado de forma directa con GitHub.

Directorio de salida de compilación: /src/front

Cada actualización enviada a la rama principal mediante git push se despliega de forma automática en Cloudflare Pages.
