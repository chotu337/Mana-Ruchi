/* =========================================================
   🌶️ MANA MASALA - COMPLETE ORDER SYSTEM
   Supabase + Order Saving + Owner Notification
   ========================================================= */

console.log("🌶️ Mana Masala script.js loaded");

document.addEventListener("DOMContentLoaded", async () => {

    console.log("✅ DOM ready");

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const SUPABASE_URL =
        "https://hcczhnmdipqrnbxviuln.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

    const PRICE_PER_KG = 350;
    const MIN_QUANTITY = 10;

    const OWNER_WHATSAPP = "918367450301";

    let db = null;

    /* =====================================================
       SUPABASE INITIALIZATION
       ===================================================== */

    try {

        if (!window.supabase) {

            console.error(
                "❌ Supabase library not found"
            );

            showOrderMessage(
                "Order system is unavailable. Please refresh the page and try again.",
                "error"
            );

            return;
        }

        db = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.log(
            "✅ Supabase client created"
        );

    } catch (error) {

        console.error(
            "❌ Supabase initialization failed:",
            error
        );

        showOrderMessage(
            "Order system is unavailable. Please refresh the page and try again.",
            "error"
        );

        return;
    }

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const quantityInput =
        document.getElementById("quantity");

    const totalAmount =
        document.getElementById("totalAmount");

    const totalPrice =
        document.getElementById("totalPrice");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const decreaseBtn =
        document.getElementById("decreaseQuantity") ||
        document.getElementById("decreaseBtn") ||
        document.getElementById("minusBtn");

    const increaseBtn =
        document.getElementById("increaseQuantity") ||
        document.getElementById("increaseBtn") ||
        document.getElementById("plusBtn");

    const orderForm =
        document.getElementById("orderForm");

    const orderButton =
        document.getElementById("orderSubmit") ||
        document.getElementById("submitOrder") ||
        document.getElementById("placeOrderButton");

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone") ||
        document.getElementById("phone");

    const address =
        document.getElementById("address");

    const notes =
        document.getElementById("notes");

    const orderMessage =
        document.getElementById("orderMessage");

    console.log(
        "Quantity element:",
        quantityInput
    );

    console.log(
        "Place Order element:",
        orderButton
    );

    console.log(
        "Order form:",
        orderForm
    );

    /* =====================================================
       MESSAGE
       ===================================================== */

    function showOrderMessage(
        message,
        type = "info"
    ) {

        if (!orderMessage) {

            console.log(message);

            return;
        }

        orderMessage.textContent =
            message;

        orderMessage.style.display =
            "block";

        if (type === "error") {

            orderMessage.style.color =
                "#b91c1c";

        } else if (type === "success") {

            orderMessage.style.color =
                "#15803d";

        } else {

            orderMessage.style.color =
                "";
        }
    }

    /* =====================================================
       CURRENCY
       ===================================================== */

    function formatCurrency(amount) {

        return "₹" +
            Number(amount).toLocaleString(
                "en-IN"
            );
    }

    /* =====================================================
       GET QUANTITY
       ===================================================== */

    function getQuantity() {

        if (!quantityInput) {

            return MIN_QUANTITY;
        }

        let quantity =
            parseInt(
                quantityInput.value,
                10
            );

        if (
            isNaN(quantity) ||
            quantity < MIN_QUANTITY
        ) {

            quantity =
                MIN_QUANTITY;
        }

        return quantity;
    }

    /* =====================================================
       UPDATE TOTAL
       ===================================================== */

    function updateTotal() {

        const quantity =
            getQuantity();

        const total =
            quantity *
            PRICE_PER_KG;

        if (quantityInput) {

            quantityInput.value =
                quantity;
        }

        if (totalAmount) {

            totalAmount.textContent =
                formatCurrency(total);
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
            `📦 Quantity: ${quantity} KG`
        );

        console.log(
            `💰 Total: ${formatCurrency(total)}`
        );

        return {
            quantity,
            total
        };
    }

    /* =====================================================
       INCREASE QUANTITY
       ===================================================== */

    if (increaseBtn) {

        increaseBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const quantity =
                    getQuantity();

                quantityInput.value =
                    quantity + 1;

                updateTotal();
            }
        );
    }

    /* =====================================================
       DECREASE QUANTITY
       ===================================================== */

    if (decreaseBtn) {

        decreaseBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const quantity =
                    getQuantity();

                quantityInput.value =
                    Math.max(
                        MIN_QUANTITY,
                        quantity - 1
                    );

                updateTotal();
            }
        );
    }

    /* =====================================================
       MANUAL QUANTITY
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

    updateTotal();

    /* =====================================================
       PHONE
       ===================================================== */

    function cleanPhoneNumber(phone) {

        return String(phone || "")
            .replace(/\D/g, "")
            .slice(-10);
    }

    function isValidPhone(phone) {

        return /^[6-9]\d{9}$/.test(
            phone
        );
    }

    /* =====================================================
       LOCAL ORDER REFERENCE
       ===================================================== */

    function createOrderReference() {

        const now =
            new Date();

        const timestamp =
            now.getTime();

        const random =
            Math.floor(
                1000 +
                Math.random() *
                9000
            );

        return `MM-${timestamp}-${random}`;
    }

    /* =====================================================
       PLACE ORDER
       ===================================================== */

    async function placeOrder(event) {

        if (event) {

            event.preventDefault();
        }

        console.log(
            "🔥 PLACE ORDER BUTTON CLICKED"
        );

        /* -------------------------------------------------
           SUPABASE CHECK
           ------------------------------------------------- */

        if (!db) {

            console.error(
                "❌ Supabase client unavailable"
            );

            showOrderMessage(
                "Order system is unavailable. Please refresh the page and try again.",
                "error"
            );

            return;
        }

        /* -------------------------------------------------
           CUSTOMER DATA
           ------------------------------------------------- */

        const name =
            customerName
                ? customerName.value.trim()
                : "";

        const rawPhone =
            customerPhone
                ? customerPhone.value.trim()
                : "";

        const customerAddress =
            address
                ? address.value.trim()
                : "";

        const customerNotes =
            notes
                ? notes.value.trim()
                : "";

        const cleanPhone =
            cleanPhoneNumber(
                rawPhone
            );

        const {
            quantity,
            total
        } = updateTotal();

        console.log(
            "📝 Customer:",
            name
        );

        console.log(
            "📱 Phone:",
            cleanPhone
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

            showOrderMessage(
                "Please enter your name.",
                "error"
            );

            if (customerName) {

                customerName.focus();
            }

            return;
        }

        if (!isValidPhone(cleanPhone)) {

            showOrderMessage(
                "Please enter a valid 10-digit mobile number.",
                "error"
            );

            if (customerPhone) {

                customerPhone.focus();
            }

            return;
        }

        if (!customerAddress) {

            showOrderMessage(
                "Please enter your delivery address.",
                "error"
            );

            if (address) {

                address.focus();
            }

            return;
        }

        if (quantity < MIN_QUANTITY) {

            showOrderMessage(
                `Minimum order is ${MIN_QUANTITY} KG.`,
                "error"
            );

            return;
        }

        /* -------------------------------------------------
           DISABLE BUTTON
           ------------------------------------------------- */

        const originalButtonText =
            orderButton
                ? orderButton.innerHTML
                : "🛒 Place Order";

        if (orderButton) {

            orderButton.disabled =
                true;

            orderButton.innerHTML =
                "⏳ Placing Order...";
        }

        showOrderMessage(
            "Submitting your order...",
            "info"
        );

        /* =================================================
           IMPORTANT
           The database DOES NOT have order_id.
           Therefore order_id is NOT inserted into orders.
           ================================================= */

        const orderReference =
            createOrderReference();

        /* =================================================
           DATABASE ORDER OBJECT
           ONLY EXISTING COLUMNS
           ================================================= */

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

        /* =================================================
           INSERT ORDER
           ================================================= */

        try {

            console.log(
                "📤 Inserting order into Supabase..."
            );

            /*
             * IMPORTANT:
             *
             * No .select()
             *
             * No order_id
             *
             * Only columns that exist in
             * your orders table.
             */

            const {
                error: insertError
            } = await db
                .from("orders")
                .insert(order);

            if (insertError) {

                console.error(
                    "❌ SUPABASE INSERT ERROR:",
                    insertError
                );

                throw new Error(
                    insertError.message
                );
            }

            console.log(
                "✅ ORDER SAVED TO SUPABASE"
            );

        } catch (error) {

            console.error(
                "❌ ORDER ERROR:",
                error
            );

            showOrderMessage(
                "Order could not be completed. Please try again.",
                "error"
            );

            if (orderButton) {

                orderButton.disabled =
                    false;

                orderButton.innerHTML =
                    originalButtonText;
            }

            return;
        }

        /* =================================================
           OWNER NOTIFICATION
           ================================================= */

        try {

            console.log(
                "📲 Sending owner notification..."
            );

            /*
             * order_id is NOT sent to the database.
             *
             * It is only used as a reference
             * for the notification/customer.
             */

            const notificationOrder = {

                ...order,

                order_reference:
                    orderReference,

                notes:
                    customerNotes
            };

            const {
                data:
                    notificationData,
                error:
                    notificationError
            } = await db.functions.invoke(
                "new-order-notification",
                {
                    body: {
                        order:
                            notificationOrder
                    }
                }
            );

            if (notificationError) {

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

        } catch (notificationError) {

            /*
             * Notification failure must NOT
             * make the order fail.
             */

            console.error(
                "⚠️ Notification error:",
                notificationError
            );
        }

        /* =================================================
           SUCCESS
           ================================================= */

        console.log(
            "🎉 ORDER COMPLETED"
        );

        showOrderMessage(
            `Order placed successfully! Reference: ${orderReference}`,
            "success"
        );

        /* =================================================
           SUCCESS MODAL
           ================================================= */

        const successModal =
            document.getElementById(
                "successModal"
            );

        const modalOrderId =
            document.getElementById(
                "orderId"
            );

        if (modalOrderId) {

            modalOrderId.textContent =
                orderReference;
        }

        if (successModal) {

            successModal.classList.add(
                "active"
            );

            successModal.style.display =
                "flex";
        }

        /* =================================================
           WHATSAPP
           ================================================= */

        const whatsappMessage =
            `🌶️ Mana Masala Order%0A%0A` +
            `Reference: ${orderReference}%0A` +
            `Name: ${encodeURIComponent(name)}%0A` +
            `Phone: ${cleanPhone}%0A` +
            `Quantity: ${quantity} KG%0A` +
            `Total: ₹${total}%0A` +
            `Address: ${encodeURIComponent(customerAddress)}`;

        const whatsappUrl =
            `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappMessage}`;

        console.log(
            "📲 WhatsApp notification URL ready"
        );

        const whatsappButton =
            document.getElementById(
                "whatsappOrderButton"
            );

        if (whatsappButton) {

            whatsappButton.href =
                whatsappUrl;

            whatsappButton.style.display =
                "inline-flex";
        }

        /* =================================================
           RESET FORM
           ================================================= */

        if (orderForm) {

            orderForm.reset();
        }

        if (quantityInput) {

            quantityInput.value =
                MIN_QUANTITY;
        }

        updateTotal();

        /* =================================================
           RESTORE BUTTON
           ================================================= */

        if (orderButton) {

            orderButton.disabled =
                false;

            orderButton.innerHTML =
                originalButtonText;
        }
    }

    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            placeOrder
        );

        console.log(
            "✅ Order form submit handler attached"
        );
    }

    /* =====================================================
       BUTTON
       ===================================================== */

    if (orderButton) {

        console.log(
            "✅ Place Order button FOUND"
        );

        /*
         * Your current button is type="submit",
         * so the form submit handler handles it.
         *
         * We don't attach another click handler.
         */

        if (
            orderButton.type !==
            "submit"
        ) {

            orderButton.addEventListener(
                "click",
                placeOrder
            );

            console.log(
                "✅ Place Order click handler attached"
            );
        }
    }

    /* =====================================================
       SUCCESS MODAL CLOSE
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

    function closeSuccessModal() {

        if (!successModal) {

            return;
        }

        successModal.classList.remove(
            "active"
        );

        successModal.style.display =
            "none";
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
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const navLinks =
        document.getElementById(
            "navLinks"
        );

    if (
        menuToggle &&
        navLinks
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "active"
                );

                menuToggle.classList.toggle(
                    "active"
                );
            }
        );

        navLinks
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "active"
                        );

                        menuToggle.classList.remove(
                            "active"
                        );
                    }
                );
            });
    }

    /* =====================================================
       FAQ
       ===================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );

    faqItems.forEach(item => {

        const question =
            item.querySelector(
                ".faq-question"
            );

        if (!question) {

            return;
        }

        question.addEventListener(
            "click",
            () => {

                item.classList.toggle(
                    "active"
                );
            }
        );
    });

    /* =====================================================
       PRODUCT IMAGE
       ===================================================== */

    const productImage =
        document.getElementById(
            "productImage"
        );

    if (productImage) {

        productImage.addEventListener(
            "click",
            () => {

                productImage.classList.toggle(
                    "zoomed"
                );
            }
        );
    }

    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".glass-card, .section-heading, .about-content"
        );

    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

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
                    threshold:
                        0.12
                }
            );

        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );
            }
        );
    }

    /* =====================================================
       PAGE LOADER
       ===================================================== */

    const pageLoader =
        document.getElementById(
            "pageLoader"
        );

    if (pageLoader) {

        window.addEventListener(
            "load",
            () => {

                pageLoader.classList.add(
                    "hidden"
                );

                setTimeout(
                    () => {

                        pageLoader.style.display =
                            "none";

                    },
                    500
                );
            }
        );
    }

    /* =====================================================
       HEADER SCROLL
       ===================================================== */

    const siteHeader =
        document.querySelector(
            ".site-header"
        );

    if (siteHeader) {

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY > 50
                ) {

                    siteHeader.classList.add(
                        "scrolled"
                    );

                } else {

                    siteHeader.classList.remove(
                        "scrolled"
                    );
                }
            }
        );
    }

    /* =====================================================
       YEAR
       ===================================================== */

    const yearElement =
        document.getElementById(
            "year"
        );

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();
    }

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
