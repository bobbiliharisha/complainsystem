
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let complaints = [];
let id = 1;

// Add Complaint
app.post("/api/complaints", (req, res) => {
    const { name, email, complaint } = req.body;

    if (!name || !email || !complaint) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newComplaint = {
        id: id++,
        name,
        email,
        complaint,
        status: "Pending"
    };

    complaints.push(newComplaint);

    res.status(201).json(newComplaint);
});

// View All Complaints
app.get("/api/complaints", (req, res) => {
    res.json(complaints);
});

// Update Complaint Status
app.put("/api/complaints/:id", (req, res) => {
    const c = complaints.find(
        x => x.id === Number(req.params.id)
    );

    if (!c) {
        return res.status(404).json({
            message: "Complaint not found"
        });
    }

    if (req.body.status !== "Resolved") {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    c.status = "Resolved";

    res.json(c);
});

// Delete Complaint
app.delete("/api/complaints/:id", (req, res) => {
    const oldLength = complaints.length;

    complaints = complaints.filter(
        x => x.id !== Number(req.params.id)
    );

    if (complaints.length === oldLength) {
        return res.status(404).json({
            message: "Complaint not found"
        });
    }

    res.json({
        message: "Complaint deleted successfully"
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
