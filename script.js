/* =========================================================
   MANA RUCHI - CUSTOMER ORDER SYSTEM
   Supabase + WhatsApp
========================================================= */
/* =========================================================
   1. SUPABASE CONFIGURATION
   ---------------------------------------------------------
   Replace ONLY these two values with your Supabase details.
========================================================= */
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
/* =========================================================
   2. CREATE SUPABASE CLIENT
========================================================= */
const { createClient } = supabase;
const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
/* =========================================================
   3. PRODUCT SETTINGS
========================================================= */
const PRICE_PER_KG = 400;
const MINIMUM_QUANTITY = 10;
/* =========================================================
   4. GET HTML ELEMENTS
========================================================= */
const orderForm =
    document.getElementById("orderForm");
const customerName =
    document.getElementById("customerName");
const customerPhone =
    document.getElementById("customerPhone");
const quantityInput =
    document.getElementById("quantity");
const addressInput =
    document.getElementById("address");
const decreaseButton =
    document.getElementById("decreaseQuantity");
const increaseButton =
    document.getElementById("increaseQuantity");
const summaryQuantity =
    document.getElementById("summaryQuantity");
const totalPrice =
    document.getElementById("totalPrice");
const orderMessage =
    document.getElementById("orderMessage");
const placeOrderButton =
    document.getElementById("placeOrderButton");
