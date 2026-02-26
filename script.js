/**
 * The JavaScript code defines a BookBazar application that manages books, shopping cart, user
 * authentication, book selling, and includes features like filtering, searching, notifications, and
 * modals.
 */
// ========== CLEAN UP DUPLICATES ==========
// Remove any existing declarations to avoid conflicts
if (window.sampleBooks) delete window.sampleBooks;
if (window.books) delete window.books;
if (window.cart) delete window.cart;

// ========== GLOBAL VARIABLES ==========
let books = []; // All books
let cart = []; // Shopping cart
let currentUser = null; // Logged in user
let currentFilter = 'all'; // Current category filter

// ========== BOOK DATA (Sample Books) ==========
const sampleBooks = [
    {
        id: 1,
        title: "Web Development Basics",
        author: "John Doe",
        category: "textbooks",
        price: 450,
        condition: "like-new",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        seller: "CS Student",
        description: "Perfect condition, barely used. Includes all chapters.",
        rating: 4.5,
        stock: 3
    },
    {
        id: 2,
        title: "Business Strategies",
        author: "Jane Smith",
        category: "business",
        price: 600,
        condition: "new",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop",
        seller: "MBA Student",
        description: "Brand new, latest edition. Perfect for management students.",
        rating: 4.8,
        stock: 1
    },
    {
        id: 3,
        title: "Romantic Evenings",
        author: "Emily Rose",
        category: "romance",
        price: 250,
        condition: "good",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
        seller: "Arts Student",
        description: "Good condition, some pages highlighted.",
        rating: 4.2,
        stock: 2
    },
    {
        id: 4,
        title: "Computer Programming",
        author: "Robert Martin",
        category: "textbooks",
        price: 700,
        condition: "new",
        image: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=400&h=300&fit=crop",
        seller: "CS Final Year",
        description: "Latest edition with practice problems.",
        rating: 4.9,
        stock: 5
    },
    {
        id: 5,
        title: "The Great Novel",
        author: "Mark Twain",
        category: "novels",
        price: 350,
        condition: "fair",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop",
        seller: "Literature Student",
        description: "Classic novel, slightly worn cover but pages intact.",
        rating: 4.7,
        stock: 1
    },
    {
        id: 6,
        title: "Financial Management",
        author: "Warren Buffet",
        category: "business",
        price: 550,
        condition: "like-new",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
        seller: "Finance Major",
        description: "Excellent for finance students.",
        rating: 4.6,
        stock: 3
    },
    {
        id: 7,
        title: "Love Stories",
        author: "Nicholas Sparks",
        category: "romance",
        price: 300,
        condition: "good",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        seller: "English Student",
        description: "Collection of romantic short stories.",
        rating: 4.3,
        stock: 4
    },
    {
        id: 8,
        title: "Academic Research",
        author: "Dr. James Wilson",
        category: "academic",
        price: 800,
        condition: "new",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
        seller: "PhD Scholar",
        description: "Advanced research methodology.",
        rating: 4.8,
        stock: 2
    }
];

// ========== DOM ELEMENTS ==========
let elements = {};

