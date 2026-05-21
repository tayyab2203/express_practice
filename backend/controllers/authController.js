// ============================================================
// authController.js
// Yeh file do main kaam karti hai:
//   1. registerUser  — naya user banao aur DB mein save karo
//   2. loginUser     — email/password verify karo aur JWT do
// ============================================================

const { supabase } = require("../config/supabase"); // Supabase client (DB connection)
const bcrypt   = require("bcryptjs");           // Password hashing library
const jwt      = require("jsonwebtoken");       // JWT token banana ke liye

// ─────────────────────────────────────────────
// REGISTER: POST /register
// Body: { name, email, password, role }
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    // Request body se values nikalo
    const { name, email, password } = req.body;
    // default role to 'employee' when not provided by client
    const role = req.body.role || "employee";

    // Step 1: Password ko hash karo — plain text kabhi store nahi karte!
    // bcrypt 10 "salt rounds" use karta hai — jitna zyada, utna secure (par slow bhi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 2: Supabase ke "users" table mein naya row insert karo
    // .select() isliye lagaya hai taake inserted row wapas mile response mein
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword, // hashed password store hoga, original nahi
          role,                      // e.g. "admin" | "employee"
        }
      ])
      .select();

    // Agar Supabase ne error diya (e.g. duplicate email, constraint fail)
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Sab theek — success response bhejo
    res.json({
      message: "User registered successfully",
      user: data  // naya bana hua user record
    });

  } catch (err) {
    // Unexpected server error (e.g. DB down, code crash)
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// LOGIN: POST /login
// Body: { email, password }
// ─────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Email se user dhundo Supabase mein
    // .single() isliye ke exactly ek row chahiye (email unique hona chahiye)
    const { data, error } = await supabase
      .from("users")
      .select("*")           // saare columns chahiye (id, role, password, etc.)
      .eq("email", email)    // WHERE email = ?
      .single();

    // Agar user mila hi nahi
    if (error || !data) {
      return res.status(400).json({ message: "User not found" });
    }

    // Step 2: Entered password ko stored hash se compare karo
    // bcrypt internally hash karta hai aur match check karta hai
    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Step 3: JWT token banao
    // Payload mein user ka id aur role rakho (sensitive info mat rakho jaise password)
    // JWT_SECRET .env file mein hona chahiye — yeh token sign karta hai
    // expiresIn: "7d" matlab yeh token 7 din mein expire hoga
    const token = jwt.sign(
      {
        id:   data.id,
        role: data.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Token client ko bhejo — aur user ka minimal info include karo
    // (password secret rakhna hai, isliye sirf id + role bhejte hain)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: data.id,
        role: data.role
      }
    });

  } catch (err) {
    // Server level error
    res.status(500).json({ error: err.message });
  }
};

// Dono functions export karo taake routes mein use ho sakein
module.exports = { registerUser, loginUser };