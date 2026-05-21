const { supabase, supabaseAdmin } = require("../config/supabase");

// Admin: create a new role
const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Role name required" });

    const { data, error } = await supabase.from("roles").insert([{ name }]).select();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Role created", role: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: create/upload a document and assign to a user
// const createDocument = async (req, res) => {
//   try {
//     const { title, fileUrl, assignedUserId } = req.body;

//     if (!title || !fileUrl) return res.status(400).json({ message: "title and fileUrl required" });

//     // Use supabaseAdmin to bypass RLS
//     const { data, error } = await supabaseAdmin
//       .from("documents")
//       .insert([
//         {
//           title,
//           file_url: fileUrl,
//           owner_id: req.user.id,
//           assigned_user_id: assignedUserId || null,
//         },
//       ])
//       .select();

//     if (error) return res.status(400).json({ message: error.message });

//     res.json({ message: "Document created", document: data[0] });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// Admin: create/upload a document and assign to a user
// const createDocument = async (req, res) => {
//   try {
//     const { title, fileUrl, assignedUserId } = req.body;

//     if (!title || !fileUrl) return res.status(400).json({ message: "title and fileUrl required" });

//     let finalOwnerId = req.user.id;

//     // 1. Check if req.user.id exists in your custom public 'users' table
//     const { data: userCheck } = await supabaseAdmin
//       .from("users")
//       .select("id")
//       .eq("id", finalOwnerId)
//       .single();

//     // 2. If it's not found by ID, try finding the user by their email address
//     if (!userCheck && req.user.email) {
//       const { data: userByEmail } = await supabaseAdmin
//         .from("users")
//         .select("id")
//         .eq("email", req.user.email)
//         .single();
      
//       if (userByEmail) {
//         finalOwnerId = userByEmail.id;
//       } else {
//         return res.status(400).json({ message: "Logged in user does not exist in the public users table." });
//       }
//     } else if (!userCheck) {
//       return res.status(400).json({ message: "Invalid user account session." });
//     }

//     // 3. Insert into documents with the verified ID
//     const { data, error } = await supabaseAdmin
//       .from("documents")
//       .insert([
//         {
//           title,
//           file_url: fileUrl,
//           owner_id: finalOwnerId, // Use the verified table ID
//           assigned_user_id: assignedUserId || null,
//         },
//       ])
//       .select();

//     if (error) return res.status(400).json({ message: error.message });

//     res.json({ message: "Document created", document: data[0] });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// Admin: create/upload a document
// Admin: create/upload a document
// Admin: create/upload a document
// Admin: create/upload a document
// Admin: create/upload a document


// const createDocument = async (req, res) => {
//   try {
//     const { title, fileUrl, assignedUserId } = req.body;

//     if (!title || !fileUrl) {
//       return res.status(400).json({ message: "title and fileUrl required" });
//     }

//     console.log("Payload received:", { title, fileUrl, assignedUserId });

//     const { data, error } = await supabaseAdmin
//       .from("documents")
//       .insert([
//         {
//           title,
//           file_url: fileUrl,
//           owner_id: "a3914e26-16a3-4c18-820d-ad383167b6af",     // Ali (Admin)
//           assigned_user_id: assignedUserId || null,             // Make it optional
//         },
//       ])
//       .select();

//     if (error) {
//       console.error("Supabase Error:", error);
//       return res.status(400).json({ 
//         message: error.message,
//         details: error.details,
//         hint: "Check assigned_user_id or owner_id"
//       });
//     }

//     res.json({ 
//       success: true,
//       message: "✅ Document created successfully!", 
//       document: data[0] 
//     });

//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// Admin: create/upload a document
// Admin: create/upload a document
const createDocument = async (req, res) => {
  try {
    const { title, fileUrl, assignedUserId } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ message: "title and fileUrl required" });
    }

    const owner_id = "a3914e26-16a3-4c18-820d-ad383167b6af"; // Ali (Admin)

    console.log("Creating document → Owner:", owner_id, "| Assigned:", assignedUserId);

    const { data, error } = await supabaseAdmin
      .from("documents")
      .insert([
        {
          title,
          file_url: fileUrl,
          owner_id: owner_id,
          assigned_user_id: assignedUserId || null,
        },
      ])
      .select();

    if (error) {
      console.error("Insert Error:", error);
      return res.status(400).json({ 
        message: error.message,
        details: error.details 
      });
    }

    res.json({ 
      success: true,
      message: "✅ Document created successfully!", 
      document: data[0] 
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: err.message });
  }
};
// Employee: fetch documents assigned to the logged-in user
const getAssignedDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("assigned_user_id", userId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ documents: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: fetch all documents
const getAllDocuments = async (req, res) => {
  try {
    const { data, error } = await supabase.from("documents").select("*");

    if (error) return res.status(400).json({ message: error.message });

    res.json({ documents: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: list users (id, name, email, role)
const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("id, name, email, role");

    if (error) return res.status(400).json({ message: error.message });

    res.json({ users: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: upload file to Supabase Storage and return public URL
// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file provided" });
//     }

//     const file = req.file;
//     const fileName = `${Date.now()}-${file.originalname}`;
//     const filePath = `documents/${fileName}`;

//     // Upload to Supabase Storage bucket "documents"
//     const { data, error } = await supabase.storage
//       .from("documents")
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//       });

//     if (error) return res.status(400).json({ message: error.message });

//     // Get public URL
//     const { data: urlData } = supabase.storage
//       .from("documents")
//       .getPublicUrl(filePath);

//     res.json({ 
//       message: "File uploaded",
//       fileUrl: urlData.publicUrl,
//       fileName: file.originalname 
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file provided or upload failed" });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `documents/${fileName}`;

    // ✅ supabaseAdmin — RLS bypass karta hai
    const { data, error } = await supabaseAdmin.storage
      .from("documents")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) return res.status(400).json({ message: error.message });

    // ✅ Public URL bhi supabaseAdmin se lo
    const { data: urlData } = supabaseAdmin.storage
      .from("documents")
      .getPublicUrl(filePath);

    res.json({
      message: "File uploaded",
      fileUrl: urlData.publicUrl,
      fileName: file.originalname,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRole, createDocument, getAssignedDocuments, getAllDocuments, getUsers, uploadFile };

