const http = require('http');

const data = JSON.stringify({
  email: 'testowner6@example.com',
  password: 'Password123!'
});

const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/v1/Customers/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const response = JSON.parse(body);
    const token = response.data.accessToken;
    
    console.log("Got token successfully");

    const getReq = http.request({
      hostname: 'localhost',
      port: 5073,
      path: '/api/v1/accommodation/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (getRes) => {
      let getBody = '';
      getRes.on('data', chunk => getBody += chunk);
      getRes.on('end', () => {
        console.log(`Status: ${getRes.statusCode}`);
        console.log(`Body: ${getBody}`);
      });
    });

    getReq.on('error', e => console.error(e));
    getReq.end();
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
