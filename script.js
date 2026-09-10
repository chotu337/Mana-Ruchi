/* =========================================
   MANA RUCHI - CUSTOMER ORDER SYSTEM
   Supabase + WhatsApp
========================================= */

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
    alert("Supabase library failed to load.");
    throw new Error("Supabase library not loaded.");
}

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// =========================================
// GET HTML ELEMENTS
// =========================================
const { error } = await db
    .from("orders")
    .insert([
        {
            customer_name: name,
            customer_phone: phone,
            quantity: quantity,
            address: customerAddress,
            price_per_kg: PRICE_PER_KG,
            total_amount: totalAmount,
            status: "Pending"
        }
    ]);


// =========================================
// GET QUANTITY
// =========================================

function getQuantity() {

    if (!quantityInput) {
        return MINIMUM_QUANTITY;
    }

    let quantity =
        parseInt(quantityInput.value, 10);

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

    if (quantityInput) {
        quantityInput.value = quantity;
    }

    if (summaryQuantity) {
        summaryQuantity.textContent =
            quantity + " kg";
    }

    if (totalPrice) {
        totalPrice.textContent =
            "₹" +
            total.toLocaleString("en-IN");
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
// SHOW MESSAGE
// =========================================

function showMessage(message, type) {

    if (!orderMessage) {
        return;
    }

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
// CREATE ORDER REFERENCE
// =========================================

function createOrderID() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return (
        "MR-" +
        year +
        month +
        day +
        "-" +
        random
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
                "Place Order clicked"
            );


            // =================================
            // GET VALUES
            // =================================

            const name =
                customerName
                    ? customerName.value.trim()
                    : "";

            const phone =
                customerPhone
                    ? customerPhone.value.trim()
                    : "";

            const quantity =
                getQuantity();

            const customerAddress =
                address
                    ? address.value.trim()
                    : "";


            // =================================
            // VALIDATE NAME
            // =================================

            if (!name) {

                showMessage(
                    "Please enter your name.",
                    "error"
                );

                if (customerName) {
                    customerName.focus();
                }

                return;
            }


            // =================================
            // VALIDATE PHONE
            // =================================

            if (!phone) {

                showMessage(
                    "Please enter your phone number.",
                    "error"
                );

                if (customerPhone) {
                    customerPhone.focus();
                }

                return;
            }


            const cleanPhone =
                phone.replace(/\D/g, "");


            if (cleanPhone.length < 10) {

                showMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                if (customerPhone) {
                    customerPhone.focus();
                }

                return;
            }


            // =================================
            // VALIDATE QUANTITY
            // =================================

            if (quantity < MINIMUM_QUANTITY) {

                showMessage(
                    "Minimum order quantity is 10 kg.",
                    "error"
                );

                if (quantityInput) {
                    quantityInput.focus();
                }

                return;
            }


            // =================================
            // VALIDATE ADDRESS
            // =================================

            if (!customerAddress) {

                showMessage(
                    "Please enter your delivery address.",
                    "error"
                );

                if (address) {
                    address.focus();
                }

                return;
            }


            // =================================
            // CALCULATE TOTAL
            // =================================

            const totalAmount =
                quantity * PRICE_PER_KG;


            // =================================
            // CREATE ORDER REFERENCE
            // =================================

            const orderID =
                createOrderID();


            // =================================
            // DISABLE BUTTON
            // =================================

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


            try {

                console.log(
                    "Sending order to Supabase..."
                );


                // =================================
                // SUPABASE INSERT
                //
                // IMPORTANT:
                // These names exactly match
                // your Supabase table.
                // =================================

                const { error } =
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
                                    "Pending"
                            }
                        ]);


                // =================================
                // CHECK DATABASE ERROR
                // =================================

                if (error) {

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    showMessage(
                        "Order could not be placed. " +
                        error.message,
                        "error"
                    );

                    return;
                }


                // =================================
                // SUCCESS
                // =================================

                console.log(
                    "Order successfully saved!"
                );

                console.log(
                    "Order Reference:",
                    orderID
                );


                showMessage(
                    "✅ Order Confirmed! " +
                    "Order ID: " +
                    orderID +
                    " | Total: ₹" +
                    totalAmount.toLocaleString("en-IN"),
                    "success"
                );


                // =================================
                // WHATSAPP MESSAGE
                // =================================

                const whatsappText =
                    `🌶️ *MANA RUCHI - NEW ORDER*

📋 *Order ID:* ${orderID}

👤 *Customer:* ${name}

📞 *Phone:* ${phone}

🌶️ *Product:* Homemade Chilli Powder

⚖️ *Quantity:* ${quantity} kg

💰 *Price:* ₹${PRICE_PER_KG}/kg

💵 *Total:* ₹${totalAmount.toLocaleString("en-IN")}

📍 *Delivery Address:* ${customerAddress}`;


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

                if (orderForm) {
                    orderForm.reset();
                }

                if (quantityInput) {
                    quantityInput.value =
                        MINIMUM_QUANTITY;
                }

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
        "orderForm was not found. " +
        "Check index.html."
    );
}


// =========================================
// INITIAL SUMMARY
// =========================================

updateOrderSummary();


// =========================================
// FLOATING WHATSAPP BUTTON
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
                    "Quality homemade chilli powder at ₹400/kg.\n" +
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
// DEBUG
// =========================================

console.log(
    "================================="
);

console.log(
    "Mana Ruchi script.js loaded successfully."
);

console.log(
    "Supabase order system ready."
);

console.log(
    "Price per KG:",
    PRICE_PER_KG
);

console.log(
    "Minimum quantity:",
    MINIMUM_QUANTITY
);

console.log(
    "================================="
);
