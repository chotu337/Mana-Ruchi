/* =========================================
   MANA RUCHI ORDER SYSTEM
========================================= */
console.log("Mana Ruchi script.js started");
/* =========================================
   SUPABASE SETTINGS
========================================= */
const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";
const SUPABASE_ANON_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";
const PRICE_PER_KG = 350;
const MINIMUM_QUANTITY = 10;
const OWNER_WHATSAPP = "918367450301";
/* =========================================
   CHECK SUPABASE
========================================= */
if (!window.supabase) {
    alert(
        "Error: Supabase library did not load."
    );
    console.error(
        "Supabase library is missing."
    );
} else {
    console.log(
        "Supabase library loaded successfully."
    );
}
/* =========================================
   CREATE SUPABASE CLIENT
========================================= */
const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
/* =========================================
   HTML ELEMENTS
========================================= */
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
const shareWhatsApp =
    document.getElementById("shareWhatsApp");
/* =========================================
   CHECK HTML ELEMENTS
========================================= */
console.log("Order form:", orderForm);
console.log("Name field:", customerName);
console.log("Phone field:", customerPhone);
console.log("Quantity:", quantityInput);
console.log("Address:", addressInput);
console.log("Order button:", placeOrderButton);
/* =========================================
   SHOW MESSAGE
========================================= */
function showMessage(message, type) {
    if (!orderMessage) {
        alert(message);
        return;
    }
    orderMessage.textContent = message;
    orderMessage.className = type;
    orderMessage.style.display = "block";
}
/* =========================================
   UPDATE TOTAL
========================================= */
function updateTotal() {
    let quantity =
        Number(quantityInput.value);
    if (
        isNaN(quantity) ||
        quantity < MINIMUM_QUANTITY
    ) {
        quantity = MINIMUM_QUANTITY;
        quantityInput.value =
            MINIMUM_QUANTITY;
    }
    const total =
        quantity * PRICE_PER_KG;
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
/* =========================================
   DECREASE
========================================= */
if (decreaseQuantity) {
    decreaseQuantity.addEventListener(
        "click",
        function () {
            let quantity =
                Number(quantityInput.value);
            if (
                quantity > MINIMUM_QUANTITY
            ) {
                quantity--;
                quantityInput.value =
                    quantity;
            }
            updateTotal();
        }
    );
}
/* =========================================
   INCREASE
========================================= */
if (increaseQuantity) {
    increaseQuantity.addEventListener(
        "click",
        function () {
            let quantity =
                Number(quantityInput.value);
            quantity++;
            quantityInput.value =
                quantity;
            updateTotal();
        }
    );
}
/* =========================================
   QUANTITY INPUT
========================================= */
if (quantityInput) {
    quantityInput.addEventListener(
        "input",
        updateTotal
    );
}
/* =========================================
   ORDER FORM
========================================= */
if (!orderForm) {
    console.error(
        "ERROR: orderForm was not found."
    );
} else {
    console.log(
        "Order form connected successfully."
    );
    orderForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();
            console.log(
                "PLACE ORDER BUTTON CLICKED"
            );
            /* -----------------------------
               GET VALUES
            ----------------------------- */
            const name =
                customerName.value.trim();
            const phone =
                customerPhone.value.trim();
            const quantity =
                Number(quantityInput.value);
            const address =
                addressInput.value.trim();
            /* -----------------------------
               VALIDATION
            ----------------------------- */
            if (!name) {
                showMessage(
                    "Please enter your name.",
                    "error"
                );
                return;
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                showMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );
                return;
            }
            if (
                isNaN(quantity) ||
                quantity < MINIMUM_QUANTITY
            ) {
                showMessage(
                    "Minimum order is 10 kg.",
                    "error"
                );
                return;
            }
            if (!address) {
                showMessage(
                    "Please enter your delivery address.",
                    "error"
                );
                return;
            }
            const totalAmount =
                quantity * PRICE_PER_KG;
            /* -----------------------------
               BUTTON
            ----------------------------- */
            placeOrderButton.disabled = true;
            placeOrderButton.textContent =
                "Placing Order...";
            showMessage(
                "Saving your order...",
                "success"
            );
            try {
                console.log(
                    "Connecting to Supabase..."
                );
                /* -----------------------------
                   INSERT ORDER
                ----------------------------- */
                const result =
                    await db
                        .from("orders")
                        .insert([
                            {
                                customer_name: name,
                                customer_phone: phone,
                                quantity: quantity,
                                address: address,
                                price_per_kg:
                                    PRICE_PER_KG,
                                total_amount:
                                    totalAmount,
                                status:
                                    "Pending"
                            }
                        ])
                        .select()
                        .single();
                console.log(
                    "Supabase response:",
                    result
                );
                const data =
                    result.data;
                const error =
                    result.error;
                /* -----------------------------
                   ERROR
                ----------------------------- */
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
                /* -----------------------------
                   SUCCESS
                ----------------------------- */
                console.log(
                    "ORDER SAVED SUCCESSFULLY:",
                    data
                );
                showMessage(
                    "✅ Order confirmed! " +
                    "Order ID: " +
                    data.id +
                    " | Total: ₹" +
                    totalAmount.toLocaleString("en-IN"),
                    "success"
                );
                /* -----------------------------
                   WHATSAPP
                ----------------------------- */
                const message =
`🌶️ MANA RUCHI ORDER
Order ID: ${data.id}
Customer Name: ${name}
Mobile: ${phone}
Quantity: ${quantity} kg
Price: ₹${PRICE_PER_KG}/kg
Total: ₹${totalAmount}
Delivery Address:
${address}
Status: Pending`;
                const whatsappURL =
                    "https://wa.me/" +
                    OWNER_WHATSAPP +
                    "?text=" +
                    encodeURIComponent(message);
                /* -----------------------------
                   OPEN WHATSAPP
                ----------------------------- */
                setTimeout(
                    function () {
                        window.open(
                            whatsappURL,
                            "_blank"
                        );
                    },
                    700
                );
                /* -----------------------------
                   RESET FORM
                ----------------------------- */
                orderForm.reset();
                quantityInput.value =
                    MINIMUM_QUANTITY;
                updateTotal();
            }
            catch (error) {
                console.error(
                    "JAVASCRIPT ERROR:",
                    error
                );
                showMessage(
                    "❌ Something went wrong: " +
                    error.message,
                    "error"
                );
            }
            finally {
                placeOrderButton.disabled =
                    false;
                placeOrderButton.textContent =
                    "Place Order";
            }
        }
    );
}
/* =========================================
   WHATSAPP SHARE
========================================= */
if (shareWhatsApp) {
    shareWhatsApp.addEventListener(
        "click",
        function () {
            const text =
                "🌶️ Check out Mana Ruchi Homemade Chilli Powder!";
            const url =
                window.location.href;
            window.open(
                "https://wa.me/?text=" +
                encodeURIComponent(
                    text + "\n" + url
                ),
                "_blank"
            );
        }
    );
}
/* =========================================
   INITIAL TOTAL
========================================= */
updateTotal();
console.log(
    "🌶️ Mana Ruchi Order System Ready"
);
