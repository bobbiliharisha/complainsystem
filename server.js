const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let complaints = [];
let id = 1;

// Add complaint
app.post("/api/complaints", (req, res) => {
  const complaint = { id: id++, ...req.body, status: "Pending" };
  complaints.push(complaint);
  res.json(complaint);
});

// View complaints
app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

// Update status
app.put("/api/complaints/:id", (req, res) => {
  const c = complaints.find(x => x.id == req.params.id);
  if (!c) return res.status(404).json({message:"Not found"});
  c.status = req.body.status;
  res.json(c);
});

// Delete complaint
app.delete("/api/complaints/:id", (req, res) => {
  complaints = complaints.filter(x => x.id != req.params.id);
  res.json({message:"Complaint deleted"});
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);
