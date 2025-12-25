

// ----------------------------
// Admin dashboard + product CRUD (JS only)
// ----------------------------

// Default admin secret (fallback). Change this as needed.
const ADMIN_DEFAULT_PASSWORD = 'admin123';

// Add Admin button to profile display (if not present, displayProfile will include it).
// Call this from displayProfile() or include it there; the code below assumes displayProfile shows a button:
// <button class="admin-btn" onclick="openAdminLogin()">Admin</button>

// Open admin password modal
function openAdminLogin() {
  if (!currentUser) {
    showMessage('Please sign in first.', 'error');
    showPage('login');
    return;
  }

  // Prevent duplicate
  if (document.getElementById('adminLoginModal')) return;

  const modal = document.createElement('div');
  modal.id = 'adminLoginModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <h2>Admin Access</h2>
      <p>Enter admin password to continue (or use admin account).</p>
      <form id="adminLoginForm" class="profile-edit-form">
        <div class="form-group">
          <input id="adminPassword" type="password" placeholder="Admin password" required>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn save-btn">Enter</button>
          <button type="button" class="btn cancel-btn" id="cancelAdminLogin">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('adminPassword').focus();

  document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
  document.getElementById('cancelAdminLogin').addEventListener('click', closeAdminLoginModal);

  // click outside to close
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAdminLoginModal(); });
  function closeAdminLoginModal() {
    const m = document.getElementById('adminLoginModal');
    if (!m) return;
    try {
      document.getElementById('adminLoginForm').removeEventListener('submit', handleAdminLogin);
      document.getElementById('cancelAdminLogin').removeEventListener('click', closeAdminLoginModal);
    } catch (err) {}
    m.remove();
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    const pw = document.getElementById('adminPassword').value.trim();
    if (!pw) return showMessage('Enter password', 'error');

    try {
      const ok = await checkAdminCredentials(pw);
      if (ok) {
        closeAdminLoginModal();
        showMessage('Admin access granted', 'success');
        await showAdminDashboard();
      } else {
        showMessage('Invalid admin password', 'error');
      }
    } catch (err) {
      console.error('admin login error', err);
      showMessage('Admin check failed', 'error');
    }
  }
}

// Check admin credentials
async function checkAdminCredentials(password) {
  // Priority: check Firestore settings document (if available) for either admins list or password
  if (typeof db !== 'undefined' && db.collection) {
    try {
      const doc = await db.collection('settings').doc('admin').get();
      if (doc.exists) {
        const data = doc.data() || {};
        // If admins array present, allow if currentUser.email is included
        if (Array.isArray(data.admins) && data.admins.includes(currentUser.email)) return true;
        // If password present, check match
        if (data.password && String(data.password) === password) return true;
      }
    } catch (err) {
      console.warn('Could not read admin settings from Firestore:', err);
    }
  }

  // Fallback: check localStorage saved admin password (optional)
  try {
    const saved = localStorage.getItem('adminPassword');
    if (saved && saved === password) return true;
  } catch (err) {}

  // Final fallback: default password
  return password === ADMIN_DEFAULT_PASSWORD;
}

// Ensure admin page exists, then populate & show
async function showAdminDashboard() {
  // Create adminPage element if missing
  let adminPage = document.getElementById('adminPage');
  if (!adminPage) {
    adminPage = document.createElement('div');
    adminPage.id = 'adminPage';
    adminPage.className = 'page';
    // Insert near end of main content
    const main = document.querySelector('.main-content') || document.body;
    main.appendChild(adminPage);
  }

  // Fill admin page
  adminPage.innerHTML = `
    <div class="admin-container">
      <div class="admin-header" style="display:flex;align-items:center;gap:12px;justify-content:space-between">
        <h1>Admin Dashboard</h1>
        <div>
          <button class="btn" onclick="showPage('profile')">Back to Profile</button>
          <button class="btn" onclick="logout()">Sign out</button>
        </div>
      </div>

      <div class="admin-actions" style="margin:12px 0">
        <button class="btn save-btn" onclick="openNewProductModal()">+ New Product</button>
        <button class="btn" onclick="loadAdminProducts()">Refresh Products</button>
        <button class="btn" onclick="loadAdminUsers()">Refresh Users</button>
      </div>

      <section>
        <h2>Products</h2>
        <div id="adminProducts">Loading products...</div>
      </section>

      <section style="margin-top:20px">
        <h2>Users (from 'users' collection)</h2>
        <div id="adminUsers">Loading users...</div>
      </section>
    </div>
  `;

  // show admin page (your showPage expects id + 'Page')
  showPage('admin');

  // populate lists
  await loadAdminProducts();
  await loadAdminUsers();
}

