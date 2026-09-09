// =========================================
// MANA RUCHI - ADMIN DASHBOARD
// =========================================

// Supabase Configuration
const SUPABASE_URL = "https://iwkrwidehhklaapbfful.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_lI-jEvVEXPHxXRFxIy3vlA_ZF84WGO0";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// =========================================
// GET HTML ELEMENTS
// =========================================

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

const searchInput = document.getElementById("searchInput");
const refreshButton = document.getElementById("refreshButton");
const downloadCsvButton =
    document.getElementById("downloadCsvButton");

const ordersContainer =
    document.getElementById("ordersContainer");


// =========================================
// DASHBOARD STAT ELEMENTS
// =========================================

const totalOrdersElement =
    document.getElementById("totalOrders");

const pendingOrdersElement =
    document.getElementById("pendingOrders");

const confirmedOrdersElement =
    document.getElementById("confirmedOrders");

const deliveredOrdersElement =
    document.getElementById("deliveredOrders");

const totalSalesElement =
    document.getElementById("totalSales");


// =========================================
// STORE ORDERS
// =========================================

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

        await loadOrders();

    } else {

        showLogin();

    }
}


// =========================================
// SHOW LOGIN
// =========================================

function showLogin() {

    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "none";
    }
}


// =========================================
// SHOW DASHBOARD
// =========================================

function showDashboard() {

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (dashboardSection) {
        dashboardSection.style.display = "block";
    }
}


// =========================================
// ADMIN LOGIN
// =========================================

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {

            showLoginMessage(
                "Please enter email and password.",
                "error"
            );

            return;
        }

        showLoginMessage(
            "Logging in...",
            "info"
        );

        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {

            console.error(error);

            showLoginMessage(
                "Invalid email or password.",
                "error"
            );

            return;
        }

        if (data.session) {

            showLoginMessage(
                "Login successful!",
                "success"
            );

            setTimeout(async function () {

                showDashboard();

                await loadOrders();

            }, 500);
        }

    });

}


// =========================================
// LOGIN MESSAGE
// =========================================

function showLoginMessage(message, type) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message " + type;
}


// =========================================
// LOGOUT
// =========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            const {
                error
            } = await supabaseClient.auth.signOut();

            if (error) {

                console.error(error);

                alert("Unable to logout.");

                return;
            }

            allOrders = [];

            showLogin();

            if (loginForm) {
                loginForm.reset();
            }

        }
    );

}


// =========================================
// LOAD ORDERS FROM SUPABASE
// =========================================

async function loadOrders() {

    if (!ordersContainer) {
        return;
    }

    ordersContainer.innerHTML = `
        <div class="loading">
            Loading orders...
        </div>
    `;

    const {
        data: orders,
        error
    } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(error);

        ordersContainer.innerHTML = `
            <div class="error-box">
                Unable to load orders.
                <br>
                Please check your connection and Supabase settings.
            </div>
        `;

        return;
    }

    allOrders = orders || [];

    updateStats();

    displayOrders(allOrders);
}


// =========================================
// DISPLAY ORDERS
// =========================================

