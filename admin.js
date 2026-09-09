/* =========================================
   MANA RUCHI ADMIN DASHBOARD
========================================= */
/* =========================
   ADMIN LOGIN
========================= */
/*
   DEMO LOGIN DETAILS
   Username: admin
   Password: ManaRuchi123
   IMPORTANT:
   This is only suitable for testing.
   Do NOT use this as real production security.
*/
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ManaRuchi123";
const loginSection =
    document.getElementById("loginSection");
const dashboardSection =
    document.getElementById("dashboardSection");
const loginForm =
    document.getElementById("loginForm");
const loginError =
    document.getElementById("loginError");
const logoutBtn =
    document.getElementById("logoutBtn");
/* =========================
   CHECK LOGIN
========================= */
function checkLogin() {
    const loggedIn =
        sessionStorage.getItem("manaRuchiAdmin");
    if (loggedIn === "true") {
        showDashboard();
    } else {
        showLogin();
    }
}
/* =========================
   LOGIN
========================= */
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const username =
        document.getElementById("username").value.trim();
    const password =
        document.getElementById("password").value;
    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        sessionStorage.setItem(
            "manaRuchiAdmin",
            "true"
        );
        loginError.textContent = "";
        showDashboard();
    } else {
        loginError.textContent =
            "❌ Invalid username or password.";
    }
});
/* =========================
   SHOW LOGIN
========================= */
function showLogin() {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
}
/* =========================
   SHOW DASHBOARD
========================= */
function showDashboard() {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    loadOrders();
}
/* =========================
   LOGOUT
========================= */
logoutBtn.addEventListener("click", function() {
    sessionStorage.removeItem(
        "manaRuchiAdmin"
    );
    showLogin();
});
/* =========================
   LOAD ORDERS
========================= */
function loadOrders() {
    const orders =
        JSON.parse(
            localStorage.getItem("manaRuchiOrders")
        ) || [];
    updateStatistics(orders);
    displayOrders(orders);
}
/* =========================
   STATISTICS
========================= */
function updateStatistics(orders) {
    const total =
        orders.length;
    const pending =
        orders.filter(
            order => order.status !== "Completed"
        ).length;
    const completed =
        orders.filter(
            order => order.status === "Completed"
        ).length;
    document.getElementById(
        "totalOrders"
    ).textContent = total;
    document.getElementById(
        "pendingOrders"
    ).textContent = pending;
    document.getElementById(
        "completedOrders"
    ).textContent = completed;
}
/* =========================
   DISPLAY ORDERS
========================= */
function displayOrders(orders) {
    const container =
        document.getElementById(
            "ordersContainer"
        );
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <p>📭 No orders available.</p>
            </div>
        `;
        return;
    }
    container.innerHTML = "";
    orders.forEach(
        (order, index) => {
            const card =
                document.createElement("div");
            card.className =
                "order-card";
            const status =
                order.status || "Pending";
            card.innerHTML = `
                <h3>
                    📦 Order #${index + 1}
                </h3>
                <div class="order-info">
                    <strong>Customer:</strong>
                    ${escapeHTML(order.name || "N/A")}
                    <br>
                    <strong>Phone:</strong>
                    ${escapeHTML(order.phone || "N/A")}
                    <br>
                    <strong>Address:</strong>
                    ${escapeHTML(order.address || "N/A")}
                    <br>
                    <strong>Product:</strong>
                    ${escapeHTML(order.product || "Chilli Powder")}
                    <br>
                    <strong>Quantity:</strong>
                    ${escapeHTML(order.quantity || "N/A")}
                    <br>
                    <strong>Order Date:</strong>
                    ${escapeHTML(order.date || "N/A")}
                </div>
                <span class="order-status">
                    ${escapeHTML(status)}
                </span>
                ${
                    status !== "Completed"
                    ?
                    `
                    <br>
                    <button
                        class="complete-btn"
                        onclick="completeOrder(${index})">
                        ✅ Mark Completed
                    </button>
                    `
                    :
                    ""
                }
            `;
            container.appendChild(card);
        }
    );
}
/* =========================
   COMPLETE ORDER
========================= */
function completeOrder(index) {
    const orders =
        JSON.parse(
            localStorage.getItem("manaRuchiOrders")
        ) || [];
    if (!orders[index]) {
        return;
    }
    orders[index].status =
        "Completed";
    localStorage.setItem(
        "manaRuchiOrders",
        JSON.stringify(orders)
    );
    loadOrders();
}
/* =========================
   CLEAR ORDERS
========================= */
document
    .getElementById("clearOrdersBtn")
    .addEventListener("click", function() {
        const confirmClear =
            confirm(
                "Are you sure you want to clear all orders?"
            );
        if (!confirmClear) {
            return;
        }
        localStorage.removeItem(
            "manaRuchiOrders"
        );
        loadOrders();
    });
/* =========================
   BASIC HTML ESCAPING
========================= */
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
/* =========================
   START
========================= */
checkLogin();
