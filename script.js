/* =========================================================
   🌶️ MANA MASALA
   COMPLETE ORDER SYSTEM
   Supabase + Order Saving + Notification
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
   GLOBALS
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

        console.log("🌶️ Mana Masala system ready");
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
        document.getElementById("quantity");

    const minusBtn =
        document.getElementById("minusBtn");

    const plusBtn =
        document.getElementById("plusBtn");


    if (!quantity) {

        console.error(
            "❌ Quantity element not found"
        );

        return;
    }


    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            () => {

                let current =
                    parseInt(quantity.value, 10) ||
                    MINIMUM_ORDER;

                current--;

                if (current < MINIMUM_ORDER) {
                    current = MINIMUM_ORDER;
                }

                quantity.value = current;

                updateOrderTotal();
            }
        );

    }


    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            () => {

                let current =
                    parseInt(quantity.value, 10) ||
                    MINIMUM_ORDER;

                current++;

                quantity.value = current;

                updateOrderTotal();
            }
        );

    }


    quantity.addEventListener(
        "input",
        () => {

            let current =
                parseInt(quantity.value, 10);

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


    quantity.addEventListener(
        "blur",
        () => {

            let current =
                parseInt(quantity.value, 10);

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
   TOTAL CALCULATION
========================================================= */

function updateOrderTotal() {

    const quantity =
        document.getElementById("quantity");

    const totalAmount =
        document.getElementById("totalAmount");

    const summaryQuantity =
        document.getElementById("summaryQuantity");


    if (!quantity) {
        return;
    }


    let quantityValue =
        parseInt(quantity.value, 10);


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
        document.getElementById("orderForm");


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
        "🛒 Order submission started"
    );


    const customerName =
        document
            .getElementById("customerName")
            ?.value
            .trim();


    const customerPhone =
        document
            .getElementById("phone")
            ?.value
            .trim();


    const address =
        document
            .getElementById("address")
            ?.value
            .trim();


    const quantityElement =
        document.getElementById("quantity");


    const orderButton =
        document.getElementById("orderSubmit");


    const message =
        document.getElementById("orderMessage");


    let quantity =
        parseInt(
            quantityElement?.value,
            10
        );


    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (!customerName) {

        showOrderMessage(
            "Please enter your full name.",
            "error"
        );

        document
            .getElementById("customerName")
            ?.focus();

        return;
    }


    if (!customerPhone) {

        showOrderMessage(
            "Please enter your phone number.",
            "error"
        );

        document
            .getElementById("phone")
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
            .getElementById("phone")
            ?.focus();

        return;
    }


    if (!address) {

        showOrderMessage(
            "Please enter your delivery address.",
            "error"
        );

        document
            .getElementById("address")
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


    if (!supabaseClient) {

        showOrderMessage(
            "Connection problem. Please refresh the page and try again.",
            "error"
        );

        console.error(
            "❌ Supabase client unavailable"
        );

        return;
    }


    /* ---------------------------------------------
       TOTAL
    --------------------------------------------- */

    const totalAmount =
        quantity *
        PRICE_PER_KG;


    /* ---------------------------------------------
       BUTTON LOADING
    --------------------------------------------- */

    const originalButtonHTML =
        orderButton?.innerHTML;


    if (orderButton) {

        orderButton.disabled = true;

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


    try {

        console.log(
            "📦 Saving order to Supabase..."
        );


        /* -----------------------------------------
           INSERT ORDER
        ----------------------------------------- */

        const {
            data,
            error
        } = await supabaseClient
            .from("orders")
            .insert([
                {
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
            ])
            .select()
            .single();


        if (error) {

            console.error(
                "❌ Supabase order error:",
                error
            );

            throw new Error(
                getReadableSupabaseError(error)
            );
        }


        console.log(
            "✅ Order saved:",
            data
        );


        const orderId =
            data?.id;


        /* -----------------------------------------
           NOTIFICATION
        ----------------------------------------- */

        let notificationSuccess =
            false;


        try {

            console.log(
                "📧 Sending owner notification..."
            );


            const {
                data: notificationData,
                error: notificationError
            } =
                await supabaseClient.functions.invoke(
                    "new-order-notification",
                    {
                        body: {
                            order_id:
                                orderId,

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


            if (notificationError) {

                console.warn(
                    "⚠️ Notification error:",
                    notificationError
                );

            } else {

                notificationSuccess =
                    true;

                console.log(
                    "✅ Notification response:",
                    notificationData
                );
            }

        } catch (notificationError) {

            console.warn(
                "⚠️ Notification failed:",
                notificationError
            );

        }


        /* -----------------------------------------
           SUCCESS
        ----------------------------------------- */

        showSuccessModal({
            orderId:
                orderId,

            quantity:
                quantity,

            total:
                totalAmount,

            customerName:
                customerName,

            customerPhone:
                customerPhone
        });


        orderFormReset();


        console.log(
            notificationSuccess
                ? "🎉 Order + notification completed"
                : "🎉 Order saved; notification may need attention"
        );


    } catch (error) {

        console.error(
            "❌ Order process failed:",
            error
        );


        showOrderMessage(
            error.message ||
            "Unable to place the order. Please try again.",
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
   SUPABASE ERROR
========================================================= */

function getReadableSupabaseError(error) {

    if (!error) {

        return "Unable to place the order.";
    }


    const message =
        error.message ||
        "";


    if (
        message.includes("row-level security") ||
        message.includes("42501")
    ) {

        return (
            "Order permission was denied. Please try again."
        );
    }


    if (
        message.includes("Failed to fetch")
    ) {

        return (
            "Network connection problem. Please check your internet connection."
        );
    }


    return (
        message ||
        "Unable to place the order."
    );
}


/* =========================================================
   MESSAGE
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
        return;
    }


    message.textContent =
        text;

    message.className =
        `order-message show ${type}`;
}


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
   FORM RESET
========================================================= */

function orderFormReset() {

    const form =
        document.getElementById(
            "orderForm"
        );


    if (!form) {
        return;
    }


    form.reset();


    const quantity =
        document.getElementById(
            "quantity"
        );


    if (quantity) {

        quantity.value =
            MINIMUM_ORDER;
    }


    updateOrderTotal();

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
                event.key === "Escape"
            ) {

                closeSuccessModal();
            }
        }
    );

}


/* =========================================================
   SHOW SUCCESS
========================================================= */

function showSuccessModal(order) {

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


    if (whatsappButton) {

        const whatsappMessage =
            [
                "Hello Mana Masala,",
                "",
                "I have placed an order.",
                `Order ID: ${order.orderId ?? "N/A"}`,
                `Name: ${order.customerName}`,
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
   CLOSE SUCCESS
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
                        behavior: "smooth",
                        block: "start"
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
            new Date().getFullYear();
    }

}


/* =========================================================
   FINAL SAFETY LOG
========================================================= */

console.log(
    "🌶️ Mana Masala frontend initialized"
);
