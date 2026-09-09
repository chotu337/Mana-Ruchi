// ==========================================
// MANA RUCHI - WHATSAPP ORDER SYSTEM
// ==========================================

const PRICE_PER_KG = 400;
const MINIMUM_ORDER = 10;

// WhatsApp business number
// 8367450301 → 918367450301
const BUSINESS_WHATSAPP = "918367450301";

// Get HTML elements
const orderForm = document.getElementById("orderForm");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const quantityInput = document.getElementById("quantity");
const addressInput = document.getElementById("address");
const totalPrice = document.getElementById("totalPrice");
const orderMessage = document.getElementById("orderMessage");


// ==========================================
// CALCULATE TOTAL
// ==========================================

function calculateTotal() {

    const quantity = Number(quantityInput.value);

    if (!quantity || quantity < 0) {
        totalPrice.textContent = "₹0";
        return;
    }

    const total = quantity * PRICE_PER_KG;

    totalPrice.textContent =
        "₹" + total.toLocaleString("en-IN");
}


// Calculate when quantity changes
if (quantityInput) {
    quantityInput.addEventListener("input", calculateTotal);
}


// ==========================================
// ORDER FORM
// ==========================================

if (orderForm) {

    orderForm.addEventListener("submit", function(event) {

        // Stop normal form submission
        event.preventDefault();


        // Get customer details
        const name = customerName.value.trim();
        const phone = customerPhone.value.trim();
        const quantity = Number(quantityInput.value);
        const address = addressInput.value.trim();


        // ==========================================
        // VALIDATION
        // ==========================================

        if (name === "") {

            alert("Please enter your name.");

            customerName.focus();

            return;
        }


        // Remove spaces and non-numbers
        const cleanPhone = phone.replace(/\D/g, "");


        if (cleanPhone.length !== 10) {

            alert("Please enter a valid 10-digit mobile number.");

            customerPhone.focus();

            return;
        }


        if (!quantity || quantity < MINIMUM_ORDER) {

            alert(
                "Minimum order quantity is " +
                MINIMUM_ORDER +
                " KG."
            );

            quantityInput.focus();

            return;
        }


        if (address === "") {

            alert("Please enter your delivery address.");

            addressInput.focus();

            return;
        }


        // ==========================================
        // CALCULATE ORDER TOTAL
        // ==========================================

        const total = quantity * PRICE_PER_KG;


        // ==========================================
        // CREATE WHATSAPP MESSAGE
        // ==========================================

        const message =
`🌶️ *MANA RUCHI - NEW ORDER*

👤 Customer Name: ${name}

📱 Customer Phone: ${phone}

📦 Quantity: ${quantity} KG

💰 Price: ₹${PRICE_PER_KG} per KG

💵 Total Amount: ₹${total.toLocaleString("en-IN")}

🏠 Delivery Address:
${address}

Thank you for choosing Mana Ruchi! 🌶️`;



        // ==========================================
        // CREATE WHATSAPP URL
        // ==========================================

        const whatsappURL =
            "https://wa.me/918367450301" +
            BUSINESS_WHATSAPP +
            "?text=" +
            encodeURIComponent(message);


        // ==========================================
        // SHOW MESSAGE
        // ==========================================

        if (orderMessage) {

            orderMessage.textContent =
                "✅ Opening WhatsApp...";

            orderMessage.style.display = "block";
        }


        // ==========================================
        // OPEN WHATSAPP
        // ==========================================

        window.open(whatsappURL, "_blank");

    });

}


// ==========================================
// INITIAL TOTAL
// ==========================================

calculateTotal();
