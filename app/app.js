const express = require('express');
const client = require('prom-client');

const app = express();

// Default Node.js process metrics (CPU, memory, event loop lag, ...)
client.collectDefaultMetrics();

// Counts every HTTP request, labelled by route and status code
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'status_code'],
});

// Increment the counter once the response has been sent.
// req.route is only set for known routes, so unknown URLs share one label
// (keeps the number of label values small).
app.use((req, res, next) => {
  res.on('finish', () => {
    const route = req.route ? req.route.path : 'unmatched';
    httpRequests.inc({ route, status_code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the monitored app' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
