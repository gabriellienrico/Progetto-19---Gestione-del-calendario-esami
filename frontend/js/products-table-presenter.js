let fetchProductBtn = "#fetch-products"
let fetchProductCatBtn = "#filter-products"

const apiBaseUrl = "http://localhost:8080/storage"

function fetchProducts() {
    $.ajax({
        url: `${apiBaseUrl}/products`,
        type: "GET",
        dataType: "json",
        success: function (res) {
            console.log(res)
            renderProducts(res.products)
        },
        error: function (err, status) {
            console.error(err)
            alert(status + ": " + err)
        },
    })
}
$(fetchProductBtn).click(function () {
    fetchProducts()
    populateCategoriesDropdown()
})

$(fetchProductCatBtn).click(function () {
    const selectedCategory = $("#category-dropdown").val()
    if (!selectedCategory) {
        alert("Seleziona una categoria")
        return
    }

    $.ajax({
        url: `${apiBaseUrl}/products`,
        type: "GET",
        dataType: "json",
        success: function (res) {
            const filteredProducts = res.products.filter(
                (product) => product.category === selectedCategory
            )
            renderProducts(filteredProducts)
        },
        error: function (err, status) {
            console.error(err)
            alert(status + ": " + err)
        },
    })
})

function populateCategoriesDropdown() {
    $.ajax({
        url: `${apiBaseUrl}/products/categories`,
        type: "GET",
        dataType: "json",
        success: function (res) {
            const categories = res.categories
            const dropdown = $("#category-dropdown")
            dropdown.html(
                '<option value="" disabled>Seleziona una categoria</option>'
            )
            categories.forEach((category) => {
                dropdown.append(
                    `<option value="${category}">${category}</option>`
                )
            })
        },
        error: function (err, status) {
            console.error(err)
            alert(status + ": " + err)
        },
    })
}

function renderProducts(products) {
    const tableBody = $("#product-table")
    tableBody.empty()

    products.forEach((product) => {
        tableBody.append(`
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product["price-piece"]}</td>
                <td>${product.quantity}</td>
                <td>${product.category}</td>
                <td>${product.stock_status}</td>
                <td>${product.total_value}</td>
            </tr>
        `)
    })

    if (products.length === 0) {
        tableBody.append(
            '<tr><td colspan="6" class="text-center">Nessun prodotto trovato</td></tr>'
        )
    }
}

// $(document).ready(function () {})
