var app = new Vue({
  el: "#app",
  data: {
    requests: [],
  },
  methods: {
    upvoteRequest(id) {
      console.log(id);
      const upvote = firebase.functions().httpsCallable("upvote");
      upvote({ id }).catch((error) => {
        showNotification(error.message);
      });
    },
  },
  mounted() {
    const ref = firebase
      .firestore()
      .collection("requests")
      .orderBy("upvotes", "desc");

    // callback function everytime a change in this collection occurs
    ref.onSnapshot((snapshot) => {
      let requests = [];
      snapshot.forEach((doc) => {
        requests.push({ ...doc.data(), id: doc.id });
      });

      this.requests = requests;
    });
  },
});
