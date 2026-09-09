// =========================================
// MANA RUCHI - ORDER SYSTEM
// =========================================

const PRICE_PER_KG = 400;
const MINIMUM_ORDER = 10;
const QUANTITY_STEP = 10;

const BUSINESS_WHATSAPP = "918367450301";


// =========================================
// GET ELEMENTS
// =========================================

const orderForm = document.getElementById("orderForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const quantityInput =
    document.getElementById("quantity");

const addressInput =
    document.getElementById("address");

const totalPrice =
    document.getElementById("totalPrice");

const orderMessage =
    document.getElementById("orderMessage");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");


// =========================================
// CALCULATE TOTAL
// =========================================

function calculateTotal() {

    const quantity =
        Number(quantityInput.value) || MINIMUM_ORDER;

    const total =
        quantity * PRICE_PER_KG;

    totalPrice.textContent =
        "₹" + total.toLocaleString("en-IN");
}


// =========================================
// INCREASE QUANTITY
// =========================================

increaseQuantity.addEventListener(
    "click",
    function () {

        let quantity =
            Number(quantityInput.value) || MINIMUM_ORDER;

        quantity += QUANTITY_STEP;

        quantityInput.value = quantity;

        calculateTotal();
    }
);


// =========================================
// DECREASE QUANTITY
// =========================================

decreaseQuantity.addEventListener(
    "click",
    function () {

        let quantity =
            Number(quantityInput.value) || MINIMUM_ORDER;

        if (quantity > MINIMUM_ORDER) {

            quantity -= QUANTITY_STEP;

        } else {

            quantity = MINIMUM_ORDER;
        }

        quantityInput.value = quantity;

        calculateTotal();
    }
);


// =========================================
// WHATSAPP ORDER
// =========================================

orderForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            customerName.value.trim();

        const phone =
            customerPhone.value.trim();

        const quantity =
            Number(quantityInput.value);

        const address =
            addressInput.value.trim();


        // NAME VALIDATION

        if (!name) {

            alert("Please enter your name.");

            customerName.focus();

            return;
        }


        // PHONE VALIDATION

        const cleanPhone =
            phone.replace(/\D/g, "");

        if (cleanPhone.length !== 10) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            customerPhone.focus();

            return;
        }


        // QUANTITY VALIDATION

        if (
            !quantity ||
            quantity < MINIMUM_ORDER
        ) {

            alert(
                "Minimum order is 10 KG."
            );

            quantityInput.focus();

            return;
        }


        // ADDRESS VALIDATION

        if (!address) {

            alert(
                "Please enter your delivery address."
            );

            addressInput.focus();

            return;
        }


        // TOTAL

        const total =
            quantity * PRICE_PER_KG;


        // WHATSAPP MESSAGE

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


        // WHATSAPP URL

        const whatsappURL =
            "https://api.whatsapp.com/send?phone=" +
            BUSINESS_WHATSAPP +
            "&text=" +
            encodeURIComponent(message);


        // SHOW MESSAGE

        orderMessage.textContent =
            "✅ Opening WhatsApp...";

        orderMessage.style.display =
            "block";


        // OPEN WHATSAPP

        window.location.href =
            whatsappURL;

    }
);


// =========================================
// INITIAL TOTAL
// =========================================

calculateTotal();
