const startBtn = document.getElementById("startBtn");
const tdArr = document.getElementsByTagName("td");
const COLOR = ["red", "skyblue", "olive", "green", "blue", "purple", "brown", "black"];
let row;
let col;

startBtn.addEventListener("click", setGame);
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

function setGame() {
  const gameSet = document.querySelector(".gameSet");
  gameSet.style.display = "none";

  row = parseInt(document.getElementById("row").value);
  col = parseInt(document.getElementById("col").value);
  const mineNum = parseInt(document.getElementById("mineNum").value);
  const mineArr = setMineNumArr(mineNum, row * col);

  makeBoard(row, col);
  putMineInBoard(mineArr);



  for (let i = 0; i < tdArr.length; i++) {
    tileEvent(i, getAroundArr(i));
  }
}

function getAroundArr(num) {
  if (num === 0) return [1, row, row + 1];
  if (num === row - 1) return [row - 2, 2 * row - 2, 2 * row - 1];
  if (num === row * (col - 1)) return [row * (col - 2), row * (col - 2) + 1, row * (col - 1) + 1];
  if (num === row * col - 1) return [row * (col - 1) - 2, row * (col - 1) - 1, row * col - 2];
  if (0 < num && num < row - 1) return [num - 1, num + 1, num + row - 1, num + row, num + row + 1];
  if (row * (col - 1) < num && num < row * col - 1) return [num - row - 1, num - row, num - row + 1, num - 1, num + 1];
  if (num % row === 0) return [num - row, num - row + 1, num + 1, num + row, num + row + 1];
  if (num % row === row - 1) return [num - row - 1, num - row, num - 1, num + row - 1, num + row];
  return [num - row - 1, num - row, num - row + 1, num - 1, num + 1, num + row - 1, num + row, num + row + 1];
}


function makeBoard(rowNum, colNum) {
  let tableEle = "<table>";

  for (let i = 0; i < colNum; i++) {
    tableEle += "<tr>";
    for (let j = 0; j < rowNum; j++) {
      tableEle += "<td></td>"
    }
    tableEle += "</tr>";
  }
  tableEle += "</table>";
  document.getElementById("gameBoard").innerHTML = tableEle;
}


function setMineNumArr(numLimit, numRange) {
  let mineArr = [];
  for (let i = 0; i < numLimit; i++) {
    let randomNum = Math.floor(Math.random() * numRange);
    if (mineArr.indexOf(randomNum) === -1) {
      mineArr.push(randomNum);
    } else {
      i--;
    }
  }
  return mineArr;
}


function putMineInBoard(mine) {
  for (let i = 0; i < tdArr.length; i++) {
    if (mine.indexOf(i) !== -1) {
      tdArr[i].classList.add("mine");
    }
  }
}

function clickTile(targetNum, aroundArr) {
  const targetTile = tdArr[targetNum];
  if (!targetTile) return; 

  if (targetTile.className !== "flag" && targetTile.className !== "qmark" && targetTile.className !== "mine flag" && targetTile.className !== "mine qmark") {
    let count = 0;
    for (let j = 0; j < aroundArr.length; j++) {
      const aroundTile = tdArr[aroundArr[j]];
      if (aroundTile && aroundTile.classList.contains("mine")) 
        count++;
    }
    if (targetTile.className === "mine") {
      alert("GAME OVER!!!");
      window.location.reload();
    } else if (count === 0) {
      targetTile.style.backgroundColor = "rgb(225, 250, 173)";
      targetTile.dataset.isOpen = "true"; 
      for (let k = 0; k < aroundArr.length; k++) {
        const aroundTile = tdArr[aroundArr[k]];
        if (aroundTile && !aroundTile.dataset.isOpen) { 
          clickTile(aroundArr[k], getAroundArr(aroundArr[k]));
        }
      }
    } else if (count > 0) {
      targetTile.dataset.isOpen = "true"; 
      targetTile.style.color = COLOR[count - 1];
      targetTile.textContent = count;
    }
  }
}


function tileEvent(targetNum, aroundArr) {
  tdArr[targetNum].addEventListener("click", function () {
    clickTile(targetNum, aroundArr);
  });

  tdArr[targetNum].addEventListener("auxclick", function () {
    if (tdArr[targetNum].dataset.isOpen === "true") return;
    if (tdArr[targetNum].className === "flag" || tdArr[targetNum].className === "mine flag") {
      tdArr[targetNum].classList.remove("flag");
      tdArr[targetNum].classList.add("qmark");
      tdArr[targetNum].innerHTML = "❓";
    }
    else if (tdArr[targetNum].className === "qmark" || tdArr[targetNum].className === "mine qmark") {
      tdArr[targetNum].classList.remove("qmark");
      tdArr[targetNum].innerHTML = "";
      tdArr[targetNum].style.backgroundColor = "";
    }
    else {
      tdArr[targetNum].classList.add("flag");
      tdArr[targetNum].innerHTML = "🚩";
      tdArr[targetNum].style.backgroundColor = "rgb(255, 255, 160)";
    }
  });
}