const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors({
    origin: 'http://localhost',
    credentials: true  // Permitir el intercambio de cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api', (req, res) => {
    const formData = req.body;
    console.log("Recibiendo solicitud en el servidor proxy: ", formData);

    const jar = request.jar();  // Crear un jar para almacenar las cookies

    // Si el cliente envió cookies, agrégalas al jar
    if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(';');
        cookies.forEach(cookie => {
            jar.setCookie(cookie, 'http://localhost/produccion-EyC-3/public/router/frontController.php');
        });
    }

    const options = {
        url: 'http://localhost/produccion-EyC-3/public/router/frontController.php',
        form: formData,
        jar: jar,  // Pasar el jar al cliente de solicitud para manejar las cookies
        encoding: null //Para manejar binarios
    };

    request.post(options, (error, response, body) => {
        if (error) {
            console.error("Error en el servidor proxy: ", error);
            res.status(500).send("Error en el server proxy");
        } else {
            // Pasar las cookies de la respuesta del backend al cliente
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
                console.log("Cookies recibidas del backend:", setCookieHeader);
                res.setHeader('Set-Cookie', setCookieHeader);
            }

            res.send(body);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor proxy corriendo en http://localhost:${port}`);
});