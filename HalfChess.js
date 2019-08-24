var canvas;
var canvasContext;
var chessBoardImage;
var blackChessImageSrcList = ["img/0.png", "img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png"];
var blackSelectedChessImageSrcList = ["img/00.png", "img/01.png", "img/02.png", "img/03.png", "img/04.png", "img/05.png", "img/06.png"];
var redChessImageSrcList = ["img/7.png", "img/8.png", "img/9.png", "img/10.png", "img/11.png", "img/12.png", "img/13.png"];
var redSelectedChessImageSrcList = ["img/07.png", "img/08.png", "img/09.png", "img/010.png", "img/011.png", "img/012.png", "img/013.png"];
var blackImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
var redImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
var blackSelectedImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
var redSelectedImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
var chessData = new Array(4);
var closeImage;
var clearImage;
var REDCHESS = { color: 'red', name: "Red" };
var BLACKCHESS = { color: 'black', name: "Black" };
var currentTeam = "";
var tempChessData = new Array(32);
var wantMoveChess = "";
var countChess;


function startGame() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener("click", playerSelectChess);
    canvas = document.getElementById('canvas_id');
    canvasContext = canvas.getContext('2d');
    setChessData();
    shuffle(tempChessData);
    initData();
    initImage();
    chessBoardImage.onload = () => {
        canvasContext.drawImage(chessBoardImage, 0, 0);
        drawChess();
    };
}

function initImage() {
    chessBoardImage = new Image();
    chessBoardImage.src = "img/newchessboard.png";
    closeImage = new Image();
    closeImage.src = "img/close.png";
    clearImage = new Image();
    clearImage.src = "img/clear.png";

    for (var i = 0; i < 7; i++) {
        blackImg[i].src = blackChessImageSrcList[i];
        redImg[i].src = redChessImageSrcList[i];
        blackSelectedImg[i].src = blackSelectedChessImageSrcList[i];
        redSelectedImg[i].src = redSelectedChessImageSrcList[i];
    }
}
function initData() {
    var count = 0;
    for (var i = 0; i < 4; i++)
        chessData[i] = new Array(8);
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 8; j++) {
            chessData[i][j] = {
                x: i,
                y: j,
                chessType: 0,
                chessLv: tempChessData[count].lv,
                chessName: tempChessData[count].name,
                chessImage: tempChessData[count].imgsrc,
                chessSelectedImage: tempChessData[count].imgselectsrc,
                chessColor: tempChessData[count++].color

            };
        }

    countChess = {
        redChessCount: 0,
        blackChessCount: 0
    };

}
function playerSelectChess(e) {
    console.log("mouse click x coor" + e.clientX);
    console.log("mouse click y coor" + e.clientY);


    var x = parseInt(e.clientX / 60);
    var y = parseInt(e.clientY / 60);
    console.log(y + " " + x);

    switch (chessData[y][x].chessType) {
        case -1:
            if (wantMoveChess !== "") {
                if (wantMoveChess.chessType === 2 && Math.abs(wantMoveChess.x - y) <= 1 && Math.abs(wantMoveChess.y - x) <= 1) {
                    moveAction(wantMoveChess.x, wantMoveChess.y, y, x);
                    releaseChess();
                    changeTeam(y, x);
                }
            }
            break;
        case 0:
            releaseChess();
            chessData[y][x].chessType = 1;
            changeTeam(y, x);
            break;
        case 1:
            if (currentTeam.color !== chessData[y][x].chessColor.color) {
                releaseChess();
                chessData[y][x].chessType = 2;
                wantMoveChess = chessData[y][x];
                console.log(wantMoveChess);
            }

            else if (wantMoveChess !== "") {
                if (wantMoveChess !== "" && wantMoveChess.chessColor !== chessData[y][x].chessColor) {
                    console.log("u in ");
                    if (chessData[y][x] !== wantMoveChess && wantMoveChess.chessType === 2 && Math.abs(wantMoveChess.x - y) <= 1 && Math.abs(wantMoveChess.y - x) <= 1) {
                        console.log("move " + wantMoveChess.chessLv + " " + chessData[y][x].chessLv);
                        console.log("selectChess " + wantMoveChess.chessName);
                        moveAction(wantMoveChess.x, wantMoveChess.y, y, x);
                        releaseChess();
                        changeTeam(y, x);
                    }

                }
            }
            else {
                alert("not your team");
                return;
            }
            /*if (wantMoveChess !== "" && wantMoveChess.chessColor !== chessData[y][x].chessColor) {
                console.log("u in ");
                if (chessData[y][x] !== wantMoveChess && wantMoveChess.chessType === 2 && Math.abs(wantMoveChess.x - y) <= 1 && Math.abs(wantMoveChess.y - x) <= 1) {
                    console.log("move " + wantMoveChess.chessLv + " " + chessData[y][x].chessLv);
                    console.log("selectChess " + wantMoveChess.chessName);
                    moveAction(wantMoveChess.x, wantMoveChess.y, y, x);
                    changeTeam(y,x);
                }
                
            }*/
            /*releaseChess();
            chessData[y][x].chessType = 2;
            wantMoveChess = chessData[y][x];
            console.log(wantMoveChess);*/
            break;
        case 2:
            releaseChess();
            break;
        default:
            break;
    }

    reDrawChess(y, x);
    //console.log(shuffle(chessData[0]));

}

