// =========================================
// MANA RUCHI - ORDER SYSTEM + SUPABASE
// =========================================

// SUPABASE CONNECTION
const SUPABASE_URL = "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// =========================================
// BUSINESS SETTINGS
// =========================================

const PRICE_PER_KG = 400;
const MINIMUM_ORDER = 10;
const QUANTITY_STEP = 1;
const BUSINESS_WHATSAPP = "918367450301";


// =========================================
// GET ELEMENTS
// =========================================

const orderForm = document.getElementById("orderForm");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const quantityInput = document.getElementById("quantity");
const addressInput = document.getElementById("address");

const totalPrice = document.getElementById("totalPrice");
const summaryQuantity = document.getElementById("summaryQuantity");

const orderMessage = document.getElementById("orderMessage");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");


// =========================================
// UPDATE ORDER SUMMARY
// =========================================

function updateOrderSummary() {

    let quantity = Number(quantityInput.value);

    if (!quantity || quantity < MINIMUM_ORDER) {
        quantity = MINIMUM_ORDER;
        quantityInput.value = quantity;
    }

    // Make sure quantity is a whole number
    quantity = Math.floor(quantity);

    quantityInput.value = quantity;

    const total = quantity * PRICE_PER_KG;

    summaryQuantity.textContent = quantity + " KG";

    totalPrice.textContent =
        "₹" + total.toLocaleString("en-IN");
}


// =========================================
// INCREASE QUANTITY
// =========================================

increaseQuantity.addEventListener("click", function () {

    let quantity =
        Number(quantityInput.value) || MINIMUM_ORDER;

    quantity += QUANTITY_STEP;

    quantityInput.value = quantity;

    updateOrderSummary();
});


// =========================================
// DECREASE QUANTITY
// =========================================

decreaseQuantity.addEventListener("click", function () {

    let quantity =
        Number(quantityInput.value) || MINIMUM_ORDER;

    if (quantity > MINIMUM_ORDER) {

        quantity -= QUANTITY_STEP;

    } else {

        quantity = MINIMUM_ORDER;
    }

    quantityInput.value = quantity;

    updateOrderSummary();
});


// =========================================
// MANUAL QUANTITY INPUT
// =========================================

quantityInput.addEventListener("input", function () {

    let quantity = Number(quantityInput.value);

    if (!quantity || quantity < MINIMUM_ORDER) {

        quantity = MINIMUM_ORDER;
    }

    quantity = Math.floor(quantity);

    quantityInput.value = quantity;

    updateOrderSummary();
});


// =========================================
// ORDER FORM SUBMIT
// =========================================

orderForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // -----------------------------------------
    // GET CUSTOMER DETAILS
    // -----------------------------------------

    const name =
        customerName.value.trim();

    const phone =
        customerPhone.value.trim();

    const quantity =
        Number(quantityInput.value);

    const address =
        addressInput.value.trim();


    // -----------------------------------------
    // VALIDATE NAME
    // -----------------------------------------

    if (!name) {

        alert("Please enter your name.");

        customerName.focus();

        return;
    }


    // -----------------------------------------
    // VALIDATE PHONE
    // -----------------------------------------

    const cleanPhone =
        phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        customerPhone.focus();

        return;
    }


    // -----------------------------------------
    // VALIDATE QUANTITY
    // -----------------------------------------

    if (
        !quantity ||
        quantity < MINIMUM_ORDER ||
        !Number.isInteger(quantity)
    ) {

        alert(
            "Minimum order is 10 KG. Please enter a whole KG quantity."
        );

        quantityInput.focus();

        return;
    }


    // -----------------------------------------
    // VALIDATE ADDRESS
    // -----------------------------------------

    if (!address) {

        alert(
            "Please enter your delivery address."
        );

        addressInput.focus();

        return;
    }


    // -----------------------------------------
    // CALCULATE TOTAL
    // -----------------------------------------

    const total =
        quantity * PRICE_PER_KG;


    // -----------------------------------------
    // SHOW SAVING MESSAGE
    // -----------------------------------------

    orderMessage.innerHTML = `
        <div class="confirmation-box">

            <div class="confirmation-icon">
                ⏳
            </div>

            <h3>Saving Your Order...</h3>

            <p>
                Please wait while we save your order.
            </p>

        </div>
    `;

    orderMessage.style.display = "block";


    // -----------------------------------------
    // SAVE ORDER TO SUPABASE
    // -----------------------------------------

    try {

        const { data, error } =
            await supabaseClient
                .from("orders")
                .insert([
                    {
                        customer_name: name,

                        customer_phone: cleanPhone,

                        quantity: quantity,

                        address: address,

                        price_per_kg: PRICE_PER_KG,

                        total_amount: total,

                        status: "Pending"
                    }
                ])
                .select();


        // -------------------------------------
        // CHECK DATABASE ERROR
        // -------------------------------------

        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            orderMessage.innerHTML = `
                <div class="confirmation-box">

                    <div class="confirmation-icon">
                        ❌
                    </div>

                    <h3>Order Could Not Be Saved</h3>

                    <p>
                        Something went wrong while saving
                        your order.
                    </p>

                    <p>
                        Please try again.
                    </p>

                </div>
            `;

            alert(
                "Could not save your order. Please try again."
            );

            return;
        }


        // -------------------------------------
        // ORDER SAVED SUCCESSFULLY
        // -------------------------------------

        console.log(
            "Order saved successfully:",
            data
        );


        // -------------------------------------
        // WHATSAPP MESSAGE
        // -------------------------------------

        const message =
`🌶️ MANA RUCHI - NEW ORDER

👤 Customer Name:
${name}

📱 Customer Phone:
${phone}

📦 Product:
Mana Ruchi Homemade Chilli Powder

📦 Quantity:
${quantity} KG

💰 Price:
₹${PRICE_PER_KG} per KG

💵 Total Amount:
₹${total.toLocaleString("en-IN")}

🏠 Delivery Address:
${address}

📋 Order Status:
Pending

Please confirm my order.

Thank you! 🌶️`;


        const whatsappURL =
            "https://api.whatsapp.com/send?phone=" +
            BUSINESS_WHATSAPP +
            "&text=" +
            encodeURIComponent(message);


        // -------------------------------------
        // SHOW CONFIRMATION
        // -------------------------------------

        orderMessage.innerHTML = `
            <div class="confirmation-box">

                <div class="confirmation-icon">
                    ✅
                </div>

                <h3>Order Saved Successfully!</h3>

                <p>
                    Thank you,
                    <strong>${escapeHTML(name)}</strong>.
                </p>

                <p>
                    Your order for
                    <strong>${quantity} KG</strong>
                    has been saved.
                </p>

                <p class="confirmation-total">
                    Total:
                    ₹${total.toLocaleString("en-IN")}
                </p>

                <p>
                    Opening WhatsApp...
                </p>

            </div>
        `;


        orderMessage.style.display = "block";


        // -------------------------------------
        // OPEN WHATSAPP
        // -------------------------------------

        setTimeout(function () {

            window.location.href =
                whatsappURL;

        }, 1200);


    } catch (error) {

        console.error(
            "Unexpected error:",
            error
        );

        orderMessage.innerHTML = `
            <div class="confirmation-box">

                <div class="confirmation-icon">
                    ❌
                </div>

                <h3>Something Went Wrong</h3>

                <p>
                    Please try submitting the order again.
                </p>

            </div>
        `;

        alert(
            "Something went wrong. Please try again."
        );
    }

});


// =========================================
// HTML ESCAPE
// =========================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================
// INITIALIZE
// =========================================

updateOrderSummary();
