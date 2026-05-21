// ============================================================
// src/api/auth.js  (ya services/authService.js)
//
// Yeh file ek "bridge" hai React app aur backend ke beech.
// Directly fetch() call karne ki bajaye, hum yahan
// reusable functions banate hain — ek jagah se manage karo.
// ============================================================

// Backend ka base URL — sab requests yahan se shuru hongi
// Production mein yeh environment variable se aana chahiye:
//   const BASE_URL = import.meta.env.VITE_API_URL;
// const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "https://express-practice-9oi6.vercel.app/api";


// ─────────────────────────────────────────────────────
// LOGIN FUNCTION
// Use: loginUser({ email: "abc@gmail.com", password: "123" })
// Returns: { message, token }  ya  { message: "User not found" }
// ─────────────────────────────────────────────────────
export const loginUser = async (data) => {
  // fetch() browser ka built-in HTTP client hai
  // pehla argument: URL
  // doosra argument: options object (method, headers, body)
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",           // HTTP POST request — data bhej rahe hain

    headers: {
      // Backend ko batao ke body mein JSON aa raha hai
      // iske bina Express req.body mein kuch nahi milega
      "Content-Type": "application/json",
    },

    // data object ko JSON string mein convert karo
    // e.g. { email: "x", password: "y" }  →  '{"email":"x","password":"y"}'
    body: JSON.stringify(data),
  });

  // Response ko parse karo — JSON string se JS object banta hai
  // Yahi woh value hai jo calling component ko milegi
  return res.json();
};


// ─────────────────────────────────────────────────────
// REGISTER FUNCTION
// Use: registerUser({ name: "Ali", email: "...", password: "...", role: "user" })
// Returns: { message, user }  ya  { error: "..." }
// ─────────────────────────────────────────────────────
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  // Backend se jo bhi response aaye — parsed JS object return karo
  return res.json();
};


// ─────────────────────────────────────────────────
// DASHBOARD FETCH (role-based)
// ─────────────────────────────────────────────────
export const getDashboard = async (role) => {
  const token = localStorage.getItem("token");

  const endpoint = role === "admin"
    ? `${BASE_URL}/admin/dashboard`
    : `${BASE_URL}/employee/dashboard`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,  // JWT token bhejo
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

// Create role (admin)
export const createRole = async (roleData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roleData),
  });

  return res.json();
};

// Create document (admin) — accepts { title, fileUrl, assignedUserId }
export const createDocument = async (doc) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(doc),
  });

  return res.json();
};

// Get documents assigned to logged-in employee
export const getAssignedDocuments = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/employee/documents`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

// Admin: list users
export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

// Admin: upload file to backend storage
export const uploadFile = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file, file.name);

  const res = await fetch(`${BASE_URL}/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};
