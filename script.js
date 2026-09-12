/* =========================================================
   MANA MASALA
   QUANTITY + AUTOMATIC PRICE CALCULATION
========================================================= */


/* ================= SETTINGS ================= */

const PRICE_PER_KG = 350;
const MIN_QUANTITY = 10;


/* ================= GET ELEMENTS ================= */

const quantityInput =
    document.getElementById("quantity");

const plusBtn =
    document.getElementById("plusBtn");

const minusBtn =
    document.getElementById("minusBtn");

const totalAmount =
    document.getElementById("totalAmount");

const orderForm =
    document.getElementById("orderForm");


/* ================= CHECK ELEMENTS ================= */

if (
    !quantityInput ||
    !plusBtn ||
    !minusBtn ||
    !totalAmount
) {

    console.error(
        "Mana Masala: Quantity elements were not found."
    );

}


/* ================= FORMAT PRICE ================= */

function formatPrice(amount) {

    return "₹" + amount.toLocaleString("en-IN");

}


/* ================= UPDATE TOTAL ================= */

function updateTotal() {

    let quantity =
        parseInt(quantityInput.value, 10);


    /* If invalid */

    if (
        isNaN(quantity) ||
        quantity < MIN_QUANTITY
    ) {

        quantity = MIN_QUANTITY;

    }


    /* Make sure quantity is a whole number */

    quantity = Math.floor(quantity);


    /* Update input */

    quantityInput.value = quantity;


    /* Calculate */

    const total =
        quantity * PRICE_PER_KG;


    /* Display */

    totalAmount.textContent =
        formatPrice(total);


    /* Console for testing */

    console.log(
        "Quantity:",
        quantity,
        "kg"
    );

    console.log(
        "Price:",
        PRICE_PER_KG,
        "per kg"
    );

    console.log(
        "Total:",
        total
    );

}


/* ================= PLUS BUTTON ================= */

plusBtn.addEventListener(
    "click",
    function () {

        let quantity =
            parseInt(quantityInput.value, 10);


        if (
            isNaN(quantity) ||
            quantity < MIN_QUANTITY
        ) {

            quantity = MIN_QUANTITY;

        }


        quantity++;


        quantityInput.value =
            quantity;


        updateTotal();

    }
);


/* ================= MINUS BUTTON ================= */

minusBtn.addEventListener(
    "click",
    function () {

        let quantity =
            parseInt(quantityInput.value, 10);


        if (
            isNaN(quantity) ||
            quantity <= MIN_QUANTITY
        ) {

            quantity = MIN_QUANTITY;

        }
        else {

            quantity--;

        }


        quantityInput.value =
            quantity;


        updateTotal();

    }
);


/* ================= MANUAL INPUT ================= */

quantityInput.addEventListener(
    "input",
    function () {

        updateTotal();

    }
);


quantityInput.addEventListener(
    "change",
    function () {

        updateTotal();

    }
);


/* ================= ORDER FORM ================= */

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const address =
                document.getElementById(
                    "address"
                ).value.trim();


            let quantity =
                parseInt(
                    quantityInput.value,
                    10
                );


            if (
                !name ||
                !phone ||
                !address
            ) {

                alert(
                    "Please fill in all details."
                );

                return;

            }


            if (
                isNaN(quantity) ||
                quantity < MIN_QUANTITY
            ) {

                alert(
                    "Minimum order quantity is 10 kg."
                );

                quantityInput.value =
                    MIN_QUANTITY;

                updateTotal();

                return;

            }


            const total =
                quantity * PRICE_PER_KG;


            /*
                For now this confirms the
                calculation.

                Your Supabase order submission
                can be connected here.
            */

            alert(
                "Order details ready!\n\n" +
                "Name: " + name + "\n" +
                "Quantity: " + quantity + " kg\n" +
                "Total: " + formatPrice(total)
            );

        }
    );

}


/* ================= INITIAL CALCULATION ================= */

updateTotal();
