const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// http request 1
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  console.log(number);
  response.send(number.toString());
});

// http request 2
exports.toMyWebsite = functions.https.onRequest((request, response) => {
  response.redirect("https://weerayoothm.github.io");
});

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
  const { name } = data;
  return `Hello, ${name}`;
});

// Auth trigger when event occurs then invoke a cloud function todo sth
// Auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  // for background triggers you must return a value/ promise
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    upvotedOn: [],
  });
});

// Auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  // for background triggers you must return a value/ promise
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});
