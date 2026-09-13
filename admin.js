/* =========================================================
   MANA MASALA - ADMIN DASHBOARD
   SUPABASE AUTH + ORDERS + REALTIME NOTIFICATIONS + EMAIL
========================================================= */

const SUPABASE_URL =
    "https://hcczhnmdipqrnbxviuln.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_EHoyeiRqm91Y1XIUoLHZvw_37-6eJh";

/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

if (!window.supabase) {
    console.error("❌ Supabase library is not loaded.");
    throw new Error("Supabase library not loaded.");
}

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("🌶️ Mana Masala Admin starting...");
console.log("✅ Supabase client initialized");

/* =========================================================
   ELEMENTS
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
   NOTIFICATION STATE
========================================================= */

let unreadNotifications = 0;
let realtimeChannel = null;
let notificationSoundEnabled = true;

/* =========================================================
   CREATE NOTIFICATION UI
========================================================= */

function createNotificationUI() {

    if (document.getElementById("manaNotificationBox")) {
        return;
    }

    const box = document.createElement("div");

    box.id = "manaNotificationBox";

    box.innerHTML = `
        <div
            id="manaNotificationBell"
            style="
                position:fixed;
                top:20px;
                right:20px;
                z-index:99999;
                cursor:pointer;
                width:52px;
                height:52px;
                border-radius:50%;
                background:#7f1d1d;
                color:white;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:24px;
                box-shadow:0 5px 20px rgba(0,0,0,.30);
            "
            title="Notifications"
        >
            🔔
            <span
                id="manaNotificationCount"
                style="
                    position:absolute;
                    top:-5px;
                    right:-5px;
                    min-width:21px;
                    height:21px;
                    padding:0 5px;
                    border-radius:50%;
                    background:#dc2626;
                    color:white;
                    font-size:12px;
                    font-weight:bold;
                    display:none;
                    align-items:center;
                    justify-content:center;
                    box-sizing:border-box;
                "
            >
                0
            </span>
        </div>

        <div
            id="manaNotificationPanel"
            style="
                position:fixed;
                top:82px;
                right:20px;
                z-index:99998;
                width:350px;
                max-width:calc(100vw - 40px);
                max-height:500px;
                overflow:auto;
                display:none;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,.12);
                border-radius:16px;
                box-shadow:0 15px 45px rgba(0,0,0,.40);
            "
        >
            <div
                style="
                    padding:16px;
                    border-bottom:1px solid rgba(255,255,255,.10);
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                "
            >
                <strong>🔔 Notifications</strong>

                <button
                    id="markNotificationsRead"
                    type="button"
                    style="
                        border:0;
                        background:transparent;
                        color:#fca5a5;
                        cursor:pointer;
                        font-size:12px;
                    "
                >
                    Mark read
                </button>
            </div>

            <div id="manaNotificationList">
                <div
                    style="
                        padding:20px;
                        text-align:center;
                        color:#9ca3af;
                    "
                >
                    No new notifications
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(box);

    const bell =
        document.getElementById(
            "manaNotificationBell"
        );

    const panel =
        document.getElementById(
            "manaNotificationPanel"
        );

    const markRead =
        document.getElementById(
            "markNotificationsRead"
        );

    bell.addEventListener("click", () => {

        const isVisible =
            panel.style.display === "block";

        panel.style.display =
            isVisible ? "none" : "block";

        if (!isVisible) {
            unreadNotifications = 0;
            updateNotificationCount();
        }
    });

    markRead.addEventListener(
        "click",
        () => {
            unreadNotifications = 0;
            updateNotificationCount();
        }
    );

    document.addEventListener(
        "click",
        event => {

            if (
                !box.contains(event.target)
            ) {
                panel.style.display =
                    "none";
            }
        }
    );
}

/* =========================================================
   UPDATE NOTIFICATION COUNT
========================================================= */

function updateNotificationCount() {

    const count =
        document.getElementById(
            "manaNotificationCount"
        );

    if (!count) {
        return;
    }

    if (unreadNotifications > 0) {

        count.textContent =
            unreadNotifications > 99
                ? "99+"
                : unreadNotifications;

        count.style.display =
            "flex";

    } else {

        count.style.display =
            "none";
    }
}

/* =========================================================
   ADD NOTIFICATION
========================================================= */

function addNotification(order) {

    unreadNotifications++;

    updateNotificationCount();

    const list =
        document.getElementById(
            "manaNotificationList"
        );

    if (!list) {
        return;
    }

    const name =
        order.customer_name ||
        "Customer";

    const quantity =
        Number(
            order.quantity_kg || 0
        );

    const total =
        Number(
            order.total_amount || 0
        );

    const time =
        formatDate(
            order.created_at
        );

    const item =
        document.createElement("div");

    item.style.cssText = `
        padding:15px;
        border-bottom:1px solid rgba(255,255,255,.08);
        cursor:pointer;
        transition:.2s;
    `;

    item.innerHTML = `
        <div
            style="
                font-weight:bold;
                color:#fca5a5;
                margin-bottom:6px;
            "
        >
            🌶️ New Order Received
        </div>

        <div
            style="
                font-size:14px;
                line-height:1.6;
            "
        >
            <strong>${escapeHTML(name)}</strong>
            placed an order.
        </div>

        <div
            style="
                margin-top:7px;
                color:#d1d5db;
                font-size:13px;
            "
        >
            📦 ${quantity} kg
            &nbsp; • &nbsp;
            💰 ₹${total.toLocaleString("en-IN")}
        </div>

        <div
            style="
                margin-top:5px;
                color:#9ca3af;
                font-size:11px;
            "
        >
            ${escapeHTML(time)}
        </div>
    `;

    item.addEventListener(
        "click",
        () => {

            const orderCard =
                document.querySelector(
                    `[data-order-id="${CSS.escape(String(order.id))}"]`
                );

            if (orderCard) {

                orderCard.scrollIntoView({
                    behavior:"smooth",
                    block:"center"
                });

                orderCard.style.outline =
                    "3px solid #ef4444";

                setTimeout(() => {
                    orderCard.style.outline =
                        "";
                }, 3000);
            }

            const panel =
                document.getElementById(
                    "manaNotificationPanel"
                );

            if (panel) {
                panel.style.display =
                    "none";
            }
        }
    );

    if (
        list.firstElementChild &&
        list.firstElementChild.textContent.includes(
            "No new notifications"
        )
    ) {
        list.innerHTML = "";
    }

    list.prepend(item);

    playNotificationSound();

    showBrowserNotification(
        name,
        quantity,
        total
    );
}

/* =========================================================
   NOTIFICATION SOUND
========================================================= */

function playNotificationSound() {

    if (!notificationSoundEnabled) {
        return;
    }

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        const context =
            new AudioContext();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.type =
            "sine";

        oscillator.frequency.value =
            880;

        gain.gain.value =
            0.08;

        oscillator.connect(gain);
        gain.connect(
            context.destination
        );

        oscillator.start();

        setTimeout(() => {
            oscillator.frequency.value =
                1100;
        }, 120);

        setTimeout(() => {

            oscillator.stop();

            context.close();

        }, 250);

    } catch (error) {

        console.warn(
            "Notification sound unavailable:",
            error
        );
    }
}

/* =========================================================
   BROWSER NOTIFICATION
========================================================= */

async function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {
        return;
    }

    if (
        Notification.permission ===
        "default"
    ) {

        try {

            await Notification.requestPermission();

        } catch (error) {

            console.warn(
                "Notification permission error:",
                error
            );
        }
    }
}

function showBrowserNotification(
    name,
    quantity,
    total
) {

    if (
        !("Notification" in window)
    ) {
        return;
    }

    if (
        Notification.permission !==
        "granted"
    ) {
        return;
    }

    try {

        new Notification(
            "🌶️ Mana Masala - New Order",
            {
                body:
                    `${name} ordered ${quantity} kg - ₹${total.toLocaleString("en-IN")}`,
                icon:
                    "https://chotu337.github.io/Mana-Ruchi/favicon.ico"
            }
        );

    } catch (error) {

        console.warn(
            "Browser notification failed:",
            error
        );
    }
}

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

    createNotificationUI();
}

/* =========================================================
   AUTH CHECK
========================================================= */

async function checkAuth() {

    console.log(
        "Checking admin session..."
    );

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();

    if (error) {

        console.error(
            "Auth error:",
            error
        );

        showLogin();

        return;
    }

    if (data.session) {

        console.log(
            "✅ Admin session found"
        );

        showDashboard();

        await requestNotificationPermission();

        await loadOrders();

        setupRealtimeOrders();

    } else {

        console.log(
            "No admin session"
        );

        showLogin();
    }
}

/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                usernameInput
                    ?.value
                    .trim();

            const password =
                passwordInput
                    ?.value;

            if (
                !email ||
                !password
            ) {

                if (loginError) {

                    loginError.textContent =
                        "Enter your email and password.";

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
                await supabaseClient
                    .auth
                    .signInWithPassword({
                        email,
                        password
                    });

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

                console.log(
                    "✅ Login successful"
                );

                showDashboard();

                await requestNotificationPermission();

                await loadOrders();

                setupRealtimeOrders();
            }
        }
    );
}

/* =========================================================
   LOAD ORDERS
========================================================= */

async function loadOrders() {

    console.log(
        "📦 Loading orders from Supabase..."
    );

    if (ordersContainer) {

        ordersContainer.innerHTML = `
            <div class="loading">
                Loading orders...
            </div>
        `;
    }

    const {
        data: orders,
        error
    } =
        await supabaseClient
            .from("orders")
            .select(
                "id,customer_name,customer_phone,quantity_kg,address,total_amount,status,created_at"
            )
            .order(
                "created_at",
                {
                    ascending:false
                }
            );

    if (error) {

        console.error(
            "❌ Orders loading error:",
            error
        );

        if (databaseMessage) {

            databaseMessage.textContent =
                "Database error: " +
                error.message;

            databaseMessage.style.display =
                "block";
        }

        if (ordersContainer) {

            ordersContainer.innerHTML = `
                <div class="error">
                    Unable to load orders.
                    <br><br>
                    ${escapeHTML(error.message)}
                </div>
            `;
        }

        return;
    }

    console.log(
        "✅ Orders loaded:",
        orders
    );

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
   REALTIME ORDERS
========================================================= */

function setupRealtimeOrders() {

    if (realtimeChannel) {

        console.log(
            "Realtime already initialized."
        );

        return;
    }

    console.log(
        "📡 Starting Supabase Realtime..."
    );

    realtimeChannel =
        supabaseClient
            .channel(
                "mana-masala-orders"
            )
            .on(
                "postgres_changes",
                {
                    event:"INSERT",
                    schema:"public",
                    table:"orders"
                },
                payload => {

                    console.log(
                        "🔔 NEW ORDER REALTIME EVENT:",
                        payload
                    );

                    const newOrder =
                        payload.new;

                    addNotification(
                        newOrder
                    );

                    loadOrders();
                }
            )
            .on(
                "postgres_changes",
                {
                    event:"UPDATE",
                    schema:"public",
                    table:"orders"
                },
                payload => {

                    console.log(
                        "🔄 Order updated:",
                        payload.new
                    );

                    loadOrders();
                }
            )
            .on(
                "postgres_changes",
                {
                    event:"DELETE",
                    schema:"public",
                    table:"orders"
                },
                payload => {

                    console.log(
                        "🗑️ Order deleted:",
                        payload.old
                    );

                    loadOrders();
                }
            )
            .subscribe(
                status => {

                    console.log(
                        "Realtime status:",
                        status
                    );

                    if (
                        status ===
                        "SUBSCRIBED"
                    ) {

                        console.log(
                            "✅ Realtime connected"
                        );

                    }

                    if (
                        status ===
                        "CHANNEL_ERROR"
                    ) {

                        console.error(
                            "❌ Realtime channel error"
                        );
                    }
                }
            );
}

/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics(
    orders
) {

    const total =
        orders.length;

    const pending =
        orders.filter(
            order =>
                String(
                    order.status || ""
                ).toLowerCase() ===
                "pending"
        ).length;

    const completed =
        orders.filter(
            order =>
                String(
                    order.status || ""
                ).toLowerCase() ===
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

function displayOrders(
    orders
) {

    if (!ordersContainer) {
        return;
    }

    if (!orders.length) {

        ordersContainer.innerHTML = `
            <div class="no-orders">
                <h3>No Orders Yet</h3>
                <p>
                    New customer orders will appear here.
                </p>
            </div>
        `;

        return;
    }

    ordersContainer.innerHTML =
        orders
            .map(
                order => {

                    const status =
                        String(
                            order.status ||
                            "Pending"
                        );

                    const statusClass =
                        status
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                "-"
                            );

                    const quantity =
                        Number(
                            order.quantity_kg ||
                            0
                        );

                    const total =
                        Number(
                            order.total_amount ||
                            0
                        );

                    const date =
                        formatDate(
                            order.created_at
                        );

                    return `
                        <div
                            class="order-card"
                            data-order-id="${escapeAttribute(String(order.id))}"
                        >

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

                                <span
                                    class="status ${escapeHTML(statusClass)}"
                                >
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
                                            order.customer_name ||
                                            "-"
                                        )}
                                    </span>

                                </div>

                                <div class="detail">

                                    <strong>
                                        Phone
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.customer_phone ||
                                            "-"
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
                                        ₹${total.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>

                                <div class="detail full-width">

                                    <strong>
                                        Address
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.address ||
                                            "-"
                                        )}
                                    </span>

                                </div>

                            </div>

                            <div class="order-actions">

                                ${
                                    status.toLowerCase() !==
                                    "completed"

                                    ?

                                    `
                                    <button
                                        class="complete-btn"
                                        onclick="markOrderCompleted('${escapeAttribute(
                                            String(order.id)
                                        )}')"
                                    >
                                        ✓ Mark Completed
                                    </button>
                                    `

                                    :

                                    `
                                    <span class="completed-label">
                                        ✓ Order Completed
                                    </span>
                                    `
                                }

                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}