/* =========================================================
   5. FORMAT RUPEE
========================================================= */
function formatRupees(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}
/* =========================================================
   6. UPDATE ORDER SUMMARY
========================================================= */
function updateOrderSummary() {
    let quantity =
        parseInt(quantityInput.value, 10);
    if (isNaN(quantity) || quantity < MINIMUM_QUANTITY) {
        quantity = MINIMUM_QUANTITY;
        quantityInput.value = quantity;
    }
    const total =
        quantity * PRICE_PER_KG;
    summaryQuantity.textContent =
        `${quantity} KG`;
    totalPrice.textContent =
        formatRupees(total);
}
/* =========================================================
   7. INCREASE QUANTITY
========================================================= */
increaseButton.addEventListener("click", function () {
    let quantity =
        parseInt(quantityInput.value, 10) || MINIMUM_QUANTITY;
    quantity++;
    quantityInput.value = quantity;
    updateOrderSummary();
});
/* =========================================================
   8. DECREASE QUANTITY
========================================================= */
decreaseButton.addEventListener("click", function () {
    let quantity =
        parseInt(quantityInput.value, 10) || MINIMUM_QUANTITY;
    if (quantity > MINIMUM_QUANTITY) {
        quantity--;
    }
    quantityInput.value = quantity;
    updateOrderSummary();
});
/* =========================================================
   9. MANUAL QUANTITY CHANGE
========================================================= */
quantityInput.addEventListener("input", function () {
    let quantity =
        parseInt(quantityInput.value, 10);
    if (isNaN(quantity)) {
        return;
    }
    if (quantity < MINIMUM_QUANTITY) {
        quantity = MINIMUM_QUANTITY;
        quantityInput.value = quantity;
    }
    updateOrderSummary();
});
/* =========================================================
   10. SHOW MESSAGE
========================================================= */
function showMessage(message, type) {
    orderMessage.textContent = message;
    orderMessage.className =
        "order-message " + type;
}
/* =========================================================
   11. CLEAR MESSAGE
========================================================= */
function clearMessage() {
    orderMessage.textContent = "";
    orderMessage.className =
        "order-message";
}
/* =========================================================
   12. VALIDATE PHONE NUMBER
========================================================= */
function validatePhone(phone) {
    const cleaned =
        phone.replace(/\D/g, "");
    return (
        cleaned.length === 10 &&
        /^[6-9]/.test(cleaned)
    );
}
/* =========================================================
   13. ESCAPE WHATSAPP MESSAGE
========================================================= */
function encodeMessage(text) {
    return encodeURIComponent(text);
}
/* =========================================================
   14. CREATE WHATSAPP MESSAGE
========================================================= */
function createWhatsAppMessage(
    orderId,
    name,
    phone,
    quantity,
    total,
    address
) {
    return `
🌶️ *MANA RUCHI - NEW ORDER*
━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* ${orderId}
👤 *Customer:* ${name}
📞 *Phone:* ${phone}
🌶️ *Product:* Homemade Chilli Powder
📦 *Quantity:* ${quantity} KG
💰 *Price:* ₹${PRICE_PER_KG} / KG
💵 *Total:* ₹${total.toLocaleString("en-IN")}
📍 *Delivery Address:*
${address}
━━━━━━━━━━━━━━━━━━
Thank you for ordering from Mana Ruchi.
`;
}
/* =========================================================
   15. OPEN WHATSAPP
========================================================= */
function sendWhatsAppNotification(
    orderId,
    name,
    phone,
    quantity,
    total,
    address
) {
    /*
       IMPORTANT:
       Replace the number below with the Mana Ruchi
       owner's WhatsApp number.
       Format:
       91XXXXXXXXXX
       Do NOT use +, spaces or brackets.
    */
    const OWNER_WHATSAPP =
        "918367450301";
    const message =
        createWhatsAppMessage(
            orderId,
            name,
            phone,
            quantity,
            total,
            address
        );
    const whatsappURL =
        "https://wa.me/" +
        OWNER_WHATSAPP +
        "?text=" +
        encodeMessage(message);
    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );
}
/* =========================================================
   16. PLACE ORDER
========================================================= */
orderForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessage();
    /* ---------------------------------------------
       GET CUSTOMER DETAILS
    --------------------------------------------- */
    const name =
        customerName.value.trim();
    const phone =
        customerPhone.value.trim();
    const address =
        addressInput.value.trim();
    let quantity =
        parseInt(quantityInput.value, 10);
    /* ---------------------------------------------
       VALIDATE NAME
    --------------------------------------------- */
    if (name.length < 2) {
        showMessage(
            "Please enter your full name.",
            "error"
        );
        customerName.focus();
        return;
    }
    /* ---------------------------------------------
       VALIDATE PHONE
    --------------------------------------------- */
    if (!validatePhone(phone)) {
        showMessage(
            "Please enter a valid 10-digit Indian mobile number.",
            "error"
        );
        customerPhone.focus();
        return;
    }
    /* ---------------------------------------------
       VALIDATE QUANTITY
    --------------------------------------------- */
    if (
        isNaN(quantity) ||
        quantity < MINIMUM_QUANTITY
    ) {
        showMessage(
            "Minimum order quantity is 10 KG.",
            "error"
        );
        quantityInput.value =
            MINIMUM_QUANTITY;
        updateOrderSummary();
        quantityInput.focus();
        return;
    }
    /* ---------------------------------------------
       VALIDATE ADDRESS
    --------------------------------------------- */
    if (address.length < 10) {
        showMessage(
            "Please enter your complete delivery address.",
            "error"
        );
        addressInput.focus();
        return;
    }
    /* ---------------------------------------------
       CALCULATE TOTAL
    --------------------------------------------- */
    const total =
        quantity * PRICE_PER_KG;
    /* ---------------------------------------------
       DISABLE BUTTON
    --------------------------------------------- */
    placeOrderButton.disabled = true;
    placeOrderButton.textContent =
        "⏳ PLACING ORDER...";
    try {
        /* -----------------------------------------
           CHECK SUPABASE CONFIG
        ----------------------------------------- */
        if (
            SUPABASE_URL.includes("PASTE_YOUR") ||
            SUPABASE_ANON_KEY.includes("PASTE_YOUR")
        ) {
            throw new Error(
                "Supabase configuration has not been added."
            );
        }
        /* -----------------------------------------
           INSERT ORDER INTO SUPABASE
        ----------------------------------------- */
        const { data, error } =
            await db
                .from("orders")
                .insert([
                    {
                        customer_name: name,
                        phone: phone,
                        quantity: quantity,
                        address: address,
                        price_per_kg: PRICE_PER_KG,
                        total_amount: total,
                        product_name:
                            "Mana Ruchi Homemade Chilli Powder",
                        status: "New"
                    }
                ])
                .select()
                .single();
        /* -----------------------------------------
           HANDLE SUPABASE ERROR
        ----------------------------------------- */
        if (error) {
            console.error(
                "Supabase order error:",
                error
            );
            throw error;
        }
        /* -----------------------------------------
           ORDER ID
        ----------------------------------------- */
        const orderId =
            data.id;
        /* -----------------------------------------
           SUCCESS MESSAGE
        ----------------------------------------- */
        showMessage(
            `✅ Order placed successfully! Your Order ID is ${orderId}.`,
            "success"
        );
        /* -----------------------------------------
           WHATSAPP NOTIFICATION
        ----------------------------------------- */
        sendWhatsAppNotification(
            orderId,
            name,
            phone,
            quantity,
            total,
            address
        );
        /* -----------------------------------------
           CUSTOMER CONFIRMATION
        ----------------------------------------- */
        alert(
            "🌶️ Mana Ruchi\n\n" +
            "Your order has been placed successfully!\n\n" +
            "Order ID: " +
            orderId +
            "\n\n" +
            "Quantity: " +
            quantity +
            " KG\n\n" +
            "Total: ₹" +
            total.toLocaleString("en-IN") +
            "\n\n" +
            "Thank you for ordering!"
        );
        /* -----------------------------------------
           RESET FORM
        ----------------------------------------- */
        orderForm.reset();
        quantityInput.value =
            MINIMUM_QUANTITY;
        updateOrderSummary();
    } catch (error) {
        console.error(
            "ORDER SUBMISSION FAILED:",
            error
        );
        /* -----------------------------------------
           USER-FRIENDLY ERROR
        ----------------------------------------- */
        let message =
            "Unable to place your order right now.";
        if (
            error.message &&
            error.message.includes(
                "Supabase configuration"
            )
        ) {
            message =
                "Supabase configuration is missing. Please contact the website administrator.";
        }
        if (
            error.code === "42501"
        ) {
            message =
                "Order permission is blocked by Supabase security settings.";
        }
        if (
            error.code === "PGRST205"
        ) {
            message =
                "The orders table was not found in Supabase.";
        }
        showMessage(
            "❌ " + message,
            "error"
        );
    } finally {
        /* -----------------------------------------
           ENABLE BUTTON
        ----------------------------------------- */
        placeOrderButton.disabled = false;
        placeOrderButton.textContent =
            "🛒 PLACE ORDER";
    }
});
/* =========================================================
   17. INITIAL SUMMARY
========================================================= */
updateOrderSummary();
/* =========================================================
   18. PREVENT INVALID QUANTITY
========================================================= */
quantityInput.addEventListener(
    "blur",
    function () {
        let quantity =
            parseInt(quantityInput.value, 10);
        if (
            isNaN(quantity) ||
            quantity < MINIMUM_QUANTITY
        ) {
            quantity =
                MINIMUM_QUANTITY;
        }
        quantityInput.value =
            quantity;
        updateOrderSummary();
    }
);

