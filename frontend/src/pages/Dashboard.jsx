import { useEffect, useState } from "react";
import {
  getDashboard,
  getAssignedDocuments,
  createRole,
  createDocument,
  getUsers,
  uploadFile,
} from "../services/api";

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
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  // Admin state
  const [roleName, setRoleName] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // ✅ role bhi lo

    if (!token) {
      window.location.href = "/login";
      return;
    }

    // ✅ Backend se role-based dashboard fetch karo
    getDashboard(role).then((data) => {
      if (data.message) {
        setMessage(data.message); // "Welcome Admin Dashboard" ya "Welcome Employee Dashboard"
        setUser({ name: "User", role }); // role bhi set karo
        if (role === "employee") {
          // fetch assigned documents
          getAssignedDocuments().then((dres) => {
            if (dres.documents) setDocuments(dres.documents);
          });
        } else if (role === "admin") {
          // fetch users for admin UI
          getUsers().then((ures) => {
            if (ures.users) setUsers(ures.users);
          });
        }
      } else {
        // 403 ya token expire — logout
        alert("Access Denied or session expired");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      setStatusMsg("Role name required");
      return;
    }
    const res = await createRole({ name: roleName });
    setStatusMsg(res.message || "Role created");
    setRoleName("");
  };

  // const handleCreateDocument = async () => {
  //   if (!title.trim() || !file) {
  //     setStatusMsg("Title and file required");
  //     return;
  //   }

  //   setUploading(true);
  //   setStatusMsg("Uploading file...");

  //   // Upload file first
  //   const uploadRes = await uploadFile(file);
  //   if (!uploadRes.fileUrl) {
  //     setStatusMsg(
  //       "File upload failed: " + (uploadRes.message || "Unknown error"),
  //     );
  //     setUploading(false);
  //     return;
  //   }

  //   // Then create document with the file URL
  //   // const res = await createDocument({
  //   //   title,
  //   //   fileUrl: uploadRes.fileUrl,
  //   //   assignedUserId: assignedUser || null
  //   // });
  //   const res = await createDocument({
  //     title,
  //     fileUrl: uploadRes.fileUrl,
  //     owner_id: assignedUser || null, // ← Correct key name
  //   });
  //   setStatusMsg(res.message || "Document created");
  //   setTitle("");
  //   setFile(null);
  //   setAssignedUser("");
  //   setUploading(false);
  // };
  // const handleCreateDocument = async () => {
  //   if (!title.trim() || !file) {
  //     setStatusMsg("Title and file required");
  //     return;
  //   }

  //   setUploading(true);
  //   setStatusMsg("Uploading file...");

  //   const uploadRes = await uploadFile(file);
  //   if (!uploadRes.fileUrl) {
  //     setStatusMsg("File upload failed");
  //     setUploading(false);
  //     return;
  //   }

  //   // ✅ Send both fields clearly
  //   const payload = {
  //     title,
  //     file_url: uploadRes.fileUrl, // Note: file_url (not fileUrl)
  //     owner_id: assignedUser || "5f081ebd-31c9-4d5c-8869-0fa068cbcb3f", // ← Tayyab's ID (your ID)
  //     assigned_user_id: assignedUser || null,
  //   };

  //   const res = await createDocument(payload);

  //   if (res.message?.includes("created") || res.success) {
  //     setStatusMsg("Document created successfully!");
  //   } else {
  //     setStatusMsg("Error: " + (res.message || JSON.stringify(res)));
  //   }

  //   setTitle("");
  //   setFile(null);
  //   setAssignedUser("");
  //   setUploading(false);
  // };

  // const handleCreateDocument = async () => {
  //   if (!title.trim() || !file) {
  //     setStatusMsg("Title and file required");
  //     return;
  //   }

  //   setUploading(true);
  //   setStatusMsg("Uploading file...");

  //   try {
  //     // 1. Upload file
  //     const uploadRes = await uploadFile(file);

  //     if (!uploadRes.fileUrl) {
  //       setStatusMsg(
  //         "File upload failed: " + (uploadRes.message || "No fileUrl returned"),
  //       );
  //       setUploading(false);
  //       return;
  //     }

  //     // 2. Prepare payload - Use exact field names that backend expects
  //     const payload = {
  //       title: title,
  //       fileUrl: uploadRes.fileUrl, // ← Important: fileUrl (camelCase)
  //       owner_id: assignedUser || null, // or use a default admin ID
  //       assigned_user_id: assignedUser || null,
  //     };

  //     console.log("Sending payload:", payload); // For debugging

  //     // 3. Create document
  //     const res = await createDocument(payload);

  //     console.log("Backend response:", res);

  //     if (res.success || res.message?.toLowerCase().includes("created")) {
  //       setStatusMsg("✅ Document created successfully!");
  //     } else {
  //       setStatusMsg("❌ " + (res.message || "Unknown error"));
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setStatusMsg("Error: " + error.message);
  //   }

  //   // Reset form
  //   setTitle("");
  //   setFile(null);
  //   setAssignedUser("");
  //   setUploading(false);
  // };

  // const handleCreateDocument = async () => {
  //   if (!title.trim() || !file) {
  //     setStatusMsg("Title and file required");
  //     return;
  //   }

  //   setUploading(true);
  //   setStatusMsg("Uploading...");

  //   try {
  //     const uploadRes = await uploadFile(file);
  //     if (!uploadRes.fileUrl) {
  //       setStatusMsg("File upload failed");
  //       return;
  //     }

  //     const safeOwnerId =
  //       assignedUser || "5f081ebd-31c9-4d5c-8869-0fa068cbcb3f";

  //     const payload = {
  //       title,
  //       fileUrl: uploadRes.fileUrl,
  //       owner_id: safeOwnerId,
  //       assigned_user_id: assignedUser || null,
  //     };

  //     console.log("Final Payload:", payload);

  //     const res = await createDocument(payload);
  //     console.log("Response:", res);

  //     if (res.message?.toLowerCase().includes("created") || res.success) {
  //       setStatusMsg("✅ Document created successfully!");
  //     } else {
  //       setStatusMsg("❌ " + (res.message || JSON.stringify(res)));
  //     }
  //   } catch (err) {
  //     setStatusMsg("Error: " + err.message);
  //   }

  //   setTitle("");
  //   setFile(null);
  //   setAssignedUser("");
  //   setUploading(false);
  // };
  const handleCreateDocument = async () => {
    if (!title.trim() || !file) {
      setStatusMsg("Title and file required");
      return;
    }

    setUploading(true);
    setStatusMsg("Uploading...");

    try {
      const uploadRes = await uploadFile(file);
      if (!uploadRes?.fileUrl) {
        setStatusMsg("File upload failed");
        return;
      }

      const payload = {
        title,
        fileUrl: uploadRes.fileUrl,
        assignedUserId: assignedUser || null, // Keep this name
      };

      const res = await createDocument(payload);

      if (res.success) {
        setStatusMsg("✅ Document created successfully!");
      } else {
        setStatusMsg("❌ " + (res.message || "Failed to create"));
      }
    } catch (err) {
      setStatusMsg("Error: " + err.message);
    }

    setTitle("");
    setFile(null);
    setAssignedUser("");
    setUploading(false);
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
          {/* ✅ Backend ka message yahan show hoga */}
          <p style={styles.subText}>
            {message || "Here's what's happening with your office today"}
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
              Manage employees, view reports, and configure office settings from
              the admin panel.
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
              {/* ✅ Role dynamically show hoga localStorage se */}
              Role:{" "}
              <strong style={{ color: "#818cf8" }}>
                {user?.role === "admin"
                  ? "Administrator"
                  : user?.role === "employee"
                    ? "Employee"
                    : "—"}
              </strong>
            </p>
            <p style={styles.cardText}>
              Status: <strong style={{ color: "#10b981" }}>Active</strong>
            </p>
          </div>
        </div>

        {/* Admin Controls */}
        {user?.role === "admin" && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>
              Admin Controls
            </h2>

            {/* Create Role Section */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                Create Role
              </h3>
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <input
                  type="text"
                  placeholder="Role name (e.g., Manager, HR)"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  style={{
                    padding: "12px",
                    background: "#0c0e12",
                    border: "1px solid #1f2330",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontFamily: "'DM Sans', sans-serif",
                    flex: 1,
                  }}
                />
                <button
                  onClick={handleCreateRole}
                  style={{
                    padding: "12px 24px",
                    background: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Create Role
                </button>
              </div>
            </div>

            {/* Create Document Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                Upload Document
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Document Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    padding: "12px",
                    background: "#0c0e12",
                    border: "1px solid #1f2330",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{
                    padding: "12px",
                    background: "#0c0e12",
                    border: "1px solid #1f2330",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  style={{
                    padding: "12px",
                    background: "#0c0e12",
                    border: "1px solid #1f2330",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <option value="">-- Select employee (optional) --</option>
                  {/* {users
                    .filter((u) => u.role === "employee")
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.email}
                      </option>
                    ))} */}
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email} ({u.id})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateDocument}
                  disabled={uploading}
                  style={{
                    padding: "12px 24px",
                    background: uploading ? "#6b7280" : "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: uploading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </button>
                {file && (
                  <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            {statusMsg && (
              <p
                style={{
                  color: "#10b981",
                  fontSize: "14px",
                  marginTop: "12px",
                }}
              >
                ✓ {statusMsg}
              </p>
            )}
          </div>
        )}

        {/* Documents section for employees */}
        {user?.role === "employee" && (
          <div style={{ marginTop: 32 }}>
            <h2>Documents assigned to you</h2>
            {documents.length === 0 ? (
              <p>No documents assigned.</p>
            ) : (
              <ul>
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <a href={doc.file_url} target="_blank" rel="noreferrer">
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
