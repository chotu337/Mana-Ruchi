/* =========================================================
   MANA MASALA - COMPLETE ORDER SYSTEM
   Price: ₹350/kg
   Minimum Order: 10 kg
   Features:
   ✅ Supabase order saving
   ✅ Owner email notification
   ✅ Quantity calculation
   ✅ Payment amount update
   ✅ Order confirmation
   ❌ NO automatic WhatsApp redirect
========================================================= */
console.log("🌶️ Mana Masala script.js started");
/* =========================================================
   SUPABASE SETTINGS
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const EDGE_FUNCTION_NAME =
    "new-order-notification";
const PRICE_PER_KG = 350;
const MINIMUM_ORDER = 10;
const OWNER_WHATSAPP =
    "918367450301";
/* =========================================================
   LOAD SUPABASE
========================================================= */
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }
        const script =
            document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = () => {
            console.log(
                "✅ Supabase library loaded"
            );
            resolve();
        };
        script.onerror = () => {
            reject(
                new Error(
                    "Supabase library could not be loaded."
                )
            );
        };
        document.head.appendChild(script);
    });
}
/* =========================================================
   START ORDER SYSTEM
========================================================= */
async function startOrderSystem() {
    try {
        await loadSupabase();
        /* =================================================
           CREATE SUPABASE CLIENT
        ================================================= */
        const db =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );
        console.log(
            "✅ Supabase client initialized"
        );
        /* =================================================
           GET HTML ELEMENTS
        ================================================= */
        const customerName =
            document.getElementById(
                "customerName"
            );
        const customerPhone =
            document.getElementById(
                "customerPhone"
            );
        const addressInput =
            document.getElementById(
                "address"
            );
        const quantityInput =
            document.getElementById(
                "quantity"
            );
        const decreaseQuantity =
            document.getElementById(
                "decreaseQuantity"
            );
        const increaseQuantity =
            document.getElementById(
                "increaseQuantity"
            );
        const summaryQuantity =
            document.getElementById(
                "summaryQuantity"
            );
        const totalPrice =
            document.getElementById(
                "totalPrice"
            );
        const paymentAmount =
            document.getElementById(
                "paymentAmount"
            );
        const paymentAmountInstruction =
            document.getElementById(
                "paymentAmountInstruction"
            );
        const placeOrderButton =
            document.getElementById(
                "placeOrderButton"
            );
        const orderMessage =
            document.getElementById(
                "orderMessage"
            );
        /* =================================================
           CHECK REQUIRED ELEMENTS
        ================================================= */
        if (!customerName) {
            console.error(
                "❌ customerName element not found."
            );
        }
        if (!customerPhone) {
            console.error(
                "❌ customerPhone element not found."
            );
        }
        if (!addressInput) {
            console.error(
                "❌ address element not found."
            );
        }
        if (!quantityInput) {
            console.error(
                "❌ quantity element not found."
            );
        }
        if (!placeOrderButton) {
            console.error(
                "❌ Place Order button not found."
            );
            return;
        }
        /* =================================================
           SHOW MESSAGE
        ================================================= */
        function showMessage(
            message,
            type
        ) {
            if (!orderMessage) {
                alert(message);
                return;
            }
            orderMessage.textContent =
                message;
            orderMessage.className =
                "order-message " +
                type;
            orderMessage.style.display =
                "block";
        }
        /* =================================================
           UPDATE TOTAL
        ================================================= */
        function updateTotal() {
            if (!quantityInput) {
                return;
            }
            let quantity =
                Number(
                    quantityInput.value
                );
            if (
                !Number.isFinite(quantity) ||
                quantity < MINIMUM_ORDER
            ) {
                quantity =
                    MINIMUM_ORDER;
                quantityInput.value =
                    MINIMUM_ORDER;
            }
            quantity =
                Math.floor(quantity);
            const total =
                quantity *
                PRICE_PER_KG;
            /* ---------------------------------------------
               SUMMARY QUANTITY
            --------------------------------------------- */
            if (summaryQuantity) {
                summaryQuantity.textContent =
                    quantity;
            }
            /* ---------------------------------------------
               TOTAL PRICE
               HTML already contains ₹
               Therefore JS adds numbers only.
            --------------------------------------------- */
            if (totalPrice) {
                totalPrice.textContent =
                    total.toLocaleString(
                        "en-IN"
                    );
            }
            /* ---------------------------------------------
               PAYMENT AMOUNT
            --------------------------------------------- */
            if (paymentAmount) {
                paymentAmount.textContent =
                    total.toLocaleString(
                        "en-IN"
                    );
            }
            if (
                paymentAmountInstruction
            ) {
                paymentAmountInstruction.textContent =
                    total.toLocaleString(
                        "en-IN"
                    );
            }
            console.log(
                "Quantity:",
                quantity,
                "Total:",
                total
            );
        }
        /* =================================================
           DECREASE QUANTITY
        ================================================= */
        if (decreaseQuantity) {
            decreaseQuantity.addEventListener(
                "click",
                function () {
                    let quantity =
                        Number(
                            quantityInput.value
                        );
                    if (
                        !Number.isFinite(
                            quantity
                        )
                    ) {
                        quantity =
                            MINIMUM_ORDER;
                    }
                    if (
                        quantity >
                        MINIMUM_ORDER
                    ) {
                        quantity--;
                        quantityInput.value =
                            quantity;
                    }
                    updateTotal();
                }
            );
        }
        /* =================================================
           INCREASE QUANTITY
        ================================================= */
        if (increaseQuantity) {
            increaseQuantity.addEventListener(
                "click",
                function () {
                    let quantity =
                        Number(
                            quantityInput.value
                        );
                    if (
                        !Number.isFinite(
                            quantity
                        )
                    ) {
                        quantity =
                            MINIMUM_ORDER;
                    }
                    quantity++;
                    quantityInput.value =
                        quantity;
                    updateTotal();
                }
            );
        }
        /* =================================================
           MANUAL QUANTITY
        ================================================= */
        if (quantityInput) {
            quantityInput.addEventListener(
                "input",
                updateTotal
            );
        }
        /* =================================================
           PLACE ORDER
        ================================================= */
        placeOrderButton.addEventListener(
            "click",
            async function () {
                console.log(
                    "🛒 PLACE ORDER CLICKED"
                );
                /* =========================================
                   GET CUSTOMER VALUES
                ========================================= */
                const name =
                    customerName.value.trim();
                const phone =
                    customerPhone.value.trim();
                const address =
                    addressInput.value.trim();
                let quantity =
                    Number(
                        quantityInput.value
                    );
                /* =========================================
                   VALIDATION
                ========================================= */
                if (!name) {
                    showMessage(
                        "Please enter your full name.",
                        "error"
                    );
                    customerName.focus();
                    return;
                }
                if (
                    !/^[0-9]{10}$/.test(
                        phone
                    )
                ) {
                    showMessage(
                        "Please enter a valid 10-digit mobile number.",
                        "error"
                    );
                    customerPhone.focus();
                    return;
                }
                if (
                    !Number.isFinite(
                        quantity
                    ) ||
                    quantity < MINIMUM_ORDER
                ) {
                    showMessage(
                        "Minimum order is 10 kg.",
                        "error"
                    );
                    quantityInput.value =
                        MINIMUM_ORDER;
                    updateTotal();
                    return;
                }
                quantity =
                    Math.floor(quantity);
                if (!address) {
                    showMessage(
                        "Please enter your complete delivery address.",
                        "error"
                    );
                    addressInput.focus();
                    return;
                }
                /* =========================================
                   CALCULATE TOTAL
                ========================================= */
                const totalAmount =
                    quantity *
                    PRICE_PER_KG;
                console.log(
                    "Order total:",
                    totalAmount
                );
                /* =========================================
                   DISABLE BUTTON
                ========================================= */
                placeOrderButton.disabled =
                    true;
                placeOrderButton.innerHTML =
                    "⏳ Placing Order...";
                showMessage(
                    "Saving your order...",
                    "success"
                );
                try {
                    /* =====================================
                       SAVE ORDER TO SUPABASE
                    ===================================== */
                    console.log(
                        "Connecting to Supabase..."
                    );
                    const { error } =
                        await db
                            .from("orders")
                            .insert({
                                customer_name:
                                    name,
                                customer_phone:
                                    phone,
                                quantity_kg:
                                    quantity,
                                address:
                                    address,
                                total_amount:
                                    totalAmount,
                                status:
                                    "New"
                            });
                    /* =====================================
                       DATABASE ERROR
                    ===================================== */
                    if (error) {
                        console.error(
                            "❌ SUPABASE ERROR:",
                            error
                        );
                        showMessage(
                            "❌ Order failed: " +
                            error.message,
                            "error"
                        );
                        return;
                    }
                    console.log(
                        "✅ ORDER SAVED"
                    );
                    /* =====================================
                       OWNER NOTIFICATION
                    ===================================== */
                    try {
                        console.log(
                            "📧 Sending owner notification..."
                        );
                        const notification =
                            await db.functions.invoke(
                                EDGE_FUNCTION_NAME,
                                {
                                    body: {
                                        order: {
                                            customer_name:
                                                name,
                                            customer_phone:
                                                phone,
                                            quantity_kg:
                                                quantity,
                                            address:
                                                address,
                                            total_amount:
                                                totalAmount,
                                            status:
                                                "New"
                                        }
                                    }
                                }
                            );
                        if (
                            notification.error
                        ) {
                            console.warn(
                                "⚠️ Notification warning:",
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
                        console.warn(
                            "⚠️ Notification failed:",
                            notificationError
                        );
                    }
                    /* =====================================
                       SUCCESS MESSAGE
                    ===================================== */
                    showMessage(
                        "✅ Order confirmed successfully! " +
                        "Total Amount: ₹" +
                        totalAmount.toLocaleString(
                            "en-IN"
                        ),
                        "success"
                    );
                    /* =====================================
                       CREATE WHATSAPP MESSAGE
                       
                       IMPORTANT:
                       This message is created only.
                       WhatsApp will NOT open automatically.
                    ===================================== */
                    const whatsappMessage =
`🌶️ MANA MASALA ORDER
Customer Name: ${name}
Mobile: ${phone}
Quantity: ${quantity} kg
Price: ₹${PRICE_PER_KG}/kg
Total: ₹${totalAmount.toLocaleString("en-IN")}
Delivery Address:
${address}
Status: New`;
                    console.log(
                        "WhatsApp message prepared."
                    );
                    /* =====================================
                       DO NOT OPEN WHATSAPP
                       
                       There is intentionally NO:
                       window.open()
                       location.href
                       window.location
                       WhatsApp redirect
                    ===================================== */
                    /* =====================================
                       RESET FORM
                    ===================================== */
                    customerName.value =
                        "";
                    customerPhone.value =
                        "";
                    addressInput.value =
                        "";
                    quantityInput.value =
                        MINIMUM_ORDER;
                    updateTotal();
                    console.log(
                        "✅ Customer remains on Mana Masala website."
                    );
                } catch (error) {
                    console.error(
                        "❌ ORDER ERROR:",
                        error
                    );
                    showMessage(
                        "❌ Order failed: " +
                        (
                            error.message ||
                            "Please try again later."
                        ),
                        "error"
                    );
                } finally {
                    /* =====================================
                       RESTORE BUTTON
                    ===================================== */
                    placeOrderButton.disabled =
                        false;
                    placeOrderButton.innerHTML =
                        `<span>✓</span>
                         <span>I Have Made the Payment –
                         Confirm & Place Order</span>
                         <span>→</span>`;
                }
            }
        );
        /* =================================================
           INITIAL TOTAL
        ================================================= */
        updateTotal();
        console.log(
            "🌶️ Mana Masala Order System Ready"
        );
        /* =================================================
           IMPORTANT SAFETY CHECK
           
           This script contains no automatic WhatsApp
           redirect after placing an order.
        ================================================= */
        console.log(
            "💬 Automatic WhatsApp redirect: DISABLED"
        );
    } catch (error) {
        console.error(
            "❌ SYSTEM ERROR:",
            error
        );
        alert(
            "Website order system could not start. Please refresh the page."
        );
    }
}
/* =========================================================
   START
========================================================= */
if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        startOrderSystem
    );
} else {
    startOrderSystem();
}