function initializeElements() {
    elements = {
        // Modals
        authModal: document.getElementById('authModal'),
        sellBookModal: document.getElementById('sellBookModal'),
        cartModal: document.getElementById('cartModal'),
        bookDetailsModal: document.getElementById('bookDetailsModal'),
        
        // Forms
        loginForm: document.getElementById('loginForm'),
        signupForm: document.getElementById('signupForm'),
        sellBookForm: document.getElementById('sellBookForm'),
        
        // Buttons
        loginBtn: document.getElementById('loginBtn'),
        signupBtn: document.getElementById('signupBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        sellBookBtn: document.getElementById('sellBookBtn'),
        cartIcon: document.querySelector('.cart-icon'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        
        // Containers
        booksContainer: document.getElementById('booksContainer'),
        cartItems: document.getElementById('cartItems'),
        cartTotalAmount: document.getElementById('cartTotalAmount'),
        cartCount: document.querySelector('.cart-count'),
        
        // Search
        searchInput: document.querySelector('.search-input'),
        searchCategory: document.querySelector('.search-category'),
        searchBtn: document.querySelector('.search-btn'),
        
        // Filters
        filterButtons: document.querySelectorAll('.btn-filter'),
        
        // User info
        userName: document.getElementById('userName'),
        userEmail: document.getElementById('userEmail'),
        
        // Dashboard elements
        dashboard: document.getElementById('dashboard'),
        cartCountElement: document.getElementById('cartCount'),
        wishlistCount: document.getElementById('wishlistCount'),
        orderCount: document.getElementById('orderCount'),
        messageCount: document.getElementById('messageCount')
    };
}

// ========== INITIALIZATION ==========
function init() {
    
    // Initialize DOM elements
    initializeElements();
    
    // Load data from localStorage or use sample
    loadData();
    
    // Render books
    renderBooks();
    
    // Update cart count
    updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
   // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    // Force select to blur after change so the arrow rotates back
    document.querySelectorAll('.search-category').forEach(select => {
    select.addEventListener('change', function() {
        this.blur();
    });
});

    if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('show');
        // Change icon between bars and times
        const icon = this.querySelector('i');
        if (navLinks.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinks.classList.remove('show');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked (for single page navigation)
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}
    // Back to Top button
     const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
    
    // Check if user is logged in
    checkLoginStatus();
    
}

// ========== DATA MANAGEMENT ==========
function loadData() {
    // Try to load from localStorage
    const savedBooks = localStorage.getItem('bookbazar_books');
    const savedCart = localStorage.getItem('bookbazar_cart');
    const savedUser = localStorage.getItem('bookbazar_user');
    
    books = savedBooks ? JSON.parse(savedBooks) : sampleBooks;
    cart = savedCart ? JSON.parse(savedCart) : [];
    currentUser = savedUser ? JSON.parse(savedUser) : null;
    
}

function saveData() {
    localStorage.setItem('bookbazar_books', JSON.stringify(books));
    localStorage.setItem('bookbazar_cart', JSON.stringify(cart));
    if (currentUser) {
        localStorage.setItem('bookbazar_user', JSON.stringify(currentUser));
    }
}

// ========== BOOK RENDERING ==========
function renderBooks(filteredBooks = null) {
    const booksToRender = filteredBooks || books;
    const container = elements.booksContainer;
    
    if (!container) {
        console.error("Books container not found!");
        return;
    }
    
    
    container.innerHTML = '';
    
    if (booksToRender.length === 0) {
        container.innerHTML = `
            <div class="no-books">
                <i class="fas fa-book-open"></i>
                <h3>No books found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
        return;
    }
    
    booksToRender.forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = book.id;
    card.dataset.category = book.category;
    
    // Format price
    const formattedPrice = `₹${book.price}`;
    
    // Condition badge color
    const conditionColors = {
        'new': '#10b981',
        'like-new': '#2563eb',
        'good': '#f59e0b',
        'fair': '#6b7280'
    };
    
    card.innerHTML = `
        <div class="book-image">
            <img src="${book.image}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop'">
        </div>
        <div class="book-info">
            <h4>${book.title}</h4>
            <p class="book-author">by ${book.author}</p>
            <div class="book-meta">
                <span class="book-price">${formattedPrice}</span>
                <span class="book-condition" style="background: ${conditionColors[book.condition] || '#e5e7eb'}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">
                    ${book.condition.replace('-', ' ').toUpperCase()}
                </span>
            </div>
            <div class="rating">
                ${generateStarRating(book.rating)}
                <span style="color: #6b7280; font-size: 0.9rem; margin-left: 5px;">${book.rating.toFixed(1)}</span>
            </div>
            <div class="book-actions">
                <button class="btn btn-primary btn-view" data-id="${book.id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-outline btn-add-to-cart" data-id="${book.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star" style="color: #f59e0b;"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #f59e0b;"></i>';
        } else {
            stars += '<i class="far fa-star" style="color: #d1d5db;"></i>';
        }
    }
    
    return stars;
}

// ========== FILTERING & SEARCH ==========
function filterBooks(category) {
    currentFilter = category;
    
    if (category === 'all') {
        renderBooks();
    } else {
        const filteredBooks = books.filter(book => book.category === category);
        renderBooks(filteredBooks);
    }
    
    // Update active filter button
    elements.filterButtons.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function searchBooks() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const category = elements.searchCategory.value;
    
    let filteredBooks = books;
    
    // Filter by search term
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by category
    if (category) {
        filteredBooks = filteredBooks.filter(book => book.category === category);
    }
    
    renderBooks(filteredBooks);
}

// ========== CART MANAGEMENT ==========
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        if (existingItem.quantity < book.stock) {
            existingItem.quantity += 1;
            showNotification(`${book.title} quantity increased!`);
        } else {
            showNotification(`Only ${book.stock} available in stock!`, 'error');
            return;
        }
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            seller: book.seller,
            quantity: 1
        });
        showNotification(`${book.title} added to cart!`);
    }
    
    updateCartCount();
    saveData();
    
    // If cart modal is open, update it
    if (elements.cartModal && elements.cartModal.classList.contains('show')) {
        renderCart();
    }
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    updateCartCount();
    saveData();
    renderCart();
    showNotification('Item removed from cart!');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (elements.cartCount) {
        elements.cartCount.textContent = totalItems;
    }
    
    // Update dashboard cart count if exists
    if (elements.cartCountElement) {
        elements.cartCountElement.textContent = totalItems;
    }
}

