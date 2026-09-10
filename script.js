/* =====================================================
   MANA RUCHI - CUSTOMER ORDER SYSTEM
===================================================== */

console.log("🌶️ Mana Ruchi script loaded");


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";


/* =====================================================
   SHOP SETTINGS
===================================================== */

const PRICE_PER_KG = 400;
const MINIMUM_QUANTITY = 10;
const OWNER_WHATSAPP = "918367450301";


/* =====================================================
   CHECK SUPABASE LIBRARY
===================================================== */

if (typeof window.supabase === "undefined") {

    console.error(
        "❌ Supabase library was not loaded."
    );

} else {

    console.log(
        "✅ Supabase library loaded."
    );
}


/* =====================================================
   CREATE SUPABASE CLIENT
===================================================== */

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const orderForm =
    document.getElementById("orderForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const quantity =
    document.getElementById("quantity");

const address =
    document.getElementById("address");

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
   CHECK ELEMENTS
===================================================== */

console.log(
    "Order form:",
    orderForm
);

console.log(
    "Place order button:",
    placeOrderButton
);


/* =====================================================
   UPDATE ORDER SUMMARY
===================================================== */

function updateSummary() {

    let qty =
        parseInt(quantity.value);

    if (
        isNaN(qty) ||
        qty < MINIMUM_QUANTITY
    ) {

        qty = MINIMUM_QUANTITY;

        quantity.value = qty;
    }

    const total =
        qty * PRICE_PER_KG;

    if (summaryQuantity) {

        summaryQuantity.textContent =
            qty + " kg";
    }

    if (totalPrice) {

        totalPrice.textContent =
            "₹" +
            total.toLocaleString("en-IN");
    }
}


/* =====================================================
   DECREASE QUANTITY
===================================================== */

if (decreaseQuantity) {

    decreaseQuantity.addEventListener(
        "click",
        function () {

            let qty =
                parseInt(quantity.value);

            if (
                isNaN(qty) ||
                qty <= MINIMUM_QUANTITY
            ) {

                qty = MINIMUM_QUANTITY;

            } else {

                qty--;
            }

            quantity.value = qty;

            updateSummary();
        }
    );
}


/* =====================================================
   INCREASE QUANTITY
===================================================== */

if (increaseQuantity) {

    increaseQuantity.addEventListener(
        "click",
        function () {

            let qty =
                parseInt(quantity.value);

            if (
                isNaN(qty) ||
                qty < MINIMUM_QUANTITY
            ) {

                qty = MINIMUM_QUANTITY;
            }

            qty++;

            quantity.value = qty;

            updateSummary();
        }
    );
}


/* =====================================================
   QUANTITY INPUT
===================================================== */

if (quantity) {

    quantity.addEventListener(
        "input",
        function () {

            updateSummary();
        }
    );
}


/* =====================================================
   INITIAL SUMMARY
===================================================== */

updateSummary();


/* =====================================================
   SHOW ERROR
===================================================== */

function showError(message) {

    if (!orderMessage) return;

    orderMessage.style.display =
        "block";

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
   SHOW SUCCESS
===================================================== */

function showSuccess(
    name,
    orderNumber,
    qty,
    total
) {

    if (!orderMessage) return;

    orderMessage.style.display =
        "block";

    orderMessage.innerHTML = `

        <div class="order-success-box">

            <div class="success-icon">
                ✅
            </div>

            <h2>
                Your Order is Confirmed!
            </h2>

            <p>
                Thank you,
                <strong>
                    ${escapeHTML(name)}
                </strong>
            </p>

            <p>
                <strong>
                    Order Number:
                </strong>
                ${orderNumber}
            </p>

            <p>
                <strong>
                    Quantity:
                </strong>
                ${qty} kg
            </p>

            <p>
                <strong>
                    Total Amount:
                </strong>
                ₹${total.toLocaleString("en-IN")}
            </p>

            <p class="success-note">
                We will contact you regarding
                your delivery.
            </p>

        </div>

    `;

    orderMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =====================================================
   ORDER FORM SUBMISSION
===================================================== */

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "🛒 Place Order clicked"
            );


            /* =========================================
               CLEAR OLD MESSAGE
            ========================================= */

            if (orderMessage) {

                orderMessage.style.display =
                    "none";

                orderMessage.innerHTML =
                    "";
            }


            /* =========================================
               GET CUSTOMER DETAILS
            ========================================= */

            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const qty =
                parseInt(quantity.value);

            const customerAddress =
                address.value.trim();


            /* =========================================
               VALIDATE NAME
            ========================================= */

            if (!name) {

                showError(
                    "Please enter your name."
                );

                return;
            }


            /* =========================================
               VALIDATE PHONE
            ========================================= */

            if (
                !/^[0-9]{10}$/.test(phone)
            ) {

                showError(
                    "Please enter a valid 10-digit mobile number."
                );

                return;
            }


            /* =========================================
               VALIDATE QUANTITY
            ========================================= */

            if (
                isNaN(qty) ||
                qty < MINIMUM_QUANTITY
            ) {

                showError(
                    "Minimum order quantity is 10 kg."
                );

                return;
            }


            /* =========================================
               VALIDATE ADDRESS
            ========================================= */

            if (!customerAddress) {

                showError(
                    "Please enter your delivery address."
                );

                return;
            }


            /* =========================================
               CALCULATE TOTAL
            ========================================= */

            const total =
                qty * PRICE_PER_KG;


            /* =========================================
               CREATE ORDER NUMBER
            ========================================= */

            const orderNumber =
                "MR-" +
                Date.now()
                    .toString()
                    .slice(-8);


            /* =========================================
               DISABLE BUTTON
            ========================================= */

            if (placeOrderButton) {

                placeOrderButton.disabled =
                    true;

                placeOrderButton.innerHTML =
                    "⏳ Placing Order...";
            }


            try {

                console.log(
                    "📤 Sending order to Supabase..."
                );


                /* =====================================
                   INSERT ORDER
                ===================================== */

                const {
                    data,
                    error
                } = await db
                    .from("orders")
                    .insert([
                        {
                            order_id:
                                orderNumber,

                            customer_name:
                                name,

                            phone:
                                phone,

                            quantity:
                                qty,

                            address:
                                customerAddress,

                            price_per_kg:
                                PRICE_PER_KG,

                            total_amount:
                                total,

                            product_name:
                                "Mana Ruchi Homemade Chilli Powder",

                            status:
                                "New"
                        }
                    ]);


                /* =====================================
                   CHECK ERROR
                ===================================== */

                if (error) {

                    console.error(
                        "❌ SUPABASE ERROR:",
                        error
                    );

                    showError(
                        "Order could not be saved. Please check your Supabase table and policies."
                    );

                    return;
                }


                /* =====================================
                   SUCCESS
                ===================================== */

                console.log(
                    "✅ ORDER SAVED:",
                    orderNumber
                );

                console.log(
                    "Supabase response:",
                    data
                );


                showSuccess(
                    name,
                    orderNumber,
                    qty,
                    total
                );


                /* =====================================
                   WHATSAPP MESSAGE
                ===================================== */

                const whatsappMessage =
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
                    encodeURIComponent(
                        whatsappMessage
                    );


                /* =====================================
                   OPEN WHATSAPP
                ===================================== */

                setTimeout(
                    function () {

                        window.open(
                            whatsappURL,
                            "_blank"
                        );

                    },
                    1200
                );


                /* =====================================
                   RESET FORM
                ===================================== */

                orderForm.reset();

                quantity.value =
                    MINIMUM_QUANTITY;

                updateSummary();


            } catch (error) {

                console.error(
                    "❌ ORDER ERROR:",
                    error
                );

                showError(
                    "Something went wrong while placing the order."
                );


            } finally {

                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.innerHTML =
                        "🛒 Place Order";
                }
            }

        }
    );

} else {

    console.error(
        "❌ orderForm was not found in index.html"
    );
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
