/* =========================================================
   MANA MASALA - CUSTOMER ORDER SYSTEM
   Supabase + Email Notification
========================================================= */
/* =========================================================
   SUPABASE CONFIG
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
/* =========================================================
   PAGE LOADER
========================================================= */
window.addEventListener("load", () => {
    const loader =
        document.getElementById("pageLoader");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("hidden");
        }, 500);
    }
});
/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */
const header =
    document.querySelector(".site-header");
window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
/* =========================================================
   MOBILE MENU
========================================================= */
const menuToggle =
    document.getElementById("menuToggle");
const navLinks =
    document.getElementById("navLinks");
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}
document.querySelectorAll(".nav-links a")
    .forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks) {
                navLinks.classList.remove("open");
            }
        });
    });
/* =========================================================
   PRODUCT IMAGE ZOOM
========================================================= */
const productImage =
    document.getElementById("productImage");
if (productImage) {
    productImage.addEventListener(
        "mousemove",
        event => {
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
                "scale(1.12)";
        }
    );
    productImage.addEventListener(
        "mouseleave",
        () => {
            productImage.style.transform =
                "scale(1)";
        }
    );
}
/* =========================================================
   QUANTITY + PRICE
========================================================= */
const quantityInput =
    document.getElementById("quantity");
const increaseBtn =
    document.getElementById("increaseBtn");
const decreaseBtn =
    document.getElementById("decreaseBtn");
const totalPrice =
    document.getElementById("totalPrice");
const PRICE_PER_KG = 350;
const MINIMUM_KG = 10;
function formatCurrency(amount) {
    return "₹" +
        Number(amount).toLocaleString("en-IN");
}
function updatePrice() {
    if (!quantityInput || !totalPrice) {
        return;
    }
    let quantity =
        parseInt(
            quantityInput.value,
            10
        );
    if (
        Number.isNaN(quantity) ||
        quantity < MINIMUM_KG
    ) {
        quantity = MINIMUM_KG;
        quantityInput.value =
            MINIMUM_KG;
    }
    totalPrice.textContent =
        formatCurrency(
            quantity * PRICE_PER_KG
        );
}
if (increaseBtn) {
    increaseBtn.addEventListener(
        "click",
        () => {
            let quantity =
                parseInt(
                    quantityInput.value,
                    10
                ) || MINIMUM_KG;
            quantity += 1;
            quantityInput.value =
                quantity;
            updatePrice();
        }
    );
}
if (decreaseBtn) {
    decreaseBtn.addEventListener(
        "click",
        () => {
            let quantity =
                parseInt(
                    quantityInput.value,
                    10
                ) || MINIMUM_KG;
            if (quantity > MINIMUM_KG) {
                quantity -= 1;
            }
            quantityInput.value =
                quantity;
            updatePrice();
        }
    );
}
if (quantityInput) {
    quantityInput.addEventListener(
        "input",
        updatePrice
    );
}
updatePrice();
/* =========================================================
   FAQ ACCORDION
========================================================= */
const faqItems =
    document.querySelectorAll(".faq-item");
faqItems.forEach(item => {
    const question =
        item.querySelector(".faq-question");
    const answer =
        item.querySelector(".faq-answer");
    if (!question || !answer) {
        return;
    }
    question.addEventListener(
        "click",
        () => {
            const alreadyOpen =
                item.classList.contains("active");
            faqItems.forEach(otherItem => {
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
            });
            if (!alreadyOpen) {
                item.classList.add(
                    "active"
                );
                answer.style.maxHeight =
                    answer.scrollHeight + "px";
            }
        }
    );
});
/* =========================================================
   ORDER ID
========================================================= */
function generateOrderId() {
    const timestamp =
        Date.now()
        .toString()
        .slice(-8);
    return "MM" + timestamp;
}
/* =========================================================
   ORDER FORM
========================================================= */
const orderForm =
    document.getElementById("orderForm");
const submitOrder =
    document.getElementById("submitOrder");
const successModal =
    document.getElementById("successModal");
const orderIdElement =
    document.getElementById("orderId");
const modalClose =
    document.getElementById("modalClose");
const continueBtn =
    document.getElementById("continueBtn");
