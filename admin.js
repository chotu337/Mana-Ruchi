// =========================================
// MANA RUCHI ADMIN DASHBOARD
// =========================================


// SUPABASE CONNECTION

const SUPABASE_URL =
    "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================
// ELEMENTS
// =========================================

const loginSection =
    document.getElementById("loginSection");

const dashboardSection =
    document.getElementById("dashboardSection");

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");

const logoutButton =
    document.getElementById("logoutButton");

const ordersContainer =
    document.getElementById("ordersContainer");

const loadingMessage =
    document.getElementById("loadingMessage");

const emptyMessage =
    document.getElementById("emptyMessage");

const refreshButton =
    document.getElementById("refreshButton");

const searchInput =
    document.getElementById("searchInput");


// STAT ELEMENTS

const totalOrders =
    document.getElementById("totalOrders");

const pendingOrders =
    document.getElementById("pendingOrders");

const confirmedOrders =
    document.getElementById("confirmedOrders");

const deliveredOrders =
    document.getElementById("deliveredOrders");

const totalSales =
    document.getElementById("totalSales");

const orderCount =
    document.getElementById("orderCount");


// STORE ORDERS

let allOrders = [];


// =========================================
// CHECK LOGIN
// =========================================

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (session) {

        showDashboard();

    } else {

        showLogin();
    }
}


// =========================================
// SHOW LOGIN
// =========================================

function showLogin() {

    loginSection.style.display = "flex";

    dashboardSection.style.display = "none";
}


// =========================================
// SHOW DASHBOARD
// =========================================

function showDashboard() {

    loginSection.style.display = "none";

    dashboardSection.style.display = "block";

    loadOrders();
}


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        loginError.textContent = "";

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            loginError.textContent =
                "Invalid email or password.";

            return;
        }


        showDashboard();
    }
);


// =========================================
// LOGOUT
// =========================================

logoutButton.addEventListener(
    "click",
    async function () {

        await supabaseClient.auth.signOut();

        showLogin();
    }
);


// =========================================
// LOAD ORDERS
// =========================================

async function loadOrders() {

    loadingMessage.style.display = "block";

    emptyMessage.style.display = "none";

    ordersContainer.innerHTML = "";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("orders")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    loadingMessage.style.display = "none";


    if (error) {

        console.error(error);

        ordersContainer.innerHTML = `
            <div class="empty-message">
                Unable to load orders.
                Please refresh the page.
            </div>
        `;

        return;
    }


    allOrders = data || [];

    updateStatistics();

    displayOrders(allOrders);
}


// =========================================
// DISPLAY ORDERS
// =========================================

function displayOrders(orders) {

    ordersContainer.innerHTML = "";

    orderCount.textContent =
        orders.length +
        (orders.length === 1 ? " order" : " orders");


    if (orders.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }


    emptyMessage.style.display = "none";


    orders.forEach(function (order) {

        const orderElement =
            createOrderElement(order);

        ordersContainer.appendChild(
            orderElement
        );
    });
}


// =========================================
// CREATE ORDER ELEMENT
// =========================================

