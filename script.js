/* =========================================
   MANA RUCHI - ORDER SYSTEM
========================================= */

const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const PRICE_PER_KG = 400;
const MINIMUM_QUANTITY = 10;

const OWNER_WHATSAPP = "918367450301";


// =========================================
// SUPABASE
// =========================================

if (!window.supabase) {
    console.error("Supabase library not loaded.");
    throw new Error("Supabase library not loaded.");
}

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// =========================================
// HTML ELEMENTS
// =========================================

const orderForm =
    document.getElementById("orderForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const quantityInput =
    document.getElementById("quantity");

const address =
    document.getElementById("address");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
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
// MESSAGE
// =========================================

function showMessage(message, type) {

    if (!orderMessage) {
        alert(message);
        return;
    }

    orderMessage.textContent = message;

    orderMessage.style.display = "block";

    if (type === "success") {

        orderMessage.style.background = "#e8f5e9";
        orderMessage.style.color = "#1b5e20";
        orderMessage.style.border = "1px solid #66bb6a";

    } else {

        orderMessage.style.background = "#ffebee";
        orderMessage.style.color = "#b71c1c";
        orderMessage.style.border = "1px solid #ef5350";
    }
}


// =========================================
// QUANTITY
// =========================================

function getQuantity() {

    let quantity =
        parseInt(quantityInput.value);

    if (
        isNaN(quantity) ||
        quantity < MINIMUM_QUANTITY
    ) {
        quantity = MINIMUM_QUANTITY;
    }

    return quantity;
}


function updateOrderSummary() {

    const quantity = getQuantity();

    const total =
        quantity * PRICE_PER_KG;

    if (quantityInput) {
        quantityInput.value = quantity;
    }

    if (summaryQuantity) {
        summaryQuantity.textContent =
            quantity + " kg";
    }

    if (totalPrice) {
        totalPrice.textContent =
            "₹" + total.toLocaleString("en-IN");
    }
}


// =========================================
// MINUS BUTTON
// =========================================

if (decreaseQuantity) {

    decreaseQuantity.addEventListener(
        "click",
        function () {

            let quantity =
                getQuantity();

            if (quantity > MINIMUM_QUANTITY) {
                quantity--;
            }

            quantityInput.value =
                quantity;

            updateOrderSummary();
        }
    );
}


// =========================================
// PLUS BUTTON
// =========================================

if (increaseQuantity) {

    increaseQuantity.addEventListener(
        "click",
        function () {

            let quantity =
                getQuantity();

            quantity++;

            quantityInput.value =
                quantity;

            updateOrderSummary();
        }
    );
}


// =========================================
// QUANTITY INPUT
// =========================================

if (quantityInput) {

    quantityInput.addEventListener(
        "input",
        updateOrderSummary
    );
}


// =========================================
// PLACE ORDER
// =========================================

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "MANA RUCHI: Place Order clicked"
            );


            // -----------------------------
            // CUSTOMER DETAILS
            // -----------------------------

            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const quantity =
                getQuantity();

            const customerAddress =
                address.value.trim();


            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (!name) {

                showMessage(
                    "Please enter your name.",
                    "error"
                );

                customerName.focus();

                return;
            }


            if (!phone) {

                showMessage(
                    "Please enter your phone number.",
                    "error"
                );

                customerPhone.focus();

                return;
            }


            const cleanPhone =
                phone.replace(/\D/g, "");


            if (cleanPhone.length < 10) {

                showMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                customerPhone.focus();

                return;
            }


            if (quantity < MINIMUM_QUANTITY) {

                showMessage(
                    "Minimum order is 10 kg.",
                    "error"
                );

                return;
            }


            if (!customerAddress) {

                showMessage(
                    "Please enter your address.",
                    "error"
                );

                address.focus();

                return;
            }


            // -----------------------------
            // TOTAL
            // -----------------------------

            const totalAmount =
                quantity * PRICE_PER_KG;


            // -----------------------------
            // BUTTON
            // -----------------------------

            if (placeOrderButton) {

                placeOrderButton.disabled = true;

                placeOrderButton.textContent =
                    "Placing Order...";
            }


            showMessage(
                "Please wait... placing your order.",
                "success"
            );


            try {

                console.log(
                    "Sending order to Supabase..."
                );


                // =================================
                // INSERT INTO ORDERS TABLE
                // =================================

                const { data, error } =
                    await db
                        .from("orders")
                        .insert([
                            {
                                customer_name:
                                    name,

                                customer_phone:
                                    phone,

                                quantity:
                                    quantity,

                                address:
                                    customerAddress,

                                price_per_kg:
                                    PRICE_PER_KG,

                                total_amount:
                                    totalAmount,

                                status:
                                    "New"
                            }
                        ])
                        .select()
                        .single();


                // =================================
                // DATABASE ERROR
                // =================================

                if (error) {

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    showMessage(
                        "❌ Order failed: " +
                        error.message,
                        "error"
                    );

                    return;
                }


                // =================================
                // ORDER SUCCESS
                // =================================

                console.log(
                    "ORDER SAVED:",
                    data
                );


                const orderID =
                    data.id;


                showMessage(
                    "✅ Your Order is Confirmed! " +
                    "Order ID: " +
                    orderID +
                    " | Total: ₹" +
                    totalAmount.toLocaleString("en-IN"),
                    "success"
                );


                // =================================
                // WHATSAPP
                // =================================

                const whatsappMessage =

                    "🌶️ MANA RUCHI - NEW ORDER\n\n" +

                    "Order ID: " +
                    orderID +
                    "\n\n" +

                    "Customer: " +
                    name +
                    "\n" +

                    "Phone: " +
                    phone +
                    "\n" +

                    "Quantity: " +
                    quantity +
                    " kg\n" +

                    "Price: ₹" +
                    PRICE_PER_KG +
                    "/kg\n" +

                    "Total: ₹" +
                    totalAmount.toLocaleString("en-IN") +
                    "\n\n" +

                    "Address:\n" +
                    customerAddress;


                const whatsappURL =
                    "https://wa.me/" +
                    OWNER_WHATSAPP +
                    "?text=" +
                    encodeURIComponent(
                        whatsappMessage
                    );


                // Open WhatsApp after confirmation

                setTimeout(function () {

                    window.open(
                        whatsappURL,
                        "_blank"
                    );

                }, 1000);


                // =================================
                // RESET FORM
                // =================================

                orderForm.reset();

                quantityInput.value =
                    MINIMUM_QUANTITY;

                updateOrderSummary();


            } catch (error) {

                console.error(
                    "UNEXPECTED ERROR:",
                    error
                );

                showMessage(
                    "❌ Something went wrong: " +
                    error.message,
                    "error"
                );

            } finally {

                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "Place Order";
                }
            }
        }
    );

} else {

    console.error(
        "ERROR: orderForm not found."
    );
}


