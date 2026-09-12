/* =========================================================
   MANA MASALA
   QUANTITY + AUTOMATIC AMOUNT CALCULATION

   PRICE: ₹350 / KG
   MINIMUM ORDER: 10 KG
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const PRICE_PER_KG = 350;
    const MIN_QUANTITY = 10;

    const quantityInput = document.getElementById("quantity");
    const plusBtn = document.getElementById("plusBtn");
    const minusBtn = document.getElementById("minusBtn");
    const totalAmount = document.getElementById("totalAmount");
    const orderForm = document.getElementById("orderForm");

    /* -----------------------------------------
       Check required elements
    ----------------------------------------- */

    if (!quantityInput) {
        console.error("Quantity input not found.");
        return;
    }

    if (!plusBtn) {
        console.error("Plus button not found.");
        return;
    }

    if (!minusBtn) {
        console.error("Minus button not found.");
        return;
    }

    if (!totalAmount) {
        console.error("Total amount element not found.");
        return;
    }


    /* -----------------------------------------
       Format Indian Rupees
    ----------------------------------------- */

    function formatPrice(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }


    /* -----------------------------------------
       Get valid quantity
    ----------------------------------------- */

    function getQuantity() {

        let quantity = parseInt(
            quantityInput.value,
            10
        );

        if (
            isNaN(quantity) ||
            quantity < MIN_QUANTITY
        ) {
            quantity = MIN_QUANTITY;
        }

        quantity = Math.floor(quantity);

        return quantity;
    }


    /* -----------------------------------------
       Update quantity + amount
    ----------------------------------------- */

    function updateTotal() {

        const quantity = getQuantity();

        const total =
            quantity * PRICE_PER_KG;

        quantityInput.value = quantity;

        totalAmount.textContent =
            formatPrice(total);

        console.log(
            "Mana Masala:",
            quantity + " kg",
            "=",
            formatPrice(total)
        );
    }


    /* -----------------------------------------
       PLUS BUTTON
    ----------------------------------------- */

    plusBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            let quantity = getQuantity();

            quantity = quantity + 1;

            quantityInput.value = quantity;

            updateTotal();
        }
    );


    /* -----------------------------------------
       MINUS BUTTON
    ----------------------------------------- */

    minusBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            let quantity = getQuantity();

            if (quantity > MIN_QUANTITY) {
                quantity = quantity - 1;
            }

            quantityInput.value = quantity;

            updateTotal();
        }
    );


    /* -----------------------------------------
       MANUAL QUANTITY CHANGE
    ----------------------------------------- */

    quantityInput.addEventListener(
        "input",
        function () {

            let value = quantityInput.value;

            /*
             * Don't immediately overwrite an empty
             * input while the customer is typing.
             */

            if (value === "") {
                totalAmount.textContent = "₹0";
                return;
            }

            let quantity = parseInt(value, 10);

            if (isNaN(quantity)) {
                quantity = MIN_QUANTITY;
            }

            if (quantity < MIN_QUANTITY) {
                quantity = MIN_QUANTITY;
            }

            quantity = Math.floor(quantity);

            quantityInput.value = quantity;

            const total =
                quantity * PRICE_PER_KG;

            totalAmount.textContent =
                formatPrice(total);
        }
    );


    /* -----------------------------------------
       MANUAL CHANGE / BLUR
    ----------------------------------------- */

    quantityInput.addEventListener(
        "change",
        function () {

            updateTotal();
        }
    );


    quantityInput.addEventListener(
        "blur",
        function () {

            updateTotal();
        }
    );


    /* -----------------------------------------
       INITIAL CALCULATION
    ----------------------------------------- */

    updateTotal();


    /* -----------------------------------------
       IMPORTANT

       Do NOT put a new order-submit handler
       here if your existing Supabase /
       Edge Function order code already has one.

       Otherwise two submit handlers can conflict.
    ----------------------------------------- */

});
