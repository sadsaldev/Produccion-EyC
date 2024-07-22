const express = require('express');
const request = require('request');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;

// Middleware de CORS para permitir solicitudes del cliente en localhost:9000
app.use(cors({
    origin: 'http://localhost:9000',
    credentials: true // Permitir el intercambio de cookies
}));

// Middleware para parsear solicitudes JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para capturar todas las solicitudes y servir el archivo 'index.html'
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

const proxyRequest = async (url, formData, jar) => {
    const options = {
        url: url,
        form: formData,
        jar: jar,
        encoding: null // Para manejar binarios
    };

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                console.error("Error en el servidor proxy: ", error);
                reject(error);
            } else {
                console.log('Solicitud realizada a:', url);
                console.log('Cuerpo de la solicitud: ', formData);

                // Verificar el tipo de contenido
                const contentType = response.headers['content-type'];

                if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                    // Si es un archivo Excel, configurar headers para descarga
                    resolve({
                        headers: {
                            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'Content-Disposition': 'attachment; filename=export.xlsx',
                        },
                        body: body,
                    });
                } else {
                    // Convertir la respuesta a JSON por defecto
                    let responseBody;
                    try {
                        responseBody = JSON.parse(body.toString('utf8'));
                    } catch (e) {
                        // Si no se puede parsear como JSON, devolver el cuerpo como está
                        responseBody = body.toString('utf8');
                    }
                    resolve({
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: responseBody,
                    });

                    console.log("Respuesta del backend: ", responseBody);
                }

            }
        });
    });
};

module.exports = {
    proxyRequest,
};


module.exports = {
    app,
    port,
    proxyRequest,
};