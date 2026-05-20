import { useEffect, useState } from "react";

// ── Styles ──────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0c0e12",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e5e7eb",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "#13161d",
    borderBottom: "1px solid #1f2330",
  },
  navBrand: {
    fontSize: "22px",
    fontWeight: 600,
    fontFamily: "'DM Serif Display', serif",
    color: "#818cf8",
  },
  logoutBtn: {
    padding: "10px 20px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background 0.3s",
  },
  container: {
    // maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    marginBottom: "40px",
  },
  greeting: {
    fontSize: "28px",
    fontFamily: "'DM Serif Display', serif",
    color: "#f3f4f6",
    margin: "0 0 8px",
  },
  subText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#13161d",
    border: "1px solid #1f2330",
    borderRadius: "16px",
    padding: "32px",
    transition: "border 0.3s",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#f3f4f6",
    margin: "0 0 12px",
  },
  cardText: {
    fontSize: "14px",
    color: "#9ca3af",
    lineHeight: 1.6,
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#818cf8",
    margin: "12px 0",
  },
};

// ── Google Fonts load ──────────────────────────────────────────
const linkId = "dm-fonts";
if (!document.getElementById(linkId)) {
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

// ── Component ────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    } else {
      // You can decode JWT to get user info if needed
      setUser({ name: "User", role: "Admin" });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={styles.page}>
      {/* ── Navbar ──────────────────────────────────────────── */}
      <div style={styles.navbar}>
        <div style={styles.navBrand}>OfficeManagement</div>
        <button
          style={styles.logoutBtn}
          onClick={logout}
          onMouseEnter={(e) => (e.target.style.background = "#dc2626")}
          onMouseLeave={(e) => (e.target.style.background = "#ef4444")}
        >
          Logout
        </button>
      </div>

      {/* ── Main Content ────────────────────────────────────── */}
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.greeting}>Welcome back!</h1>
          <p style={styles.subText}>
            Here's what's happening with your office today
          </p>
        </div>

        {/* Stats Grid */}
        <div style={styles.grid}>
          {/* Card 1: Quick Stats */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Employees</h3>
            <div style={styles.statNumber}>24</div>
            <p style={styles.cardText}>Active team members</p>
          </div>

          {/* Card 2: Tasks */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Pending Tasks</h3>
            <div style={styles.statNumber}>8</div>
            <p style={styles.cardText}>Tasks awaiting your attention</p>
          </div>

          {/* Card 3: Announcements */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Announcements</h3>
            <div style={styles.statNumber}>3</div>
            <p style={styles.cardText}>New office announcements</p>
          </div>

          {/* Card 4: Settings */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Quick Access</h3>
            <p style={styles.cardText}>
              Manage employees, view reports, and configure office settings from the admin panel.
            </p>
          </div>

          {/* Card 5: Support */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Need Help?</h3>
            <p style={styles.cardText}>
              Check our documentation or contact support for assistance.
            </p>
          </div>

          {/* Card 6: Profile */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Your Profile</h3>
            <p style={styles.cardText}>
              Role: <strong style={{ color: "#818cf8" }}>Administrator</strong>
            </p>
            <p style={styles.cardText}>
              Status: <strong style={{ color: "#10b981" }}>Active</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}