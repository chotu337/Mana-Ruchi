/* =====================================================
   MANA RUCHI - ORDER SYSTEM
===================================================== */

console.log("Mana Ruchi script loaded");


/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";

const SUPABASE_ANON_KEY =
    "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";


/* =====================================================
   SETTINGS
===================================================== */

const PRICE_PER_KG = 400;

const MINIMUM_QUANTITY = 10;

const OWNER_WHATSAPP = "918367450301";


/* =====================================================
   CHECK SUPABASE
===================================================== */

if (
    typeof window.supabase === "undefined"
) {

    console.error(
        "Supabase library was not loaded."
    );

}


/* =====================================================
   CREATE SUPABASE CLIENT
===================================================== */

const db =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =====================================================
   GET ELEMENTS
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
   CHECK HTML ELEMENTS
===================================================== */

console.log("Order form:", orderForm);

console.log(
    "Place order button:",
    placeOrderButton
);


/* =====================================================
   UPDATE SUMMARY
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

    summaryQuantity.textContent =
        qty + " kg";

    totalPrice.textContent =
        "₹" +
        total.toLocaleString("en-IN");
}


/* =====================================================
   DECREASE QUANTITY
===================================================== */

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


/* =====================================================
   INCREASE QUANTITY
===================================================== */

increaseQuantity.addEventListener(
    "click",
    function () {

        let qty =
            parseInt(quantity.value) ||
            MINIMUM_QUANTITY;

        qty++;

        quantity.value = qty;

        updateSummary();

    }
);


/* =====================================================
   QUANTITY INPUT
===================================================== */

quantity.addEventListener(
    "input",
    updateSummary
);


/* =====================================================
   INITIAL SUMMARY
===================================================== */

updateSummary();


/* =====================================================
   SHOW ERROR
===================================================== */

function showError(message) {

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

            <p>
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
   PLACE ORDER
===================================================== */

orderForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        console.log(
            "Place Order button clicked"
        );


        /* =============================================
           GET VALUES
        ============================================= */

        const name =
            customerName.value.trim();

        const phone =
            customerPhone.value.trim();

        const qty =
            parseInt(quantity.value);

        const customerAddress =
            address.value.trim();


        /* =============================================
           VALIDATION
        ============================================= */

        if (!name) {

            showError(
                "Please enter your name."
            );

            return;
        }


        if (
            !/^[0-9]{10}$/.test(phone)
        ) {

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
                "Minimum order quantity is 10 kg."
            );

            return;
        }


        if (!customerAddress) {

            showError(
                "Please enter your delivery address."
            );

            return;
        }


        /* =============================================
           TOTAL
        ============================================= */

        const total =
            qty * PRICE_PER_KG;


        /* =============================================
           ORDER NUMBER
        ============================================= */

        const orderNumber =
            "MR-" +
            Date.now()
                .toString()
                .slice(-8);


        /* =============================================
           BUTTON LOADING
        ============================================= */

        placeOrderButton.disabled =
            true;

        placeOrderButton.innerHTML =
            "⏳ Placing Order...";


        try {

            console.log(
                "Attempting Supabase insert..."
            );


            /* =========================================
               INSERT
            ========================================= */

            const result =
                await db
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


            console.log(
                "Supabase result:",
                result
            );


            /* =========================================
               DATABASE ERROR
            ========================================= */

            if (result.error) {

                console.error(
                    "DATABASE ERROR:",
                    result.error
                );

                showError(
                    "Order could not be saved. Please check your Supabase settings."
                );

                return;
            }


            /* =========================================
               SUCCESS
            ========================================= */

            showSuccess(
                name,
                orderNumber,
                qty,
                total
            );


            /* =========================================
               WHATSAPP
            ========================================= */

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


            setTimeout(
                function () {

                    window.open(
                        whatsappURL,
                        "_blank"
                    );

                },
                1000
            );


            /* =========================================
               RESET FORM
            ========================================= */

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

            placeOrderButton.disabled =
                false;

            placeOrderButton.innerHTML =
                "🛒 Place Order";
        }

    }
);


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
