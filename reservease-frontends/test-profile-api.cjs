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
    
    console.log("Logged in");

    // Test GET /me
    const meReq = http.request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/v1/Customers/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (meRes) => {
      let meBody = '';
      meRes.on('data', chunk => meBody += chunk);
      meRes.on('end', () => {
        console.log(`GET /me: ${meRes.statusCode}`);
        
        // Test PUT /me
        const putData = JSON.stringify({
          firstName: 'Test',
          lastName: 'Owner',
          mobileNumber: '+2330000001'
        });
        const putReq = http.request({
          hostname: 'localhost',
          port: 5001,
          path: '/api/v1/Customers/me',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': Buffer.byteLength(putData)
          }
        }, (putRes) => {
          let putBody = '';
          putRes.on('data', chunk => putBody += chunk);
          putRes.on('end', () => {
            console.log(`PUT /me: ${putRes.statusCode}`);
          });
        });
        putReq.on('error', e => console.error(e));
        putReq.write(putData);
        putReq.end();

      });
    });

    meReq.on('error', e => console.error(e));
    meReq.end();
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
