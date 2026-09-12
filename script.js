/* =========================================================
   🌶️ MANA MASALA
   CLEAN ORDER + QUANTITY + SUPABASE + NOTIFICATION SYSTEM
   ========================================================= */

console.log("🌶️ Mana Masala script.js loaded");

/* =========================================================
   CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

const EDGE_FUNCTION =
    "new-order-notification";

const PRICE_PER_KG = 350;
const MINIMUM_ORDER = 10;
const OWNER_WHATSAPP = "918367450301";

let db = null;


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function formatCurrency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

function generateOrderId() {
    return (
        "MM" +
        Date.now().toString().slice(-8)
    );
}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ DOM ready");


    /* =====================================================
       PAGE LOADER
       ===================================================== */

    const loader =
        document.getElementById("pageLoader");

    if (loader) {
        setTimeout(function () {
            loader.classList.add("hidden");
        }, 500);
    }


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(".site-header");

    if (header) {
        window.addEventListener("scroll", function () {

            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        });
    }


    /* =====================================================
       SUPABASE
       ===================================================== */

    if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {

        try {

            db = window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

            console.log(
                "✅ Supabase client created"
            );

        } catch (error) {

            console.error(
                "❌ Supabase initialization error:",
                error
            );

        }

    } else {

        console.error(
            "❌ Supabase library not loaded."
        );

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            function () {

                navLinks.classList.toggle("open");

            }
        );

        document
            .querySelectorAll(".nav-links a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navLinks.classList.remove(
                            "open"
                        );

                    }
                );

            });

    }


    /* =====================================================
       PRODUCT IMAGE ZOOM
       ===================================================== */

    const productImage =
        document.getElementById("productImage");

    if (productImage) {

        productImage.addEventListener(
            "mousemove",
            function (event) {

                if (window.innerWidth <= 600) {
                    return;
                }

                const rect =
                    productImage.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) /
                        rect.width) * 100;

                const y =
                    ((event.clientY - rect.top) /
                        rect.height) * 100;

                productImage.style.transformOrigin =
                    `${x}% ${y}%`;

                productImage.style.transform =
                    "scale(1.08)";

            }
        );

        productImage.addEventListener(
            "mouseleave",
            function () {

                productImage.style.transform =
                    "scale(1)";

            }
        );

    }


    /* =====================================================
       FAQ ACCORDION
       ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");

        if (!question || !answer) {
            return;
        }

        question.addEventListener(
            "click",
            function () {

                const alreadyOpen =
                    item.classList.contains("active");

                faqItems.forEach(
                    function (otherItem) {

                        otherItem.classList.remove(
                            "active"
                        );

                        const otherAnswer =
                            otherItem.querySelector(
                                ".faq-answer"
                            );

                        if (otherAnswer) {
                            otherAnswer.style.maxHeight =
                                null;
                        }

                    }
                );

                if (!alreadyOpen) {

                    item.classList.add("active");

                    answer.style.maxHeight =
                        answer.scrollHeight + "px";

                }

            }
        );

    });


    /* =====================================================
       ORDER ELEMENTS
       ===================================================== */

    const orderForm =
        document.getElementById("orderForm");

    const quantityInput =
        document.getElementById("quantity");

    const increaseButton =
        document.getElementById("increaseQuantity") ||
        document.getElementById("increaseBtn") ||
        document.getElementById("plusBtn");

    const decreaseButton =
        document.getElementById("decreaseQuantity") ||
        document.getElementById("decreaseBtn") ||
        document.getElementById("minusBtn");

    const summaryQuantity =
        document.getElementById("summaryQuantity");

    const totalPrice =
        document.getElementById("totalPrice") ||
        document.getElementById("totalAmount");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone") ||
        document.getElementById("phone");

    const address =
        document.getElementById("address");

    const notes =
        document.getElementById("notes");

    const placeOrderButton =
        document.getElementById("placeOrderButton") ||
        document.getElementById("submitOrder") ||
        document.getElementById("orderSubmit");

    const orderMessage =
        document.getElementById("orderMessage");


    console.log(
        "Quantity element:",
        quantityInput
    );

    console.log(
        "Place Order element:",
        placeOrderButton
    );

    console.log(
        "Order form:",
        orderForm
    );


    /* =====================================================
       QUANTITY
       ===================================================== */

    function getQuantity() {

        if (!quantityInput) {
            return MINIMUM_ORDER;
        }

        let quantity =
            parseInt(
                quantityInput.value,
                10
            );

        if (
            Number.isNaN(quantity) ||
            quantity < MINIMUM_ORDER
        ) {

            quantity =
                MINIMUM_ORDER;

        }

        quantity =
            Math.floor(quantity);

        return quantity;
    }


    /* =====================================================
       UPDATE PRICE
       ===================================================== */

    function updateSummary() {

        if (!quantityInput) {
            return;
        }

        const quantity =
            getQuantity();

        const total =
            quantity * PRICE_PER_KG;

        quantityInput.value =
            quantity;


        if (summaryQuantity) {

            summaryQuantity.textContent =
                quantity + " KG";

        }


        if (totalPrice) {

            totalPrice.textContent =
                formatCurrency(total);

        }


        if (paymentAmount) {

            paymentAmount.textContent =
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

    }


    /* =====================================================
       PLUS BUTTON
       ===================================================== */

    if (
        increaseButton &&
        quantityInput
    ) {

        increaseButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                let quantity =
                    getQuantity();

                quantity++;

                quantityInput.value =
                    quantity;

                updateSummary();

            }
        );

    }


    /* =====================================================
       MINUS BUTTON
       ===================================================== */

    if (
        decreaseButton &&
        quantityInput
    ) {

        decreaseButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                let quantity =
                    getQuantity();

                if (
                    quantity > MINIMUM_ORDER
                ) {

                    quantity--;

                } else {

                    quantity =
                        MINIMUM_ORDER;

                }

                quantityInput.value =
                    quantity;

                updateSummary();

            }
        );

    }


    /* =====================================================
       MANUAL QUANTITY INPUT
       ===================================================== */

    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            function () {

                let value =
                    parseInt(
                        quantityInput.value,
                        10
                    );

                if (Number.isNaN(value)) {
                    return;
                }

                if (
                    value < MINIMUM_ORDER
                ) {

                    value =
                        MINIMUM_ORDER;

                }

                quantityInput.value =
                    Math.floor(value);

                updateSummary();

            }
        );

        quantityInput.addEventListener(
            "change",
            function () {

                updateSummary();

            }
        );

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(
        message,
        success = false
    ) {

        if (!orderMessage) {

            alert(message);

            return;

        }

        orderMessage.textContent =
            message;

        orderMessage.style.display =
            "block";

        orderMessage.style.padding =
            "12px";

        orderMessage.style.marginTop =
            "15px";

        orderMessage.style.fontWeight =
            "600";

        orderMessage.style.color =
            success ? "green" : "red";

    }


    /* =====================================================
       PLACE ORDER
       ===================================================== */

    async function placeOrder() {

        console.log(
            "🔥 PLACE ORDER BUTTON CLICKED"
        );


        if (!orderForm) {

            console.error(
                "❌ Order form not found"
            );

            return;

        }


        /* -------------------------------------------------
           GET CUSTOMER DATA
           ------------------------------------------------- */

        const name =
            customerName?.value.trim() || "";

        const phone =
            customerPhone?.value.trim() || "";

        const customerAddress =
            address?.value.trim() || "";

        const customerNotes =
            notes?.value.trim() || "";


        const quantity =
            getQuantity();

        const total =
            quantity * PRICE_PER_KG;


        console.log(
            "📝 Customer:",
            name
        );

        console.log(
            "📱 Phone:",
            phone
        );

        console.log(
            "📦 Quantity:",
            quantity
        );

        console.log(
            "💰 Total:",
            total
        );


        /* -------------------------------------------------
           VALIDATION
           ------------------------------------------------- */

        if (!name) {

            showMessage(
                "Please enter your name."
            );

            customerName?.focus();

            return;

        }


        const cleanPhone =
            phone.replace(
                /\D/g,
                ""
            );


        if (
            cleanPhone.length !== 10
        ) {

            showMessage(
                "Please enter a valid 10-digit mobile number."
            );

            customerPhone?.focus();

            return;

        }


        if (!customerAddress) {

            showMessage(
                "Please enter your delivery address."
            );

            address?.focus();

            return;

        }


        if (
            quantity < MINIMUM_ORDER
        ) {

            showMessage(
                "Minimum order quantity is 10 KG."
            );

            return;

        }


        /* -------------------------------------------------
           SUPABASE CHECK
           ------------------------------------------------- */

        if (!db) {

            console.error(
                "❌ Supabase client unavailable"
            );

            showMessage(
                "Order system is unavailable. Please refresh the page and try again."
            );

            return;

        }


        /* -------------------------------------------------
           BUTTON LOADING
           ------------------------------------------------- */

        if (placeOrderButton) {

            placeOrderButton.disabled =
                true;

            placeOrderButton.dataset.originalText =
                placeOrderButton.innerHTML;

            placeOrderButton.innerHTML =
                "⏳ Processing...";

        }


        const orderId =
            generateOrderId();


        /* -------------------------------------------------
           ORDER OBJECT
           ------------------------------------------------- */

        const order = {

            customer_name:
                name,

            customer_phone:
                cleanPhone,

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
            "📦 Sending order:",
            order
        );


        try {

            /* =============================================
               SAVE ORDER
               ============================================= */

            console.log(
                "📤 Inserting order into Supabase..."
            );


            const {
                data,
                error
            } =
                await db
                    .from("orders")
                    .insert(order)
                    .select();


            if (error) {

                console.error(
                    "❌ SUPABASE ERROR:",
                    error
                );

                throw new Error(
                    error.message
                );

            }


            console.log(
                "✅ ORDER SAVED:",
                data
            );


            /* =============================================
               OWNER NOTIFICATION
               ============================================= */

            console.log(
                "📲 Sending owner notification..."
            );


            try {

                const {
                    data:
                        notificationData,
                    error:
                        notificationError
                } =
                    await db.functions.invoke(
                        EDGE_FUNCTION,
                        {
                            body: {
                                order: {
                                    ...order,
                                    order_id:
                                        orderId,
                                    notes:
                                        customerNotes
                                }
                            }
                        }
                    );


                if (
                    notificationError
                ) {

                    console.error(
                        "⚠️ Notification failed:",
                        notificationError
                    );

                } else {

                    console.log(
                        "✅ Owner notification sent:",
                        notificationData
                    );

                }

            } catch (
                notificationError
            ) {

                /*
                 * The order is already saved.
                 * A notification problem must not
                 * make the order appear failed.
                 */

                console.error(
                    "⚠️ Notification exception:",
                    notificationError
                );

            }


            /* =============================================
               SAVE LOCAL ORDER INFO
               ============================================= */

            sessionStorage.setItem(
                "manaMasalaOrder",
                JSON.stringify({

                    orderId:
                        orderId,

                    name:
                        name,

                    phone:
                        cleanPhone,

                    address:
                        customerAddress,

                    notes:
                        customerNotes,

                    quantity:
                        quantity,

                    amount:
                        total

                })
            );


            /* =============================================
               SUCCESS
               ============================================= */

            console.log(
                "🎉 ORDER COMPLETED"
            );


            showMessage(
                "✅ Order confirmed successfully! We will contact you shortly.",
                true
            );


            /* =============================================
               OPTIONAL SUCCESS MODAL
               ============================================= */

            const successModal =
                document.getElementById(
                    "successModal"
                );

            const orderIdElement =
                document.getElementById(
                    "orderId"
                );


            if (
                successModal &&
                orderIdElement
            ) {

                orderIdElement.textContent =
                    orderId;

                successModal.classList.add(
                    "show"
                );

                successModal.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }


            /* =============================================
               WHATSAPP MESSAGE
               ============================================= */

            const whatsappText =
`🌶️ Mana Masala Order

Order ID: ${orderId}
Customer: ${name}
Phone: ${cleanPhone}
Quantity: ${quantity} KG
Total: ₹${total.toLocaleString("en-IN")}

Delivery Address:
${customerAddress}`;


            const whatsappURL =
                "https://wa.me/" +
                OWNER_WHATSAPP +
                "?text=" +
                encodeURIComponent(
                    whatsappText
                );


            console.log(
                "💬 WhatsApp URL prepared:",
                whatsappURL
            );


            /* =============================================
               RESET FORM
               ============================================= */

            if (orderForm) {

                orderForm.reset();

            }


            if (quantityInput) {

                quantityInput.value =
                    MINIMUM_ORDER;

            }


            updateSummary();


        } catch (error) {

            console.error(
                "❌ ORDER ERROR:",
                error
            );


            showMessage(
                "Order could not be completed. Please try again later."
            );

        } finally {

            if (placeOrderButton) {

                placeOrderButton.disabled =
                    false;

                placeOrderButton.innerHTML =
                    placeOrderButton.dataset.originalText ||
                    "🛒 Place Order";

            }

        }

    }


    /* =====================================================
       PLACE ORDER BUTTON
       ===================================================== */

    if (placeOrderButton) {

        console.log(
            "✅ Place Order button FOUND"
        );


        placeOrderButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                placeOrder();

            }
        );


        console.log(
            "✅ Place Order click handler attached"
        );

    } else {

        console.error(
            "❌ Place Order button NOT FOUND"
        );

    }


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                placeOrder();

            }
        );

    }


    /* =====================================================
       SUCCESS MODAL
       ===================================================== */

    const successModal =
        document.getElementById(
            "successModal"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const continueBtn =
        document.getElementById(
            "continueBtn"
        );


    function closeModal() {

        if (!successModal) {
            return;
        }

        successModal.classList.remove(
            "show"
        );

        successModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            closeModal
        );

    }


    if (successModal) {

        successModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    successModal
                ) {

                    closeModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                successModal &&
                successModal.classList.contains(
                    "show"
                )
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const yearElement =
        document.getElementById("year");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".glass-card, .section-heading, .about-content"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.style.opacity =
                                    "1";

                                entry.target.style.transform =
                                    "translateY(0)";

                                revealObserver.unobserve(
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


        revealElements.forEach(
            function (element) {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(25px)";

                element.style.transition =
                    "opacity 0.7s ease, transform 0.7s ease";

                revealObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            function (anchor) {

                anchor.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            this.getAttribute(
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

                        if (target) {

                            event.preventDefault();

                            target.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            });

                        }

                    }
                );

            }
        );


    /* =====================================================
       INITIAL PRICE
       ===================================================== */

    updateSummary();


    /* =====================================================
       FINAL STATUS
       ===================================================== */

    console.log(
        "🌶️ Mana Masala Order System Ready"
    );

    console.log(
        "📦 Supabase orders: ENABLED"
    );

    console.log(
        "📲 Owner notifications: ENABLED"
    );

});