if (orderForm) {
    orderForm.addEventListener(
        "submit",
        async event => {
            event.preventDefault();
            /* -----------------------------------------
               GET CUSTOMER DETAILS
            ----------------------------------------- */
            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();
            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();
            const address =
                document
                    .getElementById(
                        "address"
                    )
                    .value
                    .trim();
            const notes =
                document
                    .getElementById(
                        "notes"
                    )
                    .value
                    .trim();
            const quantity =
                parseInt(
                    quantityInput.value,
                    10
                );
            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */
            if (!name) {
                alert(
                    "Please enter your name."
                );
                return;
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                alert(
                    "Please enter a valid 10-digit phone number."
                );
                return;
            }
            if (!address) {
                alert(
                    "Please enter your delivery address."
                );
                return;
            }
            if (
                Number.isNaN(quantity) ||
                quantity < MINIMUM_KG
            ) {
                alert(
                    "Minimum order quantity is 10 KG."
                );
                return;
            }
            const amount =
                quantity *
                PRICE_PER_KG;
            const generatedOrderId =
                generateOrderId();
            /* -----------------------------------------
               BUTTON
            ----------------------------------------- */
            submitOrder.disabled =
                true;
            submitOrder.innerHTML =
                "⏳ Placing Order...";
            try {
                /* =====================================
                   INSERT ORDER INTO SUPABASE
                ===================================== */
                const { data, error } =
                    await supabaseClient
                        .from("orders")
                        .insert([
                            {
                                order_id:
                                    generatedOrderId,
                                customer_name:
                                    name,
                                customer_phone:
                                    phone,
                                address:
                                    address,
                                product:
                                    "Mana Masala Homemade Chilli Powder",
                                quantity_kg:
                                    quantity,
                                total_amount:
                                    amount,
                                notes:
                                    notes,
                                status:
                                    "Pending"
                            }
                        ])
                        .select()
                        .single();
                /* =====================================
                   DATABASE ERROR
                ===================================== */
                if (error) {
                    console.error(
                        "Supabase order error:",
                        error
                    );
                    throw new Error(
                        error.message
                    );
                }
                console.log(
                    "✅ Order saved:",
                    data
                );
                /* =====================================
                   SEND OWNER EMAIL
                ===================================== */
                try {
                    const {
                        data: notificationData,
                        error: notificationError
                    } =
                        await supabaseClient
                            .functions
                            .invoke(
                                "send-order-notification",
                                {
                                    body: {
                                        order: data
                                    }
                                }
                            );
                    if (notificationError) {
                        console.error(
                            "Email notification error:",
                            notificationError
                        );
                    } else {
                        console.log(
                            "✅ Email notification:",
                            notificationData
                        );
                    }
                } catch (
                    notificationException
                ) {
                    /*
                     * IMPORTANT:
                     * Email failure must NOT
                     * delete the order.
                     */
                    console.error(
                        "Notification exception:",
                        notificationException
                    );
                }
                /* =====================================
                   SAVE TEMPORARY ORDER INFORMATION
                ===================================== */
                sessionStorage.setItem(
                    "manaMasalaOrder",
                    JSON.stringify({
                        orderId:
                            generatedOrderId,
                        name:
                            name,
                        phone:
                            phone,
                        address:
                            address,
                        notes:
                            notes,
                        quantity:
                            quantity,
                        amount:
                            amount
                    })
                );
                /* =====================================
                   SHOW SUCCESS
                ===================================== */
                if (orderIdElement) {
                    orderIdElement.textContent =
                        generatedOrderId;
                }
                if (successModal) {
                    successModal.classList.add(
                        "show"
                    );
                    successModal.setAttribute(
                        "aria-hidden",
                        "false"
                    );
                }
                /* =====================================
                   RESET FORM
                ===================================== */
                orderForm.reset();
                quantityInput.value =
                    MINIMUM_KG;
                updatePrice();
            } catch (error) {
                console.error(
                    "❌ ORDER FAILED:",
                    error
                );
                alert(
                    "Order could not be completed.\n\n" +
                    "Please try again later."
                );
            } finally {
                submitOrder.disabled =
                    false;
                submitOrder.innerHTML =
                    "🛒 Place Order";
            }
        }
    );
}
/* =========================================================
   CLOSE SUCCESS MODAL
========================================================= */
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
        event => {
            if (
                event.target ===
                successModal
            ) {
                closeModal();
            }
        }
    );
}
/* =========================================================
   ESCAPE KEY
========================================================= */
document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            successModal &&
            successModal.classList.contains("show")
        ) {
            closeModal();
        }
    }
);
/* =========================================================
   CURRENT YEAR
========================================================= */
const yearElement =
    document.getElementById("year");
if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}
/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealElements =
    document.querySelectorAll(
        ".glass-card, .section-heading, .about-content"
    );
if ("IntersectionObserver" in window) {
    const revealObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
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
                });
            },
            {
                threshold: 0.12
            }
        );
    revealElements.forEach(element => {
        element.style.opacity =
            "0";
        element.style.transform =
            "translateY(25px)";
        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";
        revealObserver.observe(
            element
        );
    });
}
/* =========================================================
   SMOOTH ANCHOR SCROLL
========================================================= */
document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {
    anchor.addEventListener(
        "click",
        function(event) {
            const targetId =
                this.getAttribute(
                    "href"
                );
            if (
                targetId === "#" ||
                !targetId
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
});
console.log(
    "🌶️ Mana Masala customer system loaded."
);
