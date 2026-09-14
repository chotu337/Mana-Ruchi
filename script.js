/* =========================================================
   🌶️ MANA MASALA - COMPLETE ORDER SYSTEM
   Supabase + Order Saving + Owner Notification
   Call + WhatsApp
   Version: 105
========================================================= */

console.log("🌶️ Mana Masala script.js loaded - v105");

/* =========================================================
   SUPABASE
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

const OWNER_PHONE = "918367450301";
const OWNER_DISPLAY_PHONE = "+91 83674 50301";

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ DOM ready");

    /* -------------------------------------------------------
       SUPABASE CHECK
    ------------------------------------------------------- */

    if (!window.supabase) {

        console.error(
            "❌ Supabase library was not loaded."
        );

        return;
    }

    let db;

    try {

        db = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.log(
            "✅ Supabase client initialized"
        );

    } catch (error) {

        console.error(
            "❌ Supabase initialization error:",
            error
        );

        return;
    }

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const orderForm =
        document.getElementById("orderForm");

    const customerName =
        document.getElementById("customerName");

    const phone =
        document.getElementById("customerPhone") ||
        document.getElementById("phone");

    const address =
        document.getElementById("address");

    const quantity =
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
       QUANTITY
    ===================================================== */

    function getQuantity() {

        let value =
            parseInt(quantity?.value, 10);

        if (
            Number.isNaN(value) ||
            value < MIN_QUANTITY
        ) {
            value = MIN_QUANTITY;
        }

        return value;
    }

    /* =====================================================
       TOTAL
    ===================================================== */

    function updateTotal() {

        if (!quantity || !totalAmount) {
            return;
        }

        const qty =
            getQuantity();

        quantity.value =
            qty;

        const total =
            qty * PRICE_PER_KG;

        totalAmount.textContent =
            `₹${total.toLocaleString("en-IN")}`;
    }

    /* =====================================================
       PLUS
    ===================================================== */

    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                quantity.value =
                    getQuantity() + 1;

                updateTotal();
            }
        );
    }

    /* =====================================================
       MINUS
    ===================================================== */

    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const current =
                    getQuantity();

                quantity.value =
                    Math.max(
                        MIN_QUANTITY,
                        current - 1
                    );

                updateTotal();
            }
        );
    }

    /* =====================================================
       MANUAL QUANTITY
    ===================================================== */

    if (quantity) {

        quantity.addEventListener(
            "input",
            updateTotal
        );

        quantity.addEventListener(
            "change",
            updateTotal
        );
    }

    updateTotal();

    /* =====================================================
       ORDER REFERENCE
    ===================================================== */

    function createOrderReference() {

        const now =
            new Date();

        const date =
            now.getFullYear().toString() +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            String(
                now.getDate()
            ).padStart(2, "0");

        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );

        return `MM-${date}-${random}`;
    }

    /* =====================================================
       PHONE CLEANER
    ===================================================== */

    function cleanPhone(value) {

        return String(value || "")
            .replace(/\D/g, "")
            .slice(-10);
    }

    /* =====================================================
       SUCCESS MODAL
    ===================================================== */

    function showSuccessModal(
        orderReference,
        qty,
        total
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

        if (orderId) {

            orderId.textContent =
                orderReference;
        }

        if (successQuantity) {

            successQuantity.textContent =
                `${qty} KG`;
        }

        if (successTotal) {

            successTotal.textContent =
                `₹${total.toLocaleString("en-IN")}`;
        }

        if (modal) {

            modal.style.display =
                "flex";

            modal.classList.add(
                "active"
            );

            document.body.classList.add(
                "modal-open"
            );

        } else {

            alert(
                `Order placed successfully!\n\n` +
                `Order ID: ${orderReference}\n` +
                `Quantity: ${qty} KG\n` +
                `Total: ₹${total.toLocaleString("en-IN")}`
            );
        }
    }

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeSuccessModal() {

        const modal =
            document.getElementById(
                "successModal"
            );

        if (modal) {

            modal.style.display =
                "none";

            modal.classList.remove(
                "active"
            );
        }

        document.body.classList.remove(
            "modal-open"
        );
    }

    [
        "successCloseBtn",
        "modalClose",
        "continueBtn"
    ].forEach((id) => {

        const button =
            document.getElementById(id);

        if (button) {

            button.addEventListener(
                "click",
                closeSuccessModal
            );
        }
    });

    /* =====================================================
       SUCCESS WHATSAPP BUTTON
    ===================================================== */

    const whatsappOrderButton =
        document.getElementById(
            "whatsappOrderButton"
        );

    if (whatsappOrderButton) {

        whatsappOrderButton.addEventListener(
            "click",
            () => {

                const orderId =
                    document.getElementById(
                        "orderId"
                    )?.textContent || "";

                const qty =
                    document.getElementById(
                        "successQuantity"
                    )?.textContent || "";

                const total =
                    document.getElementById(
                        "successTotal"
                    )?.textContent || "";

                const message =
                    `Hello Mana Masala 🌶️\n\n` +
                    `I have placed an order.\n` +
                    `Order ID: ${orderId}\n` +
                    `Quantity: ${qty}\n` +
                    `Total: ${total}`;

                const url =
                    `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(message)}`;

                window.open(
                    url,
                    "_blank"
                );
            }
        );
    }

    /* =====================================================
       ORDER SUBMIT
    ===================================================== */

    if (!orderForm) {

        console.error(
            "❌ orderForm not found"
        );

        return;
    }

    orderForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            console.log(
                "📦 Order submission started"
            );

            /* ------------------------------------------------
               READ FORM
            ------------------------------------------------ */

            const name =
                customerName
                    ? customerName.value.trim()
                    : "";

            const rawPhone =
                phone
                    ? phone.value.trim()
                    : "";

            const cleanPhone =
                cleanPhoneNumber(
                    rawPhone
                );

            const deliveryAddress =
                address
                    ? address.value.trim()
                    : "";

            const qty =
                getQuantity();

            const total =
                qty * PRICE_PER_KG;

            /* ------------------------------------------------
               VALIDATION
            ------------------------------------------------ */

            if (!name) {

                alert(
                    "Please enter your name."
                );

                customerName?.focus();

                return;
            }

            if (
                cleanPhone.length !== 10
            ) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                phone?.focus();

                return;
            }

            if (!deliveryAddress) {

                alert(
                    "Please enter your delivery address."
                );

                address?.focus();

                return;
            }

            if (qty < MIN_QUANTITY) {

                alert(
                    `Minimum order quantity is ${MIN_QUANTITY} KG.`
                );

                quantity.value =
                    MIN_QUANTITY;

                updateTotal();

                return;
            }

            /* ------------------------------------------------
               PAYMENT CHECKBOX
               Only required if it exists in HTML.
            ------------------------------------------------ */

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

            /* ------------------------------------------------
               ORDER REFERENCE
            ------------------------------------------------ */

            const orderReference =
                createOrderReference();

            /* ------------------------------------------------
               SUPABASE OBJECT
            ------------------------------------------------ */

            const order = {

                customer_name:
                    name,

                customer_phone:
                    cleanPhone,

                quantity_kg:
                    qty,

                address:
                    deliveryAddress,

                total_amount:
                    total,

                status:
                    "New"
            };

            console.log(
                "📦 Order:",
                order
            );

            /* ------------------------------------------------
               DISABLE BUTTON
            ------------------------------------------------ */

            if (orderSubmit) {

                orderSubmit.disabled =
                    true;

                orderSubmit.dataset.originalText =
                    orderSubmit.textContent;

                orderSubmit.textContent =
                    "Placing Order...";
            }

            try {

                /* =================================================
                   INSERT ONLY
                   
                   IMPORTANT:
                   Do NOT use .select().single()
                ================================================= */

                console.log(
                    "📤 Inserting order..."
                );

                const {
                    error
                } = await db
                    .from("orders")
                    .insert(order);

                if (error) {

                    console.error(
                        "❌ SUPABASE INSERT ERROR"
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
                    "✅ ORDER SAVED"
                );

                /* =================================================
                   OWNER NOTIFICATION
                ================================================= */

                try {

                    const notificationOrder = {

                        ...order,

                        order_reference:
                            orderReference
                    };

                    console.log(
                        "📧 Calling notification function..."
                    );

                    const {
                        data,
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
                            "⚠️ Notification error:",
                            notificationError
                        );

                    } else {

                        console.log(
                            "✅ Notification response:",
                            data
                        );
                    }

                } catch (
                    notificationError
                ) {

                    console.warn(
                        "⚠️ Notification failed, order was saved:",
                        notificationError
                    );
                }

                /* ------------------------------------------------
                   RESET
                ------------------------------------------------ */

                orderForm.reset();

                if (quantity) {

                    quantity.value =
                        MIN_QUANTITY;
                }

                updateTotal();

                /* ------------------------------------------------
                   SUCCESS
                ------------------------------------------------ */

                showSuccessModal(
                    orderReference,
                    qty,
                    total
                );

            } catch (error) {

                console.error(
                    "❌ ORDER FAILED"
                );

                console.error(
                    "Code:",
                    error?.code
                );

                console.error(
                    "Message:",
                    error?.message
                );

                console.error(
                    "Details:",
                    error?.details
                );

                console.error(
                    "Hint:",
                    error?.hint
                );

                /* -----------------------------------------------
                   SHOW EXACT ERROR FOR DEBUGGING
                ----------------------------------------------- */

                alert(
                    "Order could not be completed.\n\n" +
                    "Error: " +
                    (
                        error?.message ||
                        "Unknown error"
                    ) +
                    "\n\nCode: " +
                    (
                        error?.code ||
                        "N/A"
                    )
                );

            } finally {

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
       FLOATING WHATSAPP
    ===================================================== */

    const whatsappBubble =
        document.getElementById(
            "whatsappBubble"
        );

    if (whatsappBubble) {

        whatsappBubble.addEventListener(
            "click",
            () => {

                const message =
                    "Hello Mana Masala 🌶️ I would like to know more about the homemade chilli powder.";

                const url =
                    `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(message)}`;

                window.open(
                    url,
                    "_blank"
                );
            }
        );
    }

    /* =====================================================
       CALL BUTTON
    ===================================================== */

    const callButton =
        document.getElementById(
            "callButton"
        );

    if (callButton) {

        callButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    `tel:+${OWNER_PHONE}`;
            }
        );
    }

    /* =====================================================
       ORDER NOW SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href="#order"], [data-order-link]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    const orderSection =
                        document.getElementById(
                            "order"
                        );

                    if (orderSection) {

                        event.preventDefault();

                        orderSection.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                }
            );
        });

    console.log(
        "✅ Mana Masala order system ready"
    );

    console.log(
        `🌶️ ₹${PRICE_PER_KG}/KG`
    );

    console.log(
        `📦 Minimum ${MIN_QUANTITY} KG`
    );

    console.log(
        `📞 ${OWNER_DISPLAY_PHONE}`
    );
});


/* =========================================================
   HELPER
========================================================= */

function cleanPhoneNumber(value) {

    return String(value || "")
        .replace(/\D/g, "")
        .slice(-10);
}
