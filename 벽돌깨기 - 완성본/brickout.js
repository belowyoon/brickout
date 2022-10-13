var isTetrisTurn = false; // 테트리스게임 중인지 아닌지 확인. 이게 없으면 벽돌게임에서 방향키 누른걸 테트리스가 인식해서
// 테트리스 블럭이 없는데 테트리스 함수 호출했다고 콘솔창에 에러 출력됨.
var tetrisLevel = 0; // 레벨 수는 1~4. 0은 임시로 넣어놓은 값.
var tetrisTurnCount = 0;  // 새로 추가한 변수. 테트리스 블록이 몇 번 나왔는지 세어줌. (종료 조건 판별에 필요)
var score = 0; // 점수 저장할 변수 (벽돌게임, 테트리스게임 통합). 아직은 테트리스에서 점수 계산 안하는 상태.
var brickExist = null; // 테트리스 블록의 배열 정보 그대로 옮겨올 배열.
var brickExistAfter = null; // 테트리스 블록의 배열 정보를 행, 열 위치 직관적이게 수정한 배열.

var bricknext = null;

var brickExistFlip = null; // 테트리스 블록의 배열 뒤집은 거 <추가>

var life = 3;	//목숨 수

var level;	//현재 레벨

//ㅇㄱㅇ추가//
var iNum = null; 

var jakNum=0;
var jakNum2=0;

var nn=0;

var jakLocate = null;
var count = 0;
var count2 = 0;
/////////////

var tetrisImage = []; // 테트리스 블록 종류별로 블록 각각 칸마다 들어갈 이미지.

for(var i=0; i<7; i++) { // tetrisImage 값 갱신.
	tetrisImage[i] = new Image();
	var str = "img/earth"+(i+1)+".jpg";
	tetrisImage[i].src = str;
}

function startTetris(levelNum) {
    isTetrisTurn=true;
    count2=0;

    life=3;
    level = levelNum;
    backimage = backImageArr[levelNum-1];
    //////////////////////////////디자인 관련 수정된 부분
    backimageb = backImageArrb[levelNum-1];
    $("#content > div").addClass("invisible");
    $("#screen-tetris").removeClass("invisible");
    init();
    startGame(levelNum);
    if(levelNum==1){
        spring_music();
    } else if(levelNum==2){
        summer_music();
    } else if(levelNum==3){
        fall_music();
    } else if(levelNum==4){
        winter_music();
    }
}

function gotoMainmenu() {
    $("#content > div").addClass("invisible");
    $("#screen-start").removeClass("invisible");
    var parent = document.getElementById("colorTable");
    var child = parent.childNodes;

    while(child[0]) {
        parent.removeChild(child[0]);
    }
}

function gotoLevelChoose() {
    $("#content > div").addClass("invisible");
    $("#screen-choose-level").removeClass("invisible");
}

var bpColor = "blue";   

var colorNames = ["maroon", "red", "orange", "yellow", "olive", "purple", "fuchsia", "white", "lime", "green", "navy", "blue", "aqua", "teal", "black", "silver"];
function gotoSetting() {
    $("#content > div").addClass("invisible");
    $("#screen-setting").removeClass("invisible");

    var colordiv = document.getElementById("colorTable");
   
    for (var i = 0; i < colorNames.length; i++) {
        var ndiv = document.createElement("div");
        ndiv.setAttribute("class", "ctbox");
        ndiv.innerHTML = colorNames[i];
        ndiv.style.display = "inline-block";
        ndiv.style.width = "60px";
        ndiv.style.padding = "10px";
        ndiv.style.backgroundColor = colorNames[i];
        colordiv.appendChild(ndiv);
    }
    $(".ctbox").on("click", function () {
        bpColor = $(this).text();
        alert("공 및 패들 색깔: " + bpColor);
    });

}


var stageWidth; // 가로 칸 수
var stageHeight; // 세로 칸 수
var stageCanvas;
var nextCanvas;
var cellWidth; // 셀 한개의 크기, 현재 : 25px*25px
var cellHeight;
var cellSize;
var stageLeftPadding;
var stageTopPadding;
var blocks;
var deletedLines;
var virtualStage;
var currentBlock;
var nextBlock;
var blockX;
var blockY;
var blockAngle;

//////////////////////////////////디자인 관련 변경//////////////////
var imgArray = ["tetrisBackground/spring.jpg", "tetrisBackground/summer.jpg", "tetrisBackground/fall.jpg", "tetrisBackground/winter.jpg"];
var backImageArr = [];
//backimage.src = "spring.jpg";
for(var i=0; i<4; i++) {
    backImageArr[i] = new Image();
    backImageArr[i].src = imgArray[i];
}
var backimage = backImageArr[0];

var imgArrayb = ["brickBackground/spring.png", "brickBackground/summer.jpg", "brickBackground/fall.jpg", "brickBackground/winter.jpg"];
var backImageArrb = [];
//backimage.src = "spring.jpg";
for(var i=0; i<4; i++) {
    backImageArrb[i] = new Image();
    backImageArrb[i].src = imgArrayb[i];
}
var backimageb = backImageArrb[0];
////////////////////////////////////////////////////////////////

