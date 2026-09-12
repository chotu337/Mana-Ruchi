/* =========================================================
   MANA MASALA - PREMIUM WEBSITE JAVASCRIPT
========================================================= */
/* =========================================================
   PAGE LOADER
========================================================= */
window.addEventListener("load", () => {
    const loader =
        document.getElementById("pageLoader");
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 500);
});
/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */
const header =
    document.querySelector(".site-header");
window.addEventListener("scroll", () => {
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
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});
/* Close mobile menu after clicking a link */
document.querySelectorAll(".nav-links a")
    .forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
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
        (event) => {
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
        amount.toLocaleString("en-IN");
}
function updatePrice() {
    let quantity =
        parseInt(quantityInput.value, 10);
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
increaseBtn.addEventListener("click", () => {
    let quantity =
        parseInt(quantityInput.value, 10) || MINIMUM_KG;
    quantity += 1;
    quantityInput.value =
        quantity;
    updatePrice();
});
decreaseBtn.addEventListener("click", () => {
    let quantity =
        parseInt(quantityInput.value, 10) || MINIMUM_KG;
    if (quantity > MINIMUM_KG) {
        quantity -= 1;
    } else {
        quantity =
            MINIMUM_KG;
    }
    quantityInput.value =
        quantity;
    updatePrice();
});
quantityInput.addEventListener(
    "input",
    updatePrice
);
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
    question.addEventListener(
        "click",
        () => {
            const alreadyOpen =
                item.classList.contains("active");
            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
                const otherAnswer =
                    otherItem.querySelector(
                        ".faq-answer"
                    );
                otherAnswer.style.maxHeight =
                    null;
            });
            if (!alreadyOpen) {
                item.classList.add("active");
                answer.style.maxHeight =
                    answer.scrollHeight + "px";
            }
        }
    );
});
/* =========================================================
   ORDER ID GENERATOR
========================================================= */
function generateOrderId() {
    const timestamp =
        Date.now()
        .toString()
        .slice(-6);
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
const orderId =
    document.getElementById("orderId");
const modalClose =
    document.getElementById("modalClose");
const continueBtn =
    document.getElementById("continueBtn");
orderForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();
        const name =
            document
                .getElementById("customerName")
                .value
                .trim();
        const phone =
            document
                .getElementById("phone")
                .value
                .trim();
        const address =
            document
                .getElementById("address")
                .value
                .trim();
        const notes =
            document
                .getElementById("notes")
                .value
                .trim();
        const quantity =
            parseInt(
                quantityInput.value,
                10
            );
        if (!name) {
            alert("Please enter your name.");
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
        if (quantity < MINIMUM_KG) {
            alert(
                "Minimum order quantity is 10 KG."
            );
            return;
        }
        const amount =
            quantity * PRICE_PER_KG;
        const generatedId =
            generateOrderId();
        /*
         * IMPORTANT:
         *
         * This frontend version generates the order
         * confirmation locally.
         *
         * Your existing Supabase order insertion
         * should be connected here.
         */
        submitOrder.disabled =
            true;
        submitOrder.innerHTML =
            "⏳ Processing...";
        try {
            /*
             * Simulated short processing delay.
             *
             * Replace this section with your existing
             * Supabase INSERT code.
             */
            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        700
                    )
            );
            orderId.textContent =
                generatedId;
            successModal.classList.add("show");
            successModal.setAttribute(
                "aria-hidden",
                "false"
            );
            /*
             * Optional WhatsApp message.
             *
             * This opens WhatsApp for the CUSTOMER.
             * It does NOT automatically send the message.
             */
            const message =
                `Hello Mana Masala,%0A%0A` +
                `I placed an order.%0A` +
                `Order ID: ${generatedId}%0A` +
                `Name: ${name}%0A` +
                `Quantity: ${quantity} KG%0A` +
                `Total: ${formatCurrency(amount)}%0A%0A` +
                `Please confirm my order.`;
            /*
             * Store message temporarily so it can be
             * used if needed later.
             */
            sessionStorage.setItem(
                "manaMasalaOrder",
                JSON.stringify({
                    orderId: generatedId,
                    name: name,
                    phone: phone,
                    address: address,
                    notes: notes,
                    quantity: quantity,
                    amount: amount,
                    whatsappMessage: message
                })
            );
            orderForm.reset();
            quantityInput.value =
                MINIMUM_KG;
            updatePrice();
        } catch (error) {
            console.error(
                "Order error:",
                error
            );
            alert(
                "Order could not be completed. Please try again later."
            );
        } finally {
            submitOrder.disabled =
                false;
            submitOrder.innerHTML =
                "🛒 Place Order";
        }
    }
);
/* =========================================================
   CLOSE MODAL
========================================================= */
function closeModal() {
    successModal.classList.remove(
        "show"
    );
    successModal.setAttribute(
        "aria-hidden",
        "true"
    );
}
modalClose.addEventListener(
    "click",
    closeModal
);
continueBtn.addEventListener(
    "click",
    closeModal
);
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
/* =========================================================
   ESCAPE KEY
========================================================= */
document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            successModal.classList.contains("show")
        ) {
            closeModal();
        }
    }
);
/* =========================================================
   CURRENT YEAR
========================================================= */
document.getElementById("year")
    .textContent =
        new Date().getFullYear();
/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealElements =
    document.querySelectorAll(
        ".glass-card, .section-heading, .about-content"
    );
const revealObserver =
    new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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
    element.style.opacity = "0";
    element.style.transform =
        "translateY(25px)";
    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";
    revealObserver.observe(element);
});
/* =========================================================
   SMOOTH ANCHOR FALLBACK
========================================================= */
document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {
    anchor.addEventListener(
        "click",
        function(event) {
            const targetId =
                this.getAttribute("href");
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
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    );
});
