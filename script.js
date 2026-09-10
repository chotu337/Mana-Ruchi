/* =========================================
   MANA RUCHI - CUSTOMER ORDER SYSTEM
========================================= */

// =========================================
// SUPABASE CONFIGURATION
// =========================================

const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const PRICE_PER_KG = 400;
const MINIMUM_QUANTITY = 10;

const OWNER_WHATSAPP = "918367450301";


// =========================================
// CHECK SUPABASE
// =========================================

if (!window.supabase) {
    console.error("Supabase library is not loaded.");
    alert("Supabase failed to load. Please refresh the page.");
    throw new Error("Supabase library not loaded.");
}

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// =========================================
// GET HTML ELEMENTS
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


// =========================================
// UPDATE ORDER SUMMARY
// =========================================

function updateOrderSummary() {

    const quantity = getQuantity();

    const total =
        quantity * PRICE_PER_KG;

    quantityInput.value = quantity;

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
// DECREASE QUANTITY
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
// INCREASE QUANTITY
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
// MANUAL QUANTITY CHANGE
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
// SHOW MESSAGE
// =========================================

function showMessage(
    message,
    type
) {

    if (!orderMessage) return;

    orderMessage.textContent =
        message;

    orderMessage.style.display =
        "block";

    if (type === "success") {

        orderMessage.style.background =
            "#e8f5e9";

        orderMessage.style.color =
            "#1b5e20";

        orderMessage.style.border =
            "1px solid #66bb6a";

    } else {

        orderMessage.style.background =
            "#ffebee";

        orderMessage.style.color =
            "#b71c1c";

        orderMessage.style.border =
            "1px solid #ef5350";
    }
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
                "Place Order button clicked."
            );


            // -----------------------------
            // GET CUSTOMER DATA
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
            // VALIDATE NAME
            // -----------------------------

            if (!name) {

                showMessage(
                    "Please enter your name.",
                    "error"
                );

                customerName.focus();

                return;
            }


            // -----------------------------
            // VALIDATE PHONE
            // -----------------------------

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


            // -----------------------------
            // VALIDATE QUANTITY
            // -----------------------------

            if (
                quantity <
                MINIMUM_QUANTITY
            ) {

                showMessage(
                    "Minimum order quantity is 10 kg.",
                    "error"
                );

                quantityInput.focus();

                return;
            }


            // -----------------------------
            // VALIDATE ADDRESS
            // -----------------------------

            if (!customerAddress) {

                showMessage(
                    "Please enter your delivery address.",
                    "error"
                );

                address.focus();

                return;
            }


            // -----------------------------
            // CALCULATE TOTAL
            // -----------------------------

            const totalAmount =
                quantity * PRICE_PER_KG;


            // -----------------------------
            // DISABLE BUTTON
            // -----------------------------

            if (placeOrderButton) {

                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "Placing Order...";
            }


            showMessage(
                "Please wait... placing your order.",
                "success"
            );


            // =================================
            // SAVE ORDER TO SUPABASE
            // =================================

            try {

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


                // -----------------------------
                // DATABASE ERROR
                // -----------------------------

                if (error) {

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    showMessage(
                        "Order could not be placed. Please check your database table or permissions.",
                        "error"
                    );

                    return;
                }


                // =================================
                // ORDER SAVED SUCCESSFULLY
                // =================================

                console.log(
                    "ORDER SAVED:",
                    data
                );


                // Supabase automatically created ID
                const orderID =
                    data.id;


                // =================================
                // CONFIRMATION MESSAGE
                // =================================

                showMessage(
                    "✅ Your Order is Confirmed! " +
                    "Order ID: " +
                    orderID +
                    " | Total: ₹" +
                    totalAmount.toLocaleString("en-IN"),
                    "success"
                );


                // =================================
                // WHATSAPP MESSAGE TO OWNER
                // =================================

                const whatsappText =
                    "🌶️ MANA RUCHI - NEW ORDER\n\n" +

                    "Order ID: " +
                    orderID +
                    "\n" +

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
                        whatsappText
                    );


                // =================================
                // OPEN WHATSAPP
                // =================================

                setTimeout(
                    function () {

                        window.open(
                            whatsappURL,
                            "_blank"
                        );

                    },
                    800
                );


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
                    "Something went wrong. Please try again.",
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
        "orderForm was not found."
    );
}


// =========================================
// WHATSAPP FLOATING BUTTON
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
// WHATSAPP SHARE BUTTON
// =========================================

const shareWhatsApp =
    document.getElementById(
        "shareWhatsApp"
    );

if (shareWhatsApp) {

    shareWhatsApp.addEventListener(
        "click",
        function () {

            const shareText =
                encodeURIComponent(
                    "🌶️ Check out Mana Ruchi Homemade Chilli Powder!\n\n" +
                    "₹400/kg\n" +
                    "Minimum order: 10 kg.\n\n" +
                    window.location.href
                );

            window.open(
                "https://wa.me/?text=" +
                shareText,
                "_blank"
            );
        }
    );
}


// =========================================
// INITIALIZE
// =========================================

updateOrderSummary();

console.log(
    "✅ Mana Ruchi script.js loaded successfully."
);
