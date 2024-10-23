// Modules
const http = require('http');
const push = require('./push');

// Create HTTP Server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Get request URL
  const { url, method } = req;

  // Subscribe
  if (method === 'POST' && url.match(/^\/subscribe\/?/)) {
    // Get POST Body
    let body = [];

    req
      .on('data', (chunk) => body.push(chunk))
      .on('end', () => {
        // Parse Subscription body to object
        let subscription = JSON.parse(Buffer.concat(body).toString());

        // Store subscription for push notifications
        push.addSubscription(subscription);

        // Respond
        res.end('Subscribed!');
      });
  }

  // Public Key
  else if (url.match(/^\/key\/?/)) {
    // Get key from push module
    let key = push.getKey();

    // Respond with Public Key
    res.end(key);
  }

  // Push Notification
  else if (method === 'POST' && url.match(/^\/push\/?/)) {
    // Get POST Body
    let body = [];

    req
      .on('data', (chunk) => body.push(chunk))
      .on('end', () => {
        // Send notification with POST body
        push.send(body.toString());

        // Respond
        res.end('Push Sent!');
      });
  }

  // Not Found
  else {
    res.statusCode = 404;
    res.end('Error: Unknown Request');
  }
});

// Start the server
const port = 3333;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
