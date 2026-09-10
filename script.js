/* =====================================================
   MANA RUCHI - CUSTOMER ORDER SYSTEM
===================================================== */

const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

const PRICE_PER_KG = 400;
const MINIMUM_QUANTITY = 10;
const OWNER_WHATSAPP = "918367450301";

/* =====================================================
   SUPABASE
===================================================== */

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

/* =====================================================
   ELEMENTS
===================================================== */

const orderForm = document.getElementById("orderForm");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const quantity = document.getElementById("quantity");
const address = document.getElementById("address");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");

const summaryQuantity =
    document.getElementById("summaryQuantity");

const totalPrice =
    document.getElementById("totalPrice");

const orderMessage =
    document.getElementById("orderMessage");

const placeOrderButton =
    document.getElementById("placeOrderButton");

/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    updateSummary();
});

/* =====================================================
   QUANTITY
===================================================== */

function updateSummary() {

    let qty = parseInt(quantity?.value);

    if (isNaN(qty) || qty < MINIMUM_QUANTITY) {
        qty = MINIMUM_QUANTITY;

        if (quantity) {
            quantity.value = qty;
        }
    }

    const total = qty * PRICE_PER_KG;

    if (summaryQuantity) {
        summaryQuantity.textContent = qty + " kg";
    }

    if (totalPrice) {
        totalPrice.textContent =
            "₹" + total.toLocaleString("en-IN");
    }
}

/* =====================================================
   DECREASE
===================================================== */

if (decreaseQuantity) {

    decreaseQuantity.addEventListener("click", function () {

        let qty = parseInt(quantity.value) || MINIMUM_QUANTITY;

        if (qty > MINIMUM_QUANTITY) {
            qty--;
            quantity.value = qty;
        }

        updateSummary();
    });
}

/* =====================================================
   INCREASE
===================================================== */

if (increaseQuantity) {

    increaseQuantity.addEventListener("click", function () {

        let qty = parseInt(quantity.value) || MINIMUM_QUANTITY;

        qty++;

        quantity.value = qty;

        updateSummary();
    });
}

/* =====================================================
   MANUAL QUANTITY CHANGE
===================================================== */

if (quantity) {

    quantity.addEventListener("input", function () {
        updateSummary();
    });
}

/* =====================================================
   ORDER FORM
===================================================== */

if (orderForm) {

    orderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearMessage();

        const name =
            customerName.value.trim();

        const phone =
            customerPhone.value.trim();

        const qty =
            parseInt(quantity.value);

        const customerAddress =
            address.value.trim();

        /* =================================================
           VALIDATION
        ================================================= */

        if (!name) {
            showError("Please enter your name.");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            showError(
                "Please enter a valid 10-digit mobile number."
            );
            return;
        }

        if (
            isNaN(qty) ||
            qty < MINIMUM_QUANTITY
        ) {
            showError(
                "Minimum order quantity is " +
                MINIMUM_QUANTITY +
                " kg."
            );
            return;
        }

        if (!customerAddress) {
            showError(
                "Please enter your delivery address."
            );
            return;
        }

        /* =================================================
           TOTAL
        ================================================= */

        const total =
            qty * PRICE_PER_KG;

        /* =================================================
           ORDER NUMBER
        ================================================= */

        const orderNumber =
            "MR-" +
            Date.now().toString().slice(-8);

        /* =================================================
           BUTTON
        ================================================= */

        const originalText =
            placeOrderButton.innerHTML;

        placeOrderButton.disabled = true;

        placeOrderButton.innerHTML =
            "⏳ Placing Order...";

        try {

            console.log("Sending order to Supabase...");

            /* =================================================
               INSERT ORDER
            ================================================= */

            const { error } =
                await db
                    .from("orders")
                    .insert([
                        {
                            order_id: orderNumber,
                            customer_name: name,
                            phone: phone,
                            quantity: qty,
                            address: customerAddress,
                            price_per_kg: PRICE_PER_KG,
                            total_amount: total,
                            product_name:
                                "Mana Ruchi Homemade Chilli Powder",
                            status: "New"
                        }
                    ]);

            /* =================================================
               ERROR
            ================================================= */

            if (error) {

                console.error(
                    "SUPABASE ERROR:",
                    error
                );

                showError(
                    "Order could not be placed. Please try again."
                );

                return;
            }

            /* =================================================
               SUCCESS
            ================================================= */

            console.log(
                "ORDER SUCCESS:",
                orderNumber
            );

            orderMessage.style.display = "block";

            orderMessage.innerHTML = `
                <div class="order-success-box">

                    <div class="success-icon">
                        ✅
                    </div>

                    <h2>
                        Your Order is Confirmed!
                    </h2>

                    <p>
                        Thank you, <strong>${escapeHTML(name)}</strong>.
                    </p>

                    <p>
                        <strong>Order Number:</strong>
                        ${orderNumber}
                    </p>

                    <p>
                        <strong>Quantity:</strong>
                        ${qty} kg
                    </p>

                    <p>
                        <strong>Total Amount:</strong>
                        ₹${total.toLocaleString("en-IN")}
                    </p>

                    <p class="success-note">
                        We will contact you regarding your delivery.
                    </p>

                </div>
            `;

            /* =================================================
               SCROLL TO SUCCESS MESSAGE
            ================================================= */

            orderMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            /* =================================================
               WHATSAPP
            ================================================= */

            const whatsappText =
                `🌶️ NEW MANA RUCHI ORDER\n\n` +
                `Order No: ${orderNumber}\n` +
                `Customer: ${name}\n` +
                `Phone: ${phone}\n` +
                `Quantity: ${qty} kg\n` +
                `Total: ₹${total}\n` +
                `Address: ${customerAddress}`;

            const whatsappURL =
                "https://wa.me/" +
                OWNER_WHATSAPP +
                "?text=" +
                encodeURIComponent(whatsappText);

            /*
             * Small delay so the confirmation message
             * appears before WhatsApp opens.
             */

            setTimeout(function () {

                window.open(
                    whatsappURL,
                    "_blank"
                );

            }, 1000);

            /* =================================================
               RESET FORM
            ================================================= */

            orderForm.reset();

            quantity.value =
                MINIMUM_QUANTITY;

            updateSummary();

        } catch (error) {

            console.error(
                "ORDER ERROR:",
                error
            );

            showError(
                "Something went wrong. Please try again."
            );

        } finally {

            placeOrderButton.disabled = false;

            placeOrderButton.innerHTML =
                originalText;
        }
    });
}

/* =====================================================
   SUCCESS / ERROR STYLING
===================================================== */

function clearMessage() {

    if (!orderMessage) return;

    orderMessage.style.display = "none";
    orderMessage.innerHTML = "";
}

/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    if (!orderMessage) return;

    orderMessage.style.display = "block";

    orderMessage.innerHTML = `
        <div class="order-error-box">
            ❌ ${message}
        </div>
    `;

    orderMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