2. Your Supabase table must match this

In Supabase → Table Editor, create an orders table with these columns:

Column	Type
id	bigint / identity
customer_name	text
phone	text
quantity	numeric
address	text
price_per_kg	numeric
total_amount	numeric
product_name	text
status	text
created_at	timestamp

For created_at, let Supabase give it a default of:

now()

3. Important: RLS is probably causing your error

If your website says “Please try again later”, the most likely issue is that Supabase Row Level Security is blocking the anonymous customer from inserting an order.

For a public customer order form, you need an INSERT policy on the orders table.

In Supabase, go to:

Database → Tables → orders → RLS / Policies → New Policy

Create a policy allowing INSERT for anon.

The policy should allow customers to insert orders, while your admin side should have its own authentication/security rules.

4. I also need to correct your admin dashboard

Your current index.html tells me exactly what the customer side needs, but I don’t yet have your current admin.html/admin JavaScript in this message.

The admin dashboard must query the same orders table:

Customer
   ↓
Mana Ruchi website
   ↓
Supabase "orders"
   ↓
Admin dashboard

So the customer and admin will finally see the same orders.

One thing I need from you now: open your Supabase project and send me a screenshot of Project Settings → API. I need the Project URL and anon/publishable key shown there. Don’t send any service_role/secret key.

Then I can give you the final admin.html + admin.js code matching this exact order table.
