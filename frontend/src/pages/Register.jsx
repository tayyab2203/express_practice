import { useState } from "react";
import { registerUser } from "../services/api";

// ── Styles ──────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0c0e12",
    fontFamily: "'DM Sans', sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#13161d",
    border: "1px solid #1f2330",
    borderRadius: "20px",
    padding: "48px 40px",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#4b5563",
    marginBottom: "10px",
  },
  heading: {
    fontSize: "30px",
    color: "#f3f4f6",
    lineHeight: 1.2,
    margin: "0 0 6px",
    fontFamily: "'DM Serif Display', serif",
  },
  headingAccent: { color: "#818cf8", fontStyle: "italic" },
  sub: {
    fontSize: "13px",
    color: "#4b5563",
    margin: "0 0 32px",
    fontWeight: 300,
  },
  field: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: "8px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#0c0e12",
    border: "1px solid #1f2330",
    borderRadius: "10px",
    padding: "13px 16px",
    fontSize: "14px",
    color: "#e5e7eb",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.02em",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "#374151",
    marginTop: "24px",
  },
  footerLink: { color: "#818cf8", textDecoration: "none" },
};

// ── Google Fonts load (ek baar) ──────────────────────────────
const linkId = "dm-fonts";
if (!document.getElementById(linkId)) {
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(link);
}

// ── Component ────────────────────────────────────────────────
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    // default new users to employee role
    const data = await registerUser({ name, email, password, role: "employee" });

    if (data.message) {
      alert("User registered successfully");
      window.location.href = "/login";
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Heading */}
        <p style={styles.eyebrow}>Get started</p>
        <h2 style={styles.heading}>
          Create your{" "}
          <span style={styles.headingAccent}>account</span>
        </h2>
        <p style={styles.sub}>Join us to manage your office</p>

        {/* Name */}
        <div style={styles.field}>
          <label style={styles.label}>Full name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button style={styles.button} onClick={handleRegister}>
          Create account
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={styles.footerLink}>Sign in</a>
        </p>

      </div>
    </div>
  );
}