// Load products (Firestore 'products' collection if available; fallback to allProducts/localStorage)
async function loadAdminProducts() {
  const container = document.getElementById('adminProducts');
  container.innerHTML = 'Loading...';

  // Try Firestore
  if (typeof db !== 'undefined' && db.collection) {
    try {
      const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderAdminProducts(products);
      return;
    } catch (err) {
      console.warn('Failed to fetch products from Firestore:', err);
      // continue to fallback
    }
  }

  // Fallback: use in-memory allProducts or localStorage
  let products = allProducts && allProducts.length ? allProducts.slice().reverse() : [];
  const saved = localStorage.getItem('products');
  if ((!products || products.length === 0) && saved) {
    try { products = JSON.parse(saved); } catch (e) {}
  }
  renderAdminProducts(products);
}

function renderAdminProducts(products = []) {
  const container = document.getElementById('adminProducts');
  if (!products.length) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="admin-product" style="border:1px solid #ddd;padding:12px;border-radius:8px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start">
      <div style="width:96px;height:96px;flex:0 0 96px">
        <img src="${Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.image || (p.images||[])[0] || 'https://via.placeholder.com/96')}"
             style="width:100%;height:100%;object-fit:cover;border-radius:6px" alt="${escapeHtml(p.title || 'product')}">
      </div>
      <div style="flex:1">
        <strong>${escapeHtml(p.title || '')}</strong>
        <div>PKR ${Number(p.price || 0).toLocaleString()}</div>
        <div>Category: ${escapeHtml(p.category || '')} • Stock: ${p.stock || 0}</div>
        <div style="margin-top:6px">${escapeHtml((p.description || '').slice(0,200))}${(p.description||'').length > 200 ? '...' : ''}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn" onclick="openEditProductModal('${p.id}')">Edit</button>
        <button class="btn" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Delete product (Firestore or local)
async function deleteProduct(productId) {
  if (!confirm('Delete product?')) return;

  // Try Firestore first
  if (typeof db !== 'undefined' && db.collection) {
    try {
      await db.collection('products').doc(productId).delete();
      showMessage('Product deleted from Firestore', 'success');
      loadAdminProducts();
      // Also refresh site product list if you store in allProducts
      allProducts = allProducts.filter(p => String(p.id) !== String(productId) && String(p.id) !== productId);
      saveLocalProducts();
      displayProducts(allProducts);
      return;
    } catch (err) {
      console.warn('Failed to delete from Firestore:', err);
    }
  }

  // Fallback: remove from localStorage/allProducts
  allProducts = allProducts.filter(p => String(p.id) !== String(productId));
  saveLocalProducts();
  showMessage('Product removed locally', 'success');
  loadAdminProducts();
  displayProducts(allProducts);
}

function saveLocalProducts() {
  try {
    localStorage.setItem('products', JSON.stringify(allProducts));
  } catch (e) { console.warn('Failed saving products locally', e); }
}

// Load users (from Firestore 'users' collection if available, else localStorage)
async function loadAdminUsers() {
  const container = document.getElementById('adminUsers');
  container.innerHTML = 'Loading...';

  if (typeof db !== 'undefined' && db.collection) {
    try {
      const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderAdminUsers(users);
      return;
    } catch (err) {
      console.warn('Failed to fetch users from Firestore:', err);
    }
  }

  const saved = localStorage.getItem('users');
  let users = [];
  if (saved) {
    try { users = JSON.parse(saved); } catch (e) {}
  }
  renderAdminUsers(users);
}

function renderAdminUsers(users = []) {
  const container = document.getElementById('adminUsers');
  if (!users.length) {
    container.innerHTML = '<p>No users found (make sure you save users in Firestore "users" collection when signing up).</p>';
    return;
  }

  container.innerHTML = users.map(u => `
    <div style="border:1px solid #eee;padding:8px;border-radius:8px;margin-bottom:6px;display:flex;align-items:center;gap:12px">
      <img src="${u.photoURL || 'https://via.placeholder.com/48'}" style="width:48px;height:48px;border-radius:50%;object-fit:cover">
      <div style="flex:1">
        <strong>${escapeHtml(u.name || u.displayName || u.email || 'User')}</strong><br>
        <small>${escapeHtml(u.email || '')} • ${escapeHtml(u.phone || '')}</small>
      </div>
    </div>
  `).join('');
}

// Open New Product modal (URL inputs instead of file upload)
function openNewProductModal() {
  if (document.getElementById('newProductModal')) return;

  const modal = document.createElement('div');
  modal.id = 'newProductModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card" style="max-width:720px;">
      <h2>New Product</h2>
      <form id="newProductForm" class="profile-edit-form">
        <div class="form-group"><input id="np_title" name="title" type="text" placeholder="Title" required></div>
        <div class="form-group"><textarea id="np_description" name="description" placeholder="Description" rows="3"></textarea></div>
        <div class="form-group"><input id="np_price" name="price" type="number" placeholder="Price (PKR)" required></div>
        <div class="form-group"><input id="np_category" name="category" type="text" placeholder="Category" required></div>
        <div class="form-group"><input id="np_stock" name="stock" type="number" placeholder="Stock" value="10" required></div>
        <div class="form-group"><input id="np_discount" name="discount" type="number" placeholder="Discount %" value="0"></div>
        <div class="form-group"><input id="np_sizes" name="sizes" type="text" placeholder="Sizes (comma separated: S,M,L)"></div>
        <div class="form-group"><input id="np_colors" name="colors" type="text" placeholder="Colors (comma separated: Black,White)"></div>

        <label>Add up to 4 Image URLs</label>
        <div id="urlFields">
          <input type="text" class="url-input" placeholder="Image URL 1">
          <input type="text" class="url-input" placeholder="Image URL 2">
          <input type="text" class="url-input" placeholder="Image URL 3">
          <input type="text" class="url-input" placeholder="Image URL 4">
        </div>
        <div id="np_preview" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"></div>

        <div class="modal-actions">
          <button type="submit" class="btn save-btn">Create Product</button>
          <button type="button" class="btn cancel-btn" id="cancelNewProduct">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // live preview for URLs
  document.querySelectorAll('#urlFields .url-input').forEach(input => {
    input.addEventListener('input', () => {
      const preview = document.getElementById('np_preview');
      preview.innerHTML = '';
      document.querySelectorAll('#urlFields .url-input').forEach(inp => {
        if (inp.value.trim()) {
          const img = document.createElement('img');
          img.src = inp.value.trim();
          img.style.width = '96px';
          img.style.height = '96px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '6px';
          preview.appendChild(img);
        }
      });
    });
  });

  document.getElementById('newProductForm').addEventListener('submit', handleNewProductSubmit);
  document.getElementById('cancelNewProduct').addEventListener('click', () => {
    try { document.getElementById('newProductForm').removeEventListener('submit', handleNewProductSubmit); } catch {}
    modal.remove();
  });

  async function handleNewProductSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('np_title').value.trim();
    const description = document.getElementById('np_description').value.trim();
    const price = Number(document.getElementById('np_price').value) || 0;
    const category = document.getElementById('np_category').value.trim() || 'misc';
    const stock = Number(document.getElementById('np_stock').value) || 0;
    const discount = Number(document.getElementById('np_discount').value) || 0;
    const sizes = document.getElementById('np_sizes').value.split(',').map(s=>s.trim()).filter(Boolean);
    const colors = document.getElementById('np_colors').value.split(',').map(c=>c.trim()).filter(Boolean);

    // collect image URLs
    const imageURLs = Array.from(document.querySelectorAll('#urlFields .url-input'))
      .map(inp => inp.value.trim())
      .filter(Boolean)
      .slice(0,4);

    const productObj = {
      title, description, price, category, stock, discount, sizes, colors,
      images: imageURLs.length ? imageURLs : ['https://via.placeholder.com/300x300?text=No+Image'],
      createdAt: new Date().toISOString()
    };

    // Save Firestore or fallback
    try {
      if (typeof db !== 'undefined' && db.collection) {
        const docRef = await db.collection('products').add(productObj);
        productObj.id = docRef.id;
        showMessage('✅ Product created in Firestore', 'success');
      } else {
        productObj.id = Date.now().toString();
        allProducts.unshift(productObj);
        saveLocalProducts();
        showMessage('✅ Product created locally', 'success');
      }

      allProducts.unshift(productObj);
      saveLocalProducts();
      displayProducts(allProducts);
      populateFeaturedProducts();
      populateWhatsNew();

      document.getElementById('newProductModal')?.remove();
    } catch (err) {
      console.error('create product error', err);
      showMessage('❌ Failed to create product', 'error');
    }
  }
}


