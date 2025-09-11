const CART_KEY = 'gamehub-cart';

// Get cart from localStorage
function getCart() {
    const cartData = localStorage.getItem(CART_KEY);
    if (cartData) {
        return JSON.parse(cartData);
    }
    return [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(itemId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: itemId, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartDisplay();
}

// Remove item from cart 
function removeFromCart(itemId) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    
    saveCart(cart);
    updateCartDisplay();
}

// Clear entire cart
function clearCart() {
    console.log('Clearing cart...');
    console.log('localStorage before clear:', localStorage.getItem(CART_KEY));
    localStorage.removeItem(CART_KEY);
    console.log('localStorage after clear:', localStorage.getItem(CART_KEY));
    
    const cartLinks = document.querySelectorAll('.cart-link');
    cartLinks.forEach(link => {
        link.textContent = 'Cart';
        console.log('Immediately updated cart link to:', link.textContent);
    });
    
    updateCartDisplay();
    console.log('Cart cleared and display updated');
}

// Update cart display on all pages
function updateCartDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('Updating cart display:', totalItems, 'items');
    
    const cartLinks = document.querySelectorAll('.cart-link');
    console.log('Found cart links:', cartLinks.length);
    cartLinks.forEach(link => {
        if (totalItems > 0) {
            link.textContent = `Cart (${totalItems})`;
        } else {
            link.textContent = 'Cart';
        }
        console.log('Updated cart link:', link.textContent);
    });
}

// Check if cart was cleared after checkout
function checkCartReset() {
    const checkoutCompleted = sessionStorage.getItem('checkout-completed');
    console.log('Checking checkout completion flag:', checkoutCompleted);
    if (checkoutCompleted === 'true') {
        console.log('Checkout completed, clearing cart');
        clearCart();
        sessionStorage.removeItem('checkout-completed');
    }
    
    if (window.location.pathname.includes('confirmation')) {
        console.log('On confirmation page, forcing cart clear');
        clearCart();
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'true') {
        console.log('URL parameter indicates checkout completed, clearing cart');
        clearCart();
    }
}

// Initialize cart when page loads
function initCart() {
    console.log('Initializing cart...');
    checkCartReset();
    updateCartDisplay();
    
    // check if localStorage is empty and update
    const cart = getCart();
    if (cart.length === 0) {
        console.log('Cart is empty, forcing display update');
        updateCartDisplay();
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', initCart);

window.addEventListener('pageshow', updateCartDisplay);

// Listen for storage changes
window.addEventListener('storage', function(e) {
    if (e.key === CART_KEY) {
        console.log('localStorage cart changed, updating display');
        updateCartDisplay();
    }
});

// update cart display
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page became visible, updating cart display');
        updateCartDisplay();
    }
});
