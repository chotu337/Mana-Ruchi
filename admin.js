/* =========================================================
   MANA MASALA - ADMIN DASHBOARD
   Supabase Authentication + Orders
   ORDERS TABLE:
   id
   customer_name
   customer_phone
   quantity_kg
   address
   total_amount
   status
   created_at
========================================================= */
/* =========================================================
   SUPABASE CONFIG
========================================================= */
const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";
const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJhI";
const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
/* =========================================================
   DOM ELEMENTS
========================================================= */
const loginForm =
    document.getElementById("loginForm");
const usernameInput =
    document.getElementById("username");
const passwordInput =
    document.getElementById("password");
const loginError =
    document.getElementById("loginError");
const loginSection =
    document.getElementById("loginSection");
const dashboardSection =
    document.getElementById("dashboardSection");
const logoutBtn =
    document.getElementById("logoutBtn");
const totalOrders =
    document.getElementById("totalOrders");
const pendingOrders =
    document.getElementById("pendingOrders");
const completedOrders =
    document.getElementById("completedOrders");
const clearOrdersBtn =
    document.getElementById("clearOrdersBtn");
const ordersContainer =
    document.getElementById("ordersContainer");
const databaseMessage =
    document.getElementById("databaseMessage");
/* =========================================================
   SHOW LOGIN
========================================================= */
function showLogin() {
    if (loginSection) {
        loginSection.style.display =
            "block";
    }
    if (dashboardSection) {
        dashboardSection.style.display =
            "none";
    }
}
/* =========================================================
   SHOW DASHBOARD
========================================================= */
function showDashboard() {
    if (loginSection) {
        loginSection.style.display =
            "none";
    }
    if (dashboardSection) {
        dashboardSection.style.display =
            "block";
    }
}
/* =========================================================
   CHECK AUTH SESSION
========================================================= */
async function checkAuth() {
    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();
    if (error) {
        console.error(
            "Session error:",
            error
        );
        showLogin();
        return;
    }
    if (data.session) {
        showDashboard();
        await loadOrders();
    } else {
        showLogin();
    }
}
/* =========================================================
   ADMIN LOGIN
========================================================= */
if (loginForm) {
    loginForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();
            const email =
                usernameInput?.value.trim();
            const password =
                passwordInput?.value;
            if (!email || !password) {
                if (loginError) {
                    loginError.textContent =
                        "Please enter email and password.";
                    loginError.style.display =
                        "block";
                }
                return;
            }
            if (loginError) {
                loginError.textContent =
                    "Signing in...";
                loginError.style.display =
                    "block";
            }
            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword(
                    {
                        email: email,
                        password: password
                    }
                );
            if (error) {
                console.error(
                    "Login error:",
                    error
                );
                if (loginError) {
                    loginError.textContent =
                        "Incorrect login credentials.";
                    loginError.style.display =
                        "block";
                }
                return;
            }
            if (data.session) {
                if (loginError) {
                    loginError.style.display =
                        "none";
                }
                showDashboard();
                await loadOrders();
            }
        }
    );
}
/* =========================================================
   LOAD ORDERS
========================================================= */
async function loadOrders() {
    if (ordersContainer) {
        ordersContainer.innerHTML =
            `<div class="loading">
                Loading orders...
             </div>`;
    }
    const {
        data: orders,
        error
    } =
        await supabaseClient
            .from("orders")
            .select(
                "id, customer_name, customer_phone, quantity_kg, address, total_amount, status, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );
    if (error) {
        console.error(
            "Load orders error:",
            error
        );
        if (databaseMessage) {
            databaseMessage.textContent =
                "Unable to load orders: " +
                error.message;
            databaseMessage.style.display =
                "block";
        }
        if (ordersContainer) {
            ordersContainer.innerHTML =
                `<div class="error">
                    Unable to load orders.
                 </div>`;
        }
        return;
    }
    if (databaseMessage) {
        databaseMessage.style.display =
            "none";
    }
    updateStatistics(
        orders || []
    );
    displayOrders(
        orders || []
    );
}
/* =========================================================
   UPDATE STATISTICS
========================================================= */
function updateStatistics(orders) {
    const total =
        orders.length;
    const pending =
        orders.filter(order =>
            String(order.status)
                .toLowerCase() ===
            "pending"
        ).length;
    const completed =
        orders.filter(order =>
            String(order.status)
                .toLowerCase() ===
            "completed"
        ).length;
    if (totalOrders) {
        totalOrders.textContent =
            total;
    }
    if (pendingOrders) {
        pendingOrders.textContent =
            pending;
    }
    if (completedOrders) {
        completedOrders.textContent =
            completed;
    }
}
/* =========================================================
   DISPLAY ORDERS
========================================================= */
function displayOrders(orders) {
    if (!ordersContainer) return;
    if (!orders.length) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <h3>No Orders Yet</h3>
                <p>Customer orders will appear here.</p>
            </div>
        `;
        return;
    }
    ordersContainer.innerHTML =
        orders.map(order => {
            const status =
                String(
                    order.status || "Pending"
                );
            const statusClass =
                status
                    .toLowerCase()
                    .replace(/\s+/g, "-");
            const date =
                formatDate(
                    order.created_at
                );
            const quantity =
                Number(
                    order.quantity_kg || 0
                );
            const total =
                Number(
                    order.total_amount || 0
                );
            return `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3>
                                Order #${escapeHTML(
                                    String(order.id)
                                )}
                            </h3>
                            <span class="order-date">
                                ${escapeHTML(date)}
                            </span>
                        </div>
                        <span class="status ${statusClass}">
                            ${escapeHTML(status)}
                        </span>
                    </div>
                    <div class="order-details">
                        <div class="detail">
                            <strong>
                                Customer
                            </strong>
                            <span>
                                ${escapeHTML(
                                    order.customer_name || "-"
                                )}
                            </span>
                        </div>
                        <div class="detail">
                            <strong>
                                Phone
                            </strong>
                            <span>
                                ${escapeHTML(
                                    order.customer_phone || "-"
                                )}
                            </span>
                        </div>
                        <div class="detail">
                            <strong>
                                Quantity
                            </strong>
                            <span>
                                ${quantity} kg
                            </span>
                        </div>
                        <div class="detail">
                            <strong>
                                Total
                            </strong>
                            <span>
                                ₹${total.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div class="detail full-width">
                            <strong>
                                Address
                            </strong>
                            <span>
                                ${escapeHTML(
                                    order.address || "-"
                                )}
                            </span>
                        </div>
                    </div>
                    <div class="order-actions">
                        ${
                            status.toLowerCase() !==
                            "completed"
                            ?
                            `<button
                                class="complete-btn"
                                onclick="markOrderCompleted('${escapeAttribute(String(order.id))}')"
                            >
                                ✓ Mark Completed
                            </button>`
                            :
                            `<span class="completed-label">
                                ✓ Order Completed
                            </span>`
                        }
                    </div>
                </div>
            `;
        }).join("");
}
/* =========================================================
   MARK ORDER COMPLETED
========================================================= */
async function markOrderCompleted(orderId) {
    const confirmed =
        confirm(
            "Mark this order as completed?"
        );
    if (!confirmed) return;
    const {
        error
    } =
        await supabaseClient
            .from("orders")
            .update({
                status: "Completed"
            })
            .eq(
                "id",
                orderId
            );
    if (error) {
        console.error(
            "Update order error:",
            error
        );
        alert(
            "Could not update order: " +
            error.message
        );
        return;
    }
    await loadOrders();
}
/* =========================================================
   CLEAR ALL ORDERS
========================================================= */
if (clearOrdersBtn) {
    clearOrdersBtn.addEventListener(
        "click",
        async function () {
            const confirmed =
                confirm(
                    "Are you sure you want to delete ALL orders?\n\nThis cannot be undone."
                );
            if (!confirmed) return;
            clearOrdersBtn.disabled =
                true;
            clearOrdersBtn.textContent =
                "Clearing...";
            try {
                /*
                 * Delete all rows.
                 * The id IS NOT NULL condition
                 * prevents accidental malformed
                 * delete calls.
                 */
                const {
                    error
                } =
                    await supabaseClient
                        .from("orders")
                        .delete()
                        .not(
                            "id",
                            "is",
                            null
                        );
                if (error) {
                    throw error;
                }
                await loadOrders();
                alert(
                    "All orders have been cleared."
                );
            } catch (error) {
                console.error(
                    "Clear orders error:",
                    error
                );
                alert(
                    "Could not clear orders: " +
                    error.message
                );
            } finally {
                clearOrdersBtn.disabled =
                    false;
                clearOrdersBtn.textContent =
                    "Clear Orders";
            }
        }
    );
}
/* =========================================================
   LOGOUT
========================================================= */
if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        async function () {
            await supabaseClient.auth.signOut();
            showLogin();
        }
    );
}
/* =========================================================
   AUTO REFRESH
========================================================= */
setInterval(
    async () => {
        const {
            data
        } =
            await supabaseClient.auth.getSession();
        if (data.session) {
            await loadOrders();
        }
    },
    30000
);
/* =========================================================
   FORMAT DATE
========================================================= */
function formatDate(dateString) {
    if (!dateString) {
        return "-";
    }
    const date =
        new Date(dateString);
    if (isNaN(date.getTime())) {
        return "-";
    }
    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}
/* =========================================================
   HTML ESCAPING
========================================================= */
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function escapeAttribute(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}
/* =========================================================
   START
========================================================= */
checkAuth();
