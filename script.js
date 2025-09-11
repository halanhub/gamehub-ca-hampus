// Fetch API data
const container = document.querySelector("#container")
const filterSelect = document.querySelector("#filterSelectCategory")
const API_URL = "https://v2.api.noroff.dev/gamehub"

let allProducts = []

async function fetchAndCreateProducts(){
  try {
    // Show loading state
    container.innerHTML = '<p>Loading games...</p>'
    
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    allProducts = data.data

    // Clear loading state 
    container.innerHTML = ''

    displayProducts(allProducts)
    
    addToBasketListeners()

  }
   catch (error) {
    console.error("failed to fetch and create products", error)
    container.innerHTML = '<p>Failed to load games. Please try again later.</p>'
  }
}

function displayProducts(products) {
  container.innerHTML = ''
  
  products.forEach(product => {
    const card = document.createElement("article")
    const anchor = document.createElement("a")
    const image = document.createElement("img")
    const title = document.createElement("h3")
    const category = document.createElement("span")
    const price = document.createElement("p")
    const button = document.createElement("button")

    card.className = 'product-card'
    anchor.className = 'product-link'
    title.className = 'product-title'
    category.className = 'product-category'
    price.className = 'product-price'
    button.className = 'btn add-to-basket'

    image.src = product.image.url
    image.alt = product.image.alt
    title.textContent = product.title
    category.textContent = product.genre
    price.textContent = `$${product.price}`
    button.textContent = 'Add to Basket'
    button.dataset.id = product.id
    anchor.href = `product/index.html?id=${product.id}`

    anchor.appendChild(image)
    anchor.appendChild(title)
    card.appendChild(anchor)
    card.appendChild(category)
    card.appendChild(price)
    card.appendChild(button)

    container.appendChild(card)
  })
}

function filterProducts() {
  const selectedCategory = filterSelect.value.toLowerCase()
  
  if (selectedCategory === '') {
    displayProducts(allProducts)
  } else {
    const filteredProducts = allProducts.filter(product => 
      product.genre.toLowerCase() === selectedCategory
    )
    displayProducts(filteredProducts)
  }
  
  // event listeners for add to basket buttons
  addToBasketListeners()
}

// event listener for filter
filterSelect.addEventListener('change', filterProducts)

// event listeners add to basket buttons
function addToBasketListeners() {
  const addButtons = document.querySelectorAll('.add-to-basket')
  addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault() 
      const productId = e.target.dataset.id
      addToCart(productId)
    })
  })
}


fetchAndCreateProducts()

