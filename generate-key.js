
const crypto = require('crypto');

// Generate a 32-byte (256-bit) key and convert to hex
const key = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=' + key);
