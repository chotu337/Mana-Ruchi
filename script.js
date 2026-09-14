/* =========================================================
   🌶️ MANA MASALA - COMPLETE ORDER SYSTEM
   Supabase + Order Saving + Owner Notification
   Version: 104
========================================================= */

console.log("🌶️ Mana Masala script.js loaded - v104");

/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

/* =========================================================
   BUSINESS SETTINGS
========================================================= */

const PRICE_PER_KG = 350;
const MIN_QUANTITY = 10;
const OWNER_WHATSAPP = "918367450301";

/* =========================================================
   MAIN
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("✅ DOM ready");

    /* -----------------------------------------------------
       CHECK SUPABASE
    ----------------------------------------------------- */

    if (!window.supabase) {
        console.error("❌ Supabase library not loaded");
        return;
    }

    let db;

    try {

        db = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.log("✅ Supabase client created");

    } catch (error) {

        console.error(
            "❌ Supabase initialization failed:",
            error
        );

        return;
    }

    /* =====================================================
       GET HTML ELEMENTS
    ===================================================== */

    const orderForm =
        document.getElementById("orderForm");

    const customerNameInput =
        document.getElementById("customerName");

    const phoneInput =
        document.getElementById("customerPhone") ||
        document.getElementById("phone");

    const addressInput =
        document.getElementById("address");

    const quantityInput =
        document.getElementById("quantity");

    const minusBtn =
        document.getElementById("minusBtn");

    const plusBtn =
        document.getElementById("plusBtn");

    const totalAmount =
        document.getElementById("totalAmount");

    const orderSubmit =
        document.getElementById("orderSubmit");

    const paymentConfirmed =
        document.getElementById("paymentConfirmed");

    /* =====================================================
       CHECK REQUIRED ELEMENTS
    ===================================================== */

    if (!orderForm) {
        console.error("❌ orderForm not found");
        return;
    }

    if (!customerNameInput) {
        console.error("❌ customerName not found");
    }

    if (!phoneInput) {
        console.error("❌ phone input not found");
    }

    if (!addressInput) {
        console.error("❌ address input not found");
    }

    if (!quantityInput) {
        console.error("❌ quantity input not found");
    }

    console.log("✅ Order form elements detected");

    /* =====================================================
       QUANTITY
    ===================================================== */

    function getQuantity() {

        let value =
            parseInt(quantityInput?.value, 10);

        if (
            Number.isNaN(value) ||
            value < MIN_QUANTITY
        ) {
            value = MIN_QUANTITY;
        }

        return value;
    }

    /* =====================================================
       UPDATE TOTAL
    ===================================================== */

    function updateTotal() {

        if (!quantityInput || !totalAmount) {
            return;
        }

        const quantity = getQuantity();

        quantityInput.value = quantity;

        const total =
            quantity * PRICE_PER_KG;

        totalAmount.textContent =
            `₹${total.toLocaleString("en-IN")}`;

        console.log(
            `💰 ${quantity} KG = ₹${total}`
        );
    }

    /* =====================================================
       PLUS BUTTON
    ===================================================== */

    if (plusBtn) {

        plusBtn.addEventListener("click", (event) => {

            event.preventDefault();

            const currentQuantity =
                getQuantity();

            quantityInput.value =
                currentQuantity + 1;

            updateTotal();
        });
    }

    /* =====================================================
       MINUS BUTTON
    ===================================================== */

    if (minusBtn) {

        minusBtn.addEventListener("click", (event) => {

            event.preventDefault();

            const currentQuantity =
                getQuantity();

            if (currentQuantity > MIN_QUANTITY) {

                quantityInput.value =
                    currentQuantity - 1;

                updateTotal();

            } else {

                quantityInput.value =
                    MIN_QUANTITY;

                updateTotal();
            }
        });
    }

    /* =====================================================
       MANUAL QUANTITY CHANGE
    ===================================================== */

    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            updateTotal
        );

        quantityInput.addEventListener(
            "change",
            updateTotal
        );
    }

    /* =====================================================
       INITIAL TOTAL
    ===================================================== */

    updateTotal();

    /* =====================================================
       ORDER REFERENCE
    ===================================================== */

    function createOrderReference() {

        const now = new Date();

        const date =
            now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0");

        const random =
            Math.floor(
                1000 + Math.random() * 9000
            );

        return `MM-${date}-${random}`;
    }

    /* =====================================================
       CLEAN PHONE NUMBER
    ===================================================== */

    function cleanPhoneNumber(value) {

        return String(value || "")
            .replace(/\D/g, "")
            .slice(-10);
    }

    /* =====================================================
       SUCCESS MODAL
    ===================================================== */

    function showSuccessModal(
        orderReference,
        quantity,
        total
    ) {

        const successModal =
            document.getElementById("successModal");

        const orderId =
            document.getElementById("orderId");

        const successQuantity =
            document.getElementById("successQuantity");

        const successTotal =
            document.getElementById("successTotal");

        if (orderId) {
            orderId.textContent =
                orderReference;
        }

        if (successQuantity) {
            successQuantity.textContent =
                `${quantity} KG`;
        }

        if (successTotal) {
            successTotal.textContent =
                `₹${total.toLocaleString("en-IN")}`;
        }

        if (successModal) {

            successModal.classList.add("active");

            successModal.style.display = "flex";

            document.body.classList.add(
                "modal-open"
            );

            console.log(
                "✅ Success modal opened"
            );
        } else {

            console.warn(
                "⚠️ successModal not found"
            );

            alert(
                `Order placed successfully!\n\nOrder ID: ${orderReference}\nQuantity: ${quantity} KG\nTotal: ₹${total.toLocaleString("en-IN")}`
            );
        }
    }

    /* =====================================================
       CLOSE SUCCESS MODAL
    ===================================================== */

    function closeSuccessModal() {

        const successModal =
            document.getElementById("successModal");

        if (successModal) {

            successModal.classList.remove(
                "active"
            );

            successModal.style.display = "none";
        }

        document.body.classList.remove(
            "modal-open"
        );
    }

    const successCloseBtn =
        document.getElementById("successCloseBtn");

    const modalClose =
        document.getElementById("modalClose");

    const continueBtn =
        document.getElementById("continueBtn");

    if (successCloseBtn) {

        successCloseBtn.addEventListener(
            "click",
            closeSuccessModal
        );
    }

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeSuccessModal
        );
    }

    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            closeSuccessModal
        );
    }

    /* =====================================================
       WHATSAPP BUTTON
    ===================================================== */

    const whatsappOrderButton =
        document.getElementById(
            "whatsappOrderButton"
        );

    if (whatsappOrderButton) {

        whatsappOrderButton.addEventListener(
            "click",
            () => {

                const orderIdElement =
                    document.getElementById(
                        "orderId"
                    );

                const quantityElement =
                    document.getElementById(
                        "successQuantity"
                    );

                const totalElement =
                    document.getElementById(
                        "successTotal"
                    );

                const orderId =
                    orderIdElement
                        ? orderIdElement.textContent
                        : "";

                const quantity =
                    quantityElement
                        ? quantityElement.textContent
                        : "";

                const total =
                    totalElement
                        ? totalElement.textContent
                        : "";

                const message =
                    `Hello Mana Masala 🌶️%0A%0A` +
                    `I have placed an order.%0A` +
                    `Order ID: ${encodeURIComponent(orderId)}%0A` +
                    `Quantity: ${encodeURIComponent(quantity)}%0A` +
                    `Total: ${encodeURIComponent(total)}`;

                const whatsappURL =
                    `https://wa.me/${OWNER_WHATSAPP}?text=${message}`;

                window.open(
                    whatsappURL,
                    "_blank"
                );
            }
        );
    }

    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    orderForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            console.log(
                "📦 Order submission started"
            );

            /* -------------------------------------------------
               PREVENT DOUBLE SUBMISSION
            ------------------------------------------------- */

            if (
                orderSubmit &&
                orderSubmit.disabled
            ) {

                console.log(
                    "⚠️ Submission already running"
                );

                return;
            }

            /* -------------------------------------------------
               READ VALUES
            ------------------------------------------------- */

            const customerName =
                customerNameInput
                    ? customerNameInput.value.trim()
                    : "";

            const rawPhone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";

            const customerPhone =
                cleanPhoneNumber(rawPhone);

            const customerAddress =
                addressInput
                    ? addressInput.value.trim()
                    : "";

            const quantity =
                getQuantity();

            const total =
                quantity * PRICE_PER_KG;

            /* -------------------------------------------------
               VALIDATION
            ------------------------------------------------- */

            if (!customerName) {

                alert(
                    "Please enter your name."
                );

                customerNameInput?.focus();

                return;
            }

            if (
                !customerPhone ||
                customerPhone.length !== 10
            ) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                phoneInput?.focus();

                return;
            }

            if (!customerAddress) {

                alert(
                    "Please enter your delivery address."
                );

                addressInput?.focus();

                return;
            }

            if (quantity < MIN_QUANTITY) {

                alert(
                    `Minimum order quantity is ${MIN_QUANTITY} KG.`
                );

                quantityInput.value =
                    MIN_QUANTITY;

                updateTotal();

                return;
            }

            /* -------------------------------------------------
               OPTIONAL PAYMENT CONFIRMATION
               Only checks this if the checkbox exists.
            ------------------------------------------------- */

            if (
                paymentConfirmed &&
                !paymentConfirmed.checked
            ) {

                alert(
                    "Please confirm your payment before placing the order."
                );

                paymentConfirmed.focus();

                return;
            }

            /* -------------------------------------------------
               CREATE ORDER REFERENCE
            ------------------------------------------------- */

            const orderReference =
                createOrderReference();

            /* -------------------------------------------------
               CREATE ORDER OBJECT
            ------------------------------------------------- */

            const order = {

                customer_name:
                    customerName,

                customer_phone:
                    customerPhone,

                quantity_kg:
                    quantity,

                address:
                    customerAddress,

                total_amount:
                    total,

                status:
                    "New"
            };

            console.log(
                "📦 Order object:",
                order
            );

            /* -------------------------------------------------
               DISABLE BUTTON
            ------------------------------------------------- */

            if (orderSubmit) {

                orderSubmit.disabled = true;

                orderSubmit.dataset.originalText =
                    orderSubmit.textContent;

                orderSubmit.textContent =
                    "Placing Order...";
            }

            try {

                /* =================================================
                   IMPORTANT:
                   DO NOT USE .select().single()

                   Customer only needs INSERT permission.
                   Using .select() can require SELECT permission
                   and cause the order to appear failed even when
                   the database insert itself is allowed.
                ================================================= */

                console.log(
                    "📤 Saving order to Supabase..."
                );

                const {
                    error
                } = await db
                    .from("orders")
                    .insert(order);

                if (error) {

                    console.error(
                        "❌ Supabase order error:",
                        error
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

                    throw error;
                }

                console.log(
                    "✅ Order saved successfully"
                );

                /* =================================================
                   OWNER NOTIFICATION
                ================================================= */

                const notificationOrder = {

                    ...order,

                    order_reference:
                        orderReference
                };

                console.log(
                    "📧 Sending owner notification..."
                );

                try {

                    const {
                        data:
                            notificationData,
                        error:
                            notificationError
                    } =
                        await db.functions.invoke(
                            "new-order-notification",
                            {
                                body: {
                                    order:
                                        notificationOrder
                                }
                            }
                        );

                    if (notificationError) {

                        console.warn(
                            "⚠️ Notification failed, but order was saved:",
                            notificationError
                        );

                    } else {

                        console.log(
                            "✅ Owner notification processed:",
                            notificationData
                        );
                    }

                } catch (
                    notificationError
                ) {

                    console.warn(
                        "⚠️ Notification error, but order was saved:",
                        notificationError
                    );
                }

                /* =================================================
                   RESET FORM
                ================================================= */

                orderForm.reset();

                if (quantityInput) {

                    quantityInput.value =
                        MIN_QUANTITY;
                }

                updateTotal();

                /* =================================================
                   SHOW SUCCESS
                ================================================= */

                showSuccessModal(
                    orderReference,
                    quantity,
                    total
                );

                console.log(
                    "🎉 Order completed successfully:",
                    orderReference
                );

            } catch (error) {

                console.error(
                    "❌ ORDER FAILED",
                    error
                );

                console.error(
                    "Error code:",
                    error?.code
                );

                console.error(
                    "Error message:",
                    error?.message
                );

                console.error(
                    "Error details:",
                    error?.details
                );

                console.error(
                    "Error hint:",
                    error?.hint
                );

                alert(
                    "Order could not be completed. Please try again later."
                );

            } finally {

                /* -------------------------------------------------
                   RE-ENABLE BUTTON
                ------------------------------------------------- */

                if (orderSubmit) {

                    orderSubmit.disabled =
                        false;

                    orderSubmit.textContent =
                        orderSubmit.dataset.originalText ||
                        "Place Order";
                }
            }
        }
    );

    /* =====================================================
       SMOOTH SCROLL FOR ORDER BUTTONS
    ===================================================== */

    const orderButtons =
        document.querySelectorAll(
            'a[href="#order"], [data-order-link]'
        );

    orderButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    const target =
                        document.getElementById(
                            "order"
                        );

                    if (target) {

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                }
            );
        }
    );

    /* =====================================================
       FINAL STATUS
    ===================================================== */

    console.log(
        "✅ Mana Masala order system ready"
    );

    console.log(
        `🌶️ Price: ₹${PRICE_PER_KG}/KG`
    );

    console.log(
        `📦 Minimum order: ${MIN_QUANTITY} KG`
    );

});
