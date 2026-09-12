/* =========================================================
   🌶️ MANA MASALA
   COMPLETE CUSTOMER WEBSITE SCRIPT
   Supabase Order System
   Owner Email Notification
   WhatsApp
   ========================================================= */
"use strict";
/* =========================================================
   1. CONFIGURATION
   ========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const PRODUCT_PRICE = 350;
const MINIMUM_ORDER_KG = 10;
const OWNER_WHATSAPP =
    "918367450301";
let supabaseClient = null;
/* =========================================================
   2. INITIALIZE SUPABASE
   ========================================================= */
function initializeSupabase() {
    try {
        if (
            typeof window.supabase !== "undefined" &&
            typeof window.supabase.createClient === "function"
        ) {
            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );
            console.log(
                "✅ Supabase connected successfully."
            );
            return true;
        }
        console.warn(
            "⚠️ Supabase library was not loaded."
        );
        return false;
    } catch (error) {
        console.error(
            "❌ Supabase initialization error:",
            error
        );
        return false;
    }
}
/* =========================================================
   3. HIDE PAGE LOADER
   ========================================================= */
function hidePageLoader() {
    const loader =
        document.getElementById("pageLoader");
    if (!loader) {
        return;
    }
    loader.classList.add("hidden");
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(function () {
        loader.style.display = "none";
    }, 500);
}
/*
 * Safety backup:
 * Never allow the loader to remain forever.
 */
window.addEventListener(
    "load",
    function () {
        setTimeout(
            hidePageLoader,
            300
        );
    }
);
/* =========================================================
   4. START WEBSITE
   ========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        console.log(
            "🌶️ Mana Masala website loaded."
        );
        /*
         * Supabase is optional during page loading.
         * The homepage must open even if Supabase
         * has a temporary problem.
         */
        initializeSupabase();
        hidePageLoader();
        initializeWebsite();
    }
);
/* =========================================================
   5. INITIALIZE WEBSITE
   ========================================================= */
function initializeWebsite() {
    setupMobileMenu();
    setupQuantityCalculator();
    setupOrderForm();
    setupSuccessModal();
    setupWhatsAppButtons();
    setupImageZoom();
    setupFAQ();
    setupSmoothScrolling();
    setupScrollReveal();
    console.log(
        "✅ Mana Masala website features initialized."
    );
}
/* =========================================================
   6. MOBILE MENU
   ========================================================= */
function setupMobileMenu() {
    const menuButton =
        document.getElementById("menuBtn");
    const navigation =
        document.getElementById("navMenu");
    if (!menuButton || !navigation) {
        return;
    }
    menuButton.addEventListener(
        "click",
        function () {
            navigation.classList.toggle(
                "active"
            );
        }
    );
    navigation
        .querySelectorAll("a")
        .forEach(
            function (link) {
                link.addEventListener(
                    "click",
                    function () {
                        navigation.classList.remove(
                            "active"
                        );
                    }
                );
            }
        );
}
/* =========================================================
   7. QUANTITY / PRICE CALCULATOR
   ========================================================= */
function setupQuantityCalculator() {
    const quantityInput =
        document.getElementById("quantity");
    if (!quantityInput) {
        return;
    }
    quantityInput.addEventListener(
        "input",
        updateTotalPrice
    );
    quantityInput.addEventListener(
        "change",
        updateTotalPrice
    );
    updateTotalPrice();
}
function updateTotalPrice() {
    const quantityInput =
        document.getElementById("quantity");
    const totalElement =
        document.getElementById("totalAmount");
    if (!quantityInput) {
        return;
    }
    const quantity =
        Number(quantityInput.value);
    const total =
        quantity > 0
            ? quantity * PRODUCT_PRICE
            : 0;
    if (totalElement) {
        totalElement.textContent =
            "₹" +
            total.toLocaleString(
                "en-IN"
            );
    }
}
/* =========================================================
   8. PHONE VALIDATION
   ========================================================= */
function isValidPhone(phone) {
    const cleaned =
        phone.replace(
            /\D/g,
            ""
        );
    /*
     * 10-digit Indian mobile
     */
    if (
        cleaned.length === 10
    ) {
        return /^[6-9]\d{9}$/.test(
            cleaned
        );
    }
    /*
     * +91 / 91 format
     */
    if (
        cleaned.length === 12 &&
        cleaned.startsWith("91")
    ) {
        return /^[6-9]\d{9}$/.test(
            cleaned.substring(2)
        );
    }
    return false;
}
/* =========================================================
   9. GENERATE CUSTOMER ORDER ID
   ========================================================= */
