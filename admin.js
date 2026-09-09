/* =========================================
   MANA RUCHI - ADMIN DASHBOARD
========================================= */
/* =========================================
   ADMIN LOGIN DETAILS
========================================= */
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ManaRuchi@2026";
/* =========================================
   GET HTML ELEMENTS
========================================= */
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
const clearOrdersBtn =
    document.getElementById("clearOrdersBtn");
/* =========================================
   CHECK WHETHER ADMIN IS LOGGED IN
========================================= */
function checkLogin() {
    const loggedIn =
        sessionStorage.getItem("manaRuchiAdmin");
    if (loggedIn === "true") {
        showDashboard();
    } else {
        showLogin();
    }
}
/* =========================================
   SHOW LOGIN PAGE
========================================= */
function showLogin() {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
}
/* =========================================
   SHOW ADMIN DASHBOARD
========================================= */
function showDashboard() {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    loadOrders();
}
/* =========================================
   LOGIN
========================================= */
if (loginForm) {
    loginForm.addEventListener(
        "submit",
        function(event) {
            event.preventDefault();
            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();
            const password =
                document
                    .getElementById("password")
                    .value;
            /* Check username and password */
            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {
                sessionStorage.setItem(
                    "manaRuchiAdmin",
                    "true"
                );
                loginError.textContent = "";
                loginForm.reset();
                showDashboard();
            } else {
                loginError.textContent =
                    "❌ Incorrect username or password.";
            }
        }
    );
}
/* =========================================
   LOGOUT
========================================= */
if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        function() {
            sessionStorage.removeItem(
                "manaRuchiAdmin"
            );
            showLogin();
        }
    );
}
/* =========================================
   LOAD ORDERS
========================================= */
function loadOrders() {
    const orders =
        JSON.parse(
            localStorage.getItem(
                "manaRuchiOrders"
            )
        ) || [];
    updateStatistics(orders);
    displayOrders(orders);
}
/* =========================================
   UPDATE DASHBOARD STATISTICS
========================================= */
function updateStatistics(orders) {
    const total =
        orders.length;
    const pending =
        orders.filter(
            function(order) {
                return order.status !== "Completed";
            }
        ).length;
    const completed =
        orders.filter(
            function(order) {
                return order.status === "Completed";
            }
        ).length;
    const totalOrders =
        document.getElementById(
            "totalOrders"
        );
    const pendingOrders =
        document.getElementById(
            "pendingOrders"
        );
    const completedOrders =
        document.getElementById(
            "completedOrders"
        );
    if (totalOrders) {
        totalOrders.textContent = total;
    }
    if (pendingOrders) {
        pendingOrders.textContent = pending;
    }
    if (completedOrders) {
        completedOrders.textContent = completed;
    }
}
/* =========================================
   DISPLAY CUSTOMER ORDERS
========================================= */
function displayOrders(orders) {
    const container =
        document.getElementById(
            "ordersContainer"
        );
    if (!container) {
        return;
    }
    /* No orders */
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <p>📭 No orders available.</p>
            </div>
        `;
        return;
    }
    container.innerHTML = "";
    /* Display every order */
    orders.forEach(
        function(order, index) {
            const card =
                document.createElement(
                    "div"
                );
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
                    ${escapeHTML(
                        order.name || "N/A"
                    )}
                    <br>
                    <strong>Phone:</strong>
                    ${escapeHTML(
                        order.phone || "N/A"
                    )}
                    <br>
                    <strong>Address:</strong>
                    ${escapeHTML(
                        order.address || "N/A"
                    )}
                    <br>
                    <strong>Product:</strong>
                    ${escapeHTML(
                        order.product ||
                        "Chilli Powder"
                    )}
                    <br>
                    <strong>Quantity:</strong>
                    ${escapeHTML(
                        order.quantity || "N/A"
                    )}
                    <br>
                    <strong>Date:</strong>
                    ${escapeHTML(
                        order.date || "N/A"
                    )}
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
/* =========================================
   MARK ORDER AS COMPLETED
========================================= */
function completeOrder(index) {
    const orders =
        JSON.parse(
            localStorage.getItem(
                "manaRuchiOrders"
            )
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
/* =========================================
   CLEAR ALL ORDERS
========================================= */
if (clearOrdersBtn) {
    clearOrdersBtn.addEventListener(
        "click",
        function() {
            const confirmation =
                confirm(
                    "Are you sure you want to delete all orders?"
                );
            if (!confirmation) {
                return;
            }
            localStorage.removeItem(
                "manaRuchiOrders"
            );
            loadOrders();
        }
    );
}
/* =========================================
   PROTECT AGAINST HTML IN CUSTOMER DATA
========================================= */
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
/* =========================================
   START ADMIN DASHBOARD
========================================= */
checkLogin();
