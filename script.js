/* =========================================================
   MANA MASALA - CUSTOMER ORDER SYSTEM
   SUPABASE VERSION
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const OWNER_WHATSAPP = "918367450301";
const PRODUCT_PRICE = 350;
const MIN_QUANTITY = 10;
/* =========================================================
   CHECK SUPABASE
========================================================= */
if (!window.supabase) {
    console.error(
        "Supabase library is not loaded."
    );
    throw new Error(
        "Supabase library not loaded. Check index.html script order."
    );
}
/* =========================================================
   SUPABASE CLIENT
========================================================= */
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
console.log(
    "Mana Masala Supabase connected."
);
/* =========================================================
   DOM ELEMENTS
========================================================= */
const orderForm =
    document.getElementById("orderForm");
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
    const loader =
        document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.display =
                "none";
        }, 500);
    }
});
/* =========================================================
   MOBILE MENU
========================================================= */
const menuToggle =
    document.querySelector(".menu-toggle");
const navLinks =
    document.querySelector(".nav-links");
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
/* =========================================================
   PRICE CALCULATION
========================================================= */
function updateTotal() {
    if (!quantityInput) return;
    let quantity =
        parseFloat(
            quantityInput.value
        );
    if (
        isNaN(quantity) ||
        quantity < 0
    ) {
        quantity = 0;
    }
    const total =
        quantity * PRODUCT_PRICE;
    const totalElement =
        document.getElementById(
            "totalPrice"
        );
    if (totalElement) {
        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;
    }
}
if (quantityInput) {
    quantityInput.addEventListener(
        "input",
        updateTotal
    );
    updateTotal();
}
/* =========================================================
   PLACE ORDER
========================================================= */
if (orderForm) {
    orderForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            /* -----------------------------------------
               GET CUSTOMER DATA
            ----------------------------------------- */
            const customerName =
                customerNameInput?.value.trim() || "";
            const phone =
                phoneInput?.value.trim() || "";
            const address =
                addressInput?.value.trim() || "";
            const quantity =
                parseFloat(
                    quantityInput?.value
                );
            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */
            if (!customerName) {
                alert(
                    "Please enter your name."
                );
                customerNameInput?.focus();
                return;
            }
            if (!phone) {
                alert(
                    "Please enter your phone number."
                );
                phoneInput?.focus();
                return;
            }
            const cleanPhone =
                phone.replace(
                    /\D/g,
                    ""
                );
            if (cleanPhone.length < 10) {
                alert(
                    "Please enter a valid phone number."
                );
                phoneInput?.focus();
                return;
            }
            if (
                !quantity ||
                quantity < MIN_QUANTITY
            ) {
                alert(
                    `Minimum order quantity is ${MIN_QUANTITY} kg.`
                );
                quantityInput?.focus();
                return;
            }
            if (!address) {
                alert(
                    "Please enter your address."
                );
                addressInput?.focus();
                return;
            }
            /* -----------------------------------------
               TOTAL
            ----------------------------------------- */
            const totalAmount =
                quantity * PRODUCT_PRICE;
            /* -----------------------------------------
               BUTTON
            ----------------------------------------- */
            const oldButtonText =
                submitOrderButton
                    ? submitOrderButton.innerHTML
                    : "Place Order";
            if (submitOrderButton) {
                submitOrderButton.disabled =
                    true;
                submitOrderButton.innerHTML =
                    "Placing Order...";
            }
            try {
                /* -------------------------------------
                   DATABASE DATA
                   ONLY REAL COLUMNS
                   ARE USED.
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
                console.log(
                    "Submitting order:",
                    orderData
                );
                /* -------------------------------------
                   INSERT INTO SUPABASE
                ------------------------------------- */
                const {
                    error
                } =
                    await supabaseClient
                        .from("orders")
                        .insert([
                            orderData
                        ]);
                if (error) {
                    console.error(
                        "Supabase INSERT error:",
                        error
                    );
                    throw error;
                }
                console.log(
                    "Order successfully saved."
                );
                /* -------------------------------------
                   CUSTOMER DISPLAY ORDER ID
                   Database id is NOT requested with
                   SELECT, so public customers don't
                   need SELECT permission.
                ------------------------------------- */
                const displayOrderId =
                    "MM" +
                    Date.now()
                        .toString()
                        .slice(-8);
                /* -------------------------------------
                   SHOW SUCCESS
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
                   Email failure will NOT cancel the
                   already-saved order.
                ------------------------------------- */
                try {
                    const {
                        data:
                            notificationData,
                        error:
                            notificationError
                    } =
                        await supabaseClient
                            .functions
                            .invoke(
                                "send-order-notification",
                                {
                                    body: {
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
                                    }
                                }
                            );
                    if (notificationError) {
                        console.warn(
                            "Notification failed:",
                            notificationError
                        );
                    } else {
                        console.log(
                            "Notification sent:",
                            notificationData
                        );
                    }
                } catch (
                    notificationError
                ) {
                    console.warn(
                        "Notification exception:",
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
                        oldButtonText;
                }
            }
        }
    );
}
/* =========================================================
   SUCCESS MODAL CLOSE
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
        (event) => {
            if (
                event.target ===
                successModal
            ) {
                closeSuccessModal();
            }
        }
    );
}
/* =========================================================
   WHATSAPP BUTTON
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
        Number(quantity || 0) *
        PRODUCT_PRICE;
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
    .querySelectorAll(
        ".product-image"
    )
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
    .querySelectorAll(
        ".faq-question"
    )
    .forEach(question => {
        question.addEventListener(
            "click",
            () => {
                const answer =
                    question.nextElementSibling;
                if (answer) {
                    answer.classList.toggle(
                        "active"
                    );
                }
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
                threshold: 0.15
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