function init(){
    //$("#tetris").show();
    stageWidth = 10;
    stageHeight = 20;// stageWidth, stageHeight는 테트리스 게임판의 가로세로 블록 칸수 나타냄.
    // stageWidth, stageHeight는 변경 가능하되, 이걸 변경하면 벽돌 게임에 전달할 배열의 행열 수도 바꾸어야 하니 주의.
    stageCanvas = document.getElementById("stage");
    nextCanvas = document.getElementById("next");
    cellWidth = stageCanvas.width / stageWidth;
    cellHeight = stageCanvas.height / stageHeight;
    cellSize = cellWidth < cellHeight ? cellWidth : cellHeight;
    stageLeftPadding = (stageCanvas.width - cellSize * stageWidth) / 2;
    stageTopPadding = (stageCanvas.height - cellSize * stageHeight) / 2;
    blocks = createBlocks();
    deletedLines = 0;

    window.onkeydown = (e) => {
        if (e.keyCode === 37 && isTetrisTurn) {
            moveLeft();
            e.preventDefault();
        } else if (e.keyCode === 38 && isTetrisTurn) {
            rotate();
            e.preventDefault();
        } else if (e.keyCode === 39 && isTetrisTurn) {
            moveRight();
            e.preventDefault();
        } else if (e.keyCode === 40 && isTetrisTurn) {
            fall();
            e.preventDefault();
        }
    }

    document.getElementById("tetris-move-left-button").onmousedown = (e) => {
        moveLeft();
    }
    document.getElementById("tetris-rotate-button").onmousedown = (e) => {
        rotate();
    }
    document.getElementById("tetris-move-right-button").onmousedown = (e) => {
        moveRight();
    }
    document.getElementById("tetris-fall-button").onmousedown = (e) => {
        fall();
    }
}




function createBlocks() {
    var blocks = [
    {
        shape: [[[-1, 0], [0, 0], [1, 0], [2, 0]],
        [[0, -1], [0, 0], [0, 1], [0, 2]],
        [[-1, 0], [0, 0], [1, 0], [2, 0]],
        [[0, -1], [0, 0], [0, 1], [0, 2]]],
        color: "rgb(0, 255, 255)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(0, 128, 128)"
    },
    {
        shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]]],
        color: "rgb(255, 255, 0)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(128, 128, 0)"
    },
    {
        shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
        [[-1, -1], [-1, 0], [0, 0], [0, 1]],
        [[0, 0], [1, 0], [-1, 1], [0, 1]],
        [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
        color: "rgb(0, 255, 0)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(0, 128, 0)"
    },
    {
        shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
        [[0, -1], [-1, 0], [0, 0], [-1, 1]],
        [[-1, 0], [0, 0], [0, 1], [1, 1]],
        [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
        color: "rgb(255, 0, 0)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(128, 0, 0)"
    },
    {
        shape: [[[-1, -1], [-1, 0], [0, 0], [1, 0]],
        [[0, -1], [1, -1], [0, 0], [0, 1]],
        [[-1, 0], [0, 0], [1, 0], [1, 1]],
        [[0, -1], [0, 0], [-1, 1], [0, 1]]],
        color: "rgb(0, 0, 255)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(0, 0, 128)"
    },
    {
        shape: [[[1, -1], [-1, 0], [0, 0], [1, 0]],
        [[0, -1], [0, 0], [0, 1], [1, 1]],
        [[-1, 0], [0, 0], [1, 0], [-1, 1]],
        [[-1, -1], [0, -1], [0, 0], [0, 1]]],
        color: "rgb(255, 165, 0)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(128, 82, 0)"
    },
    {
        shape: [[[0, -1], [-1, 0], [0, 0], [1, 0]],
        [[0, -1], [0, 0], [1, 0], [0, 1]],
        [[-1, 0], [0, 0], [1, 0], [0, 1]],
        [[0, -1], [-1, 0], [0, 0], [0, 1]]],
        color: "rgb(255, 0, 255)",
        highlight: "rgb(255, 255, 255)",
        shadow: "rgb(128, 0, 128)"
    }
    ];
    return blocks;
}

function drawBlock(x, y, type, angle, canvas) {
    var context = canvas.getContext("2d");
    var block = blocks[type];
    for (var i = 0; i < block.shape[angle].length; i++) {
        drawCell(context,
           x + (block.shape[angle][i][0] * cellSize),
           y + (block.shape[angle][i][1] * cellSize),
           cellSize,
           type);
    }
}

function drawCell(context, cellX, cellY, cellSize, type) {
    var block = blocks[type];
    var adjustedX = cellX + 0.5;
    var adjustedY = cellY + 0.5;
    var adjustedSize = cellSize - 1;
    // 주석처리한 이유: 블록의 각각 칸을 이미지로 출력하는 중. 이미지에 대한 배열은 전역변수로 정의되어 있음.
    //여기에서 이미지 객체를 생성해서 사용할 경우, 이미지에 약간 딜레이가 생기는 버그 발생.
    //image = new Image();
    //image.src = block.imgsrc;
    //context.fillStyle = block.color;
    //context.fillRect(adjustedX, adjustedY, adjustedSize, adjustedSize);
    context.drawImage(tetrisImage[type],adjustedX,adjustedY,adjustedSize, adjustedSize);
    //context.fillStyle = block.color;
    //context.fillRect(adjustedX, adjustedY, adjustedSize, adjustedSize);

    context.strokeStyle = block.highlight;
    context.beginPath();
    context.moveTo(adjustedX, adjustedY + adjustedSize);
    context.lineTo(adjustedX, adjustedY);
    context.lineTo(adjustedX + adjustedSize, adjustedY);
    context.stroke();
    context.strokeStyle = block.shadow;
    context.beginPath();
    context.moveTo(adjustedX, adjustedY + adjustedSize);
    context.lineTo(adjustedX + adjustedSize, adjustedY + adjustedSize);
    context.lineTo(adjustedX + adjustedSize, adjustedY);
    context.stroke();
}

