/* =========================================================
   🌶️ MANA MASALA
   COMPLETE ORDER SYSTEM
   Supabase + Order Form + WhatsApp + Email Notification
========================================================= */

console.log("🌶️ Mana Masala website starting...");

/* =========================================================
   CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

const PRICE_PER_KG = 350;
const MIN_QUANTITY = 10;

const OWNER_WHATSAPP = "918367450301";

let supabaseClient = null;


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

try {

    if (
        typeof window.supabase !== "undefined" &&
        SUPABASE_URL &&
        SUPABASE_ANON_KEY
    ) {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("✅ Supabase client initialized");

    } else {

        console.error("❌ Supabase configuration missing");

    }

} catch (error) {

    console.error(
        "❌ Supabase initialization failed:",
        error
    );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🌶️ Mana Masala DOM loaded");

    /* -----------------------------------------------------
       ELEMENTS
    ----------------------------------------------------- */

    const orderForm =
        document.getElementById("orderForm");

    const customerName =
        document.getElementById("customerName");

    const phone =
        document.getElementById("phone");

    const address =
        document.getElementById("address");

    const quantityInput =
        document.getElementById("quantity");

    const quantityDisplay =
        document.getElementById("quantityDisplay");

    const minusBtn =
        document.getElementById("minusBtn");

    const plusBtn =
        document.getElementById("plusBtn");

    const totalAmount =
        document.getElementById("totalAmount");

    const orderSubmit =
        document.getElementById("orderSubmit");

    const formMessage =
        document.getElementById("formMessage");


    /* =====================================================
       ELEMENT CHECK
    ===================================================== */

    console.log("🔍 Checking order form elements...");

    console.log({
        orderForm: !!orderForm,
        customerName: !!customerName,
        phone: !!phone,
        address: !!address,
        quantityInput: !!quantityInput,
        quantityDisplay: !!quantityDisplay,
        minusBtn: !!minusBtn,
        plusBtn: !!plusBtn,
        totalAmount: !!totalAmount,
        orderSubmit: !!orderSubmit,
        formMessage: !!formMessage
    });


    if (!orderForm) {

        console.error(
            "❌ orderForm not found"
        );

        return;

    }


    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    function formatCurrency(amount) {

        return "₹" + Number(amount).toLocaleString("en-IN");

    }


    function getQuantity() {

        let quantity =
            parseInt(
                quantityInput?.value ||
                quantityDisplay?.textContent ||
                MIN_QUANTITY,
                10
            );

        if (
            isNaN(quantity) ||
            quantity < MIN_QUANTITY
        ) {

            quantity = MIN_QUANTITY;

        }

        return quantity;

    }


    function updateQuantityDisplay(quantity) {

        if (quantityInput) {

            quantityInput.value = quantity;

        }

        if (quantityDisplay) {

            quantityDisplay.textContent =
                quantity;

        }

    }


    function updateTotal() {

        const quantity =
            getQuantity();

        const total =
            quantity * PRICE_PER_KG;

        if (quantityInput) {

            quantityInput.value =
                quantity;

        }

        if (quantityDisplay) {

            quantityDisplay.textContent =
                quantity;

        }

        if (totalAmount) {

            totalAmount.textContent =
                formatCurrency(total);

        }

        console.log(
            "📦 Quantity:",
            quantity,
            "KG"
        );

        console.log(
            "💰 Total:",
            formatCurrency(total)
        );

        return total;

    }


    function showMessage(
        message,
        type = "success"
    ) {

        if (!formMessage) {

            console.log(
                `[${type}] ${message}`
            );

            return;

        }

        formMessage.textContent =
            message;

        formMessage.className =
            "form-message " + type;

        formMessage.style.display =
            "block";

        /* Scroll message into view */

        formMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    function setButtonLoading(
        loading
    ) {

        if (!orderSubmit) {
            return;
        }

        if (loading) {

            orderSubmit.disabled = true;

            orderSubmit.dataset.originalText =
                orderSubmit.innerHTML;

            orderSubmit.innerHTML =
                "⏳ Placing Order...";

        } else {

            orderSubmit.disabled = false;

            if (
                orderSubmit.dataset.originalText
            ) {

                orderSubmit.innerHTML =
                    orderSubmit.dataset.originalText;

            } else {

                orderSubmit.innerHTML =
                    "🌶️ Place Order";

            }

        }

    }


    /* =====================================================
       INITIAL QUANTITY
    ===================================================== */

    updateQuantityDisplay(
        MIN_QUANTITY
    );

    updateTotal();


    /* =====================================================
       QUANTITY INPUT
    ===================================================== */

    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            () => {

                let quantity =
                    parseInt(
                        quantityInput.value,
                        10
                    );

                if (isNaN(quantity)) {

                    quantity =
                        MIN_QUANTITY;

                }

                if (
                    quantity <
                    MIN_QUANTITY
                ) {

                    quantity =
                        MIN_QUANTITY;

                }

                updateQuantityDisplay(
                    quantity
                );

                updateTotal();

            }
        );

    }


    /* =====================================================
       MINUS BUTTON
    ===================================================== */

    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                let quantity =
                    getQuantity();

                if (
                    quantity >
                    MIN_QUANTITY
                ) {

                    quantity--;

                }

                updateQuantityDisplay(
                    quantity
                );

                updateTotal();

            }
        );

    }


    /* =====================================================
       PLUS BUTTON
    ===================================================== */

    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                let quantity =
                    getQuantity();

                quantity++;

                updateQuantityDisplay(
                    quantity
                );

                updateTotal();

            }
        );

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    orderForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            console.log(
                "📦 Submitting order..."
            );


            /* -------------------------------------------------
               CHECK SUPABASE
            ------------------------------------------------- */

            if (!supabaseClient) {

                console.error(
                    "❌ Supabase client unavailable"
                );

                showMessage(
                    "Order system is temporarily unavailable. Please contact us on WhatsApp.",
                    "error"
                );

                return;

            }


            /* -------------------------------------------------
               GET FORM VALUES
            ------------------------------------------------- */

            const name =
                customerName?.value.trim() || "";

            const customerPhone =
                phone?.value.trim() || "";

            const customerAddress =
                address?.value.trim() || "";

            const quantityValue =
                getQuantity();

            const total =
                quantityValue *
                PRICE_PER_KG;


            console.log(
                "📦 Order data:",
                {
                    customer_name: name,
                    customer_phone: customerPhone,
                    quantity_kg: quantityValue,
                    address: customerAddress,
                    total_amount: total
                }
            );


            /* -------------------------------------------------
               VALIDATE NAME
            ------------------------------------------------- */

            if (!name) {

                showMessage(
                    "Please enter your name.",
                    "error"
                );

                customerName?.focus();

                return;

            }


            if (name.length < 2) {

                showMessage(
                    "Please enter a valid name.",
                    "error"
                );

                customerName?.focus();

                return;

            }


            /* -------------------------------------------------
               VALIDATE PHONE
            ------------------------------------------------- */

            const cleanPhone =
                customerPhone.replace(
                    /\D/g,
                    ""
                );

            if (!cleanPhone) {

                showMessage(
                    "Please enter your phone number.",
                    "error"
                );

                phone?.focus();

                return;

            }


            if (
                cleanPhone.length !== 10
            ) {

                showMessage(
                    "Please enter a valid 10-digit phone number.",
                    "error"
                );

                phone?.focus();

                return;

            }


            /* -------------------------------------------------
               VALIDATE ADDRESS
            ------------------------------------------------- */

            if (!customerAddress) {

                showMessage(
                    "Please enter your delivery address.",
                    "error"
                );

                address?.focus();

                return;

            }


            if (
                customerAddress.length < 5
            ) {

                showMessage(
                    "Please enter a complete delivery address.",
                    "error"
                );

                address?.focus();

                return;

            }


            /* -------------------------------------------------
               VALIDATE QUANTITY
            ------------------------------------------------- */

            if (
                quantityValue <
                MIN_QUANTITY
            ) {

                showMessage(
                    `Minimum order is ${MIN_QUANTITY} KG.`,
                    "error"
                );

                return;

            }


            /* -------------------------------------------------
               ORDER OBJECT
            ------------------------------------------------- */

            const orderData = {

                customer_name:
                    name,

                customer_phone:
                    cleanPhone,

                quantity_kg:
                    quantityValue,

                address:
                    customerAddress,

                total_amount:
                    total,

                status:
                    "New"

            };


            console.log(
                "📦 Final order data:",
                orderData
            );


            /* -------------------------------------------------
               BUTTON LOADING
            ------------------------------------------------- */

            setButtonLoading(true);


            try {

                /* =================================================
                   SAVE ORDER TO SUPABASE

                   IMPORTANT:
                   DO NOT USE .select().single()

                   Customer has INSERT permission,
                   but does NOT have SELECT permission.

                   Therefore:

                   .insert([orderData])

                   is correct.

                   .insert(...).select()

                   would require SELECT permission.
                ================================================= */

                console.log(
                    "📤 Sending order to Supabase..."
                );


                const {
                    error
                } = await supabaseClient
                    .from("orders")
                    .insert([
                        orderData
                    ]);


                /* -------------------------------------------------
                   DATABASE ERROR
                ------------------------------------------------- */

                if (error) {

                    console.error(
                        "========== SUPABASE ORDER ERROR =========="
                    );

                    console.error(
                        "Code:",
                        error.code
                    );

                    console.error(
                        "Message:",
                        error.message
                    );

                    console.error(
                        "Details:",
                        error.details
                    );

                    console.error(
                        "Hint:",
                        error.hint
                    );

                    console.error(
                        "Full error:",
                        error
                    );

                    console.error(
                        "=========================================="
                    );


                    if (
                        error.code ===
                        "42501"
                    ) {

                        showMessage(
                            "Database permission denied. Please contact us on WhatsApp.",
                            "error"
                        );

                    } else {

                        showMessage(
                            "Order could not be submitted. Please try again.",
                            "error"
                        );

                    }

                    setButtonLoading(false);

                    return;

                }


                /* -------------------------------------------------
                   SUCCESS
                ------------------------------------------------- */

                console.log(
                    "✅ Order inserted successfully"
                );


                /* =================================================
                   EMAIL NOTIFICATION

                   This calls the Supabase Edge Function.

                   IMPORTANT:
                   Email failure will NOT cancel the order.

                   The order is already saved successfully.
                ================================================= */

                try {

                    console.log(
                        "📧 Sending owner notification..."
                    );


                    const {
                        data:
                            notificationData,
                        error:
                            notificationError
                    } =
                        await supabaseClient.functions.invoke(
                            "new-order-notification",
                            {
                                body: {
                                    order:
                                        orderData
                                }
                            }
                        );


                    if (
                        notificationError
                    ) {

                        console.error(
                            "⚠️ Email notification failed:",
                            notificationError
                        );

                    } else {

                        console.log(
                            "✅ Email notification response:",
                            notificationData
                        );

                    }

                } catch (
                    notificationException
                ) {

                    console.error(
                        "⚠️ Email notification exception:",
                        notificationException
                    );

                }


                /* =================================================
                   WHATSAPP MESSAGE
                ================================================= */

                const whatsappMessage =
                    `🌶️ *NEW MANA MASALA ORDER*

👤 *Customer:* ${name}

📞 *Phone:* ${cleanPhone}

📦 *Quantity:* ${quantityValue} KG

💰 *Total Amount:* ${formatCurrency(total)}

📍 *Address:*
${customerAddress}

🌶️ *Product:* Homemade Chilli Powder

💵 *Price:* ₹${PRICE_PER_KG}/KG

📦 *Minimum Order:* ${MIN_QUANTITY} KG`;


                const whatsappURL =
                    "https://wa.me/" +
                    OWNER_WHATSAPP +
                    "?text=" +
                    encodeURIComponent(
                        whatsappMessage
                    );


                /* =================================================
                   SUCCESS MESSAGE
                ================================================= */

                showMessage(
                    `✅ Order placed successfully! ${quantityValue} KG of Mana Masala has been ordered.`,
                    "success"
                );


                /* =================================================
                   RESET FORM
                ================================================= */

                orderForm.reset();


                updateQuantityDisplay(
                    MIN_QUANTITY
                );

                updateTotal();


                /* =================================================
                   OPEN WHATSAPP
                ================================================= */

                setTimeout(
                    () => {

                        window.open(
                            whatsappURL,
                            "_blank"
                        );

                    },
                    700
                );


                console.log(
                    "🌶️ Order process completed successfully"
                );


            } catch (error) {

                console.error(
                    "❌ Unexpected order error:",
                    error
                );


                showMessage(
                    "Something went wrong while placing the order. Please try again or contact us on WhatsApp.",
                    "error"
                );

            } finally {

                setButtonLoading(false);

            }

        }
    );


    /* =====================================================
       PHONE NUMBER CLEANUP
    ===================================================== */

    if (phone) {

        phone.addEventListener(
            "input",
            () => {

                let value =
                    phone.value.replace(
                        /\D/g,
                        ""
                    );

                if (
                    value.length >
                    10
                ) {

                    value =
                        value.substring(
                            0,
                            10
                        );

                }

                phone.value =
                    value;

            }
        );

    }


    /* =====================================================
       PREVENT INVALID QUANTITY
    ===================================================== */

    if (quantityInput) {

        quantityInput.addEventListener(
            "blur",
            () => {

                let quantity =
                    parseInt(
                        quantityInput.value,
                        10
                    );

                if (
                    isNaN(quantity) ||
                    quantity <
                    MIN_QUANTITY
                ) {

                    quantity =
                        MIN_QUANTITY;

                }

                updateQuantityDisplay(
                    quantity
                );

                updateTotal();

            }
        );

    }


    /* =====================================================
       READY
    ===================================================== */

    console.log(
        "✅ Mana Masala system ready"
    );

    console.log(
        `💰 Price: ₹${PRICE_PER_KG}/KG`
    );

    console.log(
        `📦 Minimum order: ${MIN_QUANTITY} KG`
    );

});
