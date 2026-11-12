
const API = "/api/complaints";

const form = document.getElementById("complaintForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const complaintInput = document.getElementById("complaint");
const data = document.getElementById("data");

// Submit Complaint
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const complaintDetails = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        complaint: complaintInput.value.trim()
    };

    if (!complaintDetails.name ||
        !complaintDetails.email ||
        !complaintDetails.complaint) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaintDetails)
        });

        if (!res.ok) {
            throw new Error("Submission failed");
        }

        alert("Complaint submitted successfully!");

        form.reset();
        loadComplaints();

    } catch (error) {
        alert("Unable to submit complaint. Check your server.");
    }
});

// Load Complaints
async function loadComplaints() {
    try {
        const res = await fetch(API);

        if (!res.ok) {
            throw new Error("Loading failed");
        }

        const complaints = await res.json();

        // Dashboard Statistics
        document.getElementById("totalCount").textContent =
            complaints.length;

        document.getElementById("pendingCount").textContent =
            complaints.filter(c => c.status === "Pending").length;

        document.getElementById("resolvedCount").textContent =
            complaints.filter(c => c.status === "Resolved").length;

        // Display Complaint Records
        if (complaints.length === 0) {
            data.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No complaints found.
                    </td>
                </tr>
            `;
            return;
        }

        data.innerHTML = complaints.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${escapeHTML(c.name)}</td>
                <td>${escapeHTML(c.email)}</td>
                <td>${escapeHTML(c.complaint)}</td>

                <td>
                    <span class="status ${c.status === "Resolved" ? "Resolved" : "Pending"}">
                        ${c.status}
                    </span>
                </td>

                <td>
                    ${c.status !== "Resolved" ? `
                        <button class="action-btn resolve-btn"
                            onclick="updateStatus(${c.id})">
                            Resolve
                        </button>
                    ` : ""}

                    <button class="action-btn delete-btn"
                        onclick="deleteComplaint(${c.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        data.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Unable to load complaints. Check server connection.
                </td>
            </tr>
        `;
    }
}

// Escape user-entered text
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Resolve Complaint
async function updateStatus(id) {
    try {
        const res = await fetch(API + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "Resolved"
            })
        });

        if (!res.ok) {
            throw new Error("Update failed");
        }

        alert("Complaint resolved successfully!");
        loadComplaints();

    } catch (error) {
        alert("Unable to update complaint.");
    }
}

// Delete Complaint
async function deleteComplaint(id) {
    if (!confirm("Are you sure you want to delete this complaint?")) {
        return;
    }

    try {
        const res = await fetch(API + "/" + id, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error("Delete failed");
        }

        alert("Complaint deleted successfully!");
        loadComplaints();

    } catch (error) {
        alert("Unable to delete complaint.");
    }
}

// Initial Loading
loadComplaints();
