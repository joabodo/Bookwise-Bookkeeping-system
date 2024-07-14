const { auth } = require("./firebase");

const verifyIDToken = (idToken) => auth.verifyIdToken(idToken);

const setCustomUserClaims = (uid, claims) =>
  auth.setCustomUserClaims(uid, claims);

module.exports = { verifyIDToken, setCustomUserClaims };
