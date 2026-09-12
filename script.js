/* =========================================================
   MANA MASALA - CUSTOMER ORDER SYSTEM
   Supabase + Email Notification
   ORDERS TABLE:
   id
   customer_name
   customer_phone
   quantity_kg
   address
   total_amount
   status
   created_at
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const OWNER_WHATSAPP = "918367450301";
const PRODUCT_PRICE = 350;
const MIN_QUANTITY = 10;
/* =========================================================
   SUPABASE
========================================================= */
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
/* =========================================================
   DOM
========================================================= */
const orderForm = document.getElementById("orderForm");
const customerNameInput =
    document.getElementById("customerName");
const phoneInput =
    document.getElementById("phone");
const addressInput =
    document.getElementById("address");
const quantityInput =
    document.getElementById("quantity");
const submitOrderButton =
    document.getElementById("submitOrder");
const successModal =
    document.getElementById("successModal");
const orderIdElement =
    document.getElementById("orderId");
const modalClose =
    document.getElementById("modalClose");
const continueButton =
    document.getElementById("continueBtn");
/* =========================================================
   PAGE LOADER
========================================================= */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
});
/* =========================================================
   MOBILE NAVIGATION
========================================================= */
const menuToggle =
    document.querySelector(".menu-toggle");
const navLinks =
    document.querySelector(".nav-links");
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}
/* =========================================================
   QUANTITY + PRICE
========================================================= */
function updateTotal() {
    if (!quantityInput) return;
    let quantity =
        parseFloat(quantityInput.value);
    if (isNaN(quantity) || quantity < 0) {
        quantity = 0;
    }
    const total =
        quantity * PRODUCT_PRICE;
    const totalElement =
        document.getElementById("totalPrice");
    if (totalElement) {
        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;
    }
}
/* Quantity input */
if (quantityInput) {
    quantityInput.addEventListener(
        "input",
        updateTotal
    );
    updateTotal();
}
/* =========================================================
   ORDER FORM
========================================================= */
if (orderForm) {
    orderForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();
            /* -----------------------------------------
               GET VALUES
            ----------------------------------------- */
            const customerName =
                customerNameInput?.value.trim();
            const phone =
                phoneInput?.value.trim();
            const address =
                addressInput?.value.trim();
            const quantity =
                parseFloat(quantityInput?.value);
            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */
            if (!customerName) {
                alert("Please enter your name.");
                customerNameInput?.focus();
                return;
            }
            if (!phone) {
                alert("Please enter your phone number.");
                phoneInput?.focus();
                return;
            }
            const cleanPhone =
                phone.replace(/\D/g, "");
            if (cleanPhone.length < 10) {
                alert("Please enter a valid phone number.");
                phoneInput?.focus();
                return;
            }
            if (!quantity || quantity < MIN_QUANTITY) {
                alert(
                    `Minimum order quantity is ${MIN_QUANTITY} kg.`
                );
                quantityInput?.focus();
                return;
            }
            if (!address) {
                alert("Please enter your address.");
                addressInput?.focus();
                return;
            }
            /* -----------------------------------------
               TOTAL
            ----------------------------------------- */
            const totalAmount =
                quantity * PRODUCT_PRICE;
            /* -----------------------------------------
               BUTTON LOADING
            ----------------------------------------- */
            const originalButtonText =
                submitOrderButton
                    ? submitOrderButton.innerHTML
                    : "Place Order";
            if (submitOrderButton) {
                submitOrderButton.disabled = true;
                submitOrderButton.innerHTML =
                    "Placing Order...";
            }
            try {
                /* -------------------------------------
                   DATABASE PAYLOAD
                   IMPORTANT:
                   Only columns that actually exist
                   in your database are used.
                ------------------------------------- */
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
                /* -------------------------------------
                   INSERT ORDER
                   We intentionally DO NOT use .select()
                   here because public customers should
                   not need SELECT permission.
                ------------------------------------- */
                const { error } =
                    await supabaseClient
                        .from("orders")
                        .insert([orderData]);
                if (error) {
                    console.error(
                        "Supabase order error:",
                        error
                    );
                    throw new Error(
                        error.message ||
                        "Could not save order."
                    );
                }
                /* -------------------------------------
                   CREATE CUSTOMER-FACING ORDER ID
                   This is a display ID only.
                   The real database ID remains
                   in the orders table.
                ------------------------------------- */
                const displayOrderId =
                    "MM" +
                    Date.now()
                        .toString()
                        .slice(-8);
                /* -------------------------------------
                   SHOW SUCCESS MODAL
                ------------------------------------- */
                if (orderIdElement) {
                    orderIdElement.textContent =
                        displayOrderId;
                }
                if (successModal) {
                    successModal.style.display =
                        "flex";
                }
                /* -------------------------------------
                   EMAIL NOTIFICATION
                   If email notification fails,
                   the order is NOT deleted.
                   The order has already been saved.
                ------------------------------------- */
                try {
                    const notificationPayload = {
                        display_order_id:
                            displayOrderId,
                        order: {
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
                        }
                    };
                    const {
                        error: functionError
                    } =
                        await supabaseClient.functions.invoke(
                            "send-order-notification",
                            {
                                body:
                                    notificationPayload
                            }
                        );
                    if (functionError) {
                        console.warn(
                            "Email notification failed:",
                            functionError
                        );
                    }
                } catch (notificationError) {
                    console.warn(
                        "Notification error:",
                        notificationError
                    );
                }
                /* -------------------------------------
                   RESET FORM
                ------------------------------------- */
                orderForm.reset();
                updateTotal();
            } catch (error) {
                console.error(
                    "ORDER ERROR:",
                    error
                );
                alert(
                    "Order could not be completed. Please try again later."
                );
            } finally {
                if (submitOrderButton) {
                    submitOrderButton.disabled =
                        false;
                    submitOrderButton.innerHTML =
                        originalButtonText;
                }
            }
        }
    );
}
/* =========================================================
   SUCCESS MODAL
========================================================= */
function closeSuccessModal() {
    if (successModal) {
        successModal.style.display =
            "none";
    }
}
if (modalClose) {
    modalClose.addEventListener(
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
if (successModal) {
    successModal.addEventListener(
        "click",
        function (event) {
            if (event.target === successModal) {
                closeSuccessModal();
            }
        }
    );
}
/* =========================================================
   WHATSAPP ORDER MESSAGE
========================================================= */
function openWhatsAppOrder() {
    const name =
        customerNameInput?.value.trim() || "";
    const phone =
        phoneInput?.value.trim() || "";
    const quantity =
        quantityInput?.value || "";
    const address =
        addressInput?.value.trim() || "";
    const total =
        Number(quantity || 0) * PRODUCT_PRICE;
    const message =
        `Hello Mana Masala,%0A%0A` +
        `I would like to place an order.%0A%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Phone: ${encodeURIComponent(phone)}%0A` +
        `Quantity: ${encodeURIComponent(quantity)} kg%0A` +
        `Address: ${encodeURIComponent(address)}%0A` +
        `Total: ₹${total.toLocaleString("en-IN")}`;
    window.open(
        `https://wa.me/${OWNER_WHATSAPP}?text=${message}`,
        "_blank"
    );
}
/* =========================================================
   IMAGE ZOOM
========================================================= */
document
    .querySelectorAll(".product-image")
    .forEach(image => {
        image.addEventListener(
            "click",
            () => {
                image.classList.toggle(
                    "zoomed"
                );
            }
        );
    });
/* =========================================================
   FAQ
========================================================= */
document
    .querySelectorAll(".faq-question")
    .forEach(question => {
        question.addEventListener(
            "click",
            () => {
                const answer =
                    question.nextElementSibling;
                if (!answer) return;
                answer.classList.toggle(
                    "active"
                );
            }
        );
    });
/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealElements =
    document.querySelectorAll(
        ".reveal, .fade-in, .scroll-reveal"
    );
if ("IntersectionObserver" in window) {
    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "visible"
                        );
                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.15
            }
        );
    revealElements.forEach(element => {
        observer.observe(element);
    });
}
