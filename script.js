const PRICE_PER_KG = 400;
const MINIMUM_ORDER = 10;
// =========================
// GET ELEMENTS
// =========================
const quantityInput =
    document.getElementById("quantity");
const totalPrice =
    document.getElementById("totalPrice");
const orderForm =
    document.getElementById("orderForm");
const orderMessage =
    document.getElementById("orderMessage");
// =========================
// CALCULATE TOTAL
// =========================
function calculateTotal() {
    const quantity =
        Number(quantityInput.value);
    if (
        quantity < MINIMUM_ORDER ||
        isNaN(quantity)
    ) {
        totalPrice.textContent =
            "Minimum 10 KG";
        return;
    }
    const total =
        quantity * PRICE_PER_KG;
    totalPrice.textContent =
        "₹" +
        total.toLocaleString("en-IN");
}
// Calculate when quantity changes
quantityInput.addEventListener(
    "input",
    calculateTotal
);
// =========================
// ORDER FORM
// =========================
orderForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        const name =
            document
                .getElementById("customerName")
                .value
                .trim();
        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();
        const quantity =
            Number(quantityInput.value);
        const address =
            document
                .getElementById("address")
                .value
                .trim();
        // Check quantity
        if (
            quantity < MINIMUM_ORDER ||
            isNaN(quantity)
        ) {
            orderMessage.textContent =
                "⚠️ Minimum order is 10 KG.";
            return;
        }
        // Check phone
        if (
            phone.length < 10
        ) {
            orderMessage.textContent =
                "⚠️ Please enter a valid phone number.";
            return;
        }
        const total =
            quantity * PRICE_PER_KG;
        /*
        ===================================
        IMPORTANT
        ===================================
        Replace this with your business
        WhatsApp number.
        Example:
        919876543210
        ===================================
        */
        const businessWhatsApp =
            "91 8367450301";
        // WhatsApp message
        const message =
            "🌶️ MANA RUCHI ORDER 🌶️\n\n" +
            "Customer Name: " +
            name +
            "\n" +
            "Phone: " +
            phone +
            "\n" +
            "Product: Homemade Chilli Powder\n" +
            "Quantity: " +
            quantity +
            " KG\n" +
            "Price: ₹400/KG\n" +
            "Total Amount: ₹" +
            total.toLocaleString("en-IN") +
            "\n\n" +
            "Delivery Address:\n" +
            address;
        const whatsappURL =
            "https://wa.me/" +
            businessWhatsApp +
            "?text=" +
            encodeURIComponent(message);
        // Show confirmation
        orderMessage.textContent =
            "✅ Order details ready. Opening WhatsApp...";
        // Open WhatsApp
        window.open(
            whatsappURL,
            "_blank"
        );
    }
);
// Initial calculation
calculateTotal();