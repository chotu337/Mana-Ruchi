/* =========================================================
   🌶️ MANA MASALA
   ORDER SYSTEM
   Supabase + Email Notification + Professional Confirmation
========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";

const PRICE_PER_KG = 350;
const MIN_QUANTITY = 10;
const OWNER_WHATSAPP = "918367450301";


document.addEventListener("DOMContentLoaded", async () => {

    console.log("🌶️ Mana Masala script.js loaded");
    console.log("📦 Order system starting...");


    /* =====================================================
       SUPABASE
    ===================================================== */

    if (!window.supabase) {
        console.error("❌ Supabase library not loaded");
        return;
    }

    const db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("✅ Supabase client created");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const orderForm =
        document.getElementById("orderForm");

    const nameInput =
        document.getElementById("customerName");

    const phoneInput =
        document.getElementById("customerPhone") ||
        document.getElementById("phone");

    const addressInput =
        document.getElementById("address");

    const notesInput =
        document.getElementById("notes");

    const quantityInput =
        document.getElementById("quantity");

    const minusBtn =
        document.getElementById("minusBtn") ||
        document.getElementById("decreaseBtn") ||
        document.getElementById("decreaseQuantity");

    const plusBtn =
        document.getElementById("plusBtn") ||
        document.getElementById("increaseBtn") ||
        document.getElementById("increaseQuantity");

    const totalAmount =
        document.getElementById("totalAmount");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const orderSubmit =
        document.getElementById("orderSubmit") ||
        document.getElementById("submitOrder") ||
        document.getElementById("placeOrderButton");

    const submitLoading =
        document.getElementById("submitLoading");

    const paymentConfirmed =
        document.getElementById("paymentConfirmed");

    /* Support BOTH possible error IDs */
    const orderMessage =
        document.getElementById("orderMessage") ||
        document.getElementById("orderError");


    /* =====================================================
       SUCCESS MODAL ELEMENTS
    ===================================================== */

    const successModal =
        document.getElementById("successModal");

    const successCloseBtn =
        document.getElementById("successCloseBtn");

    const modalClose =
        document.getElementById("modalClose");

    const continueBtn =
        document.getElementById("continueBtn");

    const orderIdElement =
        document.getElementById("orderId");

    const successQuantity =
        document.getElementById("successQuantity");

    const successTotal =
        document.getElementById("successTotal");

    const whatsappOrderButton =
        document.getElementById("whatsappOrderButton");


    /* =====================================================
       CHECK IMPORTANT ELEMENTS
    ===================================================== */

    console.log("Form:", !!orderForm);
    console.log("Quantity:", !!quantityInput);
    console.log("Submit:", !!orderSubmit);
    console.log("Success Modal:", !!successModal);


    /* =====================================================
       HELPERS
    ===================================================== */

    function formatCurrency(amount) {

        return "₹" + Number(amount).toLocaleString("en-IN");

    }


    function showOrderMessage(message, type = "error") {

        if (!orderMessage) {
            console.log(message);
            return;
        }

        orderMessage.textContent = message;

        orderMessage.className =
            type === "success"
                ? "order-message success"
                : "order-message error";

    }


    function clearOrderMessage() {

        if (!orderMessage) return;

        orderMessage.textContent = "";

    }


    /* =====================================================
       QUANTITY
    ===================================================== */

    function getQuantity() {

        let quantity =
            parseInt(quantityInput?.value, 10);

        if (isNaN(quantity)) {
            quantity = MIN_QUANTITY;
        }

        if (quantity < MIN_QUANTITY) {
            quantity = MIN_QUANTITY;
        }

        return quantity;

    }


    function updateTotal() {

        if (!quantityInput) return;

        const quantity = getQuantity();

        quantityInput.value = quantity;

        const total =
            quantity * PRICE_PER_KG;

        if (totalAmount) {

            totalAmount.textContent =
                formatCurrency(total);

        }

        if (paymentAmount) {

            paymentAmount.textContent =
                formatCurrency(total);

        }

        console.log(
            `💰 ${quantity} KG × ₹${PRICE_PER_KG} = ${formatCurrency(total)}`
        );

        return total;

    }


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


    if (minusBtn) {

        minusBtn.addEventListener("click", (event) => {

            event.preventDefault();

            const current =
                getQuantity();

            const newQuantity =
                Math.max(
                    MIN_QUANTITY,
                    current - 1
                );

            quantityInput.value =
                newQuantity;

            updateTotal();

        });

    }


    if (plusBtn) {

        plusBtn.addEventListener("click", (event) => {

            event.preventDefault();

            const current =
                getQuantity();

            quantityInput.value =
                current + 1;

            updateTotal();

        });

    }


    updateTotal();


    /* =====================================================
       ORDER REFERENCE
    ===================================================== */

    function createOrderReference() {

        const timestamp =
            Date.now().toString().slice(-8);

        const random =
            Math.floor(
                100 + Math.random() * 900
            );

        return `MM-${timestamp}-${random}`;

    }


    /* =====================================================
       SHOW PROFESSIONAL SUCCESS MODAL
    ===================================================== */

    function showSuccessModal(
        orderReference,
        quantity,
        total,
        customerName,
        customerPhone,
        customerAddress
    ) {

        console.log(
            "🎉 Showing professional confirmation:",
            orderReference
        );


        if (!successModal) {

            console.error(
                "❌ successModal not found in index.html"
            );

            return;

        }


        /* Order ID */

        if (orderIdElement) {

            orderIdElement.textContent =
                orderReference;

        }


        /* Quantity */

        if (successQuantity) {

            successQuantity.textContent =
                `${quantity} KG`;

        }


        /* Total */

        if (successTotal) {

            successTotal.textContent =
                formatCurrency(total);

        }


        /* WhatsApp */

        if (whatsappOrderButton) {

            const whatsappMessage =
                "🌶️ Mana Masala Order\n\n" +
                `Order ID: ${orderReference}\n` +
                `Name: ${customerName}\n` +
                `Phone: ${customerPhone}\n` +
                `Quantity: ${quantity} KG\n` +
                `Total: ${formatCurrency(total)}\n` +
                `Address: ${customerAddress}`;

            whatsappOrderButton.href =
                `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
                    whatsappMessage
                )}`;

        }


        /* OPEN MODAL */

        successModal.classList.remove("hidden");

        successModal.classList.add("active");

        successModal.style.display = "flex";

        document.body.classList.add(
            "success-modal-open"
        );


        console.log(
            "✅ Confirmation modal opened"
        );

    }


    /* =====================================================
       CLOSE SUCCESS MODAL
    ===================================================== */

    function closeSuccessModal() {

        if (!successModal) return;

        successModal.classList.remove("active");

        successModal.classList.add("hidden");

        successModal.style.display = "none";

        document.body.classList.remove(
            "success-modal-open"
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


    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            closeSuccessModal
        );

    }


    if (successModal) {

        successModal.addEventListener(
            "click",
            (event) => {

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


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSuccessModal();

            }

        }
    );


    /* =====================================================
       FORM SUBMIT
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
                "📦 Order form submitted"
            );


            clearOrderMessage();


            /* ---------------------------------------------
               CUSTOMER DETAILS
            --------------------------------------------- */

            const customerName =
                nameInput?.value.trim() || "";

            const customerPhone =
                phoneInput?.value.trim() || "";

            const customerAddress =
                addressInput?.value.trim() || "";

            const customerNotes =
                notesInput?.value.trim() || "";


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!customerName) {

                showOrderMessage(
                    "Please enter your name."
                );

                nameInput?.focus();

                return;

            }


            const cleanPhone =
                customerPhone.replace(
                    /\D/g,
                    ""
                );


            if (
                cleanPhone.length !== 10
            ) {

                showOrderMessage(
                    "Please enter a valid 10-digit mobile number."
                );

                phoneInput?.focus();

                return;

            }


            if (!customerAddress) {

                showOrderMessage(
                    "Please enter your delivery address."
                );

                addressInput?.focus();

                return;

            }


            const quantity =
                getQuantity();


            if (quantity < MIN_QUANTITY) {

                showOrderMessage(
                    `Minimum order is ${MIN_QUANTITY} KG.`
                );

                return;

            }


            /* ---------------------------------------------
               PAYMENT CHECK
            --------------------------------------------- */

            if (
                paymentConfirmed &&
                !paymentConfirmed.checked
            ) {

                showOrderMessage(
                    "Please confirm that you have completed the payment."
                );

                paymentConfirmed.focus();

                return;

            }


            const total =
                quantity * PRICE_PER_KG;


            /* ---------------------------------------------
               ORDER REFERENCE
            --------------------------------------------- */

            const orderReference =
                createOrderReference();


            /* ---------------------------------------------
               DATABASE OBJECT
               IMPORTANT:
               Only existing Supabase columns are used.
            --------------------------------------------- */

            const order = {

                customer_name:
                    customerName,

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
                "📤 Saving order:",
                order
            );


            /* ---------------------------------------------
               LOADING STATE
            --------------------------------------------- */

            if (orderSubmit) {

                orderSubmit.disabled = true;

            }


            if (submitLoading) {

                submitLoading.style.display =
                    "inline";

            }


            try {

                /* =========================================
                   SAVE TO SUPABASE
                ========================================= */

                const { data, error } =
                    await db
                        .from("orders")
                        .insert(order)
                        .select()
                        .single();


                if (error) {

                    console.error(
                        "❌ Supabase order error:",
                        error
                    );

                    throw error;

                }


                console.log(
                    "✅ Order saved:",
                    data
                );


                /* =========================================
                   SEND OWNER NOTIFICATION
                ========================================= */

                const notificationOrder = {

                    ...order,

                    order_reference:
                        orderReference,

                    notes:
                        customerNotes

                };


                try {

                    console.log(
                        "📩 Sending owner notification..."
                    );


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

                        console.warn(
                            "⚠️ Notification error:",
                            notificationError
                        );

                    } else {

                        console.log(
                            "✅ Notification response:",
                            notificationData
                        );

                    }

                } catch (notificationError) {

                    /*
                     * IMPORTANT:
                     * Notification failure must NOT
                     * make the already-saved order
                     * appear as failed.
                     */

                    console.warn(
                        "⚠️ Notification failed, but order was saved:",
                        notificationError
                    );

                }


                /* =========================================
                   RESET FORM
                ========================================= */

                orderForm.reset();


                if (quantityInput) {

                    quantityInput.value =
                        MIN_QUANTITY;

                }


                updateTotal();


                /* =========================================
                   PROFESSIONAL CONFIRMATION
                ========================================= */

                showSuccessModal(
                    orderReference,
                    quantity,
                    total,
                    customerName,
                    cleanPhone,
                    customerAddress
                );


                console.log(
                    "🎉 ORDER COMPLETED SUCCESSFULLY"
                );


            } catch (error) {

                console.error(
                    "❌ ORDER FAILED:",
                    error
                );


                showOrderMessage(
                    "Order could not be completed. Please try again later."
                );


            } finally {

                if (orderSubmit) {

                    orderSubmit.disabled = false;

                }

                if (submitLoading) {

                    submitLoading.style.display =
                        "none";

                }

            }

        }
    );


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
            () => {

                navLinks.classList.toggle(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       FAQ
    ===================================================== */

    document
        .querySelectorAll(".faq-question")
        .forEach((question) => {

            question.addEventListener(
                "click",
                () => {

                    const item =
                        question.closest(
                            ".faq-item"
                        );

                    if (!item) return;

                    item.classList.toggle(
                        "active"
                    );

                }
            );

        });


    /* =====================================================
       YEAR
    ===================================================== */

    const yearElement =
        document.getElementById("year");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    console.log(
        "🌶️ Mana Masala order system ready"
    );

});
