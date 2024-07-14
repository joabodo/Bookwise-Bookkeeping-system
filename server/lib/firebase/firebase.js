const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

const sa = JSON.parse(process.env.FIREBASE_SA);

const app = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(sa),
    });

const auth = getAuth(app);

module.exports = { auth };
