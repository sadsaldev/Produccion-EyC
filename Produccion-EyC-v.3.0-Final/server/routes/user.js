const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../config');
const request = require('request');

router.post('/login', async (req, res) => {
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

router.post('/signup', async (req, res) => {
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

router.post('/logout', async (req, res) => {
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

router.post('/checksession', async (req, res) => {
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

router.post('/update', async (req, res) => {
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