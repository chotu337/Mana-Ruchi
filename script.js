```javascript
/* =========================================================
   🌶️ MANA MASALA - COMPLETE ORDER SYSTEM
   Supabase + Order Saving + Owner Notification
   Professional Order Confirmation
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

        if (
            !window.supabase ||
            typeof window.supabase.createClient !== "function"
        ) {

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


    const paymentConfirmed =
        document.getElementById("paymentConfirmed");


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
       SUCCESS MODAL ELEMENTS
    ===================================================== */

    const successModal =
        document.getElementById("successModal");


    const modalOrderId =
        document.getElementById("orderId");


    const modalQuantity =
        document.getElementById("successQuantity");


    const modalTotal =
        document.getElementById("successTotal");


    const continueBtn =
        document.getElementById("continueBtn");


    const successCloseBtn =
        document.getElementById("successCloseBtn");


    const modalClose =
        document.getElementById("modalClose");


    const whatsappOrderButton =
        document.getElementById(
            "whatsappOrderButton"
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
            message ? "block" : "none";


        if (type === "error") {

            orderMessage.style.color =
                "#ff6b5f";

        } else if (type === "success") {

            orderMessage.style.color =
                "#72e68a";

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
            Number.isNaN(quantity) ||
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
       PLUS BUTTON
    ===================================================== */

    if (increaseBtn) {

        increaseBtn.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const quantity =
                    getQuantity();


                if (quantityInput) {

                    quantityInput.value =
                        quantity + 1;
                }


                updateTotal();

            }
        );

    }


    /* =====================================================
       MINUS BUTTON
    ===================================================== */

    if (decreaseBtn) {

        decreaseBtn.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const quantity =
                    getQuantity();


                if (quantityInput) {

                    quantityInput.value =
                        Math.max(
                            MIN_QUANTITY,
                            quantity - 1
                        );
                }


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


    /* =====================================================
       INITIAL TOTAL
    ===================================================== */

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
       ORDER REFERENCE
    ===================================================== */

    function createOrderReference() {

        const now =
            new Date();


        const date =
            now.getTime();


        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return `MM-${date}-${random}`;
    }


    /* =====================================================
       SHOW PROFESSIONAL SUCCESS MODAL
    ===================================================== */

    function showSuccessModal(
        orderReference,
        quantity,
        total,
        customerNameValue,
        customerPhoneValue,
        customerAddress
    ) {

        if (!successModal) {

            console.warn(
                "⚠️ successModal not found"
            );

            return;
        }


        /* -----------------------------------------------
           ORDER ID
        ----------------------------------------------- */

        if (modalOrderId) {

            modalOrderId.textContent =
                orderReference;
        }


        /* -----------------------------------------------
           QUANTITY
        ----------------------------------------------- */

        if (modalQuantity) {

            modalQuantity.textContent =
                `${quantity} KG`;
        }


        /* -----------------------------------------------
           TOTAL
        ----------------------------------------------- */

        if (modalTotal) {

            modalTotal.textContent =
                formatCurrency(total);
        }


        /* -----------------------------------------------
           WHATSAPP
        ----------------------------------------------- */

        const whatsappMessage =
            "🌶️ Mana Masala Order\n\n" +
            `Order ID: ${orderReference}\n` +
            `Name: ${customerNameValue}\n` +
            `Phone: ${customerPhoneValue}\n` +
            `Quantity: ${quantity} KG\n` +
            `Total: ${formatCurrency(total)}\n` +
            `Address: ${customerAddress}`;


        const whatsappUrl =
            `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
                whatsappMessage
            )}`;


        if (whatsappOrderButton) {

            whatsappOrderButton.href =
                whatsappUrl;

            whatsappOrderButton.style.display =
                "flex";
        }


        /* -----------------------------------------------
           SHOW MODAL
        ----------------------------------------------- */

        successModal.classList.remove(
            "hidden"
        );


        successModal.classList.add(
            "active"
        );


        successModal.style.display =
            "flex";


        document.body.style.overflow =
            "hidden";


        console.log(
            "✅ Professional confirmation displayed"
        );

    }


    /* =====================================================
       CLOSE SUCCESS MODAL
    ===================================================== */

    function closeSuccessModal() {

        if (!successModal) {

            return;
        }


        successModal.classList.remove(
            "active"
        );


        successModal.classList.add(
            "hidden"
        );


        successModal.style.display =
            "none";


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       MODAL CLOSE BUTTONS
    ===================================================== */

    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            closeSuccessModal
        );
    }


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


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE CARD
    ===================================================== */

    if (successModal) {

        successModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.classList.contains(
                        "success-overlay"
                    )
                ) {

                    closeSuccessModal();
                }

            }
        );

    }


    /* =====================================================
       ESC KEY CLOSE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                successModal &&
                successModal.classList.contains("active")
            ) {

                closeSuccessModal();
            }

        }
    );


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


        /* -----------------------------------------------
           SUPABASE CHECK
        ----------------------------------------------- */

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


        /* -----------------------------------------------
           CUSTOMER DATA
        ----------------------------------------------- */

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


        /* -----------------------------------------------
           LOG DATA
        ----------------------------------------------- */

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


        /* -----------------------------------------------
           VALIDATION
        ----------------------------------------------- */

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


        /* -----------------------------------------------
           PAYMENT CONFIRMATION
        ----------------------------------------------- */

        if (
            paymentConfirmed &&
            !paymentConfirmed.checked
        ) {

            showOrderMessage(
                "Please confirm that you have made the payment using the QR code.",
                "error"
            );


            paymentConfirmed.focus();


            return;
        }


        /* -----------------------------------------------
           DISABLE BUTTON
        ----------------------------------------------- */

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
           ORDER REFERENCE
        ================================================= */

        const orderReference =
            createOrderReference();


        console.log(
            "🆔 Order reference:",
            orderReference
        );


        /* =================================================
           DATABASE ORDER
           
           IMPORTANT:
           These are ONLY your existing table columns.
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
           INSERT INTO SUPABASE
        ================================================= */

        try {

            console.log(
                "📤 Inserting order into Supabase..."
            );


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


            const notificationOrder = {

                ...order,

                order_reference:
                    orderReference,

                notes:
                    customerNotes

            };


            const {
                data: notificationData,
                error: notificationError
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
             * IMPORTANT:
             * The order is already saved.
             * Notification failure should NOT
             * make the customer's order fail.
             */

            console.error(
                "⚠️ Notification error:",
                notificationError
            );
        }


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        showOrderMessage(
            "Order placed successfully!",
            "success"
        );


        /* =================================================
           PROFESSIONAL SUCCESS MODAL
        ================================================= */

        showSuccessModal(
            orderReference,
            quantity,
            total,
            name,
            cleanPhone,
            customerAddress
        );


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


        console.log(
            "🎉 ORDER COMPLETED SUCCESSFULLY"
        );

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
       BUTTON FALLBACK
    ===================================================== */

    if (orderButton) {

        console.log(
            "✅ Place Order button FOUND"
        );


        /*
         * If the button is type="submit",
         * the form handles it.
         */

        if (
            orderButton.type !==
            "submit"
        ) {

            orderButton.addEventListener(
                "click",
                placeOrder
            );

        }

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
       PRODUCT IMAGE ZOOM
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
       CURRENT YEAR
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


    console.log(
        "💳 Payment confirmation: ENABLED"
    );


    console.log(
        "✨ Professional order confirmation: ENABLED"
    );

});
```