function generateDisplayOrderId() {
    const time =
        Date.now()
            .toString()
            .slice(-8);
    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );
    return (
        "MM" +
        time +
        random
    );
}
/* =========================================================
   10. ORDER FORM
   ========================================================= */
function setupOrderForm() {
    const orderForm =
        document.getElementById(
            "orderForm"
        );
    if (!orderForm) {
        return;
    }
    orderForm.addEventListener(
        "submit",
        handleOrderSubmit
    );
}
/* =========================================================
   11. SUBMIT ORDER
   ========================================================= */
async function handleOrderSubmit(event) {
    event.preventDefault();
    /* -----------------------------------------
       Get form fields
       ----------------------------------------- */
    const customerNameInput =
        document.getElementById(
            "customerName"
        );
    const phoneInput =
        document.getElementById(
            "phone"
        );
    const addressInput =
        document.getElementById(
            "address"
        );
    const quantityInput =
        document.getElementById(
            "quantity"
        );
    const submitButton =
        document.getElementById(
            "submitOrder"
        );
    const customerName =
        customerNameInput
            ? customerNameInput.value.trim()
            : "";
    const phone =
        phoneInput
            ? phoneInput.value.trim()
            : "";
    const address =
        addressInput
            ? addressInput.value.trim()
            : "";
    const quantity =
        quantityInput
            ? Number(quantityInput.value)
            : 0;
    /* -----------------------------------------
       Validate name
       ----------------------------------------- */
    if (!customerName) {
        alert(
            "Please enter your name."
        );
        customerNameInput?.focus();
        return;
    }
    if (
        customerName.length < 2
    ) {
        alert(
            "Please enter a valid name."
        );
        customerNameInput?.focus();
        return;
    }
    /* -----------------------------------------
       Validate phone
       ----------------------------------------- */
    if (!phone) {
        alert(
            "Please enter your mobile number."
        );
        phoneInput?.focus();
        return;
    }
    if (!isValidPhone(phone)) {
        alert(
            "Please enter a valid Indian mobile number."
        );
        phoneInput?.focus();
        return;
    }
    /* -----------------------------------------
       Validate quantity
       ----------------------------------------- */
    if (
        !Number.isFinite(quantity) ||
        quantity < MINIMUM_ORDER_KG
    ) {
        alert(
            "Minimum order is " +
            MINIMUM_ORDER_KG +
            " kg."
        );
        quantityInput?.focus();
        return;
    }
    /* -----------------------------------------
       Validate address
       ----------------------------------------- */
    if (!address) {
        alert(
            "Please enter your delivery address."
        );
        addressInput?.focus();
        return;
    }
    if (
        address.length < 10
    ) {
        alert(
            "Please enter a complete delivery address."
        );
        addressInput?.focus();
        return;
    }
    /* -----------------------------------------
       Calculate amount
       ----------------------------------------- */
    const totalAmount =
        quantity *
        PRODUCT_PRICE;
    /* -----------------------------------------
       Generate display order ID
       ----------------------------------------- */
    const displayOrderId =
        generateDisplayOrderId();
    /* -----------------------------------------
       Disable button
       ----------------------------------------- */
    const originalButtonText =
        submitButton
            ? submitButton.innerHTML
            : "Place Order";
    if (submitButton) {
        submitButton.disabled =
            true;
        submitButton.innerHTML =
            "Placing Order...";
    }
    /* =====================================================
       IMPORTANT DATABASE STRUCTURE
       orders table:
       id
       customer_name
       customer_phone
       quantity_kg
       address
       total_amount
       status
       created_at
       We intentionally DO NOT send:
       product
       order_id
       notes
       ===================================================== */
    const orderData = {
        customer_name:
            customerName,
        customer_phone:
            phone,
        quantity_kg:
            quantity,
        address:
            address,
        total_amount:
            totalAmount,
        status:
            "Pending"
    };
    console.log(
        "📦 Order being submitted:",
        orderData
    );
    /* =====================================================
       CHECK SUPABASE
       ===================================================== */
    if (!supabaseClient) {
        console.error(
            "❌ Supabase client is not available."
        );
        if (submitButton) {
            submitButton.disabled =
                false;
            submitButton.innerHTML =
                originalButtonText;
        }
        alert(
            "The order system is temporarily unavailable. Please refresh the page and try again."
        );
        return;
    }
    /* =====================================================
       INSERT ORDER
       IMPORTANT:
       No .select() is used because public users
       may have INSERT permission without SELECT.
       ===================================================== */
    let insertResult;
    try {
        insertResult =
            await supabaseClient
                .from("orders")
                .insert([
                    orderData
                ]);
    } catch (error) {
        console.error(
            "❌ Supabase request failed:",
            error
        );
        if (submitButton) {
            submitButton.disabled =
                false;
            submitButton.innerHTML =
                originalButtonText;
        }
        alert(
            "Order could not be completed. Please try again later."
        );
        return;
    }
    /* =====================================================
       CHECK DATABASE ERROR
       ===================================================== */
    if (
        insertResult &&
        insertResult.error
    ) {
        console.error(
            "❌ Supabase database error:",
            insertResult.error
        );
        if (submitButton) {
            submitButton.disabled =
                false;
            submitButton.innerHTML =
                originalButtonText;
        }
        alert(
            "Order could not be completed.\n\nPlease try again later."
        );
        return;
    }
    /* =====================================================
       ORDER SUCCESSFULLY SAVED
       ===================================================== */
    console.log(
        "✅ Order saved successfully."
    );
    /* =====================================================
       NOTIFICATION DATA
       ===================================================== */
    const notificationData = {
        display_order_id:
            displayOrderId,
        customer_name:
            customerName,
        customer_phone:
            phone,
        quantity_kg:
            quantity,
        address:
            address,
        total_amount:
            totalAmount,
        status:
            "Pending"
    };
    /* =====================================================
       SEND OWNER EMAIL
       Notification failure must NOT cancel
       an already saved order.
       ===================================================== */
    sendOrderNotification(
        notificationData
    )
    .then(
        function (success) {
            if (success) {
                console.log(
                    "📧 Owner notification sent."
                );
            } else {
                console.warn(
                    "⚠️ Order saved, but notification failed."
                );
            }
        }
    )
    .catch(
        function (error) {
            console.error(
                "Notification error:",
                error
            );
        }
    );
    /* =====================================================
       RESET FORM
       ===================================================== */
    const orderForm =
        document.getElementById(
            "orderForm"
        );
    if (orderForm) {
        orderForm.reset();
    }
    updateTotalPrice();
    /* =====================================================
       RESTORE BUTTON
       ===================================================== */
    if (submitButton) {
        submitButton.disabled =
            false;
        submitButton.innerHTML =
            originalButtonText;
    }
    /* =====================================================
       SHOW SUCCESS MESSAGE
       ===================================================== */
    showSuccessModal(
        displayOrderId
    );
    console.log(
        "🌶️ Mana Masala order:",
        {
            orderId:
                displayOrderId,
            customer:
                customerName,
            phone:
                phone,
            quantity:
                quantity,
            amount:
                totalAmount
        }
    );
}
/* =========================================================
   12. SEND OWNER EMAIL NOTIFICATION
   ========================================================= */