/* =========================================================
   MARK COMPLETED
========================================================= */

async function markOrderCompleted(
    orderId
) {

    const confirmed =
        confirm(
            "Mark this order as completed?"
        );

    if (!confirmed) {
        return;
    }

    const {
        error
    } =
        await supabaseClient
            .from("orders")
            .update({
                status:"Completed"
            })
            .eq(
                "id",
                orderId
            );

    if (error) {

        console.error(
            "Update error:",
            error
        );

        alert(
            "Could not update order:\n" +
            error.message
        );

        return;
    }

    await loadOrders();
}

/* =========================================================
   CLEAR ORDERS
========================================================= */

if (clearOrdersBtn) {

    clearOrdersBtn.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Delete ALL orders?\n\nThis cannot be undone."
                );

            if (!confirmed) {
                return;
            }

            clearOrdersBtn.disabled =
                true;

            clearOrdersBtn.textContent =
                "Clearing...";

            try {

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
                    "All orders cleared."
                );

            } catch (error) {

                console.error(
                    "Clear orders error:",
                    error
                );

                alert(
                    "Could not clear orders:\n" +
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
        async () => {

            if (realtimeChannel) {

                await supabaseClient
                    .removeChannel(
                        realtimeChannel
                    );

                realtimeChannel =
                    null;
            }

            await supabaseClient
                .auth
                .signOut();

            showLogin();
        }
    );
}

/* =========================================================
   AUTO REFRESH FALLBACK
========================================================= */

setInterval(
    async () => {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();

        if (data.session) {

            console.log(
                "🔄 Automatic order refresh..."
            );

            await loadOrders();
        }

    },
    30000
);

/* =========================================================
   DATE
========================================================= */

function formatDate(
    dateString
) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(dateString);

    if (
        isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }

    return date.toLocaleString(
        "en-IN",
        {
            dateStyle:"medium",
            timeStyle:"short"
        }
    );
}

/* =========================================================
   SECURITY HELPERS
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}

function escapeAttribute(
    value
) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );
}

/* =========================================================
   START
========================================================= */

createNotificationUI();

checkAuth();

console.log(
    "🌶️ Mana Masala Admin JS Ready"
);
