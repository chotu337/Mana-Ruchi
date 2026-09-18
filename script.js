/* =========================================================
   🌶️ MANA MASALA
   COMPLETE ORDER SYSTEM
   Supabase + Order Saving + Notification
   Diagnostic Version

   IMPORTANT:
   - Customer INSERT does NOT use .select()
   - Exact Supabase errors are shown
   - Existing email notification is preserved
========================================================= */

console.log("🌶️ Mana Masala script.js loaded");

/* =========================================================
   CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

const PRICE_PER_KG = 350;
const MINIMUM_ORDER = 10;
const WHATSAPP_NUMBER = "918367450301";

/* =========================================================
   GLOBAL
========================================================= */

let supabaseClient = null;

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log("✅ DOM ready");

        initializeSupabase();
        initializeQuantity();
        initializeOrderForm();
        initializeModal();
        initializeNavigation();
        initializeFooter();
        initializeVideo();

        updateOrderTotal();

        console.log(
            "🌶️ Mana Masala system ready"
        );
    }
);

/* =========================================================
   SUPABASE
========================================================= */

function initializeSupabase() {

    try {

        if (
            !window.supabase ||
            typeof window.supabase.createClient !== "function"
        ) {

            console.error(
                "❌ Supabase library not available"
            );

            return;
        }

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        console.log(
            "✅ Supabase client created"
        );

    } catch (error) {

        console.error(
            "❌ Supabase initialization failed:",
            error
        );
    }
}

/* =========================================================
   QUANTITY
========================================================= */

function initializeQuantity() {

    const quantity =
        document.getElementById(
            "quantity"
        );

    const minusBtn =
        document.getElementById(
            "minusBtn"
        );

    const plusBtn =
        document.getElementById(
            "plusBtn"
        );

    if (!quantity) {

        console.error(
            "❌ Quantity element not found"
        );

        return;
    }

    /* MINUS */

    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            () => {

                let current =
                    parseInt(
                        quantity.value,
                        10
                    ) ||
                    MINIMUM_ORDER;

                current--;

                if (
                    current <
                    MINIMUM_ORDER
                ) {

                    current =
                        MINIMUM_ORDER;
                }

                quantity.value =
                    current;

                updateOrderTotal();
            }
        );
    }

    /* PLUS */

    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            () => {

                let current =
                    parseInt(
                        quantity.value,
                        10
                    ) ||
                    MINIMUM_ORDER;

                current++;

                quantity.value =
                    current;

                updateOrderTotal();
            }
        );
    }

    /* INPUT */

    quantity.addEventListener(
        "input",
        () => {

            let current =
                parseInt(
                    quantity.value,
                    10
                );

            if (
                Number.isNaN(current) ||
                current < MINIMUM_ORDER
            ) {

                if (
                    quantity.value !== ""
                ) {

                    quantity.value =
                        MINIMUM_ORDER;
                }
            }

            updateOrderTotal();
        }
    );

    /* BLUR */

    quantity.addEventListener(
        "blur",
        () => {

            let current =
                parseInt(
                    quantity.value,
                    10
                );

            if (
                Number.isNaN(current) ||
                current < MINIMUM_ORDER
            ) {

                quantity.value =
                    MINIMUM_ORDER;
            }

            updateOrderTotal();
        }
    );
}

/* =========================================================
   TOTAL
========================================================= */

function updateOrderTotal() {

    const quantity =
        document.getElementById(
            "quantity"
        );

    const totalAmount =
        document.getElementById(
            "totalAmount"
        );

    const summaryQuantity =
        document.getElementById(
            "summaryQuantity"
        );

    if (!quantity) {
        return;
    }

    let quantityValue =
        parseInt(
            quantity.value,
            10
        );

    if (
        Number.isNaN(quantityValue) ||
        quantityValue < MINIMUM_ORDER
    ) {

        quantityValue =
            MINIMUM_ORDER;

        quantity.value =
            quantityValue;
    }

    const total =
        quantityValue *
        PRICE_PER_KG;

    if (summaryQuantity) {

        summaryQuantity.textContent =
            `${quantityValue} KG`;
    }

    if (totalAmount) {

        totalAmount.textContent =
            formatCurrency(total);
    }
}

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {

    return (
        "₹" +
        Number(amount).toLocaleString(
            "en-IN"
        )
    );
}

