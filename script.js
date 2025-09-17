// Global Variables
let currentUser = null;
let cart = [];
let currentLanguage = 'en';
let currentTheme = 'light';
let currentSlide = 0;
let filteredProducts = [];
let allProducts = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Load saved settings
    loadSettings();
    
    // Initialize Firebase (if config is available)
    try {
        if (typeof initFirebase === 'function') {
            await initFirebase();
        }
    } catch (error) {
        console.log('Firebase not configured, using local storage');
    }
    
    // Load products
    await loadProducts();
    
    try {
    } catch (error) {
    }
    
    // Load cart from localStorage
    loadCart();
    
    // Initialize components
    initializeSlider();
    initializeSearch();
    updateCartCount();
    loadReviews();
    
    // Hide loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Apply saved language and theme
    changeLanguage(currentLanguage);
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
}

// Loading Screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const woodenDoor = document.querySelector('.wooden-door');
    
    setTimeout(() => {
        woodenDoor.classList.add('open');
    }, 1000);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
}

// Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update navigation
        updateNavigation(pageId);
        
        // Load page-specific content
        if (pageId === 'products') {
            displayProducts(allProducts);
        } else if (pageId === 'cart') {
            displayCart();
        } else if (pageId === 'profile') {
            displayProfile();
        }
    }
}

function updateNavigation(activePageId) {
    // Update desktop nav
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Update bottom nav
    const bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
    bottomNavBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate correct nav item
    const activeDesktopNav = document.querySelector(`[onclick="showPage('${activePageId}')"]`);
    if (activeDesktopNav && activeDesktopNav.classList.contains('nav-link')) {
        activeDesktopNav.classList.add('active');
    }
    
    const activeBottomNav = document.querySelector(`[onclick="showPage('${activePageId}')"].bottom-nav-btn`);
    if (activeBottomNav) {
        activeBottomNav.classList.add('active');
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu when a nav link is clicked
document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', function () {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');

        // Close the mobile menu
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');

        // If you are using showPage() function for SPA navigation
        const targetPage = this.getAttribute('data-page');
        if (targetPage) {
            showPage(targetPage);
        }
    });
});


// Settings
function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.classList.toggle('active');
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        currentTheme = 'light';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        currentTheme = 'dark';
    }
    
    // Save theme preference
    localStorage.setItem('theme', currentTheme);
}

function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(element => {
        element.textContent = element.getAttribute('data-' + lang);
    });
    
    // Update language selector
    document.getElementById('languageSelect').value = lang;
    
    // Save language preference
    localStorage.setItem('language', lang);
}

function loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    
    // Load language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
}

// Hero Slider
function initializeSlider() {
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    slides[currentSlide].classList.add('active');
}

// Products
async function loadProducts() {
    // Use products from products-data.js if available, otherwise use sample data
    if (typeof productsData !== 'undefined') {
        allProducts = productsData;
    } else {
        allProducts = generateSampleProducts();
    }
    
    filteredProducts = [...allProducts];
    displayFeaturedProducts();
    displayProducts(allProducts);
}

function generateSampleProducts() {
    const categories = ['men', 'women', 'accessories'];
    const products = [];
    
    for (let i = 1; i <= 20; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const isOnSale = Math.random() > 0.7;
        const isInStock = Math.random() > 0.2;
        
        products.push({
            id: i,
            title: `Fashion Item ${i}`,
            description: `Premium quality ${category} item with modern design and comfortable fit. Perfect for any occasion.`,
            price: Math.floor(Math.random() * 8000) + 2000, // PKR 2000-10000
            originalPrice: isOnSale ? Math.floor(Math.random() * 3000) + 10000 : null,
            images: [
                `https://images.pexels.com/photos/${996329 + i}/pexels-photo-${996329 + i}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`,
                `https://images.pexels.com/photos/${1040945 + i}/pexels-photo-${1040945 + i}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`,
                `https://images.pexels.com/photos/${1549200 + i}/pexels-photo-${1549200 + i}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`,
                `https://images.pexels.com/photos/${1152077 + i}/pexels-photo-${1152077 + i}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`
            ],
            category: category,
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
            reviews: Math.floor(Math.random() * 500) + 10,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'White', 'Blue', 'Red'],
            stock: isInStock ? Math.floor(Math.random() * 50) + 1 : 0,
            discount: isOnSale ? Math.floor(Math.random() * 50) + 10 : 0
        });
    }
    
    return products;
}

function displayFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    const featuredProducts = allProducts.filter(product => product.rating >= 4.0).slice(0, 8);
    
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function displayProducts(products) {
    const container = document.getElementById('allProducts');
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const discountBadge = product.discount > 0 ? `<div class="product-badge">${product.discount}% OFF</div>` : '';
    const stockBadge = product.stock === 0 ? `<div class="product-badge out-of-stock">Out of Stock</div>` : '';
    const originalPrice = product.originalPrice ? `<span class="original-price">PKR ${product.originalPrice}</span>` : '';
    
    return `
        <div class="product-card ${product.stock === 0 ? 'out-of-stock' : ''}" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
                ${discountBadge}
                ${stockBadge}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    PKR ${product.price.toLocaleString()}
                    ${originalPrice}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        Add to bag
                    </button>
                    <button class="buy-now-btn" onclick="event.stopPropagation(); buyNow(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const container = document.getElementById('productDetail');

    container.innerHTML = `
        <div class="product-images">
            <img src="${product.images[0]}" alt="${product.title}" class="main-image" id="mainImage" onclick="zoomImage(this.src)">
            <div class="thumbnail-images">
                ${product.images.map(image =>
                    `<img src="${image}" alt="${product.title}" class="thumbnail" onclick="changeMainImage('${image}')">`
                ).join('')}
            </div>
        </div>
        
        <div class="product-details">
            <h1>${product.title}</h1>
            <div class="price">PKR ${product.price.toLocaleString()}</div>
            
            <div class="product-rating">
                <div class="stars">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span>${product.rating} (${product.reviews} reviews)</span>
            </div>
            
            <p class="product-description">${product.description}</p>

            <!-- Offers Section -->
            <ul class="product-offers">
                <li>✔ Free Delivery on orders above PKR 3000</li>
                <li>✔ 7-Day Easy Returns</li>
                <li>✔ Cash on Delivery Available</li>
                <li>✔ Secure Online Payments</li>
                <li>✔ 6-Month Warranty</li>
                <li>✔ Exclusive Member Discounts</li>
            </ul>
            
            <div class="product-options">
                <div class="option-group">
                    <label>Size:</label>
                    <div class="size-options">
                        ${product.sizes.map(size =>
                            `<button class="size-btn" onclick="selectSize('${size}', this)">${size}</button>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="option-group">
                    <label>Color:</label>
                    <div class="color-options">
                        ${product.colors.map(color =>
                            `<button class="color-btn" onclick="selectColor('${color}', this)" style="background-color: ${color.toLowerCase()}"></button>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}" class="quantity-input">
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    <span class="stock-info">${product.stock > 0 ? product.stock + ' in stock' : 'Out of Stock'}</span>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="add-to-cart-btn" onclick="addToCartWithOptions(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    🛒 Add to bag
                </button>
                <button class="buy-now-btn" onclick="buyNowWithOptions(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    ⚡ Buy Now
                </button>
            </div>
        </div>

        <!-- Related Products Slider -->
        <h2 class="related-heading">You may also like</h2>
        <button id="toggleSliderBtn" class="toggle-slider">⏸ Pause</button>
        <div class="related-slider">
            <div class="related-track">
                ${allProducts
                    .filter(p => p.id !== productId)
                    .slice(0, 10)
                    .map(p => `
                        <div class="related-item" onclick="showProductDetail(${p.id})">
                            <img src="${p.images[0]}" alt="${p.title}">
                            <h3>${p.title}</h3>
                            <p>PKR ${p.price.toLocaleString()}</p>
                            <button onclick="event.stopPropagation(); addToCartWithOptions(${p.id})">Add to Cart</button>
                        </div>
                    `).join('')}
            </div>
        </div>

        <!-- Instruction Paragraph -->
        <p class="slider-instruction">
            ℹ️ If you want details about the slider product, just click the product and scroll upward to see your product details.
        </p>
    `;

    // Set first size and color as active
    container.querySelector('.size-btn')?.classList.add('active');
    container.querySelector('.color-btn')?.classList.add('active');

    // Start slider auto-scroll
    startRelatedSlider();

    showPage('productDetail');
}


let sliderInterval;
let sliderPaused = false;

function startRelatedSlider() {
    const track = document.querySelector('.related-track');
    const btn = document.getElementById('toggleSliderBtn');
    if (!track) return;

    let scrollAmount = 0;

    function animateSlider() {
        if (sliderPaused) return; // stop if paused
        scrollAmount += 200; // pixels per move
        if (scrollAmount >= track.scrollWidth / 2) scrollAmount = 0;
        track.style.transform = `translateX(-${scrollAmount}px)`;
    }

    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        animateSlider();
    }, 2000); // 1s move + 1s wait

    // Pause/Play Button
    btn.onclick = () => {
        sliderPaused = !sliderPaused;
        btn.textContent = sliderPaused ? "▶ Play" : "⏸ Pause";
    };
}


function changeMainImage(src) {
    document.getElementById('mainImage').src = src;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === src) {
            thumb.classList.add('active');
        }
    });
}

function zoomImage(src) {
    const modal = document.createElement('div');
    modal.className = 'zoom-modal';
    modal.onclick = () => modal.remove();
    
    modal.innerHTML = `
        <img src="${src}" alt="Product Image">
        <button class="zoom-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function selectSize(size, button) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

function selectColor(color, button) {
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    const currentQuantity = parseInt(quantityInput.value);
    const newQuantity = Math.max(1, currentQuantity + change);
    const maxQuantity = parseInt(quantityInput.getAttribute('max'));
    
    quantityInput.value = Math.min(newQuantity, maxQuantity);
}

// Cart Functions
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            selectedSize: product.sizes[0],
            selectedColor: product.colors[0]
        });
    }
    
    updateCartCount();
    saveCart();
    showMessage('Product added to Bag!', 'success');
    animateCartButton();
}

