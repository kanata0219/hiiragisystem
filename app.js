<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>座席管理システム</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>座席管理システム</h1>

  <div id="seat-container"></div>

  <div id="controls">
    <button id="clear-all">全てクリア</button>
    <button id="export-log">ログをダウンロード</button>
  </div>

  <div id="log-container">
    <h2>ログ</h2>
    <ul id="log-list"></ul>
  </div>

  <!-- モーダル -->
  <div id="modal" class="hidden">
    <div class="modal-content">
      <h3>座席登録</h3>
      <label>名前：<input type="text" id="input-name" /></label><br />
      <label>番号：<input type="text" id="input-number" /></label><br />
      <button id="register-btn">登録</button>
      <button id="cancel-btn">キャンセル</button>
    </div>
  </div>

  <!-- 退席確認モーダル -->
  <div id="confirm-exit" class="hidden">
    <div class="modal-content">
      <p>退席してもよいですか？</p>
      <button id="confirm-yes">はい</button>
      <button id="confirm-no">いいえ</button>
    </div>
  </div>

  <script>
    const seatContainer = document.getElementById("seat-container");
    const logList = document.getElementById("log-list");
    const modal = document.getElementById("modal");
    const confirmModal = document.getElementById("confirm-exit");
    const inputName = document.getElementById("input-name");
    const inputNumber = document.getElementById("input-number");

    let selectedSeat = null;
    const seats = {};
    const logs = [];

    function createSeatGrid() {
      const layout = [3, 4, 3];
      for (let row = 0; row < 7; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        layout.forEach((count, groupIndex) => {
          const groupDiv = document.createElement("div");
          groupDiv.classList.add("seat-group");
          for (let i = 0; i < count; i++) {
            const col = layout.slice(0, groupIndex).reduce((a, b) => a + b, 0) + i;
            const seatId = `R${row + 1}C${col + 1}`;
            const btn = document.createElement("button");
            btn.classList.add("seat");
            btn.textContent = seatId;
            btn.dataset.seatId = seatId;
            btn.addEventListener("click", () => onSeatClick(seatId, btn));
            groupDiv.appendChild(btn);
            seats[seatId] = { name: "", number: "", btn };
          }
          rowDiv.appendChild(groupDiv);
        });
        seatContainer.appendChild(rowDiv);
      }
    }

    function onSeatClick(seatId, btn) {
      selectedSeat = seatId;
      const seat = seats[seatId];
      if (seat.name || seat.number) {
        confirmModal.classList.remove("hidden");
      } else {
        inputName.value = "";
        inputNumber.value = "";
        modal.classList.remove("hidden");
      }
    }

    document.getElementById("register-btn").onclick = () => {
      const name = inputName.value.trim();
      const number = inputNumber.value.trim();
      if (!name || !number) return;
      const seat = seats[selectedSeat];
      seat.name = name;
      seat.number = number;
      seat.btn.textContent = `${name}\n${number}`;
      seat.btn.classList.add("occupied");
      logAction("登録", selectedSeat, name, number);
      modal.classList.add("hidden");
    };

    document.getElementById("cancel-btn").onclick = () => {
      modal.classList.add("hidden");
    };

    document.getElementById("confirm-yes").onclick = () => {
      const seat = seats[selectedSeat];
      logAction("退席", selectedSeat, seat.name, seat.number);
      seat.name = "";
      seat.number = "";
      seat.btn.textContent = selectedSeat;
      seat.btn.classList.remove("occupied");
      confirmModal.classList.add("hidden");
    };

    document.getElementById("confirm-no").onclick = () => {
      confirmModal.classList.add("hidden");
    };

    document.getElementById("clear-all").onclick = () => {
      Object.keys(seats).forEach(id => {
        const seat = seats[id];
        seat.name = "";
        seat.number = "";
        seat.btn.textContent = id;
        seat.btn.classList.remove("occupied");
      });
      logAction("全クリア", "", "", "");
    };

    function logAction(action, seatId, name, number) {
      const timestamp = new Date().toLocaleString();
      const log = `${timestamp} [${action}] ${seatId} ${name} ${number}`;
      logs.push(log);
      const li = document.createElement("li");
      li.textContent = log;
      logList.appendChild(li);
    }

    document.getElementById("export-log").onclick = () => {
      const blob = new Blob([logs.join("\n")], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "seat_log.txt";
      link.click();
    };

    createSeatGrid();
  </script>
</body>
</html>
