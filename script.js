/* =========================================================
   🌶️ MANA MASALA - COMPLETE ORDER SYSTEM
   ---------------------------------------------------------
   • Supabase order saving
   • Owner notification
   • ₹350 per KG
   • Minimum order: 10 KG
   • WhatsApp auto-opening: DISABLED
   • Keeps customer on website after ordering
========================================================= */
console.log("🌶️ Mana Masala script.js started");
/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const EDGE_FUNCTION_NAME =
    "new-order-notification";
/* =========================================================
   2. PRODUCT SETTINGS
========================================================= */
const PRICE_PER_KG = 350;
const MINIMUM_ORDER_KG = 10;
const OWNER_WHATSAPP =
    "918367450301";
/* =========================================================
   3. INITIALIZE SUPABASE
========================================================= */
let db = null;
try {
    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {
        console.error(
            "❌ Supabase CDN is not loaded."
        );
    } else {
        db = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
        console.log(
            "✅ Supabase client initialized"
        );
    }
} catch (error) {
    console.error(
        "❌ Supabase initialization failed:",
        error
    );
}
/* =========================================================
   4. PAGE ELEMENTS
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        console.log("✅ DOM loaded");
        const orderForm =
            document.getElementById("orderForm");
        const customerName =
            document.getElementById("customerName");
        const customerPhone =
            document.getElementById("customerPhone");
        const address =
            document.getElementById("address");
        const quantity =
            document.getElementById("quantity");
        const decreaseQuantity =
            document.getElementById("decreaseQuantity");
        const increaseQuantity =
            document.getElementById("increaseQuantity");
        const summaryQuantity =
            document.getElementById("summaryQuantity");
        const totalPrice =
            document.getElementById("totalPrice");
        const paymentAmount =
            document.getElementById("paymentAmount");
        const placeOrderButton =
            document.getElementById("placeOrderButton");
        const orderMessage =
            document.getElementById("orderMessage");
        /* =================================================
           5. CHECK REQUIRED ELEMENTS
        ================================================= */
        console.log(
            "Order form:",
            orderForm
        );
        console.log(
            "Place Order button:",
            placeOrderButton
        );
        if (!placeOrderButton) {
            console.error(
                "❌ ERROR: placeOrderButton was not found."
            );
            return;
        }
        console.log(
            "✅ Place Order button found"
        );
        /* =================================================
           6. HELPER FUNCTIONS
        ================================================= */
        function getQuantity() {
            let value =
                parseInt(
                    quantity?.value || MINIMUM_ORDER_KG,
                    10
                );
            if (
                isNaN(value) ||
                value < MINIMUM_ORDER_KG
            ) {
                value = MINIMUM_ORDER_KG;
            }
            return value;
        }
        function calculateTotal() {
            return getQuantity() * PRICE_PER_KG;
        }
        function updateOrderSummary() {
            const qty =
                getQuantity();
            const total =
                qty * PRICE_PER_KG;
            if (quantity) {
                quantity.value = qty;
            }
            if (summaryQuantity) {
                summaryQuantity.textContent =
                    qty + " KG";
            }
            if (totalPrice) {
                totalPrice.textContent =
                    "₹" + total.toLocaleString("en-IN");
            }
            if (paymentAmount) {
                paymentAmount.textContent =
                    "₹" + total.toLocaleString("en-IN");
            }
            console.log(
                "Quantity:",
                qty,
                "Total:",
                total
            );
        }
        function showMessage(
            message,
            type = "error"
        ) {
            if (!orderMessage) {
                alert(message);
                return;
            }
            orderMessage.textContent =
                message;
            orderMessage.style.display =
                "block";
            orderMessage.className =
                "order-message " + type;
            if (type === "success") {
                orderMessage.style.color =
                    "#16803c";
            } else {
                orderMessage.style.color =
                    "#c62828";
            }
        }
        function clearMessage() {
            if (!orderMessage) {
                return;
            }
            orderMessage.textContent = "";
            orderMessage.style.display =
                "none";
        }
        function setButtonLoading(
            loading
        ) {
            if (!placeOrderButton) {
                return;
            }
            if (loading) {
                placeOrderButton.disabled =
                    true;
                placeOrderButton.dataset.originalText =
                    placeOrderButton.innerHTML;
                placeOrderButton.innerHTML =
                    "⏳ Processing Order...";
            } else {
                placeOrderButton.disabled =
                    false;
                placeOrderButton.innerHTML =
                    placeOrderButton.dataset.originalText ||
                    "🛒 Place Order";
            }
        }
        /* =================================================
           7. QUANTITY BUTTONS
        ================================================= */
        if (decreaseQuantity) {
            decreaseQuantity.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    let qty =
                        getQuantity();
                    qty--;
                    if (
                        qty < MINIMUM_ORDER_KG
                    ) {
                        qty =
                            MINIMUM_ORDER_KG;
                    }
                    if (quantity) {
                        quantity.value =
                            qty;
                    }
                    updateOrderSummary();
                }
            );
        }
        if (increaseQuantity) {
            increaseQuantity.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    let qty =
                        getQuantity();
                    qty++;
                    if (quantity) {
                        quantity.value =
                            qty;
                    }
                    updateOrderSummary();
                }
            );
        }
        if (quantity) {
            quantity.addEventListener(
                "input",
                function () {
                    let qty =
                        parseInt(
                            quantity.value,
                            10
                        );
                    if (
                        isNaN(qty) ||
                        qty < MINIMUM_ORDER_KG
                    ) {
                        qty =
                            MINIMUM_ORDER_KG;
                    }
                    quantity.value =
                        qty;
                    updateOrderSummary();
                }
            );
        }
        /* =================================================
           8. INITIAL SUMMARY
        ================================================= */
        updateOrderSummary();
        /* =================================================
           9. ORDER PROCESSING
        ================================================= */
        async function processOrder(
            event
        ) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            console.log(
                "🔥 PLACE ORDER BUTTON CLICKED"
            );
            clearMessage();
            /* ---------------------------------------------
               Check Supabase
            --------------------------------------------- */
            if (!db) {
                console.error(
                    "❌ Supabase client is unavailable."
                );
                showMessage(
                    "Order system is not ready. Please refresh the page and try again."
                );
                return;
            }
            /* ---------------------------------------------
               Get customer details
            --------------------------------------------- */
            const name =
                customerName?.value
                    ?.trim() || "";
            const phone =
                customerPhone?.value
                    ?.trim() || "";
            const customerAddress =
                address?.value
                    ?.trim() || "";
            const qty =
                getQuantity();
            const totalAmount =
                qty * PRICE_PER_KG;
            console.log(
                "📝 Order details:",
                {
                    name,
                    phone,
                    qty,
                    totalAmount,
                    address: customerAddress
                }
            );
            /* ---------------------------------------------
               Validation
            --------------------------------------------- */
            if (!name) {
                showMessage(
                    "Please enter your name."
                );
                customerName?.focus();
                return;
            }
            const cleanPhone =
                phone.replace(
                    /\D/g,
                    ""
                );
            if (
                cleanPhone.length !== 10
            ) {
                showMessage(
                    "Please enter a valid 10-digit mobile number."
                );
                customerPhone?.focus();
                return;
            }
            if (
                qty < MINIMUM_ORDER_KG
            ) {
                showMessage(
                    "Minimum order is 10 KG."
                );
                return;
            }
            if (!customerAddress) {
                showMessage(
                    "Please enter your delivery address."
                );
                address?.focus();
                return;
            }
            /* ---------------------------------------------
               Disable button
            --------------------------------------------- */
            setButtonLoading(true);
            try {
                /* =========================================
                   10. SAVE ORDER TO SUPABASE
                ========================================= */
                console.log(
                    "📦 Saving order to Supabase..."
                );
                const orderData = {
                    customer_name:
                        name,
                    customer_phone:
                        cleanPhone,
                    quantity_kg:
                        qty,
                    address:
                        customerAddress,
                    total_amount:
                        totalAmount,
                    status:
                        "New"
                };
                const result =
                    await db
                        .from("orders")
                        .insert([
                            orderData
                        ])
                        .select();
                if (result.error) {
                    console.error(
                        "❌ Supabase order error:",
                        result.error
                    );
                    throw new Error(
                        result.error.message ||
                        "Could not save order."
                    );
                }
                console.log(
                    "✅ ORDER SAVED:",
                    result.data
                );
                /* =========================================
                   11. OWNER NOTIFICATION
                ========================================= */
                console.log(
                    "📧 Sending owner notification..."
                );
                try {
                    const notification =
                        await db.functions.invoke(
                            EDGE_FUNCTION_NAME,
                            {
                                body: {
                                    order: orderData
                                }
                            }
                        );
                    if (notification.error) {
                        console.error(
                            "⚠️ Notification error:",
                            notification.error
                        );
                    } else {
                        console.log(
                            "✅ Owner notification sent"
                        );
                    }
                } catch (
                    notificationError
                ) {
                    /*
                     IMPORTANT:
                     Notification failure should NOT
                     make the customer's order fail.
                     The order has already been saved.
                    */
                    console.error(
                        "⚠️ Notification failed:",
                        notificationError
                    );
                }
                /* =========================================
                   12. PREPARE WHATSAPP MESSAGE
                   BUT DO NOT OPEN WHATSAPP
                ========================================= */
                const whatsappMessage =
`🌶️ Mana Masala Order
Customer: ${name}
Phone: ${cleanPhone}
Quantity: ${qty} KG
Total: ₹${totalAmount.toLocaleString("en-IN")}
Delivery Address:
${customerAddress}`;
                const whatsappURL =
                    "https://wa.me/" +
                    OWNER_WHATSAPP +
                    "?text=" +
                    encodeURIComponent(
                        whatsappMessage
                    );
                console.log(
                    "💬 WhatsApp message prepared"
                );
                console.log(
                    "💬 Automatic WhatsApp redirect: DISABLED"
                );
                console.log(
                    "WhatsApp URL:",
                    whatsappURL
                );
                /* =========================================
                   13. SHOW SUCCESS MESSAGE
                ========================================= */
                showMessage(
                    "✅ Order confirmed successfully! We will contact you shortly.",
                    "success"
                );
                /* =========================================
                   14. RESET FORM
                ========================================= */
                if (orderForm) {
                    orderForm.reset();
                }
                if (quantity) {
                    quantity.value =
                        MINIMUM_ORDER_KG;
                }
                updateOrderSummary();
                /* =========================================
                   15. SCROLL TO MESSAGE
                ========================================= */
                if (orderMessage) {
                    orderMessage.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
                console.log(
                    "🎉 ORDER COMPLETED SUCCESSFULLY"
                );
            } catch (error) {
                console.error(
                    "❌ ORDER FAILED:",
                    error
                );
                showMessage(
                    "Order could not be completed. Please try again later."
                );
            } finally {
                setButtonLoading(false);
            }
        }
        /* =================================================
           16. PLACE ORDER BUTTON
        ================================================= */
        placeOrderButton.addEventListener(
            "click",
            processOrder
        );
        /* =================================================
           17. FORM SUBMIT
           This also protects against pressing Enter.
        ================================================= */
        if (orderForm) {
            orderForm.addEventListener(
                "submit",
                processOrder
            );
        }
        /* =================================================
           18. FINAL STATUS
        ================================================= */
        console.log(
            "🌶️ Mana Masala Order System Ready"
        );
        console.log(
            "💰 Price: ₹" +
            PRICE_PER_KG +
            "/KG"
        );
        console.log(
            "📦 Minimum Order: " +
            MINIMUM_ORDER_KG +
            " KG"
        );
        console.log(
            "💬 Automatic WhatsApp redirect: DISABLED"
        );
    }
);

One important change in your index.html

Your button should remain exactly like this:

<button type="button" id="placeOrderButton">
    🛒 Place Order
</button>

Do not change your theme or CSS.

Also make sure your Supabase CDN appears before script.js:

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="./script.js?v=99999"></script>

Then test

1. Save script.js in GitHub.
2. Wait for GitHub Pages to deploy.
3. Open:
    https://chotu337.github.io/Mana-Ruchi/?v=99999
4. Enter the customer details.
5. Select 10 KG or more.
6. Tap Place Order.

If it still doesn’t work, don’t change anything else. Send me a screenshot of the browser Console immediately after pressing Place Order. The error there will tell us exactly what is failing.
