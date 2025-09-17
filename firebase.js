// Firebase Configuration
// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAj-s6Xxfy1ZBWOf1_2WcIgabmOLyR4SVk",
  authDomain: "zerlinn-c876d.firebaseapp.com",
  projectId: "zerlinn-c876d",
  storageBucket: "zerlinn-c876d.firebasestorage.app",
  messagingSenderId: "456270612012",
  appId: "1:456270612012:web:daf9514dd4b5f722ddb389",
};

// Initialize Firebase
function initFirebase() {
  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);

    // Initialize services
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    updateUserInterface();
    console.log("User signed in:", user.email);
  } else {
    currentUser = null;
    updateUserInterface();
    console.log("User signed out");
  }
});


    return { auth, db };
  }

  return null;
}
initFirebase();
function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      currentUser = result.user;
      saveUserData(currentUser.uid, {
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
        provider: "google",
      });
      showMessage(`Welcome ${currentUser.displayName}!`, "success");
      showPage("profile");
      updateUserInterface();
    })
    .catch((error) => {
      console.error("Google Sign-in error:", error);
      showMessage(error.message, "error");
    });
}


// Logout function
function logout() {
  auth.signOut()
    .then(() => {
      currentUser = null;
      showMessage("You have been logged out.", "info");
      showPage("loginPage"); // back to login
      updateUserInterface();
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
    });
}

// Database functions
function saveUserData(userId, data) {
  if (typeof firebase !== "undefined" && firebase.firestore) {
    return firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .set(data, { merge: true });
  }

  // Fallback to localStorage
  localStorage.setItem(`user_${userId}`, JSON.stringify(data));
  return Promise.resolve();
}

function getUserData(userId) {
  if (typeof firebase !== "undefined" && firebase.firestore) {
    return firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((doc) => (doc.exists ? doc.data() : null));
  }

  // Fallback to localStorage
  const data = localStorage.getItem(`user_${userId}`);
  return Promise.resolve(data ? JSON.parse(data) : null);
}

function saveOrder(orderData) {
  if (typeof firebase !== "undefined" && firebase.firestore) {
    return firebase
      .firestore()
      .collection("orders")
      .add({
        ...orderData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Fallback to localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push({
    ...orderData,
    timestamp: new Date().toISOString(),
    id: Date.now(),
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  return Promise.resolve();
}

function getOrders(userId) {
  if (typeof firebase !== "undefined" && firebase.firestore) {
    return firebase
      .firestore()
      .collection("orders")
      .where("customer.userId", "==", userId)
      .orderBy("timestamp", "desc")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
  }

  // Fallback to localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return Promise.resolve(
    orders.filter((order) => order.customer.userId === userId)
  );
}