/* =========================================================
   ORDER FORM
========================================================= */

function initializeOrderForm() {

    const orderForm =
        document.getElementById(
            "orderForm"
        );

    if (!orderForm) {

        console.error(
            "❌ orderForm not found"
        );

        return;
    }

    orderForm.addEventListener(
        "submit",
        handleOrderSubmit
    );

    console.log(
        "✅ Order submit handler attached"
    );
}

/* =========================================================
   SUBMIT ORDER
========================================================= */

async function handleOrderSubmit(event) {

    event.preventDefault();

    console.log(
        "🛒 ORDER SUBMISSION STARTED"
    );

    const customerName =
        document
            .getElementById(
                "customerName"
            )
            ?.value
            .trim();

    const customerPhone =
        document
            .getElementById(
                "phone"
            )
            ?.value
            .trim();

    const address =
        document
            .getElementById(
                "address"
            )
            ?.value
            .trim();

    const quantityElement =
        document.getElementById(
            "quantity"
        );

    const orderButton =
        document.getElementById(
            "orderSubmit"
        );

    const orderForm =
        document.getElementById(
            "orderForm"
        );

    let quantity =
        parseInt(
            quantityElement?.value,
            10
        );

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!customerName) {

        showOrderMessage(
            "Please enter your full name.",
            "error"
        );

        document
            .getElementById(
                "customerName"
            )
            ?.focus();

        return;
    }

    if (!customerPhone) {

        showOrderMessage(
            "Please enter your phone number.",
            "error"
        );

        document
            .getElementById(
                "phone"
            )
            ?.focus();

        return;
    }

    const cleanPhone =
        customerPhone.replace(
            /\D/g,
            ""
        );

    if (
        cleanPhone.length < 10
    ) {

        showOrderMessage(
            "Please enter a valid phone number.",
            "error"
        );

        document
            .getElementById(
                "phone"
            )
            ?.focus();

        return;
    }

    if (!address) {

        showOrderMessage(
            "Please enter your delivery address.",
            "error"
        );

        document
            .getElementById(
                "address"
            )
            ?.focus();

        return;
    }

    if (
        Number.isNaN(quantity) ||
        quantity < MINIMUM_ORDER
    ) {

        quantity =
            MINIMUM_ORDER;

        if (quantityElement) {

            quantityElement.value =
                MINIMUM_ORDER;
        }

        updateOrderTotal();

        showOrderMessage(
            `Minimum order is ${MINIMUM_ORDER} KG.`,
            "error"
        );

        return;
    }

    /* =====================================================
       SUPABASE CHECK
    ===================================================== */

    if (!supabaseClient) {

        showOrderMessage(
            "Supabase connection is not available. Please refresh the page.",
            "error"
        );

        console.error(
            "❌ SUPABASE CLIENT IS NULL"
        );

        return;
    }

    const totalAmount =
        quantity *
        PRICE_PER_KG;

    /* =====================================================
       DEBUG INFORMATION
    ===================================================== */

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
        "🌶️ MANA MASALA ORDER DEBUG"
    );

    console.log(
        "Supabase URL:",
        SUPABASE_URL
    );

    console.log(
        "Supabase client:",
        supabaseClient
            ? "READY"
            : "NOT READY"
    );

    console.log(
        "Customer:",
        customerName
    );

    console.log(
        "Phone:",
        customerPhone
    );

    console.log(
        "Quantity:",
        quantity
    );

    console.log(
        "Total:",
        totalAmount
    );

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    /* =====================================================
       BUTTON LOADING
    ===================================================== */

    const originalButtonHTML =
        orderButton?.innerHTML;

    if (orderButton) {

        orderButton.disabled =
            true;

        orderButton.innerHTML =
            `
                <span class="submit-text">
                    Placing Order...
                </span>

                <span class="submit-arrow">
                    ⏳
                </span>
            `;
    }

    clearOrderMessage();

    /* =====================================================
       INSERT ORDER
    ===================================================== */

    try {

        console.log(
            "📡 Sending INSERT request..."
        );

        const result =
            await supabaseClient
                .from("orders")
                .insert({
                    customer_name:
                        customerName,

                    customer_phone:
                        customerPhone,

                    quantity_kg:
                        quantity,

                    address:
                        address,

                    total_amount:
                        totalAmount,

                    status:
                        "New"
                });

        console.log(
            "📡 COMPLETE SUPABASE RESULT:",
            result
        );

        console.log(
            "📡 RESULT DATA:",
            result?.data
        );

        console.log(
            "📡 RESULT ERROR:",
            result?.error
        );

        /* =================================================
           INSERT ERROR
        ================================================= */

        if (result.error) {

            const error =
                result.error;

            console.error(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );

            console.error(
                "❌ INSERT FAILED"
            );

            console.error(
                "❌ ERROR CODE:",
                error.code
            );

            console.error(
                "❌ ERROR MESSAGE:",
                error.message
            );

            console.error(
                "❌ ERROR DETAILS:",
                error.details
            );

            console.error(
                "❌ ERROR HINT:",
                error.hint
            );

            console.error(
                "❌ FULL ERROR:",
                JSON.stringify(
                    error
                )
            );

            console.error(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );

            /*
             * TEMPORARY DIAGNOSTIC MESSAGE
             * This intentionally exposes the actual
             * Supabase error.
             */

            showOrderMessage(
                `Supabase ${error.code || "ERROR"}: ${
                    error.message ||
                    "Unknown error"
                }`,
                "error"
            );

            return;
        }

        /* =================================================
           INSERT SUCCESS
        ================================================= */

        console.log(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

        console.log(
            "✅ ORDER INSERT SUCCESSFUL"
        );

        console.log(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

        /*
         * Since we intentionally don't use .select(),
         * the database-generated ID isn't returned.
         *
         * Create a customer-facing reference.
         */

        const temporaryOrderId =
            "MM-" +
            Date.now()
                .toString()
                .slice(-8);

        /* =================================================
           OWNER NOTIFICATION
        ================================================= */

        let notificationSuccess =
            false;

        try {

            console.log(
                "📧 Sending owner notification..."
            );

            const notificationResult =
                await supabaseClient
                    .functions
                    .invoke(
                        "new-order-notification",
                        {
                            body: {

                                customer_name:
                                    customerName,

                                customer_phone:
                                    customerPhone,

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
                    );

            console.log(
                "📧 Notification result:",
                notificationResult
            );

            if (
                notificationResult.error
            ) {

                console.warn(
                    "⚠️ Notification error:",
                    notificationResult.error
                );

            } else {

                notificationSuccess =
                    true;

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

        /* =================================================
           SUCCESS MESSAGE / MODAL
        ================================================= */

        showSuccessModal({

            orderId:
                temporaryOrderId,

            quantity:
                quantity,

            total:
                totalAmount,

            customerName:
                customerName,

            customerPhone:
                customerPhone
        });

        /* =================================================
           RESET FORM
        ================================================= */

        if (orderForm) {

            orderForm.reset();
        }

        if (quantityElement) {

            quantityElement.value =
                MINIMUM_ORDER;
        }

        updateOrderTotal();

        console.log(
            notificationSuccess
                ? "🎉 ORDER + NOTIFICATION COMPLETED"
                : "🎉 ORDER SAVED; NOTIFICATION NEEDS ATTENTION"
        );

    } catch (error) {

        console.error(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

        console.error(
            "🔥 JAVASCRIPT EXCEPTION"
        );

        console.error(
            error
        );

        console.error(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

        showOrderMessage(
            error?.message ||
            "Unexpected error occurred.",
            "error"
        );

    } finally {

        if (orderButton) {

            orderButton.disabled =
                false;

            orderButton.innerHTML =
                originalButtonHTML ||
                `
                    <span class="submit-text">
                        Confirm & Place Order
                    </span>

                    <span class="submit-arrow">
                        →
                    </span>
                `;
        }
    }
}

/* =========================================================
   ORDER MESSAGE
========================================================= */

function showOrderMessage(
    text,
    type = "error"
) {

    const message =
        document.getElementById(
            "orderMessage"
        );

    if (!message) {

        console.warn(
            "⚠️ orderMessage element not found"
        );

        return;
    }

    message.textContent =
        text;

    message.className =
        `order-message show ${type}`;
}

/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearOrderMessage() {

    const message =
        document.getElementById(
            "orderMessage"
        );

    if (!message) {
        return;
    }

    message.textContent =
        "";

    message.className =
        "order-message";
}

/* =========================================================
   SUCCESS MODAL
========================================================= */

function initializeModal() {

    const modal =
        document.getElementById(
            "successModal"
        );

    const closeButton =
        document.getElementById(
            "modalClose"
        );

    const continueButton =
        document.getElementById(
            "continueBtn"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSuccessModal
        );
    }

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            closeSuccessModal
        );
    }

    if (modal) {

        const backdrop =
            modal.querySelector(
                ".modal-backdrop"
            );

        if (backdrop) {

            backdrop.addEventListener(
                "click",
                closeSuccessModal
            );
        }
    }

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeSuccessModal();
            }
        }
    );
}

/* =========================================================
   SHOW SUCCESS MODAL
========================================================= */

function showSuccessModal(
    order
) {

    const modal =
        document.getElementById(
            "successModal"
        );

    const orderId =
        document.getElementById(
            "orderId"
        );

    const successQuantity =
        document.getElementById(
            "successQuantity"
        );

    const successTotal =
        document.getElementById(
            "successTotal"
        );

    const whatsappButton =
        document.getElementById(
            "whatsappOrderButton"
        );

    if (!modal) {

        console.warn(
            "⚠️ successModal not found"
        );

        return;
    }

    if (orderId) {

        orderId.textContent =
            order.orderId ??
            "—";
    }

    if (successQuantity) {

        successQuantity.textContent =
            `${order.quantity} KG`;
    }

    if (successTotal) {

        successTotal.textContent =
            formatCurrency(
                order.total
            );
    }

    /* =====================================================
       WHATSAPP
    ===================================================== */

    if (whatsappButton) {

        const whatsappMessage =
            [
                "Hello Mana Masala,",
                "",
                "I have placed an order.",
                `Order Reference: ${order.orderId ?? "N/A"}`,
                `Name: ${order.customerName}`,
                `Phone: ${order.customerPhone}`,
                `Quantity: ${order.quantity} KG`,
                `Total: ${formatCurrency(order.total)}`,
                "",
                "Thank you."
            ].join("\n");

        whatsappButton.href =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                whatsappMessage
            )}`;
    }

    /* =====================================================
       OPEN MODAL
    ===================================================== */

    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}

/* =========================================================
   CLOSE SUCCESS MODAL
========================================================= */

function closeSuccessModal() {

    const modal =
        document.getElementById(
            "successModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}

/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "start"
                    });
                }
            );
        }
    );
}

/* =========================================================
   VIDEO
========================================================= */

function initializeVideo() {

    const video =
        document.querySelector(
            ".glimpses-video"
        );

    if (!video) {
        return;
    }

    video.addEventListener(
        "error",
        () => {

            console.warn(
                "⚠️ glimpse.mp4 could not be loaded."
            );
        }
    );

    video.addEventListener(
        "loadeddata",
        () => {

            console.log(
                "🎥 Glimpses video loaded"
            );
        }
    );
}

/* =========================================================
   FOOTER YEAR
========================================================= */

function initializeFooter() {

    const year =
        document.getElementById(
            "currentYear"
        );

    if (year) {

        year.textContent =
            new Date()
                .getFullYear();
    }
}

/* =========================================================
   FINAL LOG
========================================================= */

console.log(
    "🌶️ Mana Masala frontend initialized"
);
