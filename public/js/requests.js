const ref = firebase.firestore().collection("requests");

// callback function everytime a change in this collection occurs
ref.onSnapshot((snapshot) => {
  let requests = [];
  snapshot.forEach((doc) => {
    requests.push({ ...doc.data(), id: doc.id });
  });

  let html = ``;
  requests.forEach((request) => {
    html += `<li>${request.text}</li>`;
  });

  document.querySelector("ul").innerHTML = html;
});
