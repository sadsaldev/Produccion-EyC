const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../config');
const { cacheQueryData, getCachedQueryData } = require('../services/cache');
const request = require('request');

router.post('/efective', async (req, res) => {
    const formData = req.body;
    const userID = req.body.userID;

    try {
        let data = getCachedQueryData(userID, formData);

        if (!data) {
            const jar = request.jar();
            if (req.headers.cookie) {
                const cookies = req.headers.cookie.split(';');
                cookies.forEach(cookie => {
                    jar.setCookie(cookie, 'http://localhost/produccion-EyC-react/public/router/frontController.php');
                });
            }

            const proxyData = {
                action: formData.action,
                fecha_inicio: formData.fecha_inicio,
                fecha_final: formData.fecha_final,
                opcion: formData.opcion,
                userID: userID
            };

            const { headers, body } = await proxyRequest('http://localhost/produccion-EyC-react/public/router/frontController.php', proxyData, jar);

            data = body;

            // Guardar en el caché solo si la respuesta es JSON
            // if (typeof data === 'object') {
                cacheQueryData(userID, formData, data);
            // }

            res.set(headers);
            res.send(body);
        } else {
            res.send(data); // Devolver datos del caché como están
        }

    } catch (error) {
        console.error("Error al realizar la consulta:", error.message);
        res.status(500).json({ error: "Error al realizar la consulta" });
    }
});

router.post('/networks', async (req, res) => {
    const formData = req.body;
    const jar = request.jar();

    if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(';');
        cookies.forEach(cookie => {
            jar.setCookie(cookie, 'http://localhost/produccion-EyC-react/public/router/frontController.php');
        });
    }

    const { headers, body } = await proxyRequest('http://localhost/produccion-EyC-react/public/router/frontController.php', formData, jar);
    res.set(headers);
    res.send(body);
});

module.exports = router;