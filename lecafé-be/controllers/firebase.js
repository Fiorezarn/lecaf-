const admin = require("firebase-admin");
const serviceAccount = require("../config/lecafe-project-fd756-firebase-adminsdk-sr3s3-9e060e4b5c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
