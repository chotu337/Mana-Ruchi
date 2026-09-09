// Mana Ruchi - WhatsApp Order System

const PRICE_PER_KG = 400;
const MINIMUM_ORDER = 10;
const BUSINESS_WHATSAPP = "918367450301";

const orderForm = document.getElementById("orderForm");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const quantityInput = document.getElementById("quantity");
const addressInput = document.getElementById("address");
const totalPrice = document.getElementById("totalPrice");
const orderMessage = document.getElementById("orderMessage");


// Calculate total
function calculateTotal() {
    const quantity = Number(quantityInput.value) || 0;
    const total = quantity * PRICE_PER_KG;

    totalPrice.textContent =
        "₹" + total.toLocaleString("en-IN");
}


// Update total when quantity changes
quantityInput.addEventListener("input", calculateTotal);


// Submit order
orderForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();
    const quantity = Number(quantityInput.value);
    const address = addressInput.value.trim();


    // Validate name
    if (!name) {
        alert("Please enter your name.");
        customerName.focus();
        return;
    }


    // Validate phone
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        customerPhone.focus();
        return;
    }


    // Validate quantity
    if (!quantity || quantity < MINIMUM_ORDER) {
        alert("Minimum order is 10 KG.");
        quantityInput.focus();
        return;
    }


    // Validate address
    if (!address) {
        alert("Please enter your delivery address.");
        addressInput.focus();
        return;
    }


    // Calculate total
    const total = quantity * PRICE_PER_KG;


    // WhatsApp message
    const message =
`🌶️ MANA RUCHI - NEW ORDER

👤 Customer Name: ${name}
📱 Customer Phone: ${phone}
📦 Quantity: ${quantity} KG
💰 Price: ₹${PRICE_PER_KG} per KG
💵 Total Amount: ₹${total.toLocaleString("en-IN")}

🏠 Delivery Address:
${address}

Thank you for choosing Mana Ruchi! 🌶️`;


    // Create working WhatsApp URL
    const whatsappURL =
        "https://api.whatsapp.com/send?phone=" +
        BUSINESS_WHATSAPP +
        "&text=" +
        encodeURIComponent(message);


    // Show confirmation
    orderMessage.textContent =
        "✅ Opening WhatsApp...";

    orderMessage.style.display = "block";


    // Open WhatsApp
    window.location.href = whatsappURL;

});


// Initial calculation
calculateTotal();