// =========================================
// FLOATING WHATSAPP
// =========================================

const floatingWhatsApp =
    document.getElementById(
        "floatingWhatsApp"
    );

if (floatingWhatsApp) {

    floatingWhatsApp.addEventListener(
        "click",
        function () {

            const message =
                encodeURIComponent(
                    "Hello Mana Ruchi, I want to know more about your homemade chilli powder."
                );

            window.open(
                "https://wa.me/" +
                OWNER_WHATSAPP +
                "?text=" +
                message,
                "_blank"
            );
        }
    );
}


// =========================================
// SHARE ON WHATSAPP
// =========================================

const shareWhatsApp =
    document.getElementById(
        "shareWhatsApp"
    );

if (shareWhatsApp) {

    shareWhatsApp.addEventListener(
        "click",
        function () {

            const text =
                encodeURIComponent(
                    "🌶️ Check out Mana Ruchi Homemade Chilli Powder!\n\n" +
                    "₹400 per kg\n" +
                    "Minimum order: 10 kg.\n\n" +
                    window.location.href
                );

            window.open(
                "https://wa.me/?text=" +
                text,
                "_blank"
            );
        }
    );
}


// =========================================
// INITIAL LOAD
// =========================================

updateOrderSummary();

console.log(
    "✅ Mana Ruchi script.js loaded successfully."
);
