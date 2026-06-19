const http = require('http');

const data = JSON.stringify({
  firstName: 'Test',
  lastName: 'OwnerOTP',
  email: `testownerotp${Date.now()}@example.com`,
  password: 'Password123!',
  confirmPassword: 'Password123!',
  source: 'AccommodationPortal'
});

const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/v1/Customers/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`Register Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log(body);
      
      const parsed = JSON.parse(body);
      const uniqueId = parsed.data.uniqueId;

      console.log('uniqueId is', uniqueId);
    }
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
