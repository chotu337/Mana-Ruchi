/* =========================================================
   MANA MASALA - COMPLETE ORDER SYSTEM
   Product:
   Homemade Chilli Powder
   Price:
   ₹350/kg
   Minimum Order:
   10 kg
   IMPORTANT:
   - Saves order to Supabase
   - Sends owner notification
   - Does NOT automatically open WhatsApp
   - Customer remains on the website
========================================================= */
console.log("🌶️ Mana Masala script.js loaded");
/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const EDGE_FUNCTION_NAME =
    "new-order-notification";
/* =========================================================
   BUSINESS SETTINGS
========================================================= */
const PRICE_PER_KG = 350;
const MINIMUM_ORDER = 10;
const OWNER_WHATSAPP = "918367450301";
/* =========================================================
   LOAD SUPABASE
========================================================= */
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            console.log("✅ Supabase already loaded");
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
   MAIN ORDER SYSTEM
========================================================= */
async function startOrderSystem() {
    try {
        await loadSupabase();
        /* -------------------------------------------------
           CREATE SUPABASE CLIENT
        ------------------------------------------------- */
        const db =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );
        console.log(
            "✅ Supabase client created"
        );
        /* -------------------------------------------------
           GET HTML ELEMENTS
        ------------------------------------------------- */
        const orderForm =
            document.getElementById("orderForm");
        const customerName =
            document.getElementById("customerName");
        const customerPhone =
            document.getElementById("customerPhone");
        const addressInput =
            document.getElementById("address");
        const quantityInput =
            document.getElementById("quantity");
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
        const placeOrderButton =
            document.getElementById(
                "placeOrderButton"
            );
        const orderMessage =
            document.getElementById(
                "orderMessage"
            );
        const shareWhatsApp =
            document.getElementById(
                "shareWhatsApp"
            );
        /* -------------------------------------------------
           CHECK REQUIRED ELEMENTS
        ------------------------------------------------- */
        if (!orderForm) {
            throw new Error(
                "orderForm not found."
            );
        }
        if (!customerName) {
            throw new Error(
                "customerName not found."
            );
        }
        if (!customerPhone) {
            throw new Error(
                "customerPhone not found."
            );
        }
        if (!addressInput) {
            throw new Error(
                "address not found."
            );
        }
        if (!quantityInput) {
            throw new Error(
                "quantity not found."
            );
        }
        if (!placeOrderButton) {
            throw new Error(
                "placeOrderButton not found."
            );
        }
        /* =================================================
           MESSAGE FUNCTION
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
                "order-message " + type;
            orderMessage.style.display =
                "block";
            orderMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
        /* =================================================
           UPDATE TOTAL
        ================================================= */
        function updateTotal() {
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
            if (summaryQuantity) {
                summaryQuantity.textContent =
                    quantity + " kg";
            }
            if (totalPrice) {
                totalPrice.textContent =
                    "₹" +
                    total.toLocaleString(
                        "en-IN"
                    );
            }
            if (paymentAmount) {
                paymentAmount.textContent =
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
           QUANTITY - DECREASE
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
                    quantity =
                        Math.floor(quantity);
                    if (
                        quantity >
                        MINIMUM_ORDER
                    ) {
                        quantity--;
                    }
                    quantityInput.value =
                        quantity;
                    updateTotal();
                }
            );
        }
        /* =================================================
           QUANTITY - INCREASE
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
                    quantity =
                        Math.floor(quantity);
                    quantity++;
                    quantityInput.value =
                        quantity;
                    updateTotal();
                }
            );
        }
        /* =================================================
           MANUAL QUANTITY CHANGE
        ================================================= */
        quantityInput.addEventListener(
            "input",
            function () {
                updateTotal();
            }
        );
        quantityInput.addEventListener(
            "change",
            function () {
                updateTotal();
            }
        );
        /* =================================================
           MOBILE NUMBER - ONLY NUMBERS
        ================================================= */
        customerPhone.addEventListener(
            "input",
            function () {
                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
            }
        );
        /* =================================================
           PLACE ORDER
           
           IMPORTANT:
           We listen to FORM SUBMIT.
           This is more reliable than only
           listening for button clicks.
        ================================================= */
        orderForm.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log(
                    "🌶️ Place Order clicked"
                );
                /* -----------------------------------------
                   READ VALUES
                ----------------------------------------- */
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
                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */
                if (!name) {
                    showMessage(
                        "❌ Please enter your name.",
                        "error"
                    );
                    customerName.focus();
                    return;
                }
                if (
                    !/^\d{10}$/.test(phone)
                ) {
                    showMessage(
                        "❌ Please enter a valid 10-digit mobile number.",
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
                        "❌ Minimum order is 10 kg.",
                        "error"
                    );
                    quantityInput.value =
                        MINIMUM_ORDER;
                    updateTotal();
                    quantityInput.focus();
                    return;
                }
                quantity =
                    Math.floor(quantity);
                if (!address) {
                    showMessage(
                        "❌ Please enter your delivery address.",
                        "error"
                    );
                    addressInput.focus();
                    return;
                }
                /* -----------------------------------------
                   CALCULATE TOTAL
                ----------------------------------------- */
                const totalAmount =
                    quantity *
                    PRICE_PER_KG;
                /* -----------------------------------------
                   DISABLE BUTTON
                ----------------------------------------- */
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
                        "📦 Saving order..."
                    );
                    const {
                        error: orderError
                    } = await db
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
                    /* -------------------------------------
                       ORDER ERROR
                    ------------------------------------- */
                    if (orderError) {
                        console.error(
                            "❌ Supabase order error:",
                            orderError
                        );
                        showMessage(
                            "❌ Order could not be completed: " +
                            orderError.message,
                            "error"
                        );
                        return;
                    }
                    console.log(
                        "✅ Order saved successfully"
                    );
                    /* =====================================
                       OWNER NOTIFICATION
                    ===================================== */
                    try {
                        console.log(
                            "📲 Sending owner notification..."
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
                        /*
                         IMPORTANT:
                         Notification failure should NOT
                         make the already-saved order fail.
                        */
                    }
                    /* =====================================
                       SUCCESS MESSAGE
                    ===================================== */
                    showMessage(
                        "✅ Order confirmed successfully! " +
                        "Total Amount: ₹" +
                        totalAmount.toLocaleString(
                            "en-IN"
                        ) +
                        ". Thank you for ordering from Mana Masala.",
                        "success"
                    );
                    /* =====================================
                       PREPARE WHATSAPP MESSAGE
                       
                       IMPORTANT:
                       It is NOT opened automatically.
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
                    /*
                     * VERY IMPORTANT
                     *
                     * There is intentionally NO:
                     *
                     * window.open()
                     * location.href =
                     * window.location =
                     *
                     * here.
                     *
                     * Therefore the customer stays
                     * on the website.
                     */
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
                    /* -------------------------------------
                       RE-ENABLE BUTTON
                    ------------------------------------- */
                    placeOrderButton.disabled =
                        false;
                    placeOrderButton.innerHTML =
                        `<span>✓</span>
                         <span>Confirm & Place Order</span>
                         <span>→</span>`;
                }
            }
        );
        /* =================================================
           SHARE WEBSITE ON WHATSAPP
           
           This works ONLY when the user explicitly
           clicks the Share button.
        ================================================= */
        if (shareWhatsApp) {
            shareWhatsApp.addEventListener(
                "click",
                function () {
                    const websiteURL =
                        window.location.href;
                    const shareMessage =
                        "🌶️ Mana Masala - Homemade Chilli Powder\n\n" +
                        "Fresh homemade chilli powder.\n" +
                        "₹350/kg\n" +
                        "Minimum order: 10 kg\n\n" +
                        "Order here:\n" +
                        websiteURL;
                    const shareURL =
                        "https://wa.me/?text=" +
                        encodeURIComponent(
                            shareMessage
                        );
                    /*
                     * WhatsApp opens ONLY because
                     * the customer explicitly clicked
                     * Share on WhatsApp.
                     */
                    window.open(
                        shareURL,
                        "_blank"
                    );
                }
            );
        }
        /* =================================================
           INITIAL TOTAL
        ================================================= */
        updateTotal();
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
   START APPLICATION
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
