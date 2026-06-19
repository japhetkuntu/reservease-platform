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
    
    const propData = JSON.stringify({
      name: 'Luxury Suite Final Test',
      category: 'hotel-room',
      location: 'Accra',
      price: '1500',
      numericPrice: 1500,
      priceUnit: 'month',
      genderPolicy: 'mixed',
      amenities: ['wifi', 'cctv'],
      roomType: 'one-bedroom',
      images: [],
      available: true,
      backupPower: 'Generator',
      waterReliability: 'Regular',
      utilityMetering: 'Shared',
      advanceMonths: '1',
      securityDeposit: '500',
      isInclusive: true,
      securityFeatures: ['CCTV'],
      roadAccess: 'Tarred',
      bathroomType: 'Self-contained',
      rules: ['No smoking'],
      transportAccess: ['Uber/Bolt'],
      compoundType: 'gated-community',
      internetType: 'Fibre',
      momoAccepted: true,
      negotiableRent: false,
      cookingAllowed: false,
      childrenAllowed: true,
      campusProximity: 'far',
      nearestCampus: 'none',
      breakfastIncluded: true,
      airConditioning: true,
      parkingAvailable: true,
      furnishedStatus: 'furnished',
      googleMapsUrl: ''
    });

    const propReq = http.request({
      hostname: 'localhost',
      port: 5073,
      path: '/api/v1/accommodation',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(propData)
      }
    }, (propRes) => {
      let propBody = '';
      propRes.on('data', chunk => propBody += chunk);
      propRes.on('end', () => {
        console.log(`Status: ${propRes.statusCode}`);
        console.log(`Body: ${propBody}`);
      });
    });

    propReq.on('error', e => console.error(e));
    propReq.write(propData);
    propReq.end();
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
