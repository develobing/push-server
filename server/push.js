// Modules
const webpush = require('web-push');
const urlsafeBase64 = require('urlsafe-base64');

// Vapid Keys
const vapid = require('./vapid.json');

// Create URL safe vapid public key
module.exports.getKey = () => urlsafeBase64.decode(vapid.publicKey);
