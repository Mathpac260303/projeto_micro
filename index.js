const express = require("express");
const app = express();

let espValue = "No value yet";

// Show the last value received from ESP
app.get("/", (req, res) => {
  res.send(`
    🚀 SIM800L Cloud Server Running! <br>
    Last value received: ${espValue}
  `);
});

// ESP updates the value using GET /update?value=123
app.get("/update", (req, res) => {
  const v = req.query.value;

  if (!v) {
    return res.send("ERROR: missing ?value=");
  }

  espValue = v;
  console.log("ESP sent:", v);

  res.send("Value updated successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
