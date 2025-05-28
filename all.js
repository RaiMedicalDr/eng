// all.js - 全ページ統合スクリプト

// ============================
// Firebase 初期化
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA6uWrfDjFnz1PFSPSDN_X8OHaHtZet_VA",
  authDomain: "lets-eng-dashboard.firebaseapp.com",
  databaseURL: "https://lets-eng-dashboard-default-rtdb.firebaseio.com",
  projectId: "lets-eng-dashboard",
  storageBucket: "lets-eng-dashboard.appspot.com",
  messagingSenderId: "1076284631243",
  appId: "1:1076284631243:web:8219ca09e8d2f11de8134e",
  measurementId: "G-MPCVC0F6S5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ============================
// Firebase 進捗データの保存 / 読み込み
// ============================
export function saveProgressToFirebase(grade, progress) {
  const progressRef = ref(database, `progress/${grade}`);
  return set(progressRef, progress);
}

export function loadProgressFromFirebase(grade, callback) {
  const progressRef = ref(database, `progress/${grade}`);
  onValue(progressRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

// ============================
// ログインフォーム制御（index.html）
// ============================
export function setupLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "tommy_0829" && password === "19440829") {
      alert("ようこそ、トミーさん！");
      window.location.href = "home.html";
    } else {
      document.getElementById("error-message").textContent = "ユーザー名またはパスワードが違います。";
    }
  });
}

// ============================
// カレンダー生成関数
// ============================
export function generateCalendar() {
  const calendar = document.getElementById("learningCalendar");
  if (!calendar) return;
  for (let i = 1; i <= 31; i++) {
    const day = document.createElement("div");
    day.classList.add("calendar-day");
    day.textContent = i;
    if ([2, 3, 9, 10, 16, 17, 23, 24, 30].includes(i)) {
      day.classList.add("completed");
    } else if ([5, 12, 19, 26].includes(i)) {
      day.classList.add("partial");
    }
    calendar.appendChild(day);
  }
}

// ============================
// サイドバー制御（共通）
// ============================
export function setupSidebarToggle() {
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");
  if (!toggleBtn || !sidebar) return;
  const icon = toggleBtn.querySelector("i");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    icon.classList.toggle("fa-angle-left");
    icon.classList.toggle("fa-angle-right");
  });
}

export function toggleSubmenu(id) {
  const submenu = document.getElementById(`submenu-${id}`);
  if (submenu) submenu.classList.toggle("active");
}

// ============================
// ダッシュボード グラフ描画（home.html）
// ============================
export function renderHomeChart() {
  const ctx = document.getElementById("progressChart")?.getContext("2d");
  if (!ctx) return;
  const tyuu1 = JSON.parse(localStorage.getItem("chartData1")) || { grammar: 30, vocab: 40, listening: 50, reading: 20 };
  const tyuu2 = JSON.parse(localStorage.getItem("chartData2")) || { grammar: 50, vocab: 60, listening: 70, reading: 60 };
  const tyuu3 = JSON.parse(localStorage.getItem("chartData3")) || { grammar: 70, vocab: 80, listening: 85, reading: 90 };
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['文法', '単語', 'リスニング', '読解'],
      datasets: [
        {
          label: '中学1年',
          data: Object.values(tyuu1),
          backgroundColor: 'rgba(75, 192, 192, 0.4)'
        },
        {
          label: '中学2年',
          data: Object.values(tyuu2),
          backgroundColor: 'rgba(255, 99, 132, 0.4)'
        },
        {
          label: '中学3年',
          data: Object.values(tyuu3),
          backgroundColor: 'rgba(54, 162, 235, 0.4)'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// ============================
// 学年ごとの進捗バー読み込み（tyuu1~3.html）
// ============================
export function loadProgressBar(gradeId) {
  const card = document.querySelector(".card");
  const fill = document.querySelector(".progress-bar-fill");
  if (!card || !fill) return;
  const localKey = `${gradeId}_progress`;
  const progress = localStorage.getItem(localKey) || 0;
  fill.style.width = `${progress}%`;
  card.querySelector("p").textContent = `現在の進捗: ${progress}% (単元は管理者が設定)`;
}
