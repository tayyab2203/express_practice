// // express import ho raaha hai
// const express = require("express");

// // instance of express banaya hai, jisse hum apne server ko control kar sakte hai
// const app = express();

// // express.json() middleware ko use kar rahe hai, jisse hum apne server par json data ko parse kar sakte hai
// app.use(express.json());

// // aik route banaya hai, jisse jab bhi user "/" route par request karega, to server "Server Running" message send karega)
// app.get("/", (req, res) => {
//   res.send("Server Running");
// });

// // server ko 5000 port par listen karne ke liye kaha hai, aur jab server start ho jaye to "Server Started" message console par print karega
// app.listen(5000, () => {
//   console.log("Server Started");
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on", process.env.PORT);
});