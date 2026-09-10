/* =========================================
   MANA RUCHI - CUSTOMER ORDER SYSTEM
   Supabase + WhatsApp
========================================= */

const SUPABASE_URL = "https://iwkrwidehhklaapbfful.supabase.co";

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

const orderForm = document.getElementById("orderForm");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const quantityInput = document.getElementById("quantity");
const address = document.getElementById("address");

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

    let quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < MINIMUM_QUANTITY) {
        quantity = MINIMUM_QUANTITY;
    }

    return quantity;
}


function updateOrderSummary() {

    const quantity = getQuantity();

    const total = quantity * PRICE_PER_KG;

    quantityInput.value = quantity;

    if (summaryQuantity) {
        summaryQuantity.textContent = quantity + " kg";
    }

    if (totalPrice) {
        totalPrice.textContent = "₹" + total.toLocaleString("en-IN");
    }
}


if (decreaseQuantity) {

    decreaseQuantity.addEventListener("click", function () {

        let quantity = getQuantity();

        if (quantity > MINIMUM_QUANTITY) {
            quantity -= 1;
        }

        quantityInput.value = quantity;

        updateOrderSummary();
    });
}


if (increaseQuantity) {

    increaseQuantity.addEventListener("click", function () {

        let quantity = getQuantity();

        quantity += 1;

        quantityInput.value = quantity;

        updateOrderSummary();
    });
}


if (quantityInput) {

    quantityInput.addEventListener("input", function () {

        updateOrderSummary();
    });
}


// =========================================
// SHOW MESSAGE
// =========================================

function showMessage(message, type) {

    if (!orderMessage) return;

    orderMessage.textContent = message;

    orderMessage.style.display = "block";

    if (type === "success") {

        orderMessage.style.background = "#e8f5e9";
        orderMessage.style.color = "#1b5e20";
        orderMessage.style.border =
            "1px solid #66bb6a";

    } else {

        orderMessage.style.background = "#ffebee";
        orderMessage.style.color = "#b71c1c";
        orderMessage.style.border =
            "1px solid #ef5350";
    }
}


// =========================================
// CREATE ORDER ID
// =========================================

function createOrderID() {

    const now = new Date();

    const date =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    const random =
        Math.floor(1000 + Math.random() * 9000);

    return "MR-" + date + "-" + random;
}


// =========================================
// PLACE ORDER
// =========================================

if (orderForm) {

    orderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Place Order clicked");

        // -----------------------------
        // Get values
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
        // Validation
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
                "Minimum order quantity is 10 kg.",
                "error"
            );

            quantityInput.focus();

            return;
        }


        if (!customerAddress) {

            showMessage(
                "Please enter your delivery address.",
                "error"
            );

            address.focus();

            return;
        }


        // -----------------------------
        // Calculate total
        // -----------------------------

        const totalAmount =
            quantity * PRICE_PER_KG;


        // -----------------------------
        // Create Order ID
        // -----------------------------

        const orderID =
            createOrderID();


        // -----------------------------
        // Disable button
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

            console.log("Sending order to Supabase...");

            // -----------------------------
            // Insert order into Supabase
            // -----------------------------

            const { data, error } =
                await db
                    .from("orders")
                    .insert([
                        {
                            order_id: orderID,

                            customer_name: name,

                            phone: phone,

                            quantity: quantity,

                            address: customerAddress,

                            price_per_kg: PRICE_PER_KG,

                            total_amount: totalAmount,

                            product_name:
                                "Mana Ruchi Homemade Chilli Powder",

                            status: "New"
                        }
                    ])
                    .select();


            // -----------------------------
            // Check error
            // -----------------------------

            if (error) {

                console.error(
                    "Supabase Error:",
                    error
                );

                showMessage(
                    "Order could not be placed. Please try again.",
                    "error"
                );

                if (placeOrderButton) {

                    placeOrderButton.disabled = false;

                    placeOrderButton.textContent =
                        "Place Order";
                }

                return;
            }


            console.log(
                "Order successfully saved:",
                data
            );


            // =================================
            // SUCCESS MESSAGE
            // =================================

            showMessage(
                "✅ Your Order is Confirmed! Order ID: " +
                orderID +
                " | Total: ₹" +
                totalAmount.toLocaleString("en-IN"),
                "success"
            );


            // =================================
            // WHATSAPP MESSAGE
            // =================================

            const whatsappMessage =
                `🌶️ *MANA RUCHI - NEW ORDER*%0A%0A` +

                `📋 *Order ID:* ${orderID}%0A` +

                `👤 *Customer:* ${encodeURIComponent(name)}%0A` +

                `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +

                `🌶️ *Product:* Homemade Chilli Powder%0A` +

                `⚖️ *Quantity:* ${quantity} kg%0A` +

                `💰 *Price:* ₹${PRICE_PER_KG}/kg%0A` +

                `💵 *Total:* ₹${totalAmount.toLocaleString("en-IN")}%0A` +

                `📍 *Address:* ${encodeURIComponent(customerAddress)}`;


            const whatsappURL =
                `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappMessage}`;


            // =================================
            // OPEN WHATSAPP
            // =================================

            setTimeout(function () {

                window.open(
                    whatsappURL,
                    "_blank"
                );

            }, 800);


            // =================================
            // RESET FORM
            // =================================

            orderForm.reset();

            quantityInput.value =
                MINIMUM_QUANTITY;

            updateOrderSummary();


        } catch (error) {

            console.error(
                "Unexpected error:",
                error
            );

            showMessage(
                "Something went wrong. Please try again.",
                "error"
            );

        } finally {

            if (placeOrderButton) {

                placeOrderButton.disabled = false;

                placeOrderButton.textContent =
                    "Place Order";
            }
        }

    });

} else {

    console.error(
        "orderForm was not found. Check index.html."
    );
}


// =========================================
// INITIAL SUMMARY
// =========================================

updateOrderSummary();


// =========================================
// WHATSAPP FLOATING BUTTON
// =========================================

const floatingWhatsApp =
    document.getElementById("floatingWhatsApp");

if (floatingWhatsApp) {

    floatingWhatsApp.addEventListener(
        "click",
        function () {

            const message =
                encodeURIComponent(
                    "Hello Mana Ruchi, I want to know more about your homemade chilli powder."
                );

            window.open(
                `https://wa.me/${OWNER_WHATSAPP}?text=${message}`,
                "_blank"
            );

        }
    );
}


// =========================================
// WHATSAPP SHARE BUTTON
// =========================================

const shareWhatsApp =
    document.getElementById("shareWhatsApp");

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
                `https://wa.me/?text=${shareText}`,
                "_blank"
            );

        }
    );
}


// =========================================
// TEST MESSAGE
// =========================================

console.log(
    "Mana Ruchi script.js loaded successfully."
);

console.log(
    "Supabase URL:",
    SUPABASE_URL
);
