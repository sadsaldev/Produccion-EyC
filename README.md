Este repositorio contiene diferentes versiones de un mismo proyecto denominado Análisis de Producción EyC.

La propuesta de construcción de este aplicativo surgió a partir de una necesidad presentada en la empresa E&C Ingeniería S.A.S. Al ser una empresa ubicada en la industria del gas, desde el área admnistrativa se manejan conjuntos robustos de datos en relación a las inspecciones de gas que se realizan en las viviendas del área metropolitana de las ciudades, veredas, municipios y corregimientos que la empresa cubre. Entonces por esa necesidad de simplificar y facilitar la visualización de los datos, se realizó la solicitud para gestionar la creación de un aplicativo web que le permita al usuario ver de forma muy sencilla, eficaz e interactiva las inspecciones 100% efectivas las cuales son determinadas según las condiciones de la empresa, llamándolas así "Producción" ya que son las tareas que más aportan a la efectividad de la empresa, por lo que es de vital importancia acceder a estos datos en diferentes momentos del día para poder evaluar el desempeño de cada sucursal e inspector.

Versiones:
- Produccion-EyC-1.0: La primera versión del proyecto se comenzó a construir en febrero de 2024, esta versión solo incluye la sección de "Consultas" que es donde el usuario puede completar el formulario con el rango de fecha y la sucursal de la cual desea ver la Producción, puede ver el contenido de dos formas: en una tabla HTML general o en un "Acordeón" donde se agrupan las inspecciones por inspector, esto sirve para evaluar la producción de cada inspector por separado y determinar quién suele ser más productivo, quien no, entre demás estadísticas. Además permite al usuario exportar en formato de Hoja de Cálculo de Excel los datos con las inspecciones efectivas. 

Esta versión usa PHP como tecnología principal. Se conecta a la base de datos, realiza las consultas, genera el contenido HTML dinámico con los datos de esa consulta y lo retorna. Además se utiliza la librería PHPSpreadsheet para escribir el código de la creación de la hoja de cálculo con los datos de las inspecciones.
JavaScript con jQuery también juega un papel muy importante. Se usa para realizar llamadas AJAX al backend en base a eventos submit, onclick, etc. Para enviar los datos necesarios al servidor y luego gestionar la respuesta de este según el tipo de contenido que sea devuelto. 

- Produccion-EyC-2.0: Esta versión es más robusta pues hace referencia a un aplicativo completo y no el modelo de una sola sección a diferencia de la primera versión. Esta es más formalizada, tiene un diseño e interfaz agradable y amigable para el usuario, cuenta con dos temas, claro y oscuro. Además contiene más secciones: Inicio, Consultas, Tablero BI, Log In, Sign Up y Perfil cuando ya inició sesión.

  - Inicio: Página principal. Contiene el título, nombre de la empresa y decoración
  - Consultas: Contiene dos subsecciones:
      - Consultar Inspecciones Efectivas: Esta subsección le permite al usuario ver las inspecciones efectivas cuando envíe el formulario, se mantuvo la misma lógica de la primera versión para esta sección, lo que              cambió fue el diseño.
      - Generar Comité Redes Nueas: Esta subsección hace referencia a otra tarea que la empresa solicitó automatizar, pero para el tiempo de construcción de esta versión, solo se realizó la interfaz.
  - Tablero BI: En esta sección el usuario podrá ver el Tablero de PowerBI creado por la empresa para ver los datos de producción de forma más gráfica e ilustrativa, datos los cuales son consistentes y coinciden con       lo mostrado en la sección de Consultar Inspecciones Efectivas
  - Log In: Formulario de inicio de sesión.
  - Sign Up: Formulario de registro.
  - Perfil: Cuando se inicia sesión ahora el usuario podrá acceder a las funcionalidades de la sección de Consultas y de Tablero BI. Además puede ver su perfil, puede modificar su nombre de usuario o contraseña.           Además si el usuario es administrador, puede acceder al panel de administración el cual es un listado de todos los usuarios que se han registrado, desde allí puede activar/desactivar o eliminar las cuentas.

