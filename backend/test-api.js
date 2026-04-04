const axios = require('axios');

async function test() {
  const endpoints = [
    'http://localhost:5000/api/504293',
    'http://localhost:5000/pincode',
    'http://localhost:5000/states',
    'http://localhost:5000/states/Maharashtra'
  ];

  for (const url of endpoints) {
    try {
      console.log(`Testing ${url}...`);
      const res = await axios.get(url);
      console.log(`✅ Success: ${url}`);
      if (url.endsWith('Maharashtra')) {
        console.log('Sample data from Maharashtra:', Object.keys(res.data).slice(0, 3));
      }
    } catch (err) {
      console.error(`❌ Failed: ${url}`, err.response ? err.response.status : err.message);
    }
  }
}

test();
