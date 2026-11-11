const API = "/api/complaints";

async function addComplaint() {
  await fetch(API, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      complaint: complaint.value
    })
  });

  name.value = "";
  email.value = "";
  complaint.value = "";
  loadComplaints();
}

async function loadComplaints() {
  const res = await fetch(API);
  const users = await res.json();

  data.innerHTML = users.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.complaint}</td>
      <td>${c.status}</td>
      <td>
        <button onclick="updateStatus(${c.id})">Resolve</button>
        <button onclick="deleteComplaint(${c.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

async function updateStatus(id) {
  await fetch(API + "/" + id, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({status:"Resolved"})
  });
  loadComplaints();
}

async function deleteComplaint(id) {
  await fetch(API + "/" + id, {method:"DELETE"});
  loadComplaints();
}

loadComplaints();