function drawChess() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 8; j++) {
            if (chessData[i][j].chessType === 0) {
                canvasContext.drawImage(closeImage, 5 + j * 60, 5 + i * 60);
                console.log("close card");
            }

            else if (chessData[i][j].chessType === -1) {
                canvasContext.drawImage(clearImage, 5 + j * 60, 5 + i * 60);
            }
            else if (chessData[i][j].chessType === 1) {
                canvasContext.drawImage(chessData[i][j].chessImage, 5 + j * 60, 5 + i * 60);
                console.log("open card " + i + " " + j);
            }
            else if (chessData[i][j].chessType === 2) {
                canvasContext.drawImage(chessData[i][j].chessSelectedImage, 5 + j * 60, 5 + i * 60);
                console.log("selected card " + i + " " + j);
            }


        }


    //canvasContext.drawImage(img1, 5+j*60,5+i*60);
}
function reDrawChess(x, y) {
    if (chessData[x][y].chessType === 0) {
        canvasContext.drawImage(closeImage, 5 + y * 60, 5 + x * 60);
        console.log("close card");
    }

    else if (chessData[x][y].chessType === -1) {
        canvasContext.drawImage(clearImage, 5 + y * 60, 5 + x * 60);
    }
    else if (chessData[x][y].chessType === 1) {
        canvasContext.drawImage(chessData[x][y].chessImage, 5 + y * 60, 5 + x * 60);
        console.log("open card " + x + " " + y + " " + chessData[x][y].chessName);
    }
    else if (chessData[x][y].chessType === 2) {
        canvasContext.drawImage(chessData[x][y].chessSelectedImage, 5 + y * 60, 5 + x * 60);
        console.log("selected card " + x + " " + y + " " + chessData[x][y].chessName);
    }

    console.log(chessData);
}

function releaseChess() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 8; j++) {
            if (chessData[i][j].chessType === 2) {
                canvasContext.drawImage(clearImage, 5 + j * 60, 5 + i * 60);
                canvasContext.drawImage(chessData[i][j].chessImage, 5 + j * 60, 5 + i * 60);
                chessData[i][j].chessType = 1;
                console.log("release " + i + " " + j + " type:" + chessData[i][j].chessType);
            }

        }
    wantMoveChess = "";
}


function moveAction(x1, y1, x2, y2) {
    console.log(x1 + " " + y1 + "   " + x2 + " " + y2);
    if (chessData[x1][y1].chessLv <= chessData[x2][y2].chessLv) {
        if(chessData[x2][y2].chessType !== -1){
            if(chessData[x2][y2].chessColor.color === "red"){
                countChess.redChessCount++;
            }
            else{
                countChess.blackChessCount++;
            }
        }
        
        chessData[x2][y2] = chessData[x1][y1];
        chessData[x2][y2].x = x2;
        chessData[x2][y2].y = y2;
        if (chessData[x1][y1] === chessData[x2][y2])
            console.log("fuck");
        chessData[x1][y1] = {
            x: x1,
            y: y1,
            chessType: -1,
            chessLv: 7,
            chessName: null,
            chessImage: null,
            chessSelectedImage: null,
            chessColor: null

        };
        console.log(chessData[x2][y2]);
        console.log(chessData[x1][y1]);
        reDrawChess(x1, y1);
        reDrawChess(x2, y2);
    }
    else
        alert("you are litte lv");

    if(countChess.blackChessCount >= 16){
        alert("Red Player is Winner");
    }
    else if(countChess.redChessCount >= 16){
        alert("Black Player is Winner");
    }
}

