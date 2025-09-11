// Checkout page with API integration
const cartList = document.querySelector("#cart-list")
const cartSummary = document.querySelector("#cart-summary")
const API_URL = "https://v2.api.noroff.dev/gamehub"

// Initialize cart from localStorage
let cartItems = getCart()

async function fetchAndDisplayCart() {
    try {
        // Show loading state
        cartList.innerHTML = '<p>Loading cart...</p>'
        
        const cartWithDetails = []
        
        // details for cart items
        for (const item of cartItems) {
            const response = await fetch(`${API_URL}/${item.id}`)
            if (response.ok) {
                const data = await response.json()
                const product = data.data
                cartWithDetails.push({
                    ...product,
                    quantity: item.quantity
                })
            }
        }
        
        // Clear loading state
        cartList.innerHTML = ''
        
        displayCartItems(cartWithDetails)
        
        updateCartSummary(cartWithDetails)
        
    } catch (error) {
        console.error("Failed to fetch cart items", error)
        cartList.innerHTML = '<p>Failed to load cart items. Please try again later.</p>'
    }
}

function displayCartItems(items) {
    if (items.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>'
        return
    }
    
    items.forEach(item => {
        const cartItem = document.createElement("div")
        cartItem.className = 'cart-item'
        cartItem.dataset.id = item.id
        
        cartItem.innerHTML = `
            <img src="${item.image.url}" alt="${item.image.alt}">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">$${item.price}</p>
            </div>
            <div class="cart-item-quantity">
                <span>Qty: ${item.quantity}</span>
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-warning" data-action="remove" data-id="${item.id}">Remove</button>
                <button class="btn btn-primary" data-action="add" data-id="${item.id}">Add</button>
            </div>
        `
        
        cartList.appendChild(cartItem)
    })
    
        // add to cart listeners
        addCartActionListeners()
        
        // proceed to checkout listener
        addProceedToCheckoutListener()
}

function updateCartSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 2.50 
    const total = subtotal + shipping
    
    cartSummary.innerHTML = `
        <h2>Order Summary</h2>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
                    <a href="/checkout/confirmation/" class="btn btn-success" style="width: 100%; margin-top: 1rem;" id="proceed-checkout">
                        Proceed to Checkout
                    </a>
    `
}

function addCartActionListeners() {
    const actionButtons = document.querySelectorAll('[data-action]')
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action
            const itemId = e.target.dataset.id
            
        if (action === 'remove') {
            removeFromCartInCheckout(itemId)
        } else if (action === 'add') {
            addToCartInCheckout(itemId)
        }
        })
    })
}

function removeFromCartInCheckout(itemId) {
    removeFromCart(itemId)
    cartItems = getCart()
    fetchAndDisplayCart()
}

function addToCartInCheckout(itemId) {
    addToCart(itemId)
    cartItems = getCart()
    fetchAndDisplayCart()
}

// event listener for proceed to checkout button
function addProceedToCheckoutListener() {
    const proceedButton = document.querySelector('#proceed-checkout')
    if (proceedButton) {
        proceedButton.addEventListener('click', (e) => {
            e.preventDefault() 
            // Clear the cart when proceeding to checkout
            clearCart()
            sessionStorage.setItem('checkout-completed', 'true')
            window.location.href = '/checkout/confirmation/?checkout=true'
        })
    }
}


fetchAndDisplayCart()