function addToCartWithOptions(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const selectedSize = document.querySelector('.size-btn.active')?.textContent || product.sizes[0];
    const selectedColor = document.querySelector('.color-btn.active')?.style.backgroundColor || product.colors[0];
    const quantity = parseInt(document.getElementById('quantity').value);
    
    const cartItem = {
        ...product,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor
    };
    
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    updateCartCount();
    saveCart();
    showMessage('Product added to Bag!', 'success');
    animateCartButton();
}

function buyNow(productId) {
    addToCart(productId);
    showPage('checkout');
}

function buyNowWithOptions(productId) {
    addToCartWithOptions(productId);
    showPage('checkout');
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function displayCart() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your Bag is empty</h2>
                <p>Add some products to get started!</p>
                <button class="shop-now-btn" onclick="showPage('products')">Shop Now</button>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    // === CART ITEMS ===
    cartContent.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.images[0]}" alt="${item.title}">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">PKR ${item.price.toLocaleString()}</p>
                <p class="cart-item-options">Size: ${item.selectedSize}, Color: ${item.selectedColor}</p>
                <p class="delivery-info">🚚 Delivery in 3–5 Business Days</p>
                <p class="delivery-express">⚡ Express Shipping Available</p>
                <p class="delivery-timer" id="deliveryTimer-${item.id}">
                    ⏳ Ships in <span class="countdown">--d --h --m --s</span>
                </p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1, '${item.selectedSize}', '${item.selectedColor}')">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1, '${item.selectedSize}', '${item.selectedColor}')">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.selectedSize}', '${item.selectedColor}')">Remove</button>
        </div>
    `).join('');

    // === CART SUMMARY ===
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let freeDeliveryThreshold = 5000;
    let deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 299;

    cartSummary.innerHTML = `
        <div class="cart-summary-box">
            <h3>Order Summary</h3>
            <p>Subtotal: <span>PKR ${subtotal.toLocaleString()}</span></p>
            <p>Delivery: <span>${deliveryFee === 0 ? "🎉 Free" : "PKR " + deliveryFee}</span></p>
            <p><strong>Total: <span>PKR ${(subtotal + deliveryFee).toLocaleString()}</span></strong></p>

            <!-- Bus Animation -->
            <div class="bus-track">
                <div class="bus">🚌</div>
            </div>

            <!-- Services -->
            <div class="cart-services">
                <p>✅ Free Delivery over PKR ${freeDeliveryThreshold.toLocaleString()}</p>
                <p>💳 Cash on Delivery</p>
                <p>↩️ Easy Returns</p>
                <p>🌍 Nationwide Shipping</p>
            </div>

            <button class="checkout-btn" onclick="proceedToCheckout()">Checkout</button>
        </div>
    `;

    startDeliveryCountdown(8);
}

// Countdown Timer (up to N days)
function startDeliveryCountdown(maxDays) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + maxDays);

    function updateCountdown() {
        let now = new Date().getTime();
        let t = deadline - now;

        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((t / (1000 * 60)) % 60);
        let seconds = Math.floor((t / 1000) % 60);

        const timers = document.querySelectorAll(".delivery-timer .countdown");
        timers.forEach(timer => {
            timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        });

        if (t <= 0) {
            timers.forEach(timer => { timer.textContent = "Expired"; });
            clearInterval(timerInterval);
        }
    }

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}


function updateCartQuantity(productId, change, size, color) {
    const itemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCartCount();
        saveCart();
        displayCart();
    }
}

function removeFromCart(productId, size, color) {
    const itemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
    );
    
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCartCount();
        saveCart();
        displayCart();
        showMessage('Item removed from Bag', 'success');
    }
}

function displayCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal > 5000 ? 0 : 200; // Free delivery over PKR 5000
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + deliveryCharges + tax;
    
    const cartSummary = document.getElementById('cartSummary');
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>PKR ${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Delivery:</span>
            <span>PKR ${deliveryCharges.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Tax:</span>
            <span>PKR ${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <strong>Total:</strong>
            <strong>PKR ${total.toLocaleString()}</strong>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showMessage('Your Bag is empty!', 'error');
        return;
    }
    
    displayOrderSummary();
    showPage('checkout');
}

function displayOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal > 5000 ? 0 : 200;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryCharges + tax;
    
    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item">
                    <span>${item.title} x${item.quantity}</span>
                    <span>PKR ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>PKR ${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Delivery:</span>
            <span>PKR ${deliveryCharges.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Tax:</span>
            <span>PKR ${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <strong>Total:</strong>
            <strong>PKR ${total.toLocaleString()}</strong>
        </div>
    `;
}

