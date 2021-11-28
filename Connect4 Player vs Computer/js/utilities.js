//Returns an object of 3 values [k,x,y].
//Value k is an integer: 0 -> no winner in the board, 1 -> red is winner, 2 -> yellow is winner, 3 -> the game is a draw.
//Values x[i],y[i] are 4 cordinate pairs that represent the connect4 points.
function checkWinner(b){
  var ansX = [0,0,0,0], ansY = [0,0,0,0], fTot = [0,0,0];
  for(var i = 0; i<n; i++){
    for(var j = 0; j<m; j++){
      fTot[b[i][j]]++;
      {
        var f = [0,0,0];
        for(var k = 0; k+j<m && k<4; k++) {
          f[b[i][j+k]]++;
          ansX[k] = i;
          ansY[k] = j+k;
        }
        if(f[1]==4) return [1,ansX,ansY];
        if(f[2]==4) return [2,ansX,ansY];
      }
      {
        var f = [0,0,0];
        for(var k = 0; k+i<n && k<4; k++) {
          f[b[i+k][j]]++;
          ansX[k] = i+k;
          ansY[k] = j;
        }
        if(f[1]==4) return [1,ansX,ansY];
        if(f[2]==4) return [2,ansX,ansY];
      }
      {
        var f = [0,0,0];
        for(var k = 0; k+i<n && k+j<m && k<4; k++) {
          f[b[i+k][j+k]]++;
          ansX[k] = i+k;
          ansY[k] = j+k;
        }
        if(f[1]==4) return [1,ansX,ansY];
        if(f[2]==4) return [2,ansX,ansY];
      }
      {
        var f = [0,0,0];
        for(var k = 0; k+i<n && j-k>=0 && k<4; k++) {
          f[b[i+k][j-k]]++;
          ansX[k] = i+k;
          ansY[k] = j-k;
        }
        if(f[1]==4)  return [1,ansX,ansY];
        if(f[2]==4)  return [2,ansX,ansY];
      }
    }
  }
  if(fTot[0]==0) return [3,ansX,ansY];
  return [0,ansX,ansY];
}

//Animates a mark drop from topPos to botPos with fixed Y.
function animate(e, topPos, botPos, Y){
  e.style.left = Y + 'px';
  var pos = topPos;
  var id = setInterval(frame, 1);
  function frame() {
    if (pos >= botPos) {
      e.style.top = botPos + 'px';
      clearInterval(id);
    } else {
      pos+=3;
      e.style.top = pos + 'px';
    }
  }
}

//Generates a mark image //color = 2 -> yellow, any other -> red.
function genMark(color){
  var panel = document.getElementById("boardPanel");
  var img = document.createElement("img");
  img.src = "images/red_mark.png";
  if(color == 2) img.src = "images/yellow_mark.png";
  img.style.position = 'absolute';
  return img;
}

//Writes information in the display console
function infoLog(txt){
  var panel = document.getElementById("infoConsole").value = txt+"\n";
}

//Appends information in the display console
function infoLogAppend(txt){
  var panel = document.getElementById("infoConsole").value += txt+"\n";
}

//Checks if a move is valid -> The row that the player tries to insert has space.
function isValidMove(slot, b){
  if(slot<0 || slot>=m || b[0][slot]!=0) return false;
  return true;
}

//Generates an id hash from the position a mark is placed
function getId(i, j){
  return "MARK_ID#"+i+"#"+j+"#";
}

//Function that displays who's turn it is
function displayTurn(firstTime,AI){
  var color = playerTurn==2?"Yellow":"Red";
  if(firstTime) infoLog("Game started!");
  else{
    var seconds = parseFloat((performance.now()-clockTime)/1000).toFixed(2);
    infoLog("It took "+((!AI)?"AI ":"you ")+seconds+" seconds to make a move.");
  }
  infoLogAppend("It is "+color+"'s turn! "+(AI?"(AI)":"(you)"));
  clockTime = performance.now();
}

//Fidnds the position that a mark inserted at the given slot will end up at.
function getDropPos(b, slot){
  var dropPos = 0;
  for(var i = 0; i<n; i++) if(b[i][slot]==0) dropPos = i;
  return dropPos;
}

//If turn is 1 return 2, if turn is 2 return 1;
function swapTurn(turn){
  return turn ^ 1 ^ 2;
}

//Function to execute content async (so that the UI won't lag)
function executeAsync(func) {
    setTimeout(func, 0);
}

//Clone a board
function cloneBoard(b){
  var newBoard = [[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0]];
  for(var i = 0; i<6; i++) for(var j = 0; j<7; j++) newBoard[i][j] = b[i][j];
  return newBoard;
}