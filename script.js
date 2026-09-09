document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // SUPABASE
    // ==========================================

    const SUPABASE_URL =
        "https://iwkrwidehhklaapbfful.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    // ==========================================
    // BUSINESS SETTINGS
    // ==========================================

    const PRICE_PER_KG = 400;
    const MINIMUM_ORDER = 10;


    // ==========================================
    // HTML ELEMENTS
    // ==========================================

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
    // SAFETY CHECK
    // ==========================================

    if (!orderForm) {
        console.error(
            "Mana Ruchi: orderForm not found."
        );

        return;
    }


    // ==========================================
    // UPDATE SUMMARY
    // ==========================================

    function updateSummary() {

        let kg = Number(quantity.value);

        if (
            !Number.isFinite(kg) ||
            kg < MINIMUM_ORDER
        ) {
            kg = MINIMUM_ORDER;
        }

        kg = Math.floor(kg);

        quantity.value = kg;


        const total =
            kg * PRICE_PER_KG;


        if (summaryQuantity) {

            summaryQuantity.textContent =
                kg + " KG";
        }


        if (totalPrice) {

            totalPrice.textContent =
                "₹" +
                total.toLocaleString("en-IN");
        }
    }


    // ==========================================
    // SHOW MESSAGE
    // ==========================================

    function showMessage(text, type) {

        if (!orderMessage) {
            return;
        }


        orderMessage.textContent = text;


        if (type === "success") {

            orderMessage.style.color =
                "#15803d";

            orderMessage.style.backgroundColor =
                "#dcfce7";

            orderMessage.style.border =
                "1px solid #86efac";

            orderMessage.style.padding =
                "14px";

            orderMessage.style.borderRadius =
                "10px";

        }

        else if (type === "error") {

            orderMessage.style.color =
                "#b91c1c";

            orderMessage.style.backgroundColor =
                "#fee2e2";

            orderMessage.style.border =
                "1px solid #fca5a5";

            orderMessage.style.padding =
                "14px";

            orderMessage.style.borderRadius =
                "10px";

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
    // DECREASE
    // ==========================================

    if (decreaseQuantity) {

        decreaseQuantity.addEventListener(
            "click",
            function () {

                let kg =
                    Number(quantity.value);


                if (
                    !Number.isFinite(kg) ||
                    kg <= MINIMUM_ORDER
                ) {

                    kg = MINIMUM_ORDER;

                } else {

                    kg--;
                }


                quantity.value = kg;

                updateSummary();
            }
        );
    }


    // ==========================================
    // INCREASE
    // ==========================================

    if (increaseQuantity) {

        increaseQuantity.addEventListener(
            "click",
            function () {

                let kg =
                    Number(quantity.value);


                if (!Number.isFinite(kg)) {

                    kg = MINIMUM_ORDER;
                }


                kg++;


                quantity.value = kg;

                updateSummary();
            }
        );
    }


    // ==========================================
    // QUANTITY INPUT
    // ==========================================

    quantity.addEventListener(
        "input",
        function () {

            quantity.value =
                quantity.value.replace(
                    /[^\d]/g,
                    ""
                );


            if (quantity.value !== "") {

                const kg =
                    Number(quantity.value);


                if (Number.isFinite(kg)) {

                    const total =
                        kg * PRICE_PER_KG;


                    if (summaryQuantity) {

                        summaryQuantity.textContent =
                            kg + " KG";
                    }


                    if (totalPrice) {

                        totalPrice.textContent =
                            "₹" +
                            total.toLocaleString("en-IN");
                    }
                }
            }
        }
    );


    // ==========================================
    // QUANTITY BLUR
    // ==========================================

    quantity.addEventListener(
        "blur",
        function () {

            let kg =
                Number(quantity.value);


            if (
                !Number.isFinite(kg) ||
                kg < MINIMUM_ORDER
            ) {

                kg = MINIMUM_ORDER;
            }


            kg = Math.floor(kg);

            quantity.value = kg;

            updateSummary();
        }
    );


    // ==========================================
    // PHONE INPUT
    // ==========================================

    if (customerPhone) {

        customerPhone.addEventListener(
            "input",
            function () {

                customerPhone.value =
                    customerPhone.value.replace(
                        /\D/g,
                        ""
                    );
            }
        );
    }


    // ==========================================
    // PLACE ORDER
    // ==========================================

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // --------------------------------------
            // GET VALUES
            // --------------------------------------

            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const kg =
                Number(quantity.value);

            const customerAddress =
                address.value.trim();


            // --------------------------------------
            // VALIDATE NAME
            // --------------------------------------

            if (name.length < 2) {

                showMessage(
                    "❌ Please enter your full name.",
                    "error"
                );

                customerName.focus();

                return;
            }


            // --------------------------------------
            // VALIDATE PHONE
            // --------------------------------------

            if (!/^\d{10,15}$/.test(phone)) {

                showMessage(
                    "❌ Please enter a valid phone number.",
                    "error"
                );

                customerPhone.focus();

                return;
            }


            // --------------------------------------
            // VALIDATE QUANTITY
            // --------------------------------------

            if (
                !Number.isInteger(kg) ||
                kg < MINIMUM_ORDER
            ) {

                showMessage(
                    "❌ Minimum order is 10 KG. Please enter a whole number.",
                    "error"
                );

                quantity.focus();

                return;
            }


            // --------------------------------------
            // VALIDATE ADDRESS
            // --------------------------------------

            if (customerAddress.length < 5) {

                showMessage(
                    "❌ Please enter your complete delivery address.",
                    "error"
                );

                address.focus();

                return;
            }


            // --------------------------------------
            // TOTAL
            // --------------------------------------

            const total =
                kg * PRICE_PER_KG;


            // --------------------------------------
            // DISABLE BUTTON
            // --------------------------------------

            placeOrderButton.disabled = true;

            placeOrderButton.textContent =
                "⏳ PLACING ORDER...";


            showMessage(
                "Please wait... Saving your order.",
                "normal"
            );


            try {

                // ==================================
                // SAVE DIRECTLY TO SUPABASE
                // ==================================

                const { error } =
                    await supabaseClient
                        .from("orders")
                        .insert([
                            {
                                customer_name: name,

                                customer_phone: phone,

                                quantity: kg,

                                address: customerAddress,

                                price_per_kg:
                                    PRICE_PER_KG,

                                total_amount:
                                    total,

                                status:
                                    "Pending"
                            }
                        ]);


                // ==================================
                // ERROR
                // ==================================

                if (error) {

                    console.error(
                        "Supabase error:",
                        error
                    );

                    throw error;
                }


                // ==================================
                // SUCCESS
                // ==================================

                showMessage(
                    "✅ ORDER PLACED SUCCESSFULLY! Your order has been received. We will contact you for confirmation.",
                    "success"
                );


                // ==================================
                // RESET FORM
                // ==================================

                customerName.value = "";

                customerPhone.value = "";

                quantity.value =
                    MINIMUM_ORDER;

                address.value = "";


                updateSummary();


                // ==================================
                // BUTTON SUCCESS STATE
                // ==================================

                placeOrderButton.textContent =
                    "✅ ORDER PLACED";


                // ==================================
                // RESTORE BUTTON
                // ==================================

                setTimeout(
                    function () {

                        placeOrderButton.disabled =
                            false;

                        placeOrderButton.textContent =
                            "🛒 PLACE ORDER";

                    },
                    3000
                );

            }


            catch (error) {

                console.error(
                    "Order failed:",
                    error
                );


                showMessage(
                    "❌ Order could not be placed. Please try again.",
                    "error"
                );


                placeOrderButton.disabled =
                    false;

                placeOrderButton.textContent =
                    "🛒 PLACE ORDER";
            }

        }
    );


    // ==========================================
    // INITIALIZE
    // ==========================================

    quantity.value = MINIMUM_ORDER;

    updateSummary();

});
