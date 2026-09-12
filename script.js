/* =========================================================
   MANA MASALA - COMPLETE ORDER SYSTEM
   Price: ₹350/kg
   Minimum Order: 10 kg
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
const OWNER_WHATSAPP = "918367450301";

/* =========================================================
   LOAD SUPABASE
========================================================= */

function loadSupabase() {
    return new Promise((resolve, reject) => {

        if (window.supabase) {
            resolve();
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => resolve();

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

        console.log(
            "✅ Supabase library loaded"
        );

        const db =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
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
           CHECK ELEMENTS
        ================================================= */

        console.log(
            "Name:",
            customerName
        );

        console.log(
            "Phone:",
            customerPhone
        );

        console.log(
            "Quantity:",
            quantityInput
        );

        console.log(
            "Address:",
            addressInput
        );

        console.log(
            "Order button:",
            placeOrderButton
        );

        if (!placeOrderButton) {

            console.error(
                "❌ Place Order button not found."
            );

            return;
        }

        /* =================================================
           MESSAGE
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

            /* Quantity */

            if (summaryQuantity) {

                summaryQuantity.textContent =
                    quantity;
            }

            /* Total */

            if (totalPrice) {

                totalPrice.textContent =
                    total.toLocaleString(
                        "en-IN"
                    );
            }

            /* Payment */

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
           DECREASE
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
           INCREASE
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

                /* -----------------------------------------
                   GET VALUES
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
                    !Number.isFinite(quantity) ||
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

                /* -----------------------------------------
                   TOTAL
                ----------------------------------------- */

                const totalAmount =
                    quantity *
                    PRICE_PER_KG;

                console.log(
                    "Order total:",
                    totalAmount
                );

                /* -----------------------------------------
                   BUTTON
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
                       INSERT INTO SUPABASE
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
        "Sending owner notification..."
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
    if (notification.error) {
        console.warn(
            "Notification warning:",
            notification.error
        );
    } else {
        console.log(
            "✅ Owner notification sent"
        );
    }
} catch (notificationError) {
    console.warn(
        "Notification failed:",
        notificationError
    );
    /*
       The order has already been saved.
       Therefore notification failure does NOT
       make the order fail.
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
                        ),
                        "success"
                    );

                    /* =====================================
                       WHATSAPP MESSAGE
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

                    const whatsappURL =
                        "https://wa.me/918367450301" +
                        OWNER_WHATSAPP +
                        "?text=" +
                        encodeURIComponent(
                            whatsappMessage
                        );

                    /* =====================================
                       OPEN WHATSAPP
                    ===================================== */

                    setTimeout(
                        function () {

                            window.open(
                                whatsappURL,
                                "_blank"
                            );

                        },
                        700
                    );

                    /* =====================================
                       RESET
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