function createOrderElement(order) {

    const item =
        document.createElement("div");

    item.className = "order-item";


    const statusClass =
        getStatusClass(order.status);


    const formattedDate =
        new Date(order.created_at)
            .toLocaleString("en-IN");


    item.innerHTML = `

        <div class="order-top">

            <div>

                <div class="customer-name">
                    ${escapeHTML(order.customer_name)}
                </div>

                <div class="order-id">
                    Order #${order.id}
                    • ${formattedDate}
                </div>

            </div>


            <span
                class="order-status ${statusClass}"
            >
                ${escapeHTML(order.status)}
            </span>

        </div>


        <div class="order-details">


            <div class="detail-box">

                <div class="detail-label">
                    📱 Phone
                </div>

                <div class="detail-value">
                    ${escapeHTML(order.customer_phone)}
                </div>

            </div>


            <div class="detail-box">

                <div class="detail-label">
                    📦 Quantity
                </div>

                <div class="detail-value">
                    ${order.quantity} KG
                </div>

            </div>


            <div class="detail-box">

                <div class="detail-label">
                    💰 Total Amount
                </div>

                <div class="detail-value">
                    ₹${Number(order.total_amount)
                        .toLocaleString("en-IN")}
                </div>

            </div>


            <div class="detail-box">

                <div class="detail-label">
                    🏠 Delivery Address
                </div>

                <div class="detail-value">
                    ${escapeHTML(order.address)}
                </div>

            </div>


        </div>


        <div class="order-actions">

            <select
                class="status-select"
                data-order-id="${order.id}"
            >

                <option value="Pending"
                    ${order.status === "Pending" ? "selected" : ""}>
                    Pending
                </option>

                <option value="Confirmed"
                    ${order.status === "Confirmed" ? "selected" : ""}>
                    Confirmed
                </option>

                <option value="Delivered"
                    ${order.status === "Delivered" ? "selected" : ""}>
                    Delivered
                </option>

                <option value="Cancelled"
                    ${order.status === "Cancelled" ? "selected" : ""}>
                    Cancelled
                </option>

            </select>


            <a
                class="call-button"
                href="tel:${escapeHTML(order.customer_phone)}"
            >
                📞 Call Customer
            </a>

        </div>

    `;


    const statusSelect =
        item.querySelector(".status-select");


    statusSelect.addEventListener(
        "change",
        function () {

            updateOrderStatus(
                order.id,
                this.value
            );

        }
    );


    return item;
}


// =========================================
// UPDATE ORDER STATUS
// =========================================

async function updateOrderStatus(
    orderId,
    newStatus
) {

    const {
        error
    } =
        await supabaseClient
            .from("orders")
            .update({
                status: newStatus
            })
            .eq("id", orderId);


    if (error) {

        console.error(error);

        alert(
            "Could not update the order status."
        );

        return;
    }


    // Update local order

    const order =
        allOrders.find(
            item => item.id === orderId
        );


    if (order) {

        order.status = newStatus;
    }


    updateStatistics();

    displayOrders(
        filterOrders(searchInput.value)
    );
}


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    function () {

        const filteredOrders =
            filterOrders(this.value);

        displayOrders(filteredOrders);
    }
);


function filterOrders(searchTerm) {

    const term =
        searchTerm
            .toLowerCase()
            .trim();


    if (!term) {

        return allOrders;
    }


    return allOrders.filter(
        function (order) {

            return (

                String(order.id)
                    .toLowerCase()
                    .includes(term)

                ||

                order.customer_name
                    .toLowerCase()
                    .includes(term)

                ||

                order.customer_phone
                    .toLowerCase()
                    .includes(term)

                ||

                order.address
                    .toLowerCase()
                    .includes(term)

                ||

                order.status
                    .toLowerCase()
                    .includes(term)

            );
        }
    );
}


// =========================================
// REFRESH
// =========================================

refreshButton.addEventListener(
    "click",
    function () {

        loadOrders();
    }
);


// =========================================
// STATISTICS
// =========================================

function updateStatistics() {

    const total =
        allOrders.length;


    const pending =
        allOrders.filter(
            order => order.status === "Pending"
        ).length;


    const confirmed =
        allOrders.filter(
            order => order.status === "Confirmed"
        ).length;


    const delivered =
        allOrders.filter(
            order => order.status === "Delivered"
        ).length;


    const sales =
        allOrders
            .filter(
                order =>
                    order.status !== "Cancelled"
            )
            .reduce(
                function (sum, order) {

                    return sum +
                        Number(order.total_amount);

                },
                0
            );


    totalOrders.textContent = total;

    pendingOrders.textContent = pending;

    confirmedOrders.textContent = confirmed;

    deliveredOrders.textContent = delivered;

    totalSales.textContent =
        "₹" +
        sales.toLocaleString("en-IN");
}


// =========================================
// STATUS CLASS
// =========================================

function getStatusClass(status) {

    switch (status) {

        case "Confirmed":
            return "status-confirmed";

        case "Delivered":
            return "status-delivered";

        case "Cancelled":
            return "status-cancelled";

        default:
            return "status-pending";
    }
}


// =========================================
// HTML ESCAPE
// =========================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================
// START
// =========================================

checkLogin();