function startGame(levelNum) {
    tetrisTurnCount = 0;
    tetrisLevel = levelNum;
    let messageElem = document.getElementById("message");
    messageElem.innerText = "";
    let linesElem = document.getElementById("lines");
    linesElem.innerText = "0";
    let virtualStage2 = new Array(stageWidth);
    for (let i = 0; i < stageWidth; i++) {
        virtualStage2[i] = new Array(stageHeight).fill(null);
    }
    virtualStage = virtualStage2;
    currentBlock = null;
    nextBlock = getRandomBlock();
    mainLoop();
}

function mainLoop() {
    if (currentBlock == null) {
        if (!createNewBlock()) {
            return;
        }
    } else {
        fallBlock();
    }
    drawStage();
    if (currentBlock != null) {
        drawBlock(stageLeftPadding + blockX * cellSize,
            stageTopPadding + blockY * cellSize,
            currentBlock, blockAngle, stageCanvas);
    }
   //setTimeout(mainLoop.bind(this), 500);
   setTimeout(mainLoop, 500);
}

function createNewBlock() {

        if (tetrisTurnCount>=tetrisLevel*6) { // 김희진 수정(8->6)블록 다 나왔을 경우 다음 단계로 이동(난이도에 따라 나오는 블록 개수 달라짐)
            // 3를 곱하는 대신 다른 수를 곱할 수도 있다. 지금은 테스트를 위해 작은 숫자를 사용중.
            isTetrisTurn=false;
            let messageElem = document.getElementById("message");
            messageElem.innerText = "논밭을 다 만들었다!";
            brickExist = virtualStage; // 벽돌게임한테 데이터 넘겨주기


            //유가은 추가//
            lineNum = deletedLines;
            score += lineNum * 150;
            var sc = document.getElementById('score');
            sc.innerHTML = "score : " + score;  
            //////////////

            setTimeout(brickStart, 1000); //3000
            //setTimeout(function() { // 일단 필요없을 거 같아서 주석처리한 코드.
                //this.clear(this.nextCanvas);
                //this.clear(this.stageCanvas);
            //}, 2000);
            return false;
        }
        currentBlock = nextBlock;
        nextBlock = getRandomBlock();
        blockX = Math.floor(stageWidth / 2 - 2);
        blockY = 0;
        blockAngle = 0;
        drawNextBlock();
        if (!checkBlockMove(blockX, blockY, currentBlock, blockAngle)) {
            isTetrisTurn=false;
            let messageElem = document.getElementById("message");
            messageElem.innerText = "논밭을 다 만들지 못했다...";
            //setTimeout(function() { // 일단 필요없을 거 같아서 주석처리한 코드.
                //this.clear(this.nextCanvas);
                //this.clear(this.stageCanvas);
            //}, 2000);
            score = 0;    // 김희진 추가-테트리스에서 게임오버시 점수 리셋
            setTimeout(function() {
                $("#content > div").addClass("invisible");
                $("#screen-start").removeClass("invisible");
                main_music(); // 김희진 추가-테트리스 게임오버 후 메인메뉴 돌아갔을 때 메인 bgm 재생
            }, 3000);
            return false;
        }
        tetrisTurnCount++;
        return true;
    }

    function drawNextBlock() {
        clear(nextCanvas);
        drawBlock(cellSize * 2, cellSize, nextBlock,
            0, nextCanvas);
    }

    function getRandomBlock() {
        return  Math.floor(Math.random() * 7);
    }

    function fallBlock() {
        if (checkBlockMove(blockX, blockY + 1, currentBlock, blockAngle)) {
            blockY++;
        } else {
            fixBlock(blockX, blockY, currentBlock, blockAngle);
            currentBlock = null;
        }
    }

    function checkBlockMove(x, y, type, angle) {
        // 김희진 추가
        if(type == null)
            return false;

        for (var i = 0; i < blocks[type].shape[angle].length; i++) {
            var cellX = x + blocks[type].shape[angle][i][0];
            var cellY = y + blocks[type].shape[angle][i][1];
            if (cellX < 0 || cellX > stageWidth - 1) {
                return false;
            }
            if (cellY > stageHeight - 1) {
                return false;
            }
            if (virtualStage[cellX][cellY] != null) {
                return false;
            }
        }
        return true;
    }

    function fixBlock(x, y, type, angle) {
        sound_effect();
        deletedLines = 0;
        for (let i = 0; i < blocks[type].shape[angle].length; i++) {
            let cellX = x + blocks[type].shape[angle][i][0];
            let cellY = y + blocks[type].shape[angle][i][1];
            if (cellY >= 0) {
                virtualStage[cellX][cellY] = type;
            }
        }
        for (let y = stageHeight - 1; y >= 0; ) {
            let filled = true;
            for (let x = 0; x < stageWidth; x++) {
                if (virtualStage[x][y] == null) {
                    filled = false;
                    break;
                }
            }
            if (filled) { // 아래 부분 주석처리한 이유: 현재 테트리스에서는 한 줄 채워도 줄 안 없앤다.
                /*
                for (let y2 = y; y2 > 0; y2--) {
                    for (let x = 0; x < this.stageWidth; x++) {
                        this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
                    }
                }
                for (let x = 0; x < this.stageWidth; x++) {
                    this.virtualStage[x][0] = null;
                }*/
                deletedLines++;
                
            } else {

            }
            y--;
        }
        let linesElem = document.getElementById("lines");
        linesElem.innerText = "" + (deletedLines);
    }

    function drawStage() {
        clear(stageCanvas);

        var context = stageCanvas.getContext("2d");
        context.drawImage(backimage,0,0, stageCanvas.width, stageCanvas.height);
        for (var x = 0; x < virtualStage.length; x++) {
            for (var y = 0; y < virtualStage[x].length; y++) {
                if (virtualStage[x][y] != null) {
                    drawCell(context,
                        stageLeftPadding + (x * cellSize),
                        stageTopPadding + (y * cellSize),
                        cellSize,
                        virtualStage[x][y]);
                }
            }
        }
    }

    function moveLeft() {
        if (checkBlockMove(blockX - 1, blockY, currentBlock, blockAngle)) {
            blockX--;
            refreshStage();
        }
    }

    function moveRight() {
        if (checkBlockMove(blockX + 1, blockY, currentBlock, blockAngle)) {
            blockX++;
            refreshStage();
        }
    }

    function rotate() {
        var newAngle;
        if (blockAngle < 3) {
            newAngle = blockAngle + 1;
        } else {
            newAngle = 0;
        }
        if (checkBlockMove(blockX, blockY, currentBlock, newAngle)) {
            blockAngle = newAngle;
            refreshStage();
        }
    }

    function fall() {
        while (checkBlockMove(blockX, blockY + 1, currentBlock, blockAngle)) {
            blockY++;
            refreshStage();
        }
    }

    function refreshStage() {
      clear(stageCanvas);
      drawStage();
      drawBlock(stageLeftPadding + blockX * cellSize,
        stageTopPadding + blockY * cellSize,
        currentBlock, blockAngle, stageCanvas);
  }

  function clear(canvas) {
    var context = canvas.getContext("2d");
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

var win ; // 임시로 설정한 변수 - 승리판정? 

var blockImage = [];     // 벽돌깨기 블록 종류별로 블록 각각 칸마다 들어갈 이미지.
        blockImage[0] = new Image();
        blockImage[1] = new Image();
        blockImage[2] = new Image();
        blockImage[3] = new Image();
        blockImage[4] = new Image();


        var str1 = "bomb.jpg";          //////////////////////파일 이름 바뀜
        var str2 = "jakmul.png";
        var str3 = "heosu.jpg";
        var str4 = "jabcho.jpg";
        var str5 = "brickImage/item1.jpg";
       
      

        blockImage[0].src = str1;
        blockImage[1].src = str2;
        blockImage[2].src = str3;
        blockImage[3].src = str4;
        blockImage[4].src = str5;
     



function brickStart() { //262 줄에 brickStart 호출한 함수 있어요 (테트리스 잘 끝내면 호출이됨)

	var sp = document.getElementById("space");		//목숨 이미지
	sp.style.display='block';
	var lifeimg;
    //유가은 수정//
    var scoreimg;
	if(life == 3){
		lifeimg = document.getElementById("life1");
		lifeimg.style.display='inline';
		lifeimg = document.getElementById("life2");
		lifeimg.style.display='inline';
		lifeimg = document.getElementById("life3");
		lifeimg.style.display='inline';  
	}else if(life == 2){
		lifeimg = document.getElementById("life3");
		lifeimg.style.display='none';
	}else if(life == 1){
		lifeimg = document.getElementById("life2");
		lifeimg.style.display='none';
	}else if(life == 0){
		lifeimg = document.getElementById("life1");
		lifeimg.style.display='none';
	}
	

    scoreimg = document.getElementById("score");
    scoreimg.style.display="inline";

    jakNum=0;

    //count=0;
    //count2=0;
	///////////

    $("#content > div").addClass("invisible");
    $("#brickGame").removeClass("invisible");

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');

    var brickWidth = 64.1; //54;
    var brickHeight = 26.5; // 10, 5 에서 캔버스 사이즈 고려해서 블록 크기 키움 < 블록크기?

    var brickExistRowCount = stageHeight; //20 높이에 들어갈 최대 블록 수
    var brickExistColumnCount = stageWidth; //10 넓이에 들어갈 최대 블록 수

    var brickX = 0; //블록 시작 x 좌표
    var brickY = 0; //y좌표 

	  
  


    brickExistAfter = new Array(brickExistRowCount);
    for (var i = 0; i < brickExistRowCount; i++) {
        brickExistAfter[i] = new Array(brickExistColumnCount).fill(null); 
    }

    for (var i = 0; i < brickExistColumnCount; i++) {
        for(var j = 0; j<brickExistRowCount; j++) {
          brickExistAfter[j][i] = brickExist[i][j]; // 테트리스에서 배열 받아온 것 (테트리스 팀에서 함)
        }
    }

    brickExistFlip = new Array(brickExistRowCount);  //전에 brickExistTemp를 바꾼것 - , 전역변수로 선언
    for (var i = 0; i < brickExistRowCount; i++) {
        brickExistFlip[i] = new Array(brickExistColumnCount).fill(null);
    }

    
    for (var i = 0; i < brickExistRowCount; i++) {
        for(var j = 0; j<brickExistColumnCount; j++) {
            brickExistFlip[i][j] = brickExistAfter[brickExistRowCount-i-1][j]; // 배열 받아온거 뒤집기 
        }
    }
	
	if(life<3){
	for (var i = 0; i < brickExistRowCount; i++) {
        for(var j = 0; j<brickExistColumnCount; j++) {
            brickExistFlip[i][j] = bricknext[i][j]; 
        }
    }
	
    }

    //유가은 추가//
    iNum = new Array(brickExistRowCount);
    for (var i = 0; i < brickExistRowCount; i++) {
        iNum[i] = new Array(brickExistColumnCount).fill(null);
    }
    
    for (var i = 0; i < brickExistRowCount; i++) {
        for(var j = 0; j<brickExistColumnCount; j++) {
            iNum[i][j] = -1; 
        }
    }

    if(life<3){
        for (var i = 0; i < brickExistRowCount; i++) {
            for(var j = 0; j<brickExistColumnCount; j++) {
                iNum[i][j] = jNum[i][j]; 
            }
        }
    
    }

    jakLocate = new Array(brickExistRowCount);
    for (var i = 0; i < brickExistRowCount; i++) {
        jakLocate[i] = new Array(2).fill(null);
    }
    
    ////////////

    var ballx = 50; //공 x좌표
    var bally = 513; // 공 y 좌표 
    var balldx = 2.5; // 공 x 좌표 변화량
    var balldy = -2.5; // 공 y 좌표 변화량 // balldy = dx이면 정사각형 모양이라 작동 잘 안될 수도 있어서
    var paddleHeight = 10; ///패들길이
    var paddleWidth = 90; //패들 넓이
    var paddleSt = 40; //패들 스타트 위치
    var rightPressed = false;
    var leftPressed = false;
    var radius = 10; //공의 반지름
    //ㅇㄱㅇ 아래 점수 주석 처리 해야함//
    //var score = 0; //점수

    win = 0;

    mainBall(); 
    var intervalB = setInterval(mainBall,10); //계속 실행시켜서 공, 패들이 움직이도록 보여주는

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }  //패들 움직이는 것

    /////////////////////////////디자인 수정-함수 하나 추가
    function drawBrickBackground() {
        ctx.beginPath();
        ctx.drawImage(backimageb,0,0, canvas.width, canvas.height);
        ctx.closePath();
    }

    function drawMain () { //테트리스에서 받아온 블록 그리기
        brickX = 0;
        brickY = 0;
        
        for (var r=0; r<brickExistRowCount; r++) {
            for (var c=0; c<brickExistColumnCount; c++) {
            	
                if (brickExistFlip[r][c]!=null) {
                        ctx.beginPath();
                        //ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        var tempNum;

                    
                             
                       if(r % 3 == 1 && c % 3 == 0)  //폭탄 -> 주위 블럭 터지기
                            tempNum = 0;
                         

                        else if((r % 3 == 0 && c % 3 == 0 )){  //작물
                            tempNum = 1;
                            //유가은 추가//
                            jakNum++;
                            
                            jakLocate[count][0] = r;
                            jakLocate[count][1] = c;

                        
                            count++;
                        }
                        else if(r % 3 == 1 && c % 3 == 1)   //허수아비 -> 패들 길이 길어지기 
                            tempNum = 2;

                        else if(r%3 == 2 && c%3 == 2)   //고양이 -> 패들 길이 짧아지기 
                            tempNum = 4;
                       
                        else                          //잡초
                            tempNum = 3;


                      
                        ctx.drawImage(blockImage[tempNum],brickX,brickY,brickWidth,brickHeight);
                        ctx.closePath();
                }
            
                brickX += 65.1; //55;
            }
            
            brickX = 0;
            brickY += 27.5;
        }
        count=0;
        //유가은 추가//
        if(nn==0){
            jakNum2=jakNum;
        }
        nn++;
        //console.log(nn+" "+jakNum2);
        //////////////
    }
    function drawBall() { //공그리기
        ctx.beginPath();
        ctx.arc(ballx, bally, radius, 0, Math.PI*2);
        if (bpColor == "maroon") {
            ctx.fillStyle = "maroon";
        }
        else if (bpColor == "red") {
            ctx.fillStyle = "red";
        }
        else if (bpColor == "orange") {
            ctx.fillStyle = "orange";
        }
        else if (bpColor == "yellow") {
            ctx.fillStyle = "yellow";
        }
        else if (bpColor == "olive") {
            ctx.fillStyle = "olive";
        }
        else if (bpColor == "purple") {
            ctx.fillStyle = "purple";
        }
        else if (bpColor == "fuchsia") {
            ctx.fillStyle = "fuchsia";
        }
        else if (bpColor == "white") {
            ctx.fillStyle = "white";
        }
        else if (bpColor == "lime") {
            ctx.fillStyle = "lime";
        }
        else if (bpColor == "green") {
            ctx.fillStyle = "green";
        }
        else if (bpColor == "navy") {
            ctx.fillStyle = "navy";
        }
        else if (bpColor == "blue") {
            ctx.fillStyle = "blue";
        }
        else if (bpColor == "aqua") {
            ctx.fillStyle = "aqua";
        }
        else if (bpColor == "teal") {
            ctx.fillStyle = "teal";
        }
        else if (bpColor == "black") {
            ctx.fillStyle = "black";
        }
        else if (bpColor == "silver") {
            ctx.fillStyle = "silver";
        }
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() { //패들 그리기
        ctx.beginPath();
        ctx.rect(paddleSt, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        if (bpColor == "maroon") {
            ctx.fillStyle = "maroon";
        }
        else if (bpColor == "red") {
            ctx.fillStyle = "red";
        }
        else if (bpColor == "orange") {
            ctx.fillStyle = "orange";
        }
        else if (bpColor == "yellow") {
            ctx.fillStyle = "yellow";
        }
        else if (bpColor == "olive") {
            ctx.fillStyle = "olive";
        }
        else if (bpColor == "purple") {
            ctx.fillStyle = "purple";
        }
        else if (bpColor == "fuchsia") {
            ctx.fillStyle = "fuchsia";
        }
        else if (bpColor == "white") {
            ctx.fillStyle = "white";
        }
        else if (bpColor == "lime") {
            ctx.fillStyle = "lime";
        }
        else if (bpColor == "green") {
            ctx.fillStyle = "green";
        }
        else if (bpColor == "navy") {
            ctx.fillStyle = "navy";
        }
        else if (bpColor == "blue") {
            ctx.fillStyle = "blue";
        }
        else if (bpColor == "aqua") {
            ctx.fillStyle = "aqua";
        }
        else if (bpColor == "teal") {
            ctx.fillStyle = "teal";
        }
        else if (bpColor == "black") {
            ctx.fillStyle = "black";
        }
        else if (bpColor == "silver") {
            ctx.fillStyle = "silver";
        }
        ctx.fill();
        ctx.closePath();
    }
    function collisionDetection() { //블록이랑 공이 맞았는지 검사하는 함수

        if (ballx + radius > canvas.width - 5) {
            balldx = 0 - balldx;
        }
        else if (ballx - radius < 5) {
            balldx = 0 - balldx;
        }
        else if (bally + paddleHeight + radius > canvas.height - 5) {
            if (ballx + radius > paddleSt && ballx - radius < paddleSt + paddleWidth) { //공이 패들에 닿음
                if (ballx < paddleSt + paddleWidth / 4) {
                    balldx = -3;
                }
                else if (ballx >= paddleSt + paddleWidth / 4 && ballx < paddleSt + paddleWidth / 2) {
                    balldx = -2;
                }
                else if (ballx >= paddleSt + paddleWidth / 2 && ballx < paddleSt + paddleWidth * 3 / 4) {
                    balldx = 2;
                }
                else {
                    balldx = 3;
                }
                balldy = 0 - balldy;
            }
            else {
                life--;
                clearInterval(intervalB);
                if (life == 0)
                    defeat();
                else {

                    // 공이 땅에 닿았을 때 현재 블록 저장
                    bricknext = new Array(brickExistRowCount);
                    for (var i = 0; i < brickExistRowCount; i++) {
                        bricknext[i] = new Array(brickExistColumnCount).fill(null);
                    }
                    for (var i = 0; i < brickExistRowCount; i++) {
                        for (var j = 0; j < brickExistColumnCount; j++) {
                            //if(brickExistFlip[i][j] != null)
                            bricknext[i][j] = brickExistFlip[i][j];

                        }
                    }

                    //유가은 추가//
                    jNum = new Array(brickExistRowCount);
                    for (var i = 0; i < brickExistRowCount; i++) {
                        jNum[i] = new Array(brickExistColumnCount).fill(null);
                    }
                    for (var i = 0; i < brickExistRowCount; i++) {
                        for (var j = 0; j < brickExistColumnCount; j++) {
                            //if(brickExistFlip[i][j] != null)
                            jNum[i][j] = iNum[i][j];

                        }
                    }
                    ///////////

                    setTimeout(brickStart, 1000);


                    //stageAgain();
                }
                // 종료 조건 1 < 패배 패들 말고 땅에 공이 닿음 > 첫 화면으로 
                win = -1;
            }
        }
        else if (bally - radius < 5) {
            balldy = 0 - balldy;
        }
        else {
            brickX = 0;
            brickY = 0;
            var found = false;
            for (var r = 0; r < brickExistRowCount; r++) {
                for (var c = 0; c < brickExistColumnCount; c++) {
                    if (brickExistFlip[r][c] != null) {
                        if (ballx + radius > brickX && ballx - radius < brickX + brickWidth && bally + radius > brickY && bally - radius < brickY + brickHeight) {
                            sound_effect();

                            //ㅇㄱㅇ추가//
                            var sc = document.getElementById('score');


                            if ((r % 3 == 0 && c % 3 == 0 ))                         //작물 , score : +100
                            {
                                radius = 10;
                                paddleWidth = 90;
                                brickExistFlip[r][c] = null;

                                //유가은 추가//
                                iNum[r][c] = 0;

                                score = score + 100;

                                sc.innerHTML = "score : " + score;

                                count2++;
                                //////////////
                            }

                            else if (r % 3 == 1 && c % 3 == 0)                     //폭탄 -> 주위 블럭 터지기, score : +300
                            {

                                radius = 10;
                                paddleWidth = 90;
                                brickExistFlip[r][c] = null;

                                if (brickExistFlip[r - 1][c] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r - 1 == jakLocate[q][0] && c == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r-1][c] = 0;

                                        }
                                    }
                                    brickExistFlip[r - 1][c] = null;
                                }

                                if (brickExistFlip[r][c - 1] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r == jakLocate[q][0] && c - 1 == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r][c-1] = 0;
                                        }
                                    }
                                    brickExistFlip[r][c - 1] = null;
                                }
                                if (brickExistFlip[r][c + 1] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r == jakLocate[q][0] && c + 1 == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r][c+1] = 0;
                                        }
                                    }
                                    brickExistFlip[r][c + 1] = null;
                                }
                                if (brickExistFlip[r + 1][c] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r + 1 == jakLocate[q][0] && c == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r+1][c] = 0;
                                        }
                                    }
                                    brickExistFlip[r + 1][c] = null;
                                }
                                if (brickExistFlip[r + 1][c + 1] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r + 1 == jakLocate[q][0] && c + 1 == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r+1][c+1] = 0;
                                        }
                                    }
                                    brickExistFlip[r + 1][c + 1] = null;
                                }
                                if (brickExistFlip[r - 1][c - 1] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r - 1 == jakLocate[q][0] && c - 1 == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r-1][c-1] = 0;
                                        }
                                    }
                                    brickExistFlip[r - 1][c - 1] = null;
                                }
                                if (brickExistFlip[r + 1][c - 1] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r + 1 == jakLocate[q][0] && c - 1 == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r+1][c-1] = 0;
                                        }
                                    }
                                    brickExistFlip[r + 1][c - 1] = null;
                                }
                                if (brickExistFlip[r - 1][c + 1] != null) {
                                    for (var q = 0; q < brickExistRowCount; q++) {
                                        if (r - 1 == jakLocate[q][0] && c + 1 == jakLocate[q][1]) {
                                            count2++;
                                            iNum[r-1][c+1] = 0;
                                        }
                                    }
                                    brickExistFlip[r - 1][c + 1] = null;
                                }




                                score = score + 300;

                                sc.innerHTML = "score : " + score;


                            }

                            else if (r % 3 == 1 && c % 3 == 1)                   // 허수아비 -> 패들 길이 길어지기,  score : +10
                            {
                                radius = 10;
                                paddleWidth = 130;
                                brickExistFlip[r][c] = null;
                                score = score + 10;

                                sc.innerHTML = "score : " + score;
                            }
                            else if (r%3 == 2 && c%3 == 2)                   // 고양이 패들 길이 짧아지기
                            {
                                radius = 10;
                                paddleWidth = 60;
                                brickExistFlip[r][c] = null;

                            }
                            else                                      // 잡초, score : +10      
                            {
                                radius = 10;
                                paddleWidth = 90;
                                brickExistFlip[r][c] = null;
                                score = score + 10;

                                sc.innerHTML = "score : " + score;
                            }




                            balldy = 0 - balldy;
                            found = true;
                            break;


                        }

                    }
                    brickX += 65.1; //55;
                }
                if (found == true) {
                    break;
                }
                brickX = 0;
                brickY += 27.5;
            }
        }
    }
    
    //ㅇㄱㅇ 수정//
    function allBroke() { //모든 블록이 다깨진 상태인 지 검사하는 함수

        
        var k = 0;
        var p = 0;
        //var q = 0;
        for (var r=0; r<brickExistRowCount; r++) {
            for (var c=0; c<brickExistColumnCount; c++) {
                if (brickExistFlip[r][c] != null ) {
                    p++;
                }
            }
        }

        for (var r=0; r<brickExistRowCount; r++) {
            for (var c=0; c<brickExistColumnCount; c++) {
                if (iNum[r][c] == 0 ) {
                    k++;
                }
            }
        }


        /*for(var r=0; r<brickExistRowCount; r++){
            if(brickExistFlip[jakLocate[r][0]][jakLocate[r][1]] != null){
                q++;
            }
        }*/
        console.log("count2 : "+count2+" jakNum2 : "+jakNum2);
        if ( k == jakNum2 || p == 0) {
        //if(q == 0){
        //if(jakNum2 == count2 || p == 0){
            //종료 조건 2 모든 블록 깨짐, 다음 스테이지 (테트리스로 넘어가기)
            win = 1;
            
            clearInterval(intervalB);
            //var sp = document.getElementById("space");		//목숨 이미지
            var sci = document.getElementById("score");
			sci.style.display='none';

            nextlevel();
            

        }
    }

    var nextbutton;

	function nextlevel(){
		//clearInterval(intervalB);
		var canvas3 = document.getElementById("myCanvas");
		nextbutton = canvas3.getContext('2d');
		nextbutton.clearRect(0, 0, canvas.width, canvas.height);

        nextbutton.drawImage(backimageb,0,0, canvas.width, canvas.height);


        $("#nextlevelbutton").removeClass("invisible"); // 다음 단계로

       
	}

    function mainBall() { // 위 언급한 그리기를 호출해 주는 함수 - 이것을 setInterval로 계속 실행
        ctx.clearRect(0, 0, canvas.width, canvas.height); //모든 거 지우기
        drawBrickBackground(); ///////////////////////디자인 수정-배경 그리기 추가
        drawMain();
        drawBall();
        drawPaddle();
        collisionDetection();
        allBroke();

       

        ballx = ballx + balldx;
        bally = bally + balldy;// 공이 벽면에 닿았을 때 튕기게 하는거

        if (rightPressed) {
            paddleSt += 5;
            if (paddleSt + paddleWidth > canvas.width) {
                paddleSt = canvas.width - paddleWidth;
            }
        }
        else if (leftPressed) {
            paddleSt -= 5;
            if (paddleSt < 0) {
                paddleSt = 0;
            }
        } //패들 움직이는거
    }

    
    /*setTimeout(function() {
        if (win = 1) {
            if (tetrisLevel<=3 && tetrisLevel >=1) {
                tetrisLevel++;
                startTetris(tetrisLevel);
            }
            else if(tetrisLevel == 4) {
                $("#content > div").addClass("invisible");
                $("#screen-start").removeClass("invisible");
            }
        }
        else if ( win = -1) {
            $("#content > div").addClass("invisible");
            $("#screen-start").removeClass("invisible");
        }
    }, 300000);*/ //3000; 
    // 스테이지 구현을 위해 임시적으로 작성한 부분. 최종적으로는 벽돌게임 내용이 끝나는
    // 지점에서 이런식으로 레벨 단계에 따라 다시 테트리스 함수를 호출해야 한다.
    // 임시 다음스테이지 구현 함수 1 지금 300000로 바꿔 놓은 이유는 3000으로 해놓으면 게임을 하는 중간에 테트리스가 호출될까봐


} ;

