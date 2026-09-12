/* =========================================================
   MANA MASALA
   CUSTOMER ORDER SYSTEM
   Supabase + Email Notification
   ========================================================= */
"use strict";
/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
/* Product settings */
const PRODUCT_PRICE = 350;
const MINIMUM_ORDER_KG = 10;
/* Owner WhatsApp */
const OWNER_WHATSAPP = "918367450301";
/* Supabase library check */
if (typeof supabase === "undefined") {
    console.error(
        "Supabase library was not loaded. Check the Supabase CDN script in index.html."
    );
    alert(
        "Website connection error. Please refresh the page."
    );
    throw new Error("Supabase library not loaded.");
}
/* Create Supabase client */
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
/* =========================================================
   2. PAGE ELEMENTS
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
   3. PAGE LOADER
   ========================================================= */
window.addEventListener("load", function () {
    const loader =
        document.getElementById("pageLoader");
    if (loader) {
        setTimeout(function () {
            loader.classList.add("hidden");
        }, 500);
    }
});
/* =========================================================
   4. MOBILE MENU
   ========================================================= */
const menuButton =
    document.getElementById("menuBtn");
const navigation =
    document.getElementById("navMenu");
if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
        navigation.classList.toggle("active");
    });
    navigation
        .querySelectorAll("a")
        .forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("active");
            });
        });
}
/* =========================================================
   5. QUANTITY / PRICE CALCULATION
   ========================================================= */
function updatePrice() {
    if (!quantityInput) {
        return;
    }
    const quantity =
        Number(quantityInput.value);
    const total =
        quantity > 0
            ? quantity * PRODUCT_PRICE
            : 0;
    const totalElement =
        document.getElementById("totalAmount");
    if (totalElement) {
        totalElement.textContent =
            "₹" + total.toLocaleString("en-IN");
    }
}
if (quantityInput) {
    quantityInput.addEventListener(
        "input",
        updatePrice
    );
    quantityInput.addEventListener(
        "change",
        updatePrice
    );
    updatePrice();
}
/* =========================================================
   6. PHONE NUMBER VALIDATION
   ========================================================= */
function isValidPhone(phone) {
    /*
       Accepts Indian 10-digit mobile numbers.
       Spaces and +91 are handled below.
    */
    const cleaned =
        phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
        return /^[6-9]\d{9}$/.test(cleaned);
    }
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
   7. GENERATE CUSTOMER DISPLAY ORDER ID
   ========================================================= */
function generateDisplayOrderId() {
    const timestamp =
        Date.now().toString();
    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );
    return (
        "MM" +
        timestamp.slice(-7) +
        random
    );
}
/* =========================================================
   8. SHOW SUCCESS MODAL
   ========================================================= */
function showSuccessModal(displayOrderId) {
    if (orderIdElement) {
        orderIdElement.textContent =
            displayOrderId;
    }
    if (successModal) {
        successModal.classList.add("show");
        successModal.style.display = "flex";
    }
}
/* =========================================================
   9. CLOSE SUCCESS MODAL
   ========================================================= */
function closeSuccessModal() {
    if (successModal) {
        successModal.classList.remove("show");
        successModal.style.display = "none";
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
/* Close modal by clicking outside */
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
   10. SEND ORDER EMAIL NOTIFICATION
   ========================================================= */
async function sendOrderNotification(orderData) {
    try {
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
                    body: JSON.stringify({
                        order: orderData
                    })
                }
            );
        if (!response.ok) {
            const errorText =
                await response.text();
            console.error(
                "Notification error:",
                errorText
            );
            return false;
        }
        const result =
            await response.json().catch(
                function () {
                    return {};
                }
            );
        console.log(
            "Order notification result:",
            result
        );
        return true;
    } catch (error) {
        console.error(
            "Notification request failed:",
            error
        );
        return false;
    }
}
/* =========================================================
   11. SUBMIT ORDER
   ========================================================= */