function renderCart() {
    const container = elements.cartItems;
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="closeModal('cartModal')">Continue Shopping</button>
            </div>
        `;
        if (elements.cartTotalAmount) {
            elements.cartTotalAmount.textContent = '₹0';
        }
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" width="60" height="80" style="object-fit: cover; border-radius: 8px;">
                <div class="cart-item-info">
                    <h4 style="margin: 0 0 5px 0; font-size: 1rem;">${item.title}</h4>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 0.9rem;">Seller: ${item.seller}</p>
                    <p style="margin: 0; color: #2563eb; font-weight: 600;">₹${item.price} × ${item.quantity} = ₹${itemTotal}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" class="remove-item" style="background: none; border: none; color: #ef4444; font-size: 1.5rem; cursor: pointer; padding: 5px;">×</button>
            </div>
        `;
    });
    
    container.innerHTML = cartHTML;
    if (elements.cartTotalAmount) {
        elements.cartTotalAmount.textContent = `₹${total}`;
    }
}

// ========== AUTHENTICATION ==========
function checkLoginStatus() {
    if (currentUser) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }
}

function loginUser(email, password) {
    // Demo login
    currentUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        type: 'buyer',
        joined: new Date().toISOString().split('T')[0]
    };
    
    saveData();
    showLoggedInState();
    closeModal('authModal');
    showNotification(`Welcome back, ${currentUser.name}!`);
}

function signupUser(name, email, password, userType) {
    // Demo signup
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        type: userType,
        joined: new Date().toISOString().split('T')[0]
    };
    
    saveData();
    showLoggedInState();
    closeModal('authModal');
    showNotification(`Welcome to BookBazar, ${name}!`);
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('bookbazar_user');
    showLoggedOutState();
    showNotification('Logged out successfully!');
}

function showLoggedInState() {
    // Update header
    if (elements.loginBtn) elements.loginBtn.classList.add('hidden');
    if (elements.signupBtn) elements.signupBtn.classList.add('hidden');
    if (elements.logoutBtn) elements.logoutBtn.classList.remove('hidden');
    
    // Update user info if elements exist
    if (elements.userName) {
        elements.userName.textContent = currentUser.name;
    }
    if (elements.userEmail) {
        elements.userEmail.textContent = currentUser.email;
    }
    
    // Show dashboard if exists
    if (elements.dashboard) {
        elements.dashboard.classList.remove('hidden');
        
        // Hide main sections
        document.querySelectorAll('.hero, .categories, .featured-books, .sell-section, .how-it-works').forEach(section => {
            if (section) section.classList.add('hidden');
        });
    }
}

function showLoggedOutState() {
    // Update header
    if (elements.loginBtn) elements.loginBtn.classList.remove('hidden');
    if (elements.signupBtn) elements.signupBtn.classList.remove('hidden');
    if (elements.logoutBtn) elements.logoutBtn.classList.add('hidden');
    
    // Hide dashboard if exists
    if (elements.dashboard) {
        elements.dashboard.classList.add('hidden');
        
        // Show main sections
        document.querySelectorAll('.hero, .categories, .featured-books, .sell-section, .how-it-works').forEach(section => {
            if (section) section.classList.remove('hidden');
        });
    }
}

