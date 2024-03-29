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

// http collable function (adding a request)
// detect user authenticated by context
exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "request must be no more than 30 characters long"
    );
  }
  return admin.firestore().collection("requests").add({
    text: data.text,
    upvotes: 0,
  });
});

// // upvote callable function
exports.upvote = functions.https.onCall(async (data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can vote up requests"
    );
  }
  // get refs for user doc & request doc
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  const request = admin.firestore().collection("requests").doc(data.id);

  const doc = await user.get();

  // check thew user hasn't already upvoted
  if (doc.data().upvotedOn.includes(data.id)) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "You can only vote something up once"
    );
  }

  // update the array in user document
  await user.update({
    upvotedOn: [...doc.data().upvotedOn, data.id],
  });

  // update the votes on the request
  // best pratice to increment
  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1),
  });
});

// firestore trigger for tracking activity
exports.logActivities = functions.firestore
  .document("/{collection}/{id}")
  .onCreate((snap, context) => {
    console.log(snap.data());

    const activities = admin.firestore().collection("activities");
    const collection = context.params.collection;

    if (collection === "requests") {
      return activities.add({ text: "a new tutorial request was added" });
    }
    if (collection === "users") {
      return activities.add({ text: "a new user signed up" });
    }

    return null;
  });
