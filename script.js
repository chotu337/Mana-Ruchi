/* =========================================
   MANA RUCHI - ORDER SYSTEM
========================================= */

const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const PRICE_PER_KG = 400;
const MINIMUM_QUANTITY = 10;
const OWNER_WHATSAPP = "918367450301";


/* =========================================
   SUPABASE CONNECTION
========================================= */

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================
   GET HTML ELEMENTS
========================================= */

const orderForm = document.getElementById("orderForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const quantityInput =
    document.getElementById("quantity");

const addressInput =
    document.getElementById("address");

const totalPrice =
    document.getElementById("totalPrice");

const summaryQuantity =
    document.getElementById("summaryQuantity");

const orderMessage =
    document.getElementById("orderMessage");

const placeOrderButton =
    document.getElementById("placeOrderButton");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");


/* =========================================
   MESSAGE FUNCTION
========================================= */

function showMessage(message, type = "success") {

    if (!orderMessage) {
        alert(message);
        return;
    }

    orderMessage.textContent = message;

    orderMessage.className = "";

    orderMessage.classList.add(type);
}


/* =========================================
   UPDATE TOTAL
========================================= */

function updateTotal() {

    let quantity =
        Number(quantityInput.value);

    if (isNaN(quantity) || quantity < MINIMUM_QUANTITY) {
        quantity = MINIMUM_QUANTITY;
        quantityInput.value = quantity;
    }

    const total =
        quantity * PRICE_PER_KG;

    if (summaryQuantity) {
        summaryQuantity.textContent =
            quantity + " kg";
    }

    if (totalPrice) {
        totalPrice.textContent =
            "₹" + total.toLocaleString("en-IN");
    }
}


/* =========================================
   QUANTITY BUTTONS
========================================= */

if (decreaseQuantity) {

    decreaseQuantity.addEventListener(
        "click",
        function () {

            let quantity =
                Number(quantityInput.value);

            quantity -= 1;

            if (quantity < MINIMUM_QUANTITY) {
                quantity = MINIMUM_QUANTITY;
            }

            quantityInput.value = quantity;

            updateTotal();
        }
    );
}


if (increaseQuantity) {

    increaseQuantity.addEventListener(
        "click",
        function () {

            let quantity =
                Number(quantityInput.value);

            quantity += 1;

            quantityInput.value = quantity;

            updateTotal();
        }
    );
}


/* =========================================
   MANUAL QUANTITY CHANGE
========================================= */

if (quantityInput) {

    quantityInput.addEventListener(
        "input",
        updateTotal
    );
}


/* =========================================
   ORDER SUBMISSION
========================================= */

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const quantity =
                Number(quantityInput.value);

            const customerAddress =
                addressInput.value.trim();


            /* -----------------------------
               VALIDATION
            ----------------------------- */

            if (!name) {

                showMessage(
                    "Please enter your name.",
                    "error"
                );

                return;
            }


            if (!phone) {

                showMessage(
                    "Please enter your phone number.",
                    "error"
                );

                return;
            }


            if (!/^[0-9]{10}$/.test(phone)) {

                showMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                return;
            }


            if (
                isNaN(quantity) ||
                quantity < MINIMUM_QUANTITY
            ) {

                showMessage(
                    "Minimum order is 10 kg.",
                    "error"
                );

                return;
            }


            if (!customerAddress) {

                showMessage(
                    "Please enter your delivery address.",
                    "error"
                );

                return;
            }


            /* -----------------------------
               CALCULATE TOTAL
            ----------------------------- */

            const totalAmount =
                quantity * PRICE_PER_KG;


            /* -----------------------------
               DISABLE BUTTON
            ----------------------------- */

            if (placeOrderButton) {

                placeOrderButton.disabled = true;

                placeOrderButton.textContent =
                    "Placing Order...";
            }


            showMessage(
                "Please wait, placing your order...",
                "success"
            );


            try {

                console.log(
                    "Sending order to Supabase..."
                );


                /* -----------------------------
                   SAVE ORDER
                ----------------------------- */

                const { data, error } =
                    await db
                        .from("orders")
                        .insert([
                            {
                                customer_name: name,
                                customer_phone: phone,
                                quantity: quantity,
                                address: customerAddress,
                                price_per_kg: PRICE_PER_KG,
                                total_amount: totalAmount,
                                status: "Pending"
                            }
                        ])
                        .select()
                        .single();


                /* -----------------------------
                   CHECK SUPABASE ERROR
                ----------------------------- */

                if (error) {

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    showMessage(
                        "Order failed: " +
                        error.message,
                        "error"
                    );

                    return;
                }


                console.log(
                    "ORDER SAVED:",
                    data
                );


                /* -----------------------------
                   SUCCESS MESSAGE
                ----------------------------- */

                showMessage(
                    "✅ Order confirmed! Order ID: " +
                    data.id +
                    " | Total: ₹" +
                    totalAmount.toLocaleString("en-IN"),
                    "success"
                );


                /* -----------------------------
                   WHATSAPP MESSAGE
                ----------------------------- */

                const whatsappText =
                    `🌶️ Mana Ruchi Order

Order ID: ${data.id}

Customer Name: ${name}
Phone: ${phone}
Quantity: ${quantity} kg
Price: ₹${PRICE_PER_KG}/kg
Total Amount: ₹${totalAmount}
Address: ${customerAddress}

Status: Pending

Thank you for ordering from Mana Ruchi!`;


                const whatsappURL =
                    "https://wa.me/" +
                    OWNER_WHATSAPP +
                    "?text=" +
                    encodeURIComponent(whatsappText);


                /* -----------------------------
                   OPEN WHATSAPP
                ----------------------------- */

                setTimeout(function () {

                    window.open(
                        whatsappURL,
                        "_blank"
                    );

                }, 500);


                /* -----------------------------
                   RESET FORM
                ----------------------------- */

                orderForm.reset();

                quantityInput.value =
                    MINIMUM_QUANTITY;

                updateTotal();

            }

            catch (error) {

                console.error(
                    "ORDER ERROR:",
                    error
                );

                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );

            }

            finally {

                if (placeOrderButton) {

                    placeOrderButton.disabled = false;

                    placeOrderButton.textContent =
                        "Place Order";
                }
            }
        }
    );
}


/* =========================================
   FLOATING WHATSAPP
========================================= */

const floatingWhatsApp =
    document.getElementById("floatingWhatsApp");

if (floatingWhatsApp) {

    floatingWhatsApp.addEventListener(
        "click",
        function () {

            window.open(
                "https://wa.me/" +
                OWNER_WHATSAPP,
                "_blank"
            );

        }
    );
}


/* =========================================
   WHATSAPP SHARE
========================================= */

const shareWhatsApp =
    document.getElementById("shareWhatsApp");

if (shareWhatsApp) {

    shareWhatsApp.addEventListener(
        "click",
        function () {

            const shareText =
                "🌶️ Check out Mana Ruchi Homemade Chilli Powder!";

            window.open(
                "https://wa.me/?text=" +
                encodeURIComponent(shareText),
                "_blank"
            );

        }
    );
}


/* =========================================
   INITIAL TOTAL
========================================= */

updateTotal();

console.log(
    "Mana Ruchi Order System Loaded Successfully"
);