function changeTeam(x, y) {
    if (currentTeam == "")
        currentTeam = chessData[x][y].chessColor;
    else
        currentTeam = currentTeam === BLACKCHESS ? REDCHESS : BLACKCHESS;

    console.log(currentTeam);
}

var chessType = {
    CLOSE: 0,
    OPEN: 1,
    SELECTED: 2,
    EMPTY: -1
};
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function setChessData() {
    tempChessData[0] = {
        lv: 0,
        color: BLACKCHESS,
        name: "boss",
        imgsrc: blackImg[0],
        imgselectsrc: blackSelectedImg[0]
    };

    tempChessData[1] = tempChessData[2] = {
        lv: 1,
        color: BLACKCHESS,
        name: "solider",
        imgsrc: blackImg[1],
        imgselectsrc: blackSelectedImg[1]

    };

    tempChessData[3] = tempChessData[4] = {
        lv: 2,
        color: BLACKCHESS,
        name: "elp",
        imgsrc: blackImg[2],
        imgselectsrc: blackSelectedImg[2]
    };

    tempChessData[5] = tempChessData[6] = {
        lv: 3,
        color: BLACKCHESS,
        name: "car",
        imgsrc: blackImg[3],
        imgselectsrc: blackSelectedImg[3]
    };
    tempChessData[7] = tempChessData[8] = {
        lv: 4,
        color: BLACKCHESS,
        name: "horse",
        imgsrc: blackImg[4],
        imgselectsrc: blackSelectedImg[4]
    };
    tempChessData[9] = tempChessData[10] = {
        lv: 5,
        color: BLACKCHESS,
        name: "bom",
        imgsrc: blackImg[5],
        imgselectsrc: blackSelectedImg[5]
    };
    tempChessData[11] = tempChessData[12] = tempChessData[13] = tempChessData[14] = tempChessData[15] = {
        lv: 6,
        color: BLACKCHESS,
        name: "ice",
        imgsrc: blackImg[6],
        imgselectsrc: blackSelectedImg[6]
    };

    tempChessData[16] = {
        lv: 0,
        color: REDCHESS,
        name: "boss",
        imgsrc: redImg[0],
        imgselectsrc: redSelectedImg[0]
    };
    tempChessData[17] = tempChessData[18] = {
        lv: 1,
        color: REDCHESS,
        name: "solider",
        imgsrc: redImg[1],
        imgselectsrc: redSelectedImg[1]
    };
    tempChessData[19] = tempChessData[20] = {
        lv: 2,
        color: REDCHESS,
        name: "elp",
        imgsrc: redImg[2],
        imgselectsrc: redSelectedImg[2]
    };
    tempChessData[21] = tempChessData[22] = {
        lv: 3,
        color: REDCHESS,
        name: "car",
        imgsrc: redImg[3],
        imgselectsrc: redSelectedImg[3]
    };
    tempChessData[23] = tempChessData[24] = {
        lv: 4,
        color: REDCHESS,
        name: "horse",
        imgsrc: redImg[4],
        imgselectsrc: redSelectedImg[4]
    };
    tempChessData[25] = tempChessData[26] = {
        lv: 5,
        color: REDCHESS,
        name: "bom",
        imgsrc: redImg[5],
        imgselectsrc: redSelectedImg[5]
    };
    tempChessData[27] = tempChessData[28] = tempChessData[29] = tempChessData[30] = tempChessData[31] = {
        lv: 6,
        color: REDCHESS,
        name: "ice",
        imgsrc: redImg[6],
        imgselectsrc: redSelectedImg[6]
    };


}