if (orderForm) {
    orderForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();
            /* -----------------------------------------
               Get values
               ----------------------------------------- */
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
               Validate customer name
               ----------------------------------------- */
            if (!customerName) {
                alert(
                    "Please enter your name."
                );
                if (customerNameInput) {
                    customerNameInput.focus();
                }
                return;
            }
            if (customerName.length < 2) {
                alert(
                    "Please enter a valid name."
                );
                if (customerNameInput) {
                    customerNameInput.focus();
                }
                return;
            }
            /* -----------------------------------------
               Validate phone
               ----------------------------------------- */
            if (!phone) {
                alert(
                    "Please enter your mobile number."
                );
                if (phoneInput) {
                    phoneInput.focus();
                }
                return;
            }
            if (!isValidPhone(phone)) {
                alert(
                    "Please enter a valid Indian mobile number."
                );
                if (phoneInput) {
                    phoneInput.focus();
                }
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
                if (quantityInput) {
                    quantityInput.focus();
                }
                return;
            }
            /* -----------------------------------------
               Validate address
               ----------------------------------------- */
            if (!address) {
                alert(
                    "Please enter your delivery address."
                );
                if (addressInput) {
                    addressInput.focus();
                }
                return;
            }
            if (address.length < 10) {
                alert(
                    "Please enter a complete delivery address."
                );
                if (addressInput) {
                    addressInput.focus();
                }
                return;
            }
            /* -----------------------------------------
               Calculate total
               ----------------------------------------- */
            const totalAmount =
                quantity * PRODUCT_PRICE;
            /* -----------------------------------------
               Customer display order ID
               ----------------------------------------- */
            const displayOrderId =
                generateDisplayOrderId();
            /* -----------------------------------------
               Disable submit button
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
            /* -----------------------------------------
               EXACT DATABASE COLUMNS
               orders table:
               id
               customer_name
               customer_phone
               quantity_kg
               address
               total_amount
               status
               created_at
               Do NOT send:
               product
               order_id
               notes
               ----------------------------------------- */
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
            /* -----------------------------------------
               INSERT INTO SUPABASE
               
               IMPORTANT:
               Do NOT use .select() here because
               public customers may have INSERT
               permission but not SELECT permission.
               ----------------------------------------- */
            const {
                error
            } =
                await supabaseClient
                    .from("orders")
                    .insert([
                        orderData
                    ]);
            /* -----------------------------------------
               Handle database error
               ----------------------------------------- */
            if (error) {
                console.error(
                    "Supabase order error:",
                    error
                );
                if (submitOrderButton) {
                    submitOrderButton.disabled =
                        false;
                    submitOrderButton.innerHTML =
                        originalButtonText;
                }
                alert(
                    "Order could not be completed.\n\n" +
                    "Please try again later."
                );
                return;
            }
            /* -----------------------------------------
               Order saved successfully
               ----------------------------------------- */
            console.log(
                "Order successfully saved."
            );
            /* -----------------------------------------
               Prepare notification data
               ----------------------------------------- */
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
            /* -----------------------------------------
               Send owner email notification
               If notification fails, the order
               remains safely stored in Supabase.
               ----------------------------------------- */
            sendOrderNotification(
                notificationData
            ).then(
                function (success) {
                    if (success) {
                        console.log(
                            "Owner notification sent."
                        );
                    } else {
                        console.warn(
                            "Order saved, but owner notification failed."
                        );
                    }
                }
            );
            /* -----------------------------------------
               Reset form
               ----------------------------------------- */
            orderForm.reset();
            updatePrice();
            /* -----------------------------------------
               Restore button
               ----------------------------------------- */
            if (submitOrderButton) {
                submitOrderButton.disabled =
                    false;
                submitOrderButton.innerHTML =
                    originalButtonText;
            }
            /* -----------------------------------------
               Show customer confirmation
               ----------------------------------------- */
            showSuccessModal(
                displayOrderId
            );
            /* -----------------------------------------
               Log order information
               ----------------------------------------- */
            console.log(
                "Customer order:",
                {
                    orderId:
                        displayOrderId,
                    customer:
                        customerName,
                    phone:
                        phone,
                    quantity:
                        quantity,
                    total:
                        totalAmount
                }
            );
        }
    );
}
/* =========================================================
   12. WHATSAPP HELPER
   ========================================================= */
function openWhatsApp() {
    const message =
        "Hello Mana Masala! I would like to order homemade chilli powder.";
    const url =
        "https://wa.me/" +
        OWNER_WHATSAPP +
        "?text=" +
        encodeURIComponent(message);
    window.open(
        url,
        "_blank"
    );
}
/* =========================================================
   13. FLOATING WHATSAPP BUTTON
   ========================================================= */
const whatsappButtons =
    document.querySelectorAll(
        ".whatsapp-btn, .whatsapp-button, [data-whatsapp]"
    );
whatsappButtons.forEach(
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
/* =========================================================
   14. IMAGE ZOOM
   ========================================================= */
const productImage =
    document.querySelector(
        ".product-image img, .hero-product-image img, #productImage"
    );
if (productImage) {
    productImage.addEventListener(
        "click",
        function () {
            productImage.classList.toggle(
                "zoomed"
            );
        }
    );
}
/* =========================================================
   15. FAQ ACCORDION
   ========================================================= */
const faqItems =
    document.querySelectorAll(
        ".faq-question, .faq-header"
    );
faqItems.forEach(
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
/* =========================================================
   16. SCROLL REVEAL
   ========================================================= */
const revealElements =
    document.querySelectorAll(
        ".reveal, .fade-in, .animate-on-scroll"
    );
if (
    revealElements.length > 0 &&
    "IntersectionObserver" in window
) {
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
    revealElements.forEach(
        function (element) {
            observer.observe(
                element
            );
        }
    );
} else {
    revealElements.forEach(
        function (element) {
            element.classList.add(
                "visible"
            );
        }
    );
}
/* =========================================================
   17. SMOOTH SCROLL
   ========================================================= */
document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        function (link) {
            link.addEventListener(
                "click",
                function (event) {
                    const targetId =
                        link.getAttribute("href");
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
/* =========================================================
   18. CONSOLE INFORMATION
   ========================================================= */
console.log(
    "Mana Masala website script loaded successfully."
);
console.log(
    "Product price: ₹" +
    PRODUCT_PRICE +
    "/kg"
);
console.log(
    "Minimum order: " +
    MINIMUM_ORDER_KG +
    " kg"
);
