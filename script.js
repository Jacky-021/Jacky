// ---------- Dashboard data (sample figures – replace with real numbers) ----------
const DATA = {
  week:  {received: 38,  dispatched: 33,  stock: 412, out: 6, open: 14, bookings: 28,   sales: "₹1.1L",  csat: 4.9},
  month: {received: 162, dispatched: 149, stock: 412, out: 6, open: 14, bookings: 118,  sales: "₹4.82L", csat: 4.9},
  year:  {received: 1840,dispatched: 1772,stock: 412, out: 6, open: 14, bookings: 1320, sales: "₹52L",   csat: 4.8}
};
const MONTHS = ["May","Jun","Jul","Aug","Sep","Oct"];
const RECEIVED = [128,141,155,170,149,162];
const DISPATCHED = [120,133,148,160,142,149];
const STOCKOUT = ["Room cooler","Ceiling fan","Induction cooktop","Mixer grinder","Dry iron","Wiring cable 1.5 mm"];
const CYAN = "#29C7E8", RED = "#D91A2B";

function renderKpis(period){
  const d = DATA[period];
  const rate = Math.round(d.dispatched / d.received * 1000) / 10;
  const items = [
    ["Orders received", d.received.toLocaleString("en-IN")],
    ["Orders dispatched", d.dispatched.toLocaleString("en-IN")],
    ["Dispatch rate", rate + "%"],
    ["Items in stock", d.stock],
    ["Stock-out items", d.out, true],
    ["Repair bookings", d.bookings.toLocaleString("en-IN")],
    ["Open repairs", d.open],
    ["Sales", d.sales],
    ["Customer satisfaction", d.csat + " / 5"]
  ];
  document.getElementById("kpis").innerHTML = items.map(
    i => `<div class="kpi${i[2] ? " warn" : ""}"><b>${i[1]}</b><span>${i[0]}</span></div>`
  ).join("");
}

function renderChart(){
  const svg = document.getElementById("chart");
  const W = 560, H = 280, left = 40, bottom = 36, top = 20;
  const max = 200, plotH = H - bottom - top, slot = (W - left - 10) / MONTHS.length;
  let out = "";
  for (let v = 0; v <= max; v += 50){
    const y = top + plotH - v / max * plotH;
    out += `<line x1="${left}" x2="${W-10}" y1="${y}" y2="${y}" stroke="currentColor" opacity=".15"/><text x="${left-6}" y="${y+4}" text-anchor="end">${v}</text>`;
  }
  MONTHS.forEach((m, i) => {
    const x = left + i * slot + slot * .12, bw = slot * .36;
    const h1 = RECEIVED[i] / max * plotH, h2 = DISPATCHED[i] / max * plotH;
    out += `<rect x="${x}" y="${top+plotH-h1}" width="${bw}" height="${h1}" fill="${CYAN}"><title>${m}: ${RECEIVED[i]} received</title></rect>`;
    out += `<rect x="${x+bw+2}" y="${top+plotH-h2}" width="${bw}" height="${h2}" fill="${RED}"><title>${m}: ${DISPATCHED[i]} dispatched</title></rect>`;
    out += `<text x="${x+bw}" y="${H-bottom+16}" text-anchor="middle">${m}</text>`;
  });
  out += `<rect x="${left}" y="${H-12}" width="10" height="10" fill="${CYAN}"/><text x="${left+14}" y="${H-3}">Received</text>`;
  out += `<rect x="${left+90}" y="${H-12}" width="10" height="10" fill="${RED}"/><text x="${left+104}" y="${H-3}">Dispatched</text>`;
  svg.innerHTML = out;
}

// ---------- Repair tracking (interactive feature) ----------
const ORDERS = {
  "EF-1024": {item: "LED TV", stage: 4, note: "Repair complete. Ready for delivery today."},
  "EF-1025": {item: "AC", stage: 2, note: "Diagnosis in progress. We will call with the estimate."},
  "EF-1026": {item: "Laptop", stage: 3, note: "Repair under way."},
  "EF-1027": {item: "Mobile", stage: 3, note: "Waiting for a spare part."}
};
const STAGES = ["Received", "Diagnosis", "Repairing", "Ready"];

document.getElementById("trackForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("orderId").value.trim().toUpperCase();
  const box = document.getElementById("trackResult");
  const o = ORDERS[id];
  if (!o){
    box.innerHTML = `<p class="err">No repair found for “${id.replace(/[<>&]/g,"")}”. Check the ticket number on your slip or call the shop.</p>`;
    return;
  }
  box.innerHTML = `<div class="result"><p><strong>${id}</strong> – ${o.item} repair</p>
    <p>Status: <strong>${STAGES[o.stage-1]}</strong>. ${o.note}</p>
    <ol class="steps">${STAGES.map((s,i)=>`<li class="${i<o.stage?"done":""}">${s}</li>`).join("")}</ol></div>`;
});

// ---------- Enquiry form: opens the customer's email app with the details filled in ----------
document.getElementById("enquiryForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const body = `Name: ${v("name")}\nPhone: ${v("phone")}\nTopic: ${v("topic")}\n\n${v("msg")}`;
  window.location.href = `mailto:jaikee021@gmail.com?subject=${encodeURIComponent("Enquiry: " + v("topic"))}&body=${encodeURIComponent(body)}`;
  document.getElementById("formMsg").textContent = "Your email app is opening. Send the message to complete your enquiry.";
});

// ---------- Setup ----------
const period = document.getElementById("period");
period.addEventListener("change", () => renderKpis(period.value));
document.getElementById("stockout").innerHTML = STOCKOUT.map(s => `<li>${s}</li>`).join("");
document.getElementById("year").textContent = new Date().getFullYear();
renderKpis(period.value);
renderChart();
