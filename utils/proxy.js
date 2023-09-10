const express = require('express');
const httpProxy = require('http-proxy');
const expressWs = require('express-ws');

const app = express();
expressWs(app);
const proxy = httpProxy.createProxyServer();

const AWS_API_GATEWAY_URL = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT; // Replace with your actual AWS API Gateway WebSocket URL

// Proxy WebSocket requests
app.ws('/api/startWebSocketConnection', (ws, req) => {
    // Forward the WebSocket request to the AWS API Gateway
    proxy.ws(req, ws, { target: AWS_API_GATEWAY_URL });
});

// If you have other regular HTTP routes or any other middleware, you can define them here
// Example:
// app.get('/api/some-endpoint', (req, res) => {
//     res.json({ message: 'Hello from proxy!' });
// });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