// ========== BOOK SELLING ==========
function handleSellBook(event) {
    event.preventDefault();
    
    const formData = {
        id: Date.now(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        price: parseFloat(document.getElementById('bookPrice').value),
        condition: document.getElementById('bookCondition').value,
        description: document.getElementById('bookDescription').value,
        image: document.getElementById('bookImage').value || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop',
        seller: document.getElementById('sellerName').value,
        rating: 4.0,
        stock: 1
    };
    
    // Add to books array
    books.unshift(formData);
    
    // Save and render
    saveData();
    renderBooks();
    
    // Reset form and close modal
    event.target.reset();
    closeModal('sellBookModal');
    
    showNotification('Your book has been listed successfully!');
}

// ========== MODAL MANAGEMENT ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = document.getElementById('bookDetailsModal');
    if (!modal) return;
    
    const title = modal.querySelector('#modalBookTitle');
    const body = modal.querySelector('#modalBookDetails');
    
    if (title) title.textContent = book.title;
    
    if (body) {
        body.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                <div>
                    <img src="${book.image}" alt="${book.title}" style="width: 100%; border-radius: 12px;">
                </div>
                <div>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p><strong>Condition:</strong> ${book.condition.replace('-', ' ')}</p>
                    <p><strong>Price:</strong> ₹${book.price}</p>
                    <p><strong>Seller:</strong> ${book.seller}</p>
                    <p><strong>Stock:</strong> ${book.stock} available</p>
                    <p><strong>Rating:</strong> ${book.rating}/5</p>
                    <hr>
                    <p><strong>Description:</strong></p>
                    <p>${book.description}</p>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button class="btn btn-primary" onclick="addToCart(${book.id}); closeModal('bookDetailsModal')">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline" onclick="closeModal('bookDetailsModal')">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    openModal('bookDetailsModal');
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#ef4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close button style
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 15px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// ========== EVENT LISTENERS SETUP ==========
function setupEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Login button
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => openModal('authModal'));
    }
    
    // Signup button
    if (elements.signupBtn) {
        elements.signupBtn.addEventListener('click', () => {
            openModal('authModal');
            // Switch to signup tab
            document.querySelectorAll('.auth-tab').forEach(tab => {
                if (tab.dataset.tab === 'signup') {
                    tab.click();
                }
            });
        });
    }
    
    // Logout button
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', logoutUser);
    }
    
    // Sell book button
    if (elements.sellBookBtn) {
        elements.sellBookBtn.addEventListener('click', () => openModal('sellBookModal'));
    }
    
    // Cart icon
    if (elements.cartIcon) {
        elements.cartIcon.addEventListener('click', () => {
            renderCart();
            openModal('cartModal');
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            if (!currentUser) {
                showNotification('Please login to checkout!', 'error');
                openModal('authModal');
                return;
            }
            
            showNotification('Checkout successful! This is a demo - no actual purchase.', 'success');
            cart = [];
            updateCartCount();
            saveData();
            closeModal('cartModal');
        });
    }
    
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            const form = document.getElementById(`${tabName}Form`);
            if (form) form.classList.add('active');
        });
    });
    
    // Login form
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            loginUser(email, password);
        });
    }
    
    // Signup form
    if (elements.signupForm) {
        elements.signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const userType = document.getElementById('userType').value;
            signupUser(name, email, password, userType);
        });
    }
    
    // Sell book form
    if (elements.sellBookForm) {
        elements.sellBookForm.addEventListener('submit', handleSellBook);
    }
    
    // Search button
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', searchBooks);
    }
    
    // Search on Enter key
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }
    
    // Filter buttons
    if (elements.filterButtons) {
        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBooks(this.dataset.filter);
            });
        });
    }
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterBooks(category);
            // Scroll to books section
            const browseSection = document.getElementById('browse');
            if (browseSection) {
                browseSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Load more button
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', () => {
            showNotification('Loading more books...', 'success');
        });
    }
    
    // Delegated events for dynamically created elements
    document.addEventListener('click', function(e) {
        // Add to cart button
        if (e.target.closest('.btn-add-to-cart')) {
            const bookId = parseInt(e.target.closest('.btn-add-to-cart').dataset.id);
            addToCart(bookId);
        }
        
        // View book button
        if (e.target.closest('.btn-view')) {
            const bookId = parseInt(e.target.closest('.btn-view').dataset.id);
            showBookDetails(bookId);
        }
        
        // Quick actions in dashboard
        if (e.target.closest('#quickSell')) {
            openModal('sellBookModal');
        }
        if (e.target.closest('#quickSearch')) {
            if (elements.searchInput) elements.searchInput.focus();
        }
        if (e.target.closest('#quickCart')) {
            renderCart();
            openModal('cartModal');
        }
        if (e.target.closest('#quickProfile')) {
            showNotification('Profile editing demo - would show edit form', 'success');
        }
        if (e.target.closest('#browseBooksBtn')) {
            const browseSection = document.getElementById('browse');
            if (browseSection) {
                browseSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// ========== START APPLICATION ==========
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// ========== GLOBAL FUNCTIONS (for inline onclick) ==========
window.closeModal = closeModal;
window.openModal = openModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.showBookDetails = showBookDetails;