async function sendOrderNotification(
    orderData
) {
    try {
        console.log(
            "📧 Sending owner notification..."
        );
        const response =
            await fetch(
                SUPABASE_URL +
                "/functions/v1/send-order-notification",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify({
                            order:
                                orderData
                        })
                }
            );
        if (!response.ok) {
            const errorText =
                await response.text();
            console.error(
                "Notification server error:",
                errorText
            );
            return false;
        }
        const result =
            await response
                .json()
                .catch(
                    function () {
                        return {};
                    }
                );
        console.log(
            "📧 Notification response:",
            result
        );
        return true;
    } catch (error) {
        console.error(
            "❌ Notification request failed:",
            error
        );
        return false;
    }
}
/* =========================================================
   13. SUCCESS MODAL
   ========================================================= */
function setupSuccessModal() {
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
        modal.addEventListener(
            "click",
            function (event) {
                if (
                    event.target === modal
                ) {
                    closeSuccessModal();
                }
            }
        );
    }
}
/* =========================================================
   14. SHOW SUCCESS MODAL
   ========================================================= */
function showSuccessModal(
    displayOrderId
) {
    const modal =
        document.getElementById(
            "successModal"
        );
    const orderId =
        document.getElementById(
            "orderId"
        );
    if (orderId) {
        orderId.textContent =
            displayOrderId;
    }
    if (modal) {
        modal.style.display =
            "flex";
        modal.classList.add(
            "show"
        );
        document.body.style.overflow =
            "hidden";
    }
}
/* =========================================================
   15. CLOSE SUCCESS MODAL
   ========================================================= */