function whatNext() {
    if (win = 1) {
        if (tetrisLevel<=3 && tetrisLevel >=1) {
            tetrisLevel++;
            startTetris(tetrisLevel);
        }
        else if(tetrisLevel == 4) {
            $("#content > div").addClass("invisible");
            $("#screen-start").removeClass("invisible");
        }
    }
    else if ( win = -1) {
        $("#content > div").addClass("invisible");
        $("#screen-start").removeClass("invisible");
     }        
} // 종료 조건 ?? 이걸 mainBall 에 그냥 넣으면 brickStart()가 아예 안되는 오류


//목숨 0 인 경우 (패배)
function defeat(){
	
	var lifeimg = document.getElementById("life1");
	lifeimg.style.display='none';

    //ㅇㄱㅇ 추가//
    nn=0;

	restartbtn();
}   

var button = null;
var path = null;


/*
var buttonImage = [];     // 벽돌깨기 블록 종류별로 블록 각각 칸마다 들어갈 이미지.
        buttonImage[0] = new Image();
        buttonImage[1] = new Image();
        buttonImage[2] = new Image();
        buttonImage[3] = new Image();
        buttonImage[4] = new Image();
        buttonImage[5] = new Image();
        buttonImage[6] = new Image();

        var s1 = "startagain.png";
        var s2 = "exit.png";
        var s3 = "springbutton.png";
        var s4 = "summerbutton.png";
        var s5 = "fallbutton.png";
        var s6 = "winterbutton.png";
        var s7 = "nextlevelbutton.png";

        buttonImage[0].src = s1;
        buttonImage[1].src = s2;
        buttonImage[2].src = s3;
        buttonImage[3].src = s4;
        buttonImage[4].src = s5;
        buttonImage[5].src = s6;
        buttonImage[6].src = s7;

        */

