const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
var serviceAccount = require('./service-account-credentials.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://firestore.firebaseio.com'
// });

admin.initializeApp();

let uid = 'vXpMzQg40JgnzryCKIutE18VVdh1';

admin.auth().createCustomToken(uid)
  .then(function(customToken) {
    console.log(customToken);
    return customToken;
  })
  .catch(function(error) {
    console.log('Error creating custom token:', error);
});

app.use(cors({ origin: true }));

// app.get('/hello-world', (req, res) => {
//   return res.status(200).send('Hello World!');
// });

exports.uploadFile = functions.https.onRequest((req, res) => {
  res.status(200).json({
    message: 'It worked!'
  })
})

exports.app = functions.https.onRequest(app);
