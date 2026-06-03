const https = require('https');
const ids = [
  'photo-1616423640778-28d1b53229bd', // van?
  'photo-1519003722824-194d4455a60c', // truck?
  'photo-1592982537447-6f2c6e0c2ed1', // tractor?
  'photo-1624831868350-a9cb480bc061', // van
  'photo-1590496794008-383c8070b257', // tractor
  'photo-1601584115197-04ecc0da31d7'  // truck (was returning neon?)
];
ids.forEach(id => {
  https.get(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`, res => {
    console.log(`${id}: ${res.statusCode}`);
  });
});