// Filters
function filterProducts(category) {
    if (category) {
        filteredProducts = allProducts.filter(product => product.category === category);
    } else {
        filteredProducts = [...allProducts];
    }
    displayProducts(filteredProducts);
    showPage('products');
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    
    let filtered = [...allProducts];
    
    // Category filter
    if (categoryFilter) {
        filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Stock filter
    if (stockFilter === 'instock') {
        filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outstock') {
        filtered = filtered.filter(product => product.stock === 0);
    }
    
    // Price filter
    if (priceFilter === 'low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'high') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    filteredProducts = filtered;
    displayProducts(filteredProducts);
}

// Search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            displayProducts(allProducts);
            return;
        }
        
        const searchResults = allProducts.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        displayProducts(searchResults);
    });
}

// Authentication
function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

// function googleSignIn() {
//     // Implement Google Sign-In
//     if (typeof firebase !== 'undefined' && firebase.auth) {
//         const provider = new firebase.auth.GoogleAuthProvider();
//         firebase.auth().signInWithPopup(provider)
//             .then((result) => {
//                 currentUser = result.user;
//                 showMessage('Signed in successfully!', 'success');
//                 showPage('profile');
//                 updateUserInterface();
//             })
//             .catch((error) => {
//                 showMessage('Sign in failed: ' + error.message, 'error');
//             });
//     } else {
//         // Mock Google sign-in for demo
//         currentUser = {
//             displayName: 'Demo User',
//             email: 'demo@example.com',
//             photoURL: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
//         };
//         showMessage('Signed in successfully! (Demo)', 'success');
//         showPage('profile');
//         updateUserInterface();
//     }
// }

