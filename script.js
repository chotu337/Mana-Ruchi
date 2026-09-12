/* =========================================================
   🌶️ MANA MASALA - COMPLETE ORDER SYSTEM
   Works with the current index.html

   Price: ₹350/kg
   Minimum Order: 10 kg
   Automatic WhatsApp redirect: DISABLED
========================================================= */

console.log("🌶️ Mana Masala script.js started");

/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

const EDGE_FUNCTION_NAME =
    "new-order-notification";

const PRICE_PER_KG = 350;
const MINIMUM_ORDER = 10;

/* =========================================================
   START
========================================================= */

function startOrderSystem() {

    /* -----------------------------------------------------
       CHECK SUPABASE
    ----------------------------------------------------- */

    if (!window.supabase) {
        console.error("❌ Supabase library not loaded.");
        return;
    }

    const db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("✅ Supabase client initialized");

    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const form =
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

    /* =====================================================
       CHECK REQUIRED ELEMENTS
    ===================================================== */

    console.log("🔎 Checking order elements...");

    if (!form) {
        console.error("❌ orderForm not found");
        return;
    }

    if (!placeOrderButton) {
        console.error("❌ placeOrderButton not found");
        return;
    }

    if (!customerName) {
        console.error("❌ customerName not found");
        return;
    }

    if (!customerPhone) {
        console.error("❌ customerPhone not found");
        return;
    }

    if (!quantityInput) {
        console.error("❌ quantity not found");
        return;
    }

    if (!addressInput) {
        console.error("❌ address not found");
        return;
    }

    console.log("✅ All order elements found");

    /* =====================================================
       MESSAGE FUNCTION
    ===================================================== */

    function showMessage(message, type) {

        if (!orderMessage) {
            alert(message);
            return;
        }

        orderMessage.textContent = message;

        orderMessage.className =
            "order-message " + type;

        orderMessage.style.display = "block";
    }

    /* =====================================================
       UPDATE TOTAL
    ===================================================== */

    function updateTotal() {

        let quantity =
            parseInt(quantityInput.value, 10);

        if (
            Number.isNaN(quantity) ||
            quantity < MINIMUM_ORDER
        ) {
            quantity = MINIMUM_ORDER;
            quantityInput.value = MINIMUM_ORDER;
        }

        const total =
            quantity * PRICE_PER_KG;

        if (summaryQuantity) {
            summaryQuantity.textContent =
                quantity;
        }

        if (totalPrice) {
            totalPrice.textContent =
                total.toLocaleString("en-IN");
        }

        if (paymentAmount) {
            paymentAmount.textContent =
                total.toLocaleString("en-IN");
        }

        console.log(
            "Quantity:",
            quantity,
            "Total:",
            total
        );
    }

    /* =====================================================
       QUANTITY - DECREASE
    ===================================================== */

    if (decreaseQuantity) {

        decreaseQuantity.addEventListener(
            "click",
            function () {

                let quantity =
                    parseInt(
                        quantityInput.value,
                        10
                    );

                if (Number.isNaN(quantity)) {
                    quantity = MINIMUM_ORDER;
                }

                if (
                    quantity > MINIMUM_ORDER
                ) {
                    quantity--;
                }

                quantityInput.value =
                    quantity;

                updateTotal();
            }
        );
    }

    /* =====================================================
       QUANTITY - INCREASE
    ===================================================== */

    if (increaseQuantity) {

        increaseQuantity.addEventListener(
            "click",
            function () {

                let quantity =
                    parseInt(
                        quantityInput.value,
                        10
                    );

                if (Number.isNaN(quantity)) {
                    quantity = MINIMUM_ORDER;
                }

                quantity++;

                quantityInput.value =
                    quantity;

                updateTotal();
            }
        );
    }

    /* =====================================================
       MANUAL QUANTITY CHANGE
    ===================================================== */

    quantityInput.addEventListener(
        "input",
        function () {
            updateTotal();
        }
    );

    /* =====================================================
       FORM SUBMISSION
       This catches BOTH:
       - button click
       - Enter key
    ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "🛒 Order form submitted"
            );

            await placeOrder();
        }
    );

    /* =====================================================
       BUTTON CLICK
    ===================================================== */

    placeOrderButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();

            console.log(
                "🛒 Place Order button clicked"
            );

            await placeOrder();
        }
    );

    /* =====================================================
       PLACE ORDER FUNCTION
    ===================================================== */

    async function placeOrder() {

        /* -------------------------------------------------
           PREVENT DOUBLE CLICK
        ------------------------------------------------- */

        if (placeOrderButton.disabled) {
            return;
        }

        /* -------------------------------------------------
           GET VALUES
        ------------------------------------------------- */

        const name =
            customerName.value.trim();

        const phone =
            customerPhone.value.trim();

        const address =
            addressInput.value.trim();

        let quantity =
            parseInt(
                quantityInput.value,
                10
            );

        /* -------------------------------------------------
           VALIDATE NAME
        ------------------------------------------------- */

        if (!name) {

            showMessage(
                "❌ Please enter your name.",
                "error"
            );

            customerName.focus();

            return;
        }

        /* -------------------------------------------------
           VALIDATE PHONE
        ------------------------------------------------- */

        const cleanPhone =
            phone.replace(/\D/g, "");

        if (
            cleanPhone.length !== 10
        ) {

            showMessage(
                "❌ Please enter a valid 10-digit mobile number.",
                "error"
            );

            customerPhone.focus();

            return;
        }

        /* -------------------------------------------------
           VALIDATE QUANTITY
        ------------------------------------------------- */

        if (
            Number.isNaN(quantity) ||
            quantity < MINIMUM_ORDER
        ) {

            showMessage(
                "❌ Minimum order quantity is 10 KG.",
                "error"
            );

            quantityInput.value =
                MINIMUM_ORDER;

            updateTotal();

            quantityInput.focus();

            return;
        }

        /* -------------------------------------------------
           VALIDATE ADDRESS
        ------------------------------------------------- */

        if (!address) {

            showMessage(
                "❌ Please enter your delivery address.",
                "error"
            );

            addressInput.focus();

            return;
        }

        /* -------------------------------------------------
           CALCULATE TOTAL
        ------------------------------------------------- */

        const totalAmount =
            quantity * PRICE_PER_KG;

        console.log(
            "📦 Order details:",
            {
                name,
                phone,
                quantity,
                address,
                totalAmount
            }
        );

        /* -------------------------------------------------
           BUTTON LOADING
        ------------------------------------------------- */

        placeOrderButton.disabled = true;

        placeOrderButton.innerHTML =
            `
            <span>⏳</span>
            <span>Placing Your Order...</span>
            `;

        showMessage(
            "⏳ Saving your order...",
            "success"
        );

        /* =================================================
           SAVE ORDER TO SUPABASE
        ================================================= */

        try {

            console.log(
                "📡 Sending order to Supabase..."
            );

            const {
                data,
                error
            } = await db
                .from("orders")
                .insert([
                    {
                        customer_name: name,
                        customer_phone: cleanPhone,
                        quantity_kg: quantity,
                        address: address,
                        total_amount: totalAmount,
                        status: "New"
                    }
                ])
                .select();

            /* -------------------------------------------------
               DATABASE ERROR
            ------------------------------------------------- */

            if (error) {

                console.error(
                    "❌ Supabase order error:",
                    error
                );

                showMessage(
                    "❌ Order could not be completed. " +
                    error.message,
                    "error"
                );

                return;
            }

            console.log(
                "✅ Order saved successfully:",
                data
            );

            /* =================================================
               OWNER NOTIFICATION
            ================================================= */

            try {

                console.log(
                    "📨 Sending owner notification..."
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
                                        cleanPhone,

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

            } catch (notificationError) {

                /*
                 Notification failure should NOT
                 cancel an already saved order.
                */

                console.warn(
                    "⚠️ Notification failed:",
                    notificationError
                );
            }

            /* =================================================
               SUCCESS
            ================================================= */

            showMessage(
                "✅ Order confirmed successfully! " +
                "Total Amount: ₹" +
                totalAmount.toLocaleString("en-IN"),
                "success"
            );

            console.log(
                "🎉 ORDER COMPLETED SUCCESSFULLY"
            );

            /* =================================================
               PREPARE WHATSAPP MESSAGE
               BUT DO NOT OPEN WHATSAPP
            ================================================= */

            const whatsappMessage =
`
🌶️ MANA MASALA ORDER

Customer Name: ${name}
Mobile: ${cleanPhone}
Quantity: ${quantity} KG
Price: ₹${PRICE_PER_KG}/KG
Total: ₹${totalAmount.toLocaleString("en-IN")}

Delivery Address:
${address}

Status: New
`;

            console.log(
                "💬 WhatsApp message prepared.",
                whatsappMessage
            );

            /*
               IMPORTANT:
               We intentionally DO NOT use:

               window.open(...)
               window.location.href = ...
               location.href = ...

               Customer stays on the website.
            */

            /* =================================================
               RESET FORM AFTER SUCCESS
            ================================================= */

            setTimeout(
                function () {

                    form.reset();

                    quantityInput.value =
                        MINIMUM_ORDER;

                    updateTotal();

                },
                1500
            );

        } catch (error) {

            console.error(
                "❌ ORDER SYSTEM ERROR:",
                error
            );

            showMessage(
                "❌ Order failed. Please try again later.",
                "error"
            );

        } finally {

            /* -------------------------------------------------
               RESTORE BUTTON
            ------------------------------------------------- */

            placeOrderButton.disabled = false;

            placeOrderButton.innerHTML =
                `
                <span>✓</span>
                <span>
                    I Have Made the Payment – Confirm & Place Order
                </span>
                <span>→</span>
                `;
        }
    }

    /* =====================================================
       INITIAL TOTAL
    ===================================================== */

    updateTotal();

    console.log(
        "🌶️ Mana Masala Order System Ready"
    );

    console.log(
        "💬 Automatic WhatsApp redirect: DISABLED"
    );
}

/* =========================================================
   START AFTER DOM LOAD
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startOrderSystem
    );

} else {

    startOrderSystem();
}