function restartbtn(){
	var canvas = document.getElementById("myCanvas");
	button = canvas.getContext('2d');
	
    $("#startagain").removeClass("invisible"); // 다시시작
    $("#exit").removeClass("invisible"); // 종료

 

}



var audio = new Audio();
audio.loop = true;
audio.volume = 0.5;

function main_music(){
    audio.pause();
    audio.src = "bgm/main.mp3";
    audio.play();
}

function spring_music(){
    audio.pause();
    audio.src = "bgm/spring.mp3";
    audio.play();
}

function summer_music(){
    audio.pause();
    audio.src = "bgm/summer.mp3";
    audio.play();
}

function fall_music(){
    audio.pause();
    audio.src = "bgm/fall.mp3";
    audio.play();
}

function winter_music(){
    audio.pause();
    audio.src = "bgm/winter.mp3";
    audio.play();
}

function music_volume(){
    var volume = document.getElementById("music_volume").value;
    audio.volume = volume;
}

var effect = new Audio("effect/drop.mp3");
effect.volume = 0.5;

function effect_volume(){
    var volume = document.getElementById("effect_volume").value;
    effect.volume = volume;
    effect.play(); // 볼륨 테스트
}

function sound_effect(){
    effect.play();
}


// 계절 선택하는 부분

function changeImageSpring() {
    $("#spring").attr("src", "levelButton/level1_spring.jpg");
}
function restoreImageSpring() {
    $("#spring").attr("src", "levelButton/level1_spring_opacity50.jpg");
}
function changeImageSummer() {
    $("#summer").attr("src", "levelButton/level2_summer.jpg");
}
function restoreImageSummer() {
    $("#summer").attr("src", "levelButton/level2_summer_opacity50.jpg");
}
function changeImageFall() {
    $("#fall").attr("src", "levelButton/level3_fall.jpg");
}
function restoreImageFall() {
    $("#fall").attr("src", "levelButton/level3_fall_opacity50.jpg");
}
function changeImageWinter() {
    $("#winter").attr("src", "levelButton/level4_winter.jpg");
}
function restoreImageWinter() {
    $("#winter").attr("src", "levelButton/level4_winter_opacity50.jpg");
}



// 맨 처음 화면에서 메인메뉴로
function gotoMain() {
    $("#content > div").addClass("invisible");
    $("#screen-start").removeClass("invisible");
    main_music();
}



// 다시 시작하기, 다음 단계로, 종료 버튼 관련 함수

function startagainFunc() {
    score = 0;
    count2=0;
    document.getElementById("score").style.display="none";
    $("#content > div").addClass("invisible");
    $("#screen-choose-level").removeClass("invisible");
    $("#brickGame > img").addClass("invisible");

}

function exitFunc() {
    score = 0;
    count2=0;
    document.getElementById("score").style.display="none";
    $("#content > div").addClass("invisible");
    $("#screen-start").removeClass("invisible");
    $("#brickGame > img").addClass("invisible");
    main_music();
}

function nextlevelbuttonFunc() {
    nn=0;
    count2=0;
    document.getElementById("life1").style.display='none';
    document.getElementById("life2").style.display='none';
    document.getElementById("life3").style.display='none';
    if(level>=1 && level<=3) {
                level++;
                startTetris(level);
            }
            else {
                level=1;
                startTetris(level);
            }
    $("#brickGame > img").addClass("invisible");
}