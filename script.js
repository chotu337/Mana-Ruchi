// =========================================
// MANA RUCHI - CUSTOMER ORDER SYSTEM
// =========================================

// Supabase
const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const supabaseClient =
    window.supabase.createClient(
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

const orderForm =
    document.getElementById("orderForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const quantityInput =
    document.getElementById("quantity");

const addressInput =
    document.getElementById("address");

const decreaseButton =
    document.getElementById("decreaseQuantity");

const increaseButton =
    document.getElementById("increaseQuantity");

const summaryQuantity =
    document.getElementById("summaryQuantity");

const totalPrice =
    document.getElementById("totalPrice");

const orderMessage =
    document.getElementById("orderMessage");

const placeOrderButton =
    document.getElementById("placeOrderButton");


// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString("en-IN");

}


// =========================================
// GET VALID QUANTITY
// =========================================

function getQuantity() {

    let quantity =
        Number(quantityInput.value);

    if (!Number.isFinite(quantity)) {
        quantity = MINIMUM_ORDER;
    }

    quantity = Math.floor(quantity);

    if (quantity < MINIMUM_ORDER) {
        quantity = MINIMUM_ORDER;
    }

    return quantity;
}


// =========================================
// UPDATE ORDER SUMMARY
// =========================================

function updateOrderSummary() {

    const quantity =
        getQuantity();

    const total =
        quantity * PRICE_PER_KG;

    quantityInput.value =
        quantity;

    if (summaryQuantity) {

        summaryQuantity.textContent =
            quantity + " KG";

    }

    if (totalPrice) {

        totalPrice.textContent =
            formatCurrency(total);

    }

}


// =========================================
// DECREASE QUANTITY
// =========================================

if (decreaseButton) {

    decreaseButton.addEventListener(
        "click",
        function () {

            let quantity =
                getQuantity();

            quantity -= QUANTITY_STEP;

            if (quantity < MINIMUM_ORDER) {
                quantity = MINIMUM_ORDER;
            }

            quantityInput.value =
                quantity;

            updateOrderSummary();

        }
    );

}


// =========================================
// INCREASE QUANTITY
// =========================================

if (increaseButton) {

    increaseButton.addEventListener(
        "click",
        function () {

            let quantity =
                getQuantity();

            quantity += QUANTITY_STEP;

            quantityInput.value =
                quantity;

            updateOrderSummary();

        }
    );

}


// =========================================
// MANUAL QUANTITY INPUT
// =========================================

if (quantityInput) {

    quantityInput.addEventListener(
        "input",
        function () {

            updateOrderSummary();

        }
    );

}


// =========================================
// PHONE INPUT
// =========================================

if (customerPhone) {

    customerPhone.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /\D/g,
                    ""
                ).slice(0, 10);

        }
    );

}


// =========================================
// SHOW MESSAGE
// =========================================

function showOrderMessage(
    message,
    type = "info"
) {

    if (!orderMessage) {
        return;
    }

    orderMessage.style.display =
        "block";

    orderMessage.textContent =
        message;

    orderMessage.className =
        "order-message " + type;

}


// =========================================
// CREATE WHATSAPP MESSAGE
// =========================================

function createWhatsAppMessage(
    name,
    phone,
    quantity,
    address,
    total
) {

    return `Hello Mana Ruchi 🌶️

I would like to place an order.

Customer Name: ${name}
Mobile Number: ${phone}
Quantity: ${quantity} KG
Price: ₹${PRICE_PER_KG} per KG
Total Amount: ₹${total.toLocaleString("en-IN")}

Delivery Address:
${address}

Please confirm my order. Thank you.`;

}


// =========================================
// SUBMIT ORDER
// =========================================

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -----------------------------
            // GET VALUES
            // -----------------------------

            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value
                    .replace(/\D/g, "");

            const quantity =
                getQuantity();

            const address =
                addressInput.value.trim();


            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (!name) {

                showOrderMessage(
                    "Please enter your full name.",
                    "error"
                );

                customerName.focus();

                return;
            }


            if (!/^\d{10}$/.test(phone)) {

                showOrderMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                customerPhone.focus();

                return;
            }


            if (
                !Number.isInteger(quantity) ||
                quantity < MINIMUM_ORDER
            ) {

                showOrderMessage(
                    "Minimum order is 10 KG.",
                    "error"
                );

                quantityInput.focus();

                return;
            }


            if (!address) {

                showOrderMessage(
                    "Please enter your complete delivery address.",
                    "error"
                );

                addressInput.focus();

                return;
            }


            // -----------------------------
            // CALCULATE TOTAL
            // -----------------------------

            const total =
                quantity * PRICE_PER_KG;


            // -----------------------------
            // DISABLE BUTTON
            // -----------------------------

            if (placeOrderButton) {

                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "Saving Order...";

            }


            showOrderMessage(
                "Saving your order...",
                "info"
            );


            // -----------------------------
            // SAVE TO SUPABASE
            // -----------------------------

            const {
                data,
                error
            } = await supabaseClient
                .from("orders")
                .insert([
                    {
                        customer_name: name,
                        customer_phone: phone,
                        quantity: quantity,
                        address: address,
                        price_per_kg: PRICE_PER_KG,
                        total_amount: total,
                        status: "Pending"
                    }
                ])
                .select();


            // -----------------------------
            // HANDLE ERROR
            // -----------------------------

            if (error) {

                console.error(
                    "Supabase order error:",
                    error
                );


                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "🛒 Place Order & Continue to WhatsApp";

                }


                showOrderMessage(
                    "Unable to save your order. Please try again.",
                    "error"
                );

                return;
            }


            // -----------------------------
            // ORDER SAVED
            // -----------------------------

            console.log(
                "Order saved:",
                data
            );


            showOrderMessage(
                "✅ Order saved successfully! Opening WhatsApp...",
                "success"
            );


            if (placeOrderButton) {

                placeOrderButton.textContent =
                    "✅ Order Saved — Opening WhatsApp...";

            }


            // -----------------------------
            // WHATSAPP MESSAGE
            // -----------------------------

            const whatsappMessage =
                createWhatsAppMessage(
                    name,
                    phone,
                    quantity,
                    address,
                    total
                );


            const whatsappURL =
                "https://api.whatsapp.com/send?phone=" +
                BUSINESS_WHATSAPP +
                "&text=" +
                encodeURIComponent(
                    whatsappMessage
                );


            // -----------------------------
            // OPEN WHATSAPP
            // -----------------------------

            setTimeout(
                function () {

                    window.location.href =
                        whatsappURL;

                },
                800
            );

        }
    );

}


// =========================================
// INITIAL SUMMARY
// =========================================

updateOrderSummary();
