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
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const clearOrdersBtn = document.getElementById("clearOrdersBtn");
/* =========================================
   CHECK LOGIN
========================================= */
function checkLogin() {
    const loggedIn = sessionStorage.getItem("manaRuchiAdmin");
    if (loggedIn === "true") {
        showDashboard();
    } else {
        showLogin();
    }
}
/* =========================================
   SHOW LOGIN
========================================= */
function showLogin() {
    if (loginSection) {
        loginSection.classList.remove("hidden");
    }
    if (dashboardSection) {
        dashboardSection.classList.add("hidden");
    }
}
/* =========================================
   SHOW DASHBOARD
========================================= */
function showDashboard() {
    if (loginSection) {
        loginSection.classList.add("hidden");
    }
    if (dashboardSection) {
        dashboardSection.classList.remove("hidden");
    }
    loadOrders();
}
/* =========================================
   ADMIN LOGIN
========================================= */
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const usernameInput =
            document.getElementById("username");
        const passwordInput =
            document.getElementById("password");
        const username =
            usernameInput.value.trim();
        const password =
            passwordInput.value;
        /* Check credentials */
        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {
            /* Save login */
            sessionStorage.setItem(
                "manaRuchiAdmin",
                "true"
            );
            /* Remove error */
            if (loginError) {
                loginError.textContent = "";
            }
            /* Clear form */
            loginForm.reset();
            /* Open dashboard */
            showDashboard();
        } else {
            if (loginError) {
                loginError.textContent =
                    "❌ Incorrect username or password.";
            }
        }
    });
}
/* =========================================
   LOGOUT
========================================= */
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        sessionStorage.removeItem(
            "manaRuchiAdmin"
        );
        showLogin();
    });
}
/* =========================================
   LOAD ORDERS
========================================= */
function loadOrders() {
    let orders = [];
    try {
        orders =
            JSON.parse(
                localStorage.getItem(
                    "manaRuchiOrders"
                )
            ) || [];
    } catch (error) {
        orders = [];
    }
    updateStatistics(orders);
    displayOrders(orders);
}
/* =========================================
   UPDATE STATISTICS
========================================= */
function updateStatistics(orders) {
    const total =
        orders.length;
    const pending =
        orders.filter(function(order) {
            return order.status !== "Completed";
        }).length;
    const completed =
        orders.filter(function(order) {
            return order.status === "Completed";
        }).length;
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
   DISPLAY ORDERS
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
    /* Display orders */
    orders.forEach(function(order, index) {
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
                ${escapeHTML(
                    order.product || "Chilli Powder"
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
    });
}
/* =========================================
   MARK ORDER COMPLETED
========================================= */
function completeOrder(index) {
    let orders = [];
    try {
        orders =
            JSON.parse(
                localStorage.getItem(
                    "manaRuchiOrders"
                )
            ) || [];
    } catch (error) {
        orders = [];
    }
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
   ESCAPE HTML
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
   START DASHBOARD
========================================= */
checkLogin();
