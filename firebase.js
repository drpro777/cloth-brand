// Firebase Configuration
// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCD6q5420HsR8ajgGWzCOCNijJ2wOhyG7E",
  authDomain: "zerlin-df3d6.firebaseapp.com",
  projectId: "zerlin-df3d6",
  storageBucket: "zerlin-df3d6.firebasestorage.app",
  messagingSenderId: "910306711663",
  appId: "1:910306711663:web:bd70a8da8676647fb0559a",
  measurementId: "G-6L46PFP8JM"
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


function displayFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  const featuredProducts = allProducts.filter(p => p.featured).slice(0, 8);

  container.innerHTML = featuredProducts.map(p => createProductCard(p)).join('');
}

const featured = document.getElementById('np_featured').checked;
const productObj = { title, description, price, category, stock, discount, sizes, colors, images: imageURLs, featured, createdAt: new Date().toISOString() };

// reviews sections
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewName").value;
    const rating = document.getElementById("reviewRating").value;
    const description = document.getElementById("reviewDescription").value;
    const images = document.getElementById("reviewImages").files;

    let imageUrls = [];

    for (let img of images) {
        const imgRef = ref(storage, `reviews/${Date.now()}_${img.name}`);
        await uploadBytes(imgRef, img);
        const url = await getDownloadURL(imgRef);
        imageUrls.push(url);
    }

    await addDoc(collection(db, "reviews"), {
        userId: currentUser.uid,
        name,
        rating,
        description,
        images: imageUrls,
        createdAt: serverTimestamp()
    });

    e.target.reset();
    loadReviews();
});
async function loadReviews() {
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "reviews"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        reviewsList.innerHTML += `
            <div class="review-card">
                <h4>${data.name}</h4>
                <p>Rating: ⭐ ${data.rating}</p>
                <p>${data.description}</p>

                <div class="review-images">
                    ${data.images.map(img => `<img src="${img}" />`).join("")}
                </div>
            </div>
        `;
    });
}

loadReviews();