function displayOrders(orders) {

    if (!ordersContainer) {
        return;
    }

    if (!orders || orders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="empty-box">
                <h3>No Orders Found</h3>
                <p>There are currently no orders to display.</p>
            </div>
        `;

        return;
    }

    ordersContainer.innerHTML = orders
        .map(order => createOrderCard(order))
        .join("");
}


// =========================================
// CREATE ORDER CARD
// =========================================

function createOrderCard(order) {

    const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleString("en-IN")
        : "N/A";

    const safeName =
        escapeHTML(order.customer_name);

    const safePhone =
        escapeHTML(order.customer_phone);

    const safeAddress =
        escapeHTML(order.address);

    const safeStatus =
        escapeHTML(order.status);

    const quantity =
        Number(order.quantity) || 0;

    const total =
        Number(order.total_amount) || 0;

    return `
        <div class="order-card">

            <div class="order-header">

                <div>
                    <h3>
                        Order #${order.id}
                    </h3>

                    <p class="order-date">
                        ${orderDate}
                    </p>
                </div>

                <div>
                    <select
                        class="status-select"
                        data-order-id="${order.id}"
                        onchange="changeOrderStatus(this)"
                    >

                        <option value="Pending"
                            ${safeStatus === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="Confirmed"
                            ${safeStatus === "Confirmed" ? "selected" : ""}>
                            Confirmed
                        </option>

                        <option value="Delivered"
                            ${safeStatus === "Delivered" ? "selected" : ""}>
                            Delivered
                        </option>

                        <option value="Cancelled"
                            ${safeStatus === "Cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>

                    </select>
                </div>

            </div>


            <div class="order-details">

                <div class="detail-item">
                    <strong>Customer</strong>
                    <span>${safeName}</span>
                </div>


                <div class="detail-item">
                    <strong>Phone</strong>

                    <span>
                        ${safePhone}

                        <a
                            href="tel:${encodeURIComponent(order.customer_phone)}"
                            class="call-button"
                        >
                            📞 Call
                        </a>
                    </span>

                </div>


                <div class="detail-item">
                    <strong>Quantity</strong>
                    <span>${quantity} KG</span>
                </div>


                <div class="detail-item">
                    <strong>Price / KG</strong>
                    <span>₹${Number(order.price_per_kg || 400).toLocaleString("en-IN")}</span>
                </div>


                <div class="detail-item">
                    <strong>Total Amount</strong>
                    <span class="order-total">
                        ₹${total.toLocaleString("en-IN")}
                    </span>
                </div>


                <div class="detail-item address-item">
                    <strong>Delivery Address</strong>
                    <span>${safeAddress}</span>
                </div>

            </div>

        </div>
    `;
}


// =========================================
// CHANGE ORDER STATUS
// =========================================

async function changeOrderStatus(selectElement) {

    const orderId =
        selectElement.dataset.orderId;

    const newStatus =
        selectElement.value;

    selectElement.disabled = true;

    const {
        error
    } = await supabaseClient
        .from("orders")
        .update({
            status: newStatus
        })
        .eq("id", orderId);

    selectElement.disabled = false;

    if (error) {

        console.error(error);

        alert(
            "Unable to update order status."
        );

        return;
    }

    // Update local order
    const order = allOrders.find(
        item => String(item.id) === String(orderId)
    );

    if (order) {
        order.status = newStatus;
    }

    updateStats();

}


// =========================================
// SEARCH ORDERS
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();

            if (!searchTerm) {

                displayOrders(allOrders);

                return;
            }

            const filteredOrders =
                allOrders.filter(order => {

                    return (

                        String(order.id)
                            .toLowerCase()
                            .includes(searchTerm)

                        ||

                        String(order.customer_name || "")
                            .toLowerCase()
                            .includes(searchTerm)

                        ||

                        String(order.customer_phone || "")
                            .toLowerCase()
                            .includes(searchTerm)

                        ||

                        String(order.address || "")
                            .toLowerCase()
                            .includes(searchTerm)

                        ||

                        String(order.status || "")
                            .toLowerCase()
                            .includes(searchTerm)

                    );

                });

            displayOrders(filteredOrders);

        }
    );

}


// =========================================
// REFRESH ORDERS
// =========================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        async function () {

            await loadOrders();

        }
    );

}


// =========================================
// UPDATE DASHBOARD STATS
// =========================================

function updateStats() {

    const totalOrders =
        allOrders.length;

    const pendingOrders =
        allOrders.filter(
            order => order.status === "Pending"
        ).length;

    const confirmedOrders =
        allOrders.filter(
            order => order.status === "Confirmed"
        ).length;

    const deliveredOrders =
        allOrders.filter(
            order => order.status === "Delivered"
        ).length;

    const totalSales =
        allOrders
            .filter(
                order => order.status !== "Cancelled"
            )
            .reduce(
                (sum, order) =>
                    sum +
                    Number(order.total_amount || 0),
                0
            );


    if (totalOrdersElement) {
        totalOrdersElement.textContent =
            totalOrders;
    }

    if (pendingOrdersElement) {
        pendingOrdersElement.textContent =
            pendingOrders;
    }

    if (confirmedOrdersElement) {
        confirmedOrdersElement.textContent =
            confirmedOrders;
    }

    if (deliveredOrdersElement) {
        deliveredOrdersElement.textContent =
            deliveredOrders;
    }

    if (totalSalesElement) {

        totalSalesElement.textContent =
            "₹" +
            totalSales.toLocaleString("en-IN");

    }

}


// =========================================
// DOWNLOAD ORDERS AS CSV
// =========================================

async function downloadOrdersCSV() {

    // Get latest orders from Supabase
    const {
        data: orders,
        error
    } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(error);

        alert(
            "Unable to download orders."
        );

        return;
    }


    if (!orders || orders.length === 0) {

        alert(
            "There are no orders to download."
        );

        return;
    }


    // CSV column headings
    const headers = [
        "Order ID",
        "Customer Name",
        "Phone",
        "Quantity (KG)",
        "Price per KG",
        "Total Amount",
        "Address",
        "Status",
        "Order Date"
    ];


    // Convert orders into rows
    const rows = orders.map(order => [

        order.id,

        order.customer_name,

        order.customer_phone,

        order.quantity,

        order.price_per_kg,

        order.total_amount,

        order.address,

        order.status,

        order.created_at
            ? new Date(
                order.created_at
            ).toLocaleString("en-IN")
            : ""

    ]);


    // Create CSV text
    const csv = [
        headers,
        ...rows
    ]
        .map(row => {

            return row
                .map(value => {

                    const text =
                        String(
                            value ?? ""
                        );

                    return `"${text.replace(
                        /"/g,
                        '""'
                    )}"`;

                })
                .join(",");

        })
        .join("\n");


    // Create downloadable file
    const blob = new Blob(
        [
            "\uFEFF" + csv
        ],
        {
            type:
                "text/csv;charset=utf-8;"
        }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "mana-ruchi-orders.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// =========================================
// DOWNLOAD BUTTON
// =========================================

if (downloadCsvButton) {

    downloadCsvButton.addEventListener(
        "click",
        downloadOrdersCSV
    );

}


// =========================================
// HTML SECURITY
// =========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================================
// SUPABASE AUTH STATE
// =========================================

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (session) {

            showDashboard();

        } else {

            showLogin();

        }

    }
);


// =========================================
// START ADMIN APP
// =========================================

checkLogin();
