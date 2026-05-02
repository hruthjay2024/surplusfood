function loadDonations() {
  fetch("http://localhost:5000/api/food/all")
    .then(res => res.json())
    .then(data => {

      let html = "";

      data.forEach(d => {
        html += `
        <tr>
          <td>${d.donorName}</td>
          <td>${d.foodType}</td>
          <td>${d.quantity}</td>
          <td>${d.pickupLocation}</td>
          <td>${d.phone}</td>
          <td>
            <select onchange="updateStatus('${d._id}',this.value)">
              <option ${d.status=="Pending"?"selected":""}>Pending</option>
              <option ${d.status=="Pickup Scheduled"?"selected":""}>Pickup Scheduled</option>
              <option ${d.status=="Food Collected"?"selected":""}>Food Collected</option>
              <option ${d.status=="Delivered to NGO"?"selected":""}>Delivered to NGO</option>
            </select>
          </td>
        </tr>
        `;
      });

      document.getElementById("donationTable").innerHTML = html;
    });
}

function updateStatus(id,status){
  fetch(`http://localhost:5000/api/food/status/${id}`,{
    method:"PUT",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({status})
  });
}

loadDonations();
setInterval(loadDonations,5000);
