document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // SUPABASE CONFIGURATION
    // ==========================================

    const SUPABASE_URL = "https://iwkrwidehhklaapbfful.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


    // ==========================================
    // BUSINESS SETTINGS
    // ==========================================

    const PRICE_PER_KG = 400;
    const MINIMUM_ORDER = 10;


    // ==========================================
    // GET HTML ELEMENTS
    // ==========================================

    const orderForm = document.getElementById("orderForm");

    const customerNameInput =
        document.getElementById("customerName");

    const customerPhoneInput =
        document.getElementById("customerPhone");

    const quantityInput =
        document.getElementById("quantity");

    const addressInput =
        document.getElementById("address");

    const summaryQuantity =
        document.getElementById("summaryQuantity");

    const totalPrice =
        document.getElementById("totalPrice");

    const decreaseQuantity =
        document.getElementById("decreaseQuantity");

    const increaseQuantity =
        document.getElementById("increaseQuantity");

    const orderMessage =
        document.getElementById("orderMessage");

    const placeOrderButton =
        document.getElementById("placeOrderButton");


    // ==========================================
    // CHECK REQUIRED ELEMENTS
    // ==========================================

    if (!orderForm || !quantityInput || !placeOrderButton) {
        console.error(
            "Mana Ruchi: Required order form elements are missing."
        );
        return;
    }


    // ==========================================
    // UPDATE ORDER SUMMARY
    // ==========================================

    function updateSummary() {

        let quantity = Number(quantityInput.value);

        if (
            !Number.isFinite(quantity) ||
            quantity < MINIMUM_ORDER
        ) {
            quantity = MINIMUM_ORDER;
        }

        quantity = Math.floor(quantity);

        quantityInput.value = quantity;

        const total = quantity * PRICE_PER_KG;

        if (summaryQuantity) {
            summaryQuantity.textContent =
                quantity + " KG";
        }

        if (totalPrice) {
            totalPrice.textContent =
                "₹" + total.toLocaleString("en-IN");
        }
    }


    // ==========================================
    // SHOW MESSAGE
    // ==========================================

    function showOrderMessage(message, type) {

        if (!orderMessage) {
            return;
        }

        orderMessage.textContent = message;

        if (type === "success") {
            orderMessage.style.color = "#15803d";
            orderMessage.style.backgroundColor = "#dcfce7";
            orderMessage.style.border =
                "1px solid #86efac";
            orderMessage.style.padding = "14px";
            orderMessage.style.borderRadius = "10px";
        }

        else if (type === "error") {
            orderMessage.style.color = "#b91c1c";
            orderMessage.style.backgroundColor = "#fee2e2";
            orderMessage.style.border =
                "1px solid #fca5a5";
            orderMessage.style.padding = "14px";
            orderMessage.style.borderRadius = "10px";
        }

        else {
            orderMessage.style.color = "";
            orderMessage.style.backgroundColor = "";
            orderMessage.style.border = "";
            orderMessage.style.padding = "";
            orderMessage.style.borderRadius = "";
        }
    }


    // ==========================================
    // CLEAR MESSAGE
    // ==========================================

    function clearOrderMessage() {

        if (!orderMessage) {
            return;
        }

        orderMessage.textContent = "";

        orderMessage.style.color = "";
        orderMessage.style.backgroundColor = "";
        orderMessage.style.border = "";
        orderMessage.style.padding = "";
        orderMessage.style.borderRadius = "";
    }


    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    if (decreaseQuantity) {

        decreaseQuantity.addEventListener(
            "click",
            function () {

                let quantity =
                    Number(quantityInput.value);

                if (
                    !Number.isFinite(quantity) ||
                    quantity <= MINIMUM_ORDER
                ) {
                    quantity = MINIMUM_ORDER;
                } else {
                    quantity--;
                }

                quantityInput.value = quantity;

                updateSummary();
            }
        );
    }


    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    if (increaseQuantity) {

        increaseQuantity.addEventListener(
            "click",
            function () {

                let quantity =
                    Number(quantityInput.value);

                if (!Number.isFinite(quantity)) {
                    quantity = MINIMUM_ORDER;
                }

                quantity++;

                quantityInput.value = quantity;

                updateSummary();
            }
        );
    }


    // ==========================================
    // MANUAL QUANTITY INPUT
    // ==========================================

    quantityInput.addEventListener(
        "input",
        function () {

            let value = quantityInput.value;

            // Remove decimal point and other characters
            value = value.replace(/[^\d]/g, "");

            quantityInput.value = value;

            if (value !== "") {
                updateSummary();
            }
        }
    );


    quantityInput.addEventListener(
        "blur",
        function () {

            let quantity =
                Number(quantityInput.value);

            if (
                !Number.isFinite(quantity) ||
                quantity < MINIMUM_ORDER
            ) {
                quantity = MINIMUM_ORDER;
            }

            quantity = Math.floor(quantity);

            quantityInput.value = quantity;

            updateSummary();
        }
    );


    // ==========================================
    // PHONE NUMBER INPUT
    // ==========================================

    if (customerPhoneInput) {

        customerPhoneInput.addEventListener(
            "input",
            function () {

                let phone =
                    customerPhoneInput.value;

                phone = phone.replace(/\D/g, "");

                customerPhoneInput.value = phone;
            }
        );
    }


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearOrderMessage();


            // --------------------------------------
            // GET CUSTOMER DETAILS
            // --------------------------------------

            const name =
                customerNameInput.value.trim();

            const phone =
                customerPhoneInput.value.trim();

            const address =
                addressInput.value.trim();

            const quantity =
                Number(quantityInput.value);


            // --------------------------------------
            // VALIDATE NAME
            // --------------------------------------

            if (name.length < 2) {

                showOrderMessage(
                    "❌ Please enter your full name.",
                    "error"
                );

                customerNameInput.focus();

                return;
            }


            // --------------------------------------
            // VALIDATE PHONE
            // --------------------------------------

            if (!/^\d{10,15}$/.test(phone)) {

                showOrderMessage(
                    "❌ Please enter a valid phone number.",
                    "error"
                );

                customerPhoneInput.focus();

                return;
            }


            // --------------------------------------
            // VALIDATE QUANTITY
            // --------------------------------------

            if (
                !Number.isInteger(quantity) ||
                quantity < MINIMUM_ORDER
            ) {

                showOrderMessage(
                    "❌ Minimum order is 10 KG. Please enter a whole number.",
                    "error"
                );

                quantityInput.focus();

                return;
            }


            // --------------------------------------
            // VALIDATE ADDRESS
            // --------------------------------------

            if (address.length < 5) {

                showOrderMessage(
                    "❌ Please enter your complete delivery address.",
                    "error"
                );

                addressInput.focus();

                return;
            }


            // --------------------------------------
            // CALCULATE TOTAL
            // --------------------------------------

            const total =
                quantity * PRICE_PER_KG;


            // --------------------------------------
            // DISABLE BUTTON
            // --------------------------------------

            placeOrderButton.disabled = true;

            placeOrderButton.textContent =
                "⏳ PLACING ORDER...";


            showOrderMessage(
                "Please wait... Your order is being placed.",
                "normal"
            );


            try {

                // ----------------------------------
                // SAVE ORDER TO SUPABASE
                // ----------------------------------

                const { error } =
                    await supabaseClient
                        .from("orders")
                        .insert([
                            {
                                customer_name: name,

                                customer_phone: phone,

                                quantity: quantity,

                                address: address,

                                price_per_kg:
                                    PRICE_PER_KG,

                                total_amount:
                                    total,

                                status: "Pending"
                            }
                        ]);


                // ----------------------------------
                // HANDLE SUPABASE ERROR
                // ----------------------------------

                if (error) {

                    console.error(
                        "Supabase order error:",
                        error
                    );

                    throw error;
                }


                // ----------------------------------
                // SUCCESS
                // ----------------------------------

                showOrderMessage(
                    "✅ ORDER PLACED SUCCESSFULLY! Your order has been received. We will contact you for confirmation.",
                    "success"
                );


                // ----------------------------------
                // CHANGE BUTTON
                // ----------------------------------

                placeOrderButton.textContent =
                    "✅ ORDER PLACED";


                // ----------------------------------
                // RESET FORM
                // ----------------------------------

                customerNameInput.value = "";

                customerPhoneInput.value = "";

                addressInput.value = "";

                quantityInput.value =
                    MINIMUM_ORDER;

                updateSummary();


                // ----------------------------------
                // RESTORE BUTTON AFTER DELAY
                // ----------------------------------

                setTimeout(function () {

                    placeOrderButton.disabled = false;

                    placeOrderButton.textContent =
                        "🛒 PLACE ORDER";

                }, 3000);


            }

            catch (error) {

                console.error(
                    "Order placement failed:",
                    error
                );


                // ----------------------------------
                // ERROR MESSAGE
                // ----------------------------------

                showOrderMessage(
                    "❌ We could not place your order. Please try again.",
                    "error"
                );


                // ----------------------------------
                // RESTORE BUTTON
                // ----------------------------------

                placeOrderButton.disabled = false;

                placeOrderButton.textContent =
                    "🛒 PLACE ORDER";
            }
        }
    );


    // ==========================================
    // INITIAL SUMMARY
    // ==========================================

    updateSummary();

});
