let getProductButtonId = "#get-one-product-button"
let productIdInputId = "#product-id-input"

// ! primi problemi con variabili con i nomi doppi
// ! => creazione di un file a parte da includere
const apiBaseUrl = "http://localhost:8080/storage"

function reduce() {
    $.ajax({
        url: `${apiBaseUrl}/products/decrease`,
        type: "PUT",
        dataType: "json",
        data: { product_id: $(productIdInputId).val() },
        contentType: "application/json",
        success: function (res) {
            console.log(res)
        },
        error: function (err, status) {
            console.error(err)
            alert(status)
        },
    })
}
$(getProductButtonId).click(function () {
    reduce()
})