function displayProfile() {
    const container = document.getElementById('profileContainer');
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="auth-required">
                <h2>Please Sign In</h2>
                <p>You need to sign in to view your profile.</p>
                <button class="auth-btn" onclick="showPage('login')">Sign In</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="profile-header">
            <img src="${currentUser.photoURL || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop'}" alt="Profile" class="profile-image">
            <div class="profile-info">
                <h1>${currentUser.displayName || 'User'}</h1>
                <p>${currentUser.email}</p>
                <button class="edit-profile-btn" onclick="editProfile()">Edit Profile</button>
            </div>
        </div>
        
        <div class="profile-sections">
            <div class="profile-section">
                <h3>Order History</h3>
                <p>View your past orders and track current ones.</p>
            </div>
            
            <div class="profile-section">
                <h3>Favorites</h3>
                <p>Manage your favorite products.</p>
            </div>
            
            <div class="profile-section">
                <h3>Settings</h3>
                <p>Update your preferences and account settings.</p>
            </div>
        </div>
    `;
}

function updateUserInterface() {
    const loginBtn = document.querySelector('.login-btn span');
    if (currentUser) {
        loginBtn.textContent = currentUser.displayName || 'Profile';
        loginBtn.parentElement.onclick = () => showPage('profile');
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.parentElement.onclick = () => showPage('login');
    }
}

// Reviews
function loadReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    const sampleReviews = [
        {
            name: 'Shafique ur Rehman',
            avatar: 'shafique.jpeg',
            rating: 5,
            text: 'Amazing quality and fast delivery! Love shopping here.'
        },
        {
            name: 'Muhammad ALi',
            avatar: 'ali.JPG',
            rating: 4,
            text: 'Great products and excellent customer service. Highly recommended!'
        },
        {
            name: 'Hania Khan',
            avatar: 'hania.jpeg',
            rating: 3,
            text: 'Beautiful clothing collection. Perfect fit and best quality.'
        }
    ];
    
    reviewsContainer.innerHTML = sampleReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <img src="${review.avatar}" alt="${review.name}" class="review-avatar">
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}


 function displayProfile() {
    const container = document.getElementById('profileContainer');
    if (!currentUser) {
      container.innerHTML = `
        <div class="auth-required">
          <h2>Please Sign In</h2>
          <p>You need to sign in to view your profile.</p>
          <button class="auth-btn" onclick="showPage('login')">Sign In</button>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="profile-header">
        <img src="${currentUser.photoURL || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop'}" alt="Profile" class="profile-image">
        <div class="profile-info">
          <h1>${currentUser.displayName || 'User'}</h1>
          <p>${currentUser.email}</p>
          <button class="edit-profile-btn" onclick="editProfile()">Edit Profile</button>
        </div>
      </div>
      <div class="profile-sections">
        <div class="profile-section"><h3>Order History</h3><p>View your past orders and track current ones.</p></div>
        <div class="profile-section"><h3>Favorites</h3><p>Manage your favorite products.</p></div>
        <div class="profile-section"><h3>Settings</h3><p>Update your preferences and account settings.</p></div>
      </div>`;
  }
  // Email/Password Signup
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((result) => {
      currentUser = result.user;
      showMessage(`Welcome back ${currentUser.email}!`, "success");
      showPage("profile"); // go to profile page
      updateUserInterface();
    })
    .catch((error) => {
      console.error("Login error:", error);
      showMessage(error.message, "error");
    });
});

// Handle Signup form
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      currentUser = result.user;

      // Save user data to Firestore
      saveUserData(currentUser.uid, {
        email: currentUser.email,
        createdAt: new Date().toISOString(),
      });

      showMessage(`Account created for ${currentUser.email}!`, "success");
      showPage("profile");
      updateUserInterface();
    })
    .catch((error) => {
      console.error("Signup error:", error);
      showMessage(error.message, "error");
    });
});

 (function() {
    emailjs.init("ZKJrFdtrTk4pQYv1j"); // replace with your actual public key
  })();

  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };

    try {
        await emailjs.send('service_2m9hw9p', 'template_y345958', data);
        showMessage('✅ Message sent successfully!', 'success');
        e.target.reset();
    } catch (error) {
        console.error('EmailJS error:', error);
        showMessage('❌ Failed to send message. Please try again.', 'error');
    }
  });

  function showMessage(message, type) {
    const msgBox = document.createElement("div");
    msgBox.textContent = message;
    msgBox.className = type === "success" ? "msg-success" : "msg-error";
    document.body.appendChild(msgBox);
    setTimeout(() => msgBox.remove(), 3000);
  }
// ✅ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Handle checkout form submit
document.getElementById('checkoutForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Build orderData with all product details
  const orderData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    city: formData.get('city'),
    address: formData.get('address'),
    payment: formData.get('payment'),

    // 🛒 Full cart details
    items: cart.map(item => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      color: item.selectedColor || null,   // ✅ save selected color
      size: item.selectedSize || null,     // ✅ save selected size
      category: item.category || null,
      stock: item.stock,
      discount: item.discount,
      image: item.images ? item.images[0] : null, // first product image
      subtotal: item.price * item.quantity
    })),

    // 💰 Order summary
    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),

    createdAt: new Date().toISOString()
  };

  try {
    // ✅ Save to Firestore under "orders" collection
    await db.collection("orders").add(orderData);

    showMessage('✅ Order send successfully!', 'success');

    // Reset cart
    cart = [];
    updateCartCount();
    saveCart();
    showPage('home');

  } catch (error) {
    console.error("❌ Firebase Error:", error);
    showMessage('⚠️ Failed to save order. Please try again.', 'error');
  }
});

// ✅ Example message popup
function showMessage(message, type) {
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.className = type === "success" ? "msg-success" : "msg-error";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

// Utility Functions
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 3000);
}

function animateCartButton() {
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.classList.add('bounce');
    setTimeout(() => {
        cartBtn.classList.remove('bounce');
    }, 600);
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showMessage('Something went wrong. Please refresh the page.', 'error');
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
}
function switchAuthTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const tabs = document.querySelectorAll(".auth-tab");

  if (tab === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    tabs[1].classList.add("active");
    tabs[0].classList.remove("active");
  }
}
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  const phoneInput = this.phone.value.trim();
  const phoneRegex = /^(\+92[0-9]{10}|03[0-9]{9})$/;

  if (!phoneRegex.test(phoneInput)) {
    e.preventDefault(); // stop form
    alert("Please enter a valid Pakistani phone number (e.g. +923001234567 or 03001234567).");
  }
});
