// Fetch API data
const container = document.querySelector("#container")
const API_URL = "https://v2.api.noroff.dev/gamehub"

async function fetchAndCreateProduct(){
    try {
        const params = new URLSearchParams(window.location.search)
        const id = params.get("id")
        if (!id){
            container.textContent = "No product id available"
            return
        }
        
        // Show loading state
        container.innerHTML = '<p>Loading product...</p>'
        
        const response = await fetch (`${API_URL}/${id}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const product = data.data

        // Clear loading state
        container.innerHTML = ''

        const productDiv = document.createElement("div")
        const productGallery = document.createElement("div")
        const productInfo = document.createElement("div")
        const mainImage = document.createElement("img")
        const title = document.createElement("h1")
        const price = document.createElement("p")
        const description = document.createElement("p")
        const platformTags = document.createElement("div")
        const addButton = document.createElement("button")
        const productSpecs = document.createElement("div")
        const specsTitle = document.createElement("h3")
        const specsList = document.createElement("dl")

        // Set classes
        productDiv.className = 'product-details'
        productGallery.className = 'product-gallery'
        productInfo.className = 'product-info'
        mainImage.className = 'main-image'
        title.className = 'product-title'
        price.className = 'product-price'
        description.className = 'product-description'
        platformTags.className = 'platform-tags'
        addButton.className = 'btn add-to-basket'
        productSpecs.className = 'product-specs'

        // Set content
        mainImage.src = product.image.url
        mainImage.alt = product.image.alt
        title.textContent = product.title
        price.textContent = `$${product.price}`
        description.textContent = product.description
        addButton.textContent = 'Add to Basket'
        addButton.dataset.id = product.id
        specsTitle.textContent = 'Game Details'

        // Create platform tags
        const genreTag = document.createElement("span")
        genreTag.className = 'platform-tag'
        genreTag.textContent = product.genre
        platformTags.appendChild(genreTag)

        // Create specs
        const specs = [
            ['Genre', product.genre],
            ['Age Rating', product.ageRating],
            ['Released', product.released],
            ['On Sale', product.onSale ? 'Yes' : 'No']
        ]

        specs.forEach(([term, definition]) => {
            const dt = document.createElement("dt")
            const dd = document.createElement("dd")
            dt.textContent = term + ':'
            dd.textContent = definition
            specsList.appendChild(dt)
            specsList.appendChild(dd)
        })

        // Build structure
        productGallery.appendChild(mainImage)
        productInfo.appendChild(title)
        productInfo.appendChild(price)
        productInfo.appendChild(platformTags)
        productInfo.appendChild(description)
        productInfo.appendChild(addButton)
        productSpecs.appendChild(specsTitle)
        productSpecs.appendChild(specsList)
        productInfo.appendChild(productSpecs)
        productDiv.appendChild(productGallery)
        productDiv.appendChild(productInfo)

        container.appendChild(productDiv)
        
        // Add event listener for add to basket button
        addButton.addEventListener('click', (e) => {
            const productId = e.target.dataset.id
            addToCart(productId)
        })
        
       
    } catch (error) {
        console.error("Failed to fetch and create product", error)
        container.innerHTML = '<p>Failed to load product. Please try again later.</p>'
    }
}

fetchAndCreateProduct()

