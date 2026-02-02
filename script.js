// ===== DOM Elements =====
const navMenu = document.getElementById('navMenu');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const themeToggle = document.getElementById('themeToggle');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const backToTop = document.getElementById('backToTop');
const newsletterForm = document.querySelector('.newsletter-form');

// ===== State Management =====
let cart = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeAnimations();
    setupEventListeners();
    updateCartUI();
});

// ===== Theme Management =====
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
}

// ===== Shopping Cart =====
function toggleCart() {
    cartModal.classList.toggle('active');
    document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
}

function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productOrId) {
    let product;
    if (typeof productOrId === 'number' || typeof productOrId === 'string') {
        product = products.find(p => p.id == productOrId);
    } else {
        product = productOrId;
    }

    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartUI();
    showNotification('Product removed from cart!');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) cartCountElement.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const imageSrc = item.image || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&q=80&w=200';
            return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${imageSrc}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&q=80&w=200'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        }).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmountElement = document.querySelector('.total-amount');
    if (totalAmountElement) totalAmountElement.textContent = `₹${total}`;
}

// ===== Animations =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .scale-in, .slide-in-left').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Cart
    cartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', closeCart);
    cartClose.addEventListener('click', closeCart);

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Scroll events
    window.addEventListener('scroll', handleScroll);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
}

// ===== Scroll Handling =====
function handleScroll() {
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');

    // Header shadow on scroll
    if (window.scrollY > 10) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }

    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
}

// ===== Newsletter =====
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    if (email) {
        showNotification('Thank you for subscribing! Check your email for confirmation.');
        e.target.reset();
    }
}

// ===== Notifications =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Product Data =====
const products = [
    {
        id: 1,
        name: 'Handwoven Banarasi Silk Saree',
        price: 3500,
        image: 'https://cdn.shopify.com/s/files/1/1950/6115/files/WhatsApp_Image_2024-03-27_at_20.18.49_480x480.jpg?v=1712393008',
        category: 'Sarees'
    },
    {
        id: 2,
        name: 'Traditional Cotton Dhoti',
        price: 800,
        image: 'https://i.pinimg.com/736x/80/ed/ac/80edac0e8846939e1db831a0751c7b98.jpg',
        category: 'Dhotis'
    },
    {
        id: 3,
        name: 'Indigo Print Cotton Kurta',
        price: 1200,
        image: 'https://stylum.in/cdn/shop/products/INDIGOBIRD_5.jpg?v=1747974168',
        category: 'Kurtas'
    },
    {
        id: 4,
        name: 'Pure Tussar Silk Saree',
        price: 4200,
        image: 'https://clothsvilla.com/cdn/shop/products/12006-1_80428a2e-f336-43b0-b0e3-dc02390f11f3_1024x1024.jpg?v=1698779035',
        category: 'Sarees'
    },
    {
        id: 5,
        name: 'Phulkari Embroidered Kurti',
        price: 1850,
        image: 'https://trinjann.com/wp-content/uploads/2022/08/TRJ146-5-scaled.jpg',
        category: 'Kurtis'
    },
    {
        id: 6,
        name: 'Kerala Silk Mundu',
        price: 2100,
        image: 'https://images.jdmagicbox.com/quickquotes/images_main/silk-dhoti-kurta-set-for-men-802708837-8bzfx9zl.jpg',
        category: 'Dhotis'
    },
    {
        id: 7,
        name: 'Lucknow Chikankari Kurta',
        price: 2400,
        image: 'https://thechikanlabel.com/cdn/shop/files/Rubina_Dilaik.jpg?v=1736160987&width=1045',
        category: 'Kurtas'
    },
    {
        id: 8,
        name: 'Kanjeevaram Silk Saree',
        price: 6500,
        image: 'https://pub-95ccf2d427eb4955a7de1c41d3fa57dd.r2.dev/blog-g3fashion-com/2021/04/Kajal-Agarwal-in-Kanjivaram-Silk-Saree-1024x1024.jpg',
        category: 'Sarees'
    },
    {
        id: 9,
        name: 'Hand Block Print Saree',
        price: 1500,
        image: 'https://www.craftyle.com/cdn/shop/files/jet-black-hand-block-mulberryi-pure-silk-saree-cwsblxxx0041-476.webp?v=1767553262&width=1100',
        category: 'Sarees'
    },
    {
        id: 10,
        name: 'Hand-painted Kalamkari Saree',
        price: 3200,
        image: 'https://southindiafashion.com/wp-content/uploads/2022/05/pooja-hegde-in-pista-green-saree-by-archana-jaju-1.jpg',
        category: 'Sarees'
    }
];

// ===== Utility Functions =====
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add cart item styles dynamically
const cartStyles = `
    <style>
        .cart-item {
            display: flex;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border);
            animation: slideInLeft 0.3s ease;
        }
        
        .cart-item-image {
            width: 80px !important;
            height: 80px !important;
            border-radius: var(--radius-md) !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
            background-color: var(--tertiary-color);
        }
        
        .cart-item-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
        }
        
        .cart-item-details {
            flex: 1;
        }
        
        .cart-item-details h4 {
            font-size: 1rem;
            margin-bottom: var(--spacing-xs);
            color: var(--text-primary);
        }
        
        .cart-item-price {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .cart-item-quantity button {
            width: 24px;
            height: 24px;
            border: 1px solid var(--border);
            background: var(--surface);
            border-radius: var(--radius-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
        }
        
        .cart-item-quantity button:hover {
            background: var(--primary-color);
            color: var(--tertiary-color);
            border-color: var(--primary-color);
        }
        
        .cart-item-quantity span {
            min-width: 20px;
            text-align: center;
            font-weight: 500;
        }
        
        .cart-item-remove {
            background: none;
            border: none;
            color: var(--error);
            cursor: pointer;
            padding: var(--spacing-xs);
            transition: color var(--transition-fast);
        }
        
        .cart-item-remove:hover {
            color: var(--error);
        }
        
        .notification {
            font-family: var(--font-secondary);
            font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
            .cart-item {
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .cart-item-image {
                width: 100%;
                height: 120px;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', cartStyles);

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
