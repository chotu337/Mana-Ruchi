<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <meta
        name="robots"
        content="noindex, nofollow"
    >
    <title>Mana Ruchi | Admin Dashboard</title>
    <link
        rel="stylesheet"
        href="admin.css"
    >
</head>
<body>
<!-- =====================================
     LOGIN PAGE
====================================== -->
<main
    id="loginSection"
    class="login-section"
>
    <div class="login-card">
        <!-- BRAND -->
        <div class="brand">
            <div class="brand-icon">
                🌶️
            </div>
            <h1>
                Mana Ruchi
            </h1>
            <p>
                Admin Portal
            </p>
        </div>
        <!-- LOGIN TITLE -->
        <div class="login-title">
            <h2>
                Welcome Back
            </h2>
            <p>
                Sign in to manage your orders
            </p>
        </div>
        <!-- LOGIN FORM -->
        <form
            id="loginForm"
            autocomplete="off"
        >
            <!-- USERNAME -->
            <div class="input-group">
                <label for="username">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    autocomplete="username"
                    required
                >
            </div>
            <!-- PASSWORD -->
            <div class="input-group">
                <label for="password">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    required
                >
            </div>
            <!-- LOGIN BUTTON -->
            <button
                type="submit"
                class="login-button"
            >
                <span>
                    🔐
                </span>
                Sign In
            </button>
            <!-- LOGIN ERROR -->
            <p
                id="loginError"
                class="login-error"
                aria-live="polite"
            ></p>
        </form>
        <!-- BACK TO WEBSITE -->
        <a
            href="index.html"
            class="back-link"
        >
            ← Back to Mana Ruchi
        </a>
        <!-- FOOTER -->
        <div class="login-footer">
            <span>
                🔒 Secure Admin Area
            </span>
        </div>
    </div>
</main>
<!-- =====================================
     DASHBOARD
====================================== -->
<section
    id="dashboardSection"
    class="dashboard-section hidden"
>
    <!-- HEADER -->
    <header class="dashboard-header">
        <div class="dashboard-brand">
            <div class="dashboard-logo">
                🌶️
            </div>
            <div>
                <h1>
                    Mana Ruchi
                </h1>
                <p>
                    Admin Dashboard
                </p>
            </div>
        </div>
        <button
            id="logoutBtn"
            class="logout-button"
        >
            Logout
        </button>
    </header>
    <!-- DASHBOARD CONTENT -->
    <main class="dashboard-content">
        <!-- TITLE -->
        <div class="dashboard-title">
            <div>
                <h2>
                    Dashboard
                </h2>
                <p>
                    Manage your customer orders
                </p>
            </div>
        </div>
        <!-- STATISTICS -->
        <div class="stats-grid">
            <!-- TOTAL -->
            <div class="stat-card">
                <div class="stat-icon">
                    📦
                </div>
                <div>
                    <h3 id="totalOrders">
                        0
                    </h3>
                    <p>
                        Total Orders
                    </p>
                </div>
            </div>
            <!-- PENDING -->
            <div class="stat-card">
                <div class="stat-icon">
                    ⏳
                </div>
                <div>
                    <h3 id="pendingOrders">
                        0
                    </h3>
                    <p>
                        Pending Orders
                    </p>
                </div>
            </div>
            <!-- COMPLETED -->
            <div class="stat-card">
                <div class="stat-icon">
                    ✅
                </div>
                <div>
                    <h3 id="completedOrders">
                        0
                    </h3>
                    <p>
                        Completed Orders
                    </p>
                </div>
            </div>
        </div>
        <!-- ORDERS -->
        <section class="orders-section">
            <div class="orders-header">
                <div>
                    <h2>
                        Customer Orders
                    </h2>
                    <p>
                        Recent orders from Mana Ruchi customers
                    </p>
                </div>
                <button
                    id="clearOrdersBtn"
                    class="clear-button"
                    type="button"
                >
                    🗑️ Clear Orders
                </button>
            </div>
            <!-- DATABASE STATUS -->
            <div
                id="databaseMessage"
                class="database-message"
                aria-live="polite"
            ></div>
            <!-- ORDERS CONTAINER -->
            <div
                id="ordersContainer"
                class="orders-container"
            >
                <div class="no-orders">
                    <div class="no-orders-icon">
                        ⏳
                    </div>
                    <h3>
                        Loading Orders...
                    </h3>
                    <p>
                        Please wait.
                    </p>
                </div>
            </div>
        </section>
    </main>
</section>
<!-- =====================================
     SUPABASE
====================================== -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<!-- =====================================
     ADMIN JAVASCRIPT
====================================== -->
<script src="admin.js"></script>
</body>
</html>

Very important

Now your files should work like this:

CUSTOMER
index.html
     ↓
script.js
     ↓
Supabase
     ↓
orders table
     ↓
admin.js
     ↓
admin.html

So both pages must use the exact same Supabase URL and anon/publishable key.

Your admin dashboard also needs an admin.js that matches these IDs:

loginForm
username
password
loginError
loginSection
dashboardSection
logoutBtn
totalOrders
pendingOrders
completedOrders
clearOrdersBtn
ordersContainer
databaseMessage

I can give you that complete admin.js next. Don’t use the Firebase code from my earlier message—your website is using Supabase, so we should keep the whole project on Supabase.
