// === label: 지뢰 개수 ===  //


// === reset button === // 
function reset(){
    while(map.hasChildNodes()) {
        map.removeChild(map.firstChild);
    } 
    gameStart(); // timer가 겹침
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
    let isOver = true; // true이면 모두 openCell;
    if (row < 5 || row > 30 || col < 5 || col > 30) {
        alert("칸 개수를 올바르게 설정해 주세요!")
    } else if (mineNum < 0 || mineNum > row * col) {
        alert("지뢰 개수를 올바르게 설정해 주세요!")
    } else {

    let minesLeft = document.getElementById("minesLeft")
    minesLeft.textContent = mineNum;

    const cells = [];
    
    for (let i=0; i<col; i++){
        cells[i] = new Array();
        const arr = document.createElement('div');
        map.appendChild(arr);
        arr.setAttribute('class', 'arr');
        for (let j=0; j<row; j++){
            const cell = document.createElement('div');
            cell.setAttribute('x', j) // 추가. 순서가 바뀜.
            cell.setAttribute('y', i) // 추가
            cells[i][j] = cell;            
            arr.appendChild(cell);
            cell.setAttribute('class', 'defaultCell');
            cell.addEventListener("click", handleClick);
            cell.addEventListener("contextmenu", rightClick);
        }
    }
    placeMine();

    // === 지뢰심기(random) === // 

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

    // function mineClick() {
    //     for(let i=0; i<row; i++) {
    //         for(let j=0; j<col; j++) {
    //             const cell = cells[i][j];
    //             if (cell.getAttribute('mineCell')=='true'){
    //                 cell.className="mine";
    //                 gameover();
    //             } else if (cell.getAttribute('neighborCell')) {
    //                 cell.className="neighbor"
    //                 cell.openCell(); 
    //             }
    //         }
    //     }
    // }

    function handleClick(cell){
        if (cell.currentTarget.classList.contains("mineCell")) {
            gameOver(); 
            isOver = true;
        } else {
            openCell(cell);
        }; 
    }

    function getNeighborCells(cell) {  
        const i = parseInt(cell.currentTarget.getAttribute("y")); 
        const j = parseInt(cell.currentTarget.getAttribute("x"));
        console.log(i, j);
        let neighborCells = [];
        surroundCells = [
            cells[i-1][j-1], // j에서 에러발생
            cells[i][j-1],
            cells[i+1][j-1], // j에서 에러발생
            cells[i-1][j],
            cells[i+1][j],
            cells[i-1][j+1],
            cells[i][j+1],
            cells[i+1][j+1] 
            ]
        neighborCells = surroundCells.filter(surroundCell => surroundCell !== undefined)
        return neighborCells;
    }
    
    function openCell(cell) {
        const neighborCells = getNeighborCells(cell);
        // const isMine = cell.currentTarget.classList.contains("mineCell");
        // const isOpen = cell.currentTarget.classList.contains("isOpen");

        // const mineCount = neighborCells.reduce((pv, cv) => {
        //     if(cv === isMine) pv++;
        //     return pv;
        // }, 0);
        let mineCount = 0
        neighborCells.forEach(neighborCell => {
            if(neighborCell.classList.contains("mineCell")) {
                mineCount++;
            }
        })

        cell.currentTarget.classList.remove("defaultCell");
        cell.currentTarget.classList.add("isOpen");

        if(mineCount > 0) { // 작동 안함
            cell.currentTarget.textContent = mineCount;
            console.log(mineCount);
        } else {
            neighborCells.forEach(neighborCell => {   
                if(!neighborCell.classList.contains("isOpen")) {
                    openCell(neighborCell);
                }
            });
        };
    };
    

    // === 우클릭 === //

    function rightClick(e) {
        if (e.currentTarget.className==="defaultCell") {  
            e.preventDefault();
            e.currentTarget.className="flagCell";
            minesLeft.innerHTML--;
        } else if (e.currentTarget.className==="flagCell") { 
            e.preventDefault();
            e.currentTarget.className="defaultCell";
            // e.currentTarget.textContent="";
            minesLeft.innerHTML++;
        }
    } 

    // === 게임 종료 === // 
    
    function gameOver() {
        // cells.classList.add("isOpen");
        isOver = true;
        alert('gameover');
        time.textContent = null;
    }
    }
}


