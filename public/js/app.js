const requestModal = document.querySelector(".new-request");
const requestLink = document.querySelector(".add-request");
const requestForm = document.querySelector(".new-request form");

// open request modal
requestLink.addEventListener("click", () => {
  requestModal.classList.add("open");
});

// close request modal
requestModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("new-request")) {
    requestModal.classList.remove("open");
  }
});
// say hello function call
// const button = document.querySelector(".call");
// button.addEventListener("click", () => {
//   // get function reference
//   const sayHello = firebase.functions().httpsCallable("sayHello");
//   sayHello({ name: "Weerayooth" }).then((result) => {
//     console.log(result.data);
//   });
// });

// add a new request
requestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const addRequest = firebase.functions().httpsCallable("addRequest");
  addRequest({
    text: requestForm.request.value,
  })
    .then(() => {
      requestForm.reset();
      requestModal.classList.remove("open");
      requestForm.querySelector(".error").textContent = "";
    })
    .catch((err) => {
      requestForm.querySelector(".error").textContent = err.message;
    });
});

// notification
const notification = document.querySelector(".notification");

const showNotification = (message) => {
  notification.textContent = message;
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
    notification.textContent = "";
  }, 4000);
};
