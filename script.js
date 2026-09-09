// Mana Ruchi - Order System

const PRICE_PER_KG = 400;
const MINIMUM_ORDER = 10;

// Mana Ruchi WhatsApp Number
const BUSINESS_WHATSAPP = "918367450301";

// Get form elements
const orderForm = document.getElementById("orderForm");
const quantityInput = document.getElementById("quantity");
const totalAmount = document.getElementById("totalAmount");
const orderMessage = document.getElementById("orderMessage");

// Calculate total price
function calculateTotal() {
    const quantity = Number(quantityInput.value);

    if (!quantity || quantity < 0) {
        totalAmount.textContent = "₹0";
        return;
    }

    const total = quantity * PRICE_PER_KG;

    totalAmount.textContent =
        "₹" + total.toLocaleString("en-IN");
}

// Update total when quantity changes
if (quantityInput) {
    quantityInput.addEventListener("input", calculateTotal);
}

// Handle order form
if (orderForm) {
    orderForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get customer information
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const quantity = Number(quantityInput.value);
        const address = document.getElementById("address").value.trim();

        // Validate name
        if (name === "") {
            alert("Please enter your name.");
            return;
        }

        // Validate phone number
        const cleanPhone = phone.replace(/\D/g, "");

        if (cleanPhone.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        // Validate minimum order
        if (!quantity || quantity < MINIMUM_ORDER) {
            alert("Minimum order is " + MINIMUM_ORDER + " KG.");
            return;
        }

        // Validate address
        if (address === "") {
            alert("Please enter your delivery address.");
            return;
        }

        // Calculate total
        const total = quantity * PRICE_PER_KG;

        // Create WhatsApp message
        const message =
            "🌶️ *Mana Ruchi - New Order*%0A%0A" +
            "👤 *Customer Name:* " + encodeURIComponent(name) + "%0A" +
            "📱 *Customer Phone:* " + encodeURIComponent(phone) + "%0A" +
            "📦 *Quantity:* " + quantity + " KG%0A" +
            "💰 *Price:* ₹" + PRICE_PER_KG + " per KG%0A" +
            "💵 *Total Amount:* ₹" +
            total.toLocaleString("en-IN") +
            "%0A%0A" +
            "🏠 *Delivery Address:*%0A" +
            encodeURIComponent(address) +
            "%0A%0A" +
            "Thank you for ordering from Mana Ruchi! 🌶️";

        // Create WhatsApp URL
        const whatsappURL =
            "https://wa.me/" +
            BUSINESS_WHATSAPP +
            "?text=" +
            message;

        // Show confirmation
        if (orderMessage) {
            orderMessage.innerHTML =
                "✅ Order details ready! Opening WhatsApp...";
            orderMessage.style.display = "block";
        }

        // Open WhatsApp
        window.open(whatsappURL, "_blank");
    });
}

// Set initial total
calculateTotal();