Esta versión estableció la propuesta de construcción de un aplicativo web completo cambiando por completo el diseño el cual fue aprobado por la empresa. Entonces lo que se trabajó en la primera versión, se incluyó aquí para la subsección de Consultas. 
Debido al crecimiento del proyecto, se utilizaron nuevas tecnologías y se optimizaron procesos de las tecnologías que ya se habían usado anteriormente. Se siguió usando PHP para las sesiones, consultas y construcción de HTML. Además, con Node.js se creó un server proxy para centralizar las solicitudes entre el frontend y el backend y manejar de mejor forma las respuestas. Por lo que en el frontend se siguió utilizando JavaScript y jQuery para las AJAX calls y la manipulación del DOM. Por último, se utilizó webpack para empaquetar el proyecto.

- Produccion-EyC-3.0: Esta es la última versión trabajada del aplicativo hasta la fecha y por ende la más óptima, rápida y completa. Se mejoró en un 90% en base a lo que hizo en la versión anterior, se mantuvieron las mismas secciones, estructuras y diseño que en un principio fueron las planeadas, pero se mejoró significativamente la lógica, se aplicaron mejores prácticas y se utilizaron tecnologías más apropiadas para ciertos procesos delegando las responsabilidades de mejor manera.

A diferencia de las versiones anteriores en donde PHP a pesar de ser originalmente un lenguaje optimizado para backend, se estaban creando en él funciones propias de frontend. Y como en este ya se tenía a JavaScript, pues se decidió separar estas responsabilidades para mantener una estructura ordenada y coherente en el proyecto. Se implementó React completamente para el frontend aplicando rutas de SPA, lo cual ayudó a la optimización y rápida renderización de los elementos UI. Por lo que siguió usando PHP pero exclusivamente para tareas propias de backend, como recopilar datos de consultas a las bases de datos y devolviendolos en objetos JSON, datos de sesiones de usuario, validaciones, códigos para crear hojas de cálculo, etc. 

Además de esta mejora de lógica, migración a React para evitar usar jQuery y no tener que manipular tanto el DOM, se mejoró lo que ya se había hecho con Node.js en la versión anterior. Se crearon diferentes rutas en el servidor proxy de acuerdo a la petición que se realizó, como por ejemplo "/user" para acciones de Usuario, "/queries" para acciones de Consultas, "/admin" para acciones de administrador, etc. Aportando mayor organización a la estructura de este servidor y una buena centralización entre los datos que se reciben y se envian. Además se pudo implementar un sistema básico de caché para las inspecciones efectivas ya que suele ser el conjunto de datos más grande que se obtiene, entonces para evitar sobrecargas o llamadas constantes al servidor para consultar estos datos uan y otra vez, se cachean de acuerdo a la fecha. 

Por último, en la versión anterior quedó pendiente construir la lógica para la subsección de Consultas denominada "Generar Comité Redes Nuevas" la cual fue pedida por la empresa para automatizar una tarea que se realiza a diario. Básicamente consiste en que el usuario ingrese una serie de números de contrato junto con su número de solicitud (cada contrato hace referencia a una vivienda la cual tiene un contrato adjudicado a la empresa) para consultar qué inspecciones (en general, no solo efectivas) hay relacionadas a esos contratos en base a la fecha especificada por el usuario. Permitiéndole ver esta información en la interfaz con una tabla detallada y conteos especificos para ciertos criterios pedidos por la empresa y también exportar esta misma información en formato de Hoja de Cálculo de Excel. 

Esta versión aporta mucha más organización y mejor repartición de las responsabilidades de cada tecnología implementada para evitar problemas de rendimiento y procurar la aplicación de buenas prácticas.

- Produccion-EyC-Deploy: Además de las versiones descritas anteriormente, este directorio contiene la versión actualmente deployada en el servidor de producción elegido para el alojamiento de la página. La única diferencia de este con la versión 3.0 es que no utiliza Node.js por lo que todas las llamadas se hacen directamente al router PHP (root/public/router/frontController.php). Esto es debido a que el servidor no está optimizado para Node.js, por lo que finalmente no se pudo utilizar al ser un entorno más óptimo para PHP. Sin embargo, se pudo mantener todo el frontend y las rutas con React como se había establecido.

Este proceso de construcción para este aplicativo se llevó a cabo desde febrero hasta julio de 2024, pasando por múltiples mejoras, optimizaciones y nuevas funcionalidades a medida que se fue aprendiendo y teniendo más certeza de como realizar cada tarea de la mejor manera. 

El dominio de la página donde está alojada la versión Produccion-EyC-Deploy es el siguiente: https://produccioneyc.infinityfreeapp.com/index

Gracias por leer!
