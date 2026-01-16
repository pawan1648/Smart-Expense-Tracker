// DOM Elements
const form = document.getElementById("form");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const alertEl = document.getElementById("alert");
const clearBtn = document.getElementById("clearAll");

const searchCategory = document.getElementById("searchCategory");
const dayFilter = document.getElementById("dayFilter");
const weekFilter = document.getElementById("weekFilter");
const monthFilter = document.getElementById("monthFilter");
const yearFilter = document.getElementById("yearFilter");

const topCategoryEl = document.getElementById("topCategory");
const savingStatusEl = document.getElementById("savingStatus");

let transactions = [];

// Populate Day Filter (1–31)
for (let d = 1; d <= 31; d++) {
  const opt = document.createElement("option");
  opt.value = d;
  opt.textContent = d;
  dayFilter.appendChild(opt);
}

// Populate Year Filter (last 10 years)
let currentYear = new Date().getFullYear();
for (let y = currentYear; y >= currentYear - 10; y--) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearFilter.appendChild(opt);
}

// Get Week Number
function getWeekNumber(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = Math.floor((d - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

// Get Current Time
function getCurrentTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// Get Day of Week
function getDayName(date) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[new Date(date).getDay()];
}

// Add Transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  if (!amount || !date || !category) {
    alertEl.textContent = "Please fill all fields!";
    setTimeout(() => (alertEl.textContent = ""), 3000);
    return;
  }

  const time = getCurrentTime();
  transactions.push({ type, amount, date, time, category });
  form.reset();
  updateList();
});

// Clear All
clearBtn.addEventListener("click", () => {
  transactions = [];
  updateList();
});

// Update List
function updateList() {
  list.innerHTML = "";

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);

    const matchCategory = searchCategory.value
      ? t.category.toLowerCase().includes(searchCategory.value.toLowerCase())
      : true;

    const matchDay = dayFilter.value
      ? d.getDate() == dayFilter.value
      : true;

    const matchWeek = weekFilter.value
      ? getWeekNumber(t.date) == weekFilter.value
      : true;

    const matchMonth = monthFilter.value
      ? (d.getMonth()+1) == monthFilter.value
      : true;

    const matchYear = yearFilter.value
      ? d.getFullYear() == yearFilter.value
      : true;

    return matchCategory && matchDay && matchWeek && matchMonth && matchYear;
  });

  filtered.forEach((t) => {
    const dayName = getDayName(t.date);

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.type} ₹${t.amount} (${t.category})</span>
      <span>${t.date} (${dayName}) ${t.time}</span>
    `;
    list.appendChild(li);
  });

  updateSummary(filtered);
}

// Update Summary
function updateSummary(arr) {
  let income = 0, expense = 0;
  const expenseMap = {};

  arr.forEach((t) => {
    if (t.type === "Income") income += t.amount;
    else {
      expense += t.amount;
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    }
  });

  balanceEl.textContent = `₹${income - expense}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;

  const topCat = Object.keys(expenseMap).reduce(
    (a,b) => expenseMap[a] > expenseMap[b] ? a : b, "-"
  );

  topCategoryEl.textContent = `Top Expense: ${topCat !== "-" ? topCat : "—"}`;
  savingStatusEl.textContent = `Savings: ₹${income - expense}`;
}

// Filters
searchCategory.addEventListener("input", updateList);
dayFilter.addEventListener("change", updateList);
weekFilter.addEventListener("change", updateList);
monthFilter.addEventListener("change", updateList);
yearFilter.addEventListener("change", updateList);
