/* =========================================================
   🌶️ MANA MASALA - FINAL ORDER SYSTEM
   ========================================================= */
console.log("🌶️ Mana Masala script.js loaded");
/* =========================================================
   SUPABASE
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const EDGE_FUNCTION =
    "new-order-notification";
const PRICE_PER_KG = 350;
const MINIMUM_ORDER = 10;
const OWNER_WHATSAPP = "918367450301";
let db = null;
/* =========================================================
   CREATE SUPABASE CLIENT
========================================================= */
if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    console.log("✅ Supabase already loaded");
    db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
    console.log("✅ Supabase client created");
} else {
    console.error(
        "❌ Supabase library not loaded"
    );
}
/* =========================================================
   START WEBSITE
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        console.log("✅ DOM ready");
        /* =================================================
           GET ELEMENTS
        ================================================= */
        const quantityInput =
            document.getElementById("quantity");
        const decreaseButton =
            document.getElementById("decreaseQuantity");
        const increaseButton =
            document.getElementById("increaseQuantity");
        const summaryQuantity =
            document.getElementById("summaryQuantity");
        const totalPrice =
            document.getElementById("totalPrice");
        const paymentAmount =
            document.getElementById("paymentAmount");
        const customerName =
            document.getElementById("customerName");
        const customerPhone =
            document.getElementById("customerPhone");
        const address =
            document.getElementById("address");
        const placeOrderButton =
            document.getElementById("placeOrderButton");
        const orderMessage =
            document.getElementById("orderMessage");
        const orderForm =
            document.getElementById("orderForm");
        /* =================================================
           DEBUG
        ================================================= */
        console.log(
            "Quantity element:",
            quantityInput
        );
        console.log(
            "Place Order element:",
            placeOrderButton
        );
        console.log(
            "Order form:",
            orderForm
        );
        /* =================================================
           BUTTON CHECK
        ================================================= */
        if (!placeOrderButton) {
            console.error(
                "❌ Place Order button NOT FOUND"
            );
            return;
        }
        console.log(
            "✅ Place Order button FOUND"
        );
        /* =================================================
           QUANTITY
        ================================================= */
        function getQuantity() {
            let value =
                parseInt(
                    quantityInput?.value,
                    10
                );
            if (
                isNaN(value) ||
                value < MINIMUM_ORDER
            ) {
                value =
                    MINIMUM_ORDER;
            }
            return value;
        }
        function updateSummary() {
            const qty =
                getQuantity();
            const total =
                qty * PRICE_PER_KG;
            if (quantityInput) {
                quantityInput.value =
                    qty;
            }
            if (summaryQuantity) {
                summaryQuantity.textContent =
                    qty + " KG";
            }
            if (totalPrice) {
                totalPrice.textContent =
                    "₹" +
                    total.toLocaleString("en-IN");
            }
            if (paymentAmount) {
                paymentAmount.textContent =
                    "₹" +
                    total.toLocaleString("en-IN");
            }
            console.log(
                "Quantity:",
                qty,
                "Total:",
                total
            );
        }
        /* =================================================
           DECREASE
        ================================================= */
        if (decreaseButton) {
            decreaseButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    let qty =
                        getQuantity();
                    qty--;
                    if (
                        qty < MINIMUM_ORDER
                    ) {
                        qty =
                            MINIMUM_ORDER;
                    }
                    quantityInput.value =
                        qty;
                    updateSummary();
                }
            );
        }
        /* =================================================
           INCREASE
        ================================================= */
        if (increaseButton) {
            increaseButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    let qty =
                        getQuantity();
                    qty++;
                    quantityInput.value =
                        qty;
                    updateSummary();
                }
            );
        }
        /* =================================================
           INITIAL SUMMARY
        ================================================= */
        updateSummary();
        /* =================================================
           MESSAGE
        ================================================= */
        function showMessage(
            text,
            success = false
        ) {
            if (!orderMessage) {
                alert(text);
                return;
            }
            orderMessage.textContent =
                text;
            orderMessage.style.display =
                "block";
            orderMessage.style.padding =
                "12px";
            orderMessage.style.marginTop =
                "15px";
            orderMessage.style.fontWeight =
                "600";
            if (success) {
                orderMessage.style.color =
                    "green";
            } else {
                orderMessage.style.color =
                    "red";
            }
        }
        /* =================================================
           PLACE ORDER
        ================================================= */
        async function placeOrder() {
            console.log(
                "🔥 PLACE ORDER BUTTON CLICKED"
            );
            /* ---------------------------------------------
               Prevent multiple clicks
            --------------------------------------------- */
            if (
                placeOrderButton.disabled
            ) {
                return;
            }
            /* ---------------------------------------------
               Clear old message
            --------------------------------------------- */
            if (orderMessage) {
                orderMessage.textContent = "";
                orderMessage.style.display =
                    "none";
            }
            /* ---------------------------------------------
               Get values
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
            const total =
                qty * PRICE_PER_KG;
            console.log(
                "📝 Customer:",
                name
            );
            console.log(
                "📱 Phone:",
                phone
            );
            console.log(
                "📦 Quantity:",
                qty
            );
            console.log(
                "💰 Total:",
                total
            );
            /* ---------------------------------------------
               VALIDATION
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
                qty < MINIMUM_ORDER
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
               CHECK SUPABASE
            --------------------------------------------- */
            if (!db) {
                console.error(
                    "❌ Supabase client unavailable"
                );
                showMessage(
                    "Order system is unavailable. Please refresh the page and try again."
                );
                return;
            }
            /* ---------------------------------------------
               BUTTON LOADING
            --------------------------------------------- */
            placeOrderButton.disabled =
                true;
            const oldButtonText =
                placeOrderButton.innerHTML;
            placeOrderButton.innerHTML =
                "⏳ Processing...";
            /* ---------------------------------------------
               ORDER OBJECT
            --------------------------------------------- */
            const order = {
                customer_name:
                    name,
                customer_phone:
                    cleanPhone,
                quantity_kg:
                    qty,
                address:
                    customerAddress,
                total_amount:
                    total,
                status:
                    "New"
            };
            console.log(
                "📦 Sending order:",
                order
            );
            try {
                /* =========================================
                   SAVE TO SUPABASE
                ========================================= */
                console.log(
                    "📤 Inserting order into Supabase..."
                );
                const {
                    data,
                    error
                } =
                    await db
                        .from("orders")
                        .insert(order)
                        .select();
                if (error) {
                    console.error(
                        "❌ SUPABASE ERROR:",
                        error
                    );
                    throw new Error(
                        error.message
                    );
                }
                console.log(
                    "✅ ORDER SAVED:",
                    data
                );
                /* =========================================
                   OWNER NOTIFICATION
                ========================================= */
                console.log(
                    "📲 Sending owner notification..."
                );
                try {
                    const {
                        data:
                            notificationData,
                        error:
                            notificationError
                    } =
                        await db.functions.invoke(
                            EDGE_FUNCTION,
                            {
                                body: {
                                    order: order
                                }
                            }
                        );
                    if (
                        notificationError
                    ) {
                        console.error(
                            "⚠️ Notification failed:",
                            notificationError
                        );
                    } else {
                        console.log(
                            "✅ Owner notification sent:",
                            notificationData
                        );
                    }
                } catch (
                    notificationError
                ) {
                    /*
                       The order has already been saved.
                       Notification failure must not
                       make the customer order fail.
                    */
                    console.error(
                        "⚠️ Notification exception:",
                        notificationError
                    );
                }
                /* =========================================
                   SUCCESS
                ========================================= */
                showMessage(
                    "✅ Order confirmed successfully! We will contact you shortly.",
                    true
                );
                console.log(
                    "🎉 ORDER COMPLETED"
                );
                /* =========================================
                   RESET FORM
                ========================================= */
                if (orderForm) {
                    orderForm.reset();
                }
                if (quantityInput) {
                    quantityInput.value =
                        MINIMUM_ORDER;
                }
                updateSummary();
                /* =========================================
                   WHATSAPP
                   PREPARED ONLY — NOT OPENED
                ========================================= */
                const whatsappText =
`🌶️ Mana Masala Order
Customer: ${name}
Phone: ${cleanPhone}
Quantity: ${qty} KG
Total: ₹${total.toLocaleString("en-IN")}
Delivery Address:
${customerAddress}`;
                const whatsappURL =
                    "https://wa.me/" +
                    OWNER_WHATSAPP +
                    "?text=" +
                    encodeURIComponent(
                        whatsappText
                    );
                console.log(
                    "💬 WhatsApp URL prepared:",
                    whatsappURL
                );
                console.log(
                    "💬 Automatic WhatsApp redirect: DISABLED"
                );
            } catch (error) {
                console.error(
                    "❌ ORDER ERROR:",
                    error
                );
                showMessage(
                    "Order could not be completed. Please try again later."
                );
            } finally {
                placeOrderButton.disabled =
                    false;
                placeOrderButton.innerHTML =
                    oldButtonText;
            }
        }
        /* =================================================
           ATTACH BUTTON EVENT
        ================================================= */
        placeOrderButton.onclick =
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                placeOrder();
            };
        console.log(
            "✅ Place Order click handler attached"
        );
        /* =================================================
           IMPORTANT:
           Prevent normal form submission
        ================================================= */
        if (orderForm) {
            orderForm.onsubmit =
                function (event) {
                    event.preventDefault();
                    console.log(
                        "ℹ️ Normal form submission prevented"
                    );
                };
        }
        /* =================================================
           FINAL STATUS
        ================================================= */
        console.log(
            "🌶️ Mana Masala Order System Ready"
        );
        console.log(
            "💬 Automatic WhatsApp redirect: DISABLED"
        );
        console.log(
            "📦 Supabase orders: ENABLED"
        );
        console.log(
            "📲 Owner notifications: ENABLED"
        );
    }
);

Also check this one line in index.html

Your Place Order button must have this ID:

<button type="button" id="placeOrderButton">
    🛒 Place Order
</button>

Do not change anything else.

After saving, open:

https://chotu337.github.io/Mana-Ruchi/?v=99999

Then click Place Order.

The console should now show:

✅ Place Order button FOUND
✅ Place Order click handler attached
🔥 PLACE ORDER BUTTON CLICKED
📝 Customer: ...
📦 Quantity: ...
📤 Inserting order into Supabase...

If you see 🔥 PLACE ORDER BUTTON CLICKED, we’ve fixed the button and the next error, if any, will be specifically from validation/Supabase—not the homepage theme.