// Edit product modal - open edit modal prefilled with Firestore/local data
async function openEditProductModal(productId) {
  // Fetch product from Firestore or local
  let product = null;
  if (typeof db !== 'undefined' && db.collection) {
    try {
      const doc = await db.collection('products').doc(productId).get();
      if (doc.exists) product = { id: doc.id, ...doc.data() };
    } catch (err) {
      console.warn('Failed to fetch product from Firestore:', err);
    }
  }
  if (!product) {
    product = (allProducts || []).find(p => String(p.id) === String(productId)) || null;
  }
  if (!product) return showMessage('Product not found', 'error');

  // Create modal similar to new product but prefilling fields
  if (document.getElementById('editProductModal')) return;
  const modal = document.createElement('div');
  modal.id = 'editProductModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <h2>Edit Product</h2>
      <form id="editProductForm" class="profile-edit-form">
        <div class="form-group"><input id="ep_title" name="title" type="text" value="${escapeHtml(product.title||'')}" required></div>
        <div class="form-group"><textarea id="ep_description" name="description" rows="3">${escapeHtml(product.description||'')}</textarea></div>
        <div class="form-group"><input id="ep_price" type="number" value="${Number(product.price||0)}" required></div>
        <div class="form-group"><input id="ep_category" type="text" value="${escapeHtml(product.category||'')}" required></div>
        <div class="form-group"><input id="ep_stock" type="number" value="${product.stock||0}" required></div>
        <div class="form-group"><input id="ep_discount" type="number" value="${product.discount||0}"></div>
        <div class="form-group"><input id="ep_sizes" type="text" value="${(product.sizes||[]).join(',')}"></div>
        <div class="form-group"><input id="ep_colors" type="text" value="${(product.colors||[]).join(',')}"></div>
        <div class="form-group">
          <label>Replace up to 4 images (optional)</label>
          <input id="ep_images" type="file" accept="image/*" multiple>
          <div id="ep_preview" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"></div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn save-btn">Save Changes</button>
          <button type="button" class="btn cancel-btn" id="cancelEditProduct">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // show existing images
  const preview = document.getElementById('ep_preview');
  (product.images || []).slice(0,4).forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.style.width = '96px';
    img.style.height = '96px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '6px';
    preview.appendChild(img);
  });

  document.getElementById('ep_images').addEventListener('change', () => {
    // replace preview with newly selected files
    preview.innerHTML = '';
    const files = Array.from(document.getElementById('ep_images').files).slice(0,4);
    files.forEach(f => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      img.style.width = '96px';
      img.style.height = '96px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '6px';
      preview.appendChild(img);
    });
  });

  document.getElementById('editProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('ep_title').value.trim();
    const description = document.getElementById('ep_description').value.trim();
    const price = Number(document.getElementById('ep_price').value) || 0;
    const category = document.getElementById('ep_category').value.trim();
    const stock = Number(document.getElementById('ep_stock').value) || 0;
    const discount = Number(document.getElementById('ep_discount').value) || 0;
    const sizes = document.getElementById('ep_sizes').value.split(',').map(s=>s.trim()).filter(Boolean);
    const colors = document.getElementById('ep_colors').value.split(',').map(c=>c.trim()).filter(Boolean);
    const files = Array.from(document.getElementById('ep_images').files).slice(0,4);

    const submitBtn = document.querySelector('#editProductForm .save-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      let imageURLs = product.images ? [...product.images] : [];
      if (files.length && typeof firebase !== 'undefined' && firebase.storage) {
        const storageRef = firebase.storage().ref();
        const prefix = `products/${Date.now()}`;
        // upload new images and replace all images with new ones for simplicity
        imageURLs = [];
        for (let f of files) {
          const snap = await storageRef.child(`${prefix}/${f.name}`).put(f);
          const url = await snap.ref.getDownloadURL();
          imageURLs.push(url);
        }
      } else if (files.length) {
        imageURLs = files.map(f => URL.createObjectURL(f));
      }

      const payload = { title, description, price, category, stock, discount, sizes, colors, images: imageURLs, updatedAt: new Date().toISOString() };

      if (typeof db !== 'undefined' && db.collection) {
        await db.collection('products').doc(productId).set(payload, { merge: true });
        showMessage('Product updated in Firestore', 'success');
      } else {
        // update local allProducts
        const idx = allProducts.findIndex(p => String(p.id) === String(productId));
        if (idx !== -1) {
          allProducts[idx] = { ...allProducts[idx], ...payload };
          saveLocalProducts();
        }
        showMessage('Product updated locally', 'success');
      }

      // refresh lists
      await loadAdminProducts();
      displayProducts(allProducts);

      // close modal
      try { document.getElementById('editProductModal').remove(); } catch (e) {}
    } catch (err) {
      console.error('update product error', err);
      showMessage('Failed to update product', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Changes';
    }
  });

  document.getElementById('cancelEditProduct').addEventListener('click', () => {
    try { document.getElementById('editProductForm').removeEventListener('submit', ()=>{}); } catch (e) {}
    document.getElementById('editProductModal').remove();
  });
}

/* End of admin module */
function populateFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;
  container.innerHTML = allProducts.slice(0, 4).map(p => `
    <div class="product-card" onclick="openProductDetail('${p.id}')">
      <img src="${p.images?.[0] || p.image || 'https://via.placeholder.com/200'}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>PKR ${Number(p.price).toLocaleString()}</p>
    </div>
  `).join('');
}

function populateWhatsNew() {
  const track = document.querySelector('.whats-new-track');
  if (!track) return;
  track.innerHTML = allProducts.slice(0, 6).map(p => `
    <a class="product-item5" onclick="openProductDetail('${p.id}')">
      <img src="${p.images?.[0] || p.image || 'https://via.placeholder.com/200'}" alt="${p.title}">
      <div class="product-info5">
        <h3>${p.title}</h3>
        <p>PKR ${Number(p.price).toLocaleString()}</p>
      </div>
    </a>
  `).join('');
}
displayProducts(allProducts);  
populateFeaturedProducts();  
populateWhatsNew();