function closeSuccessModal() {
    const modal =
        document.getElementById(
            "successModal"
        );
    if (modal) {
        modal.classList.remove(
            "show"
        );
        modal.style.display =
            "none";
    }
    document.body.style.overflow =
        "";
}
/* =========================================================
   16. WHATSAPP
   ========================================================= */
function openWhatsApp() {
    const message =
        "Hello Mana Masala! 🌶️\n\n" +
        "I would like to order your homemade chilli powder.";
    const whatsappURL =
        "https://wa.me/" +
        OWNER_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            message
        );
    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );
}
/* =========================================================
   17. WHATSAPP BUTTONS
   ========================================================= */
function setupWhatsAppButtons() {
    const buttons =
        document.querySelectorAll(
            ".whatsapp-btn, " +
            ".whatsapp-button, " +
            "[data-whatsapp]"
        );
    buttons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    openWhatsApp();
                }
            );
        }
    );
}
/* =========================================================
   18. IMAGE ZOOM
   ========================================================= */
function setupImageZoom() {
    const images =
        document.querySelectorAll(
            ".product-image img, " +
            ".hero-product-image img, " +
            "#productImage"
        );
    images.forEach(
        function (image) {
            image.style.cursor =
                "zoom-in";
            image.addEventListener(
                "click",
                function () {
                    image.classList.toggle(
                        "zoomed"
                    );
                    if (
                        image.classList.contains(
                            "zoomed"
                        )
                    ) {
                        image.style.transform =
                            "scale(1.08)";
                    } else {
                        image.style.transform =
                            "";
                    }
                }
            );
        }
    );
}
/* =========================================================
   19. FAQ
   ========================================================= */
function setupFAQ() {
    const questions =
        document.querySelectorAll(
            ".faq-question, " +
            ".faq-header"
        );
    questions.forEach(
        function (question) {
            question.addEventListener(
                "click",
                function () {
                    const parent =
                        question.parentElement;
                    if (!parent) {
                        return;
                    }
                    parent.classList.toggle(
                        "active"
                    );
                }
            );
        }
    );
}
/* =========================================================
   20. SMOOTH SCROLLING
   ========================================================= */
function setupSmoothScrolling() {
    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );
    links.forEach(
        function (link) {
            link.addEventListener(
                "click",
                function (event) {
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
   21. SCROLL REVEAL
   ========================================================= */
function setupScrollReveal() {
    const elements =
        document.querySelectorAll(
            ".reveal, " +
            ".fade-in, " +
            ".animate-on-scroll"
        );
    if (
        elements.length === 0
    ) {
        return;
    }
    if (
        !("IntersectionObserver" in window)
    ) {
        elements.forEach(
            function (element) {
                element.classList.add(
                    "visible"
                );
            }
        );
        return;
    }
    const observer =
        new IntersectionObserver(
            function (entries) {
                entries.forEach(
                    function (entry) {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "visible"
                            );
                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.12
            }
        );
    elements.forEach(
        function (element) {
            observer.observe(
                element
            );
        }
    );
}
/* =========================================================
   22. PREVENT ENTER KEY ISSUES
   ========================================================= */
document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Escape"
        ) {
            closeSuccessModal();
        }
    }
);
/* =========================================================
   23. ERROR HANDLING
   ========================================================= */
window.addEventListener(
    "error",
    function (event) {
        console.error(
            "Website JavaScript error:",
            event.error ||
            event.message
        );
        /*
         * Never allow a JavaScript error
         * to keep the page loader visible.
         */
        hidePageLoader();
    }
);
/* =========================================================
   24. FINAL STARTUP MESSAGE
   ========================================================= */
console.log(
    "================================================="
);
console.log(
    "🌶️ MANA MASALA"
);
console.log(
    "Authentic Homemade Chilli Powder"
);
console.log(
    "Price: ₹" +
    PRODUCT_PRICE +
    "/kg"
);
console.log(
    "Minimum order: " +
    MINIMUM_ORDER_KG +
    " kg"
);
console.log(
    "Owner WhatsApp: +" +
    OWNER_WHATSAPP
);
console.log(
    "================================================="
);
