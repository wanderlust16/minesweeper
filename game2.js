// === reset button === // 
function reset(){
    while(map.hasChildNodes()) {
        map.removeChild(map.firstChild);
    } 
    gameStart();
}

// === map logic === // 

document.getElementById("play").addEventListener('click', gameStart);

    function gameStart(){
    const map = document.getElementById("map")
    const row = parseInt(document.getElementById("row").value);
    const col = parseInt(document.getElementById("col").value);
    const mineNum = parseInt(document.getElementById("mine").value);
    const time = document.getElementById("timer");
    
    time.innerText = 0;
    function countTime() {
        time.innerText++;
    }
    setInterval(countTime, 1000);
    
    let isOver = false; 
    if (row < 5 || row > 30 || col < 5 || col > 30) {
        alert("칸 개수를 올바르게 설정해 주세요!")
    } else if (mineNum < 0 || mineNum > row * col) {
        alert("지뢰 개수를 올바르게 설정해 주세요!")
    } else {

    let minesLeft = document.getElementById("minesLeft")
    minesLeft.innerHTML = mineNum;

    const cells = [];
    
    for (let i=0; i<col; i++){ 
        cells[i] = new Array();
        const arr = document.createElement('div');
        map.appendChild(arr);
        arr.setAttribute('class', 'arr');
        for (let j=0; j<row; j++){
            const cell = document.createElement('div');
            cell.setAttribute('x', j) 
            cell.setAttribute('y', i)
            cells[i][j] = cell;            
            arr.appendChild(cell);
            cell.setAttribute('class', 'defaultCell');
            cell.addEventListener("click", handleClick);
            cell.addEventListener("contextmenu", rightClick);
        }
    }
    placeMine();

    // === 지뢰심기 === // 

    function placeMine() {
        for(let i=0; i<mineNum; i++) { 
            const rdmX = Math.floor(Math.random() * col);
            const rdmY = Math.floor(Math.random() * row);
            const mineCell = cells[rdmX][rdmY];
            mineCell.classList.add('mineCell');
            if (isOver) {
                mineCell.style.backgroundColor = 'red'
            };
        }
    }

    // === Click === //

    function handleClick(cell){
        if (cell.currentTarget.classList.contains("mineCell")) {
            gameOver(); 
            isOver = true;
        } else {
            openCell(cell);
        }; 
    }

    function getNeighborCells(cell) {  
        const i = parseInt(cell.currentTarget.getAttribute("x"));
        const j = parseInt(cell.currentTarget.getAttribute("y"));
        let neighborCells = [];
        if (j === 0) {
            surroundCells = [
                cells[j][i-1],
                cells[j+1][i-1], 
                cells[j+1][i],
                cells[j][i+1],
                cells[j+1][i+1] 
            ]
        } else if (j === row - 1) {
            surroundCells = [
                cells[j-1][i-1],
                cells[j][i-1],
                cells[j-1][i],
                cells[j-1][i+1],
                cells[j][i+1],
            ]
        } else {
        surroundCells = [
            cells[j-1][i-1], 
            cells[j][i-1],
            cells[j+1][i-1], 
            cells[j-1][i],
            cells[j+1][i],
            cells[j-1][i+1],
            cells[j][i+1],
            cells[j+1][i+1] 
            ]
        }
         
        neighborCells = surroundCells.filter(surroundCell => surroundCell !== undefined)
        return neighborCells;
    }
    
    function openCell(cell) {
        const neighborCells = getNeighborCells(cell);
        cell.currentTarget.classList.remove("defaultCell");
        cell.currentTarget.classList.add("isOpen");
        let mineCount = 0
        neighborCells.forEach(neighborCell => {
            if(neighborCell.classList.contains("mineCell")) {
                mineCount++;
            }
        })
        // neighborCells.forEach(neighborCell => console.log(neighborCell));
        if(mineCount > 0) {
            cell.currentTarget.textContent = mineCount;
        } else {
            neighborCells.forEach(neighborCell => {
                neighborCell;// neighborCell을 초기화해야 openCell의 재귀함수를 call할 수 있을 것 같은데, 어떻게 초기화해야하는지 모르겠습니다.
                if(!neighborCell.classList.contains("isOpen")) {
                    openCell(neighborCell);
                }
            });
        };

        if(document.getElementsByClassName("isOpen").length === row * col - mineNum){
            gameWin();
        }
    };
    
    // === 우클릭 === //

    function rightClick(e) {
        if (e.currentTarget.className === "defaultCell") {  
            e.preventDefault();
            e.currentTarget.className="flagCell";
            minesLeft.innerHTML--;
        } else if (e.currentTarget.className === "flagCell") { 
            e.preventDefault();
            e.currentTarget.className="defaultCell";
            minesLeft.innerHTML++;
        }
    } 

    // === 게임 종료 === // 
    
    function gameOver() {
        // cells.classList.add("isOpen");
        isOver = true;
        alert('gameover');
        time.textContent = null;
        location.reload();
    }

    function gameWin() {
        alert("You win!");
    }
    }
}
