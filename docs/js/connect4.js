var GAME_STATE = "NOT_STARTED";
var startX = 92, startY = 40, delta = 117, n = 6, m = 7;
var board = [[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0]];
var playerTurn = 1;
var red = 0, yellow = 0, draw = 0;
var clockTime;

//Sets up the game.
function newGame(){
  playerTurn = 1;
  GAME_STATE = "PLAYER_PLAYING";
  reset();
  displayTurn(true,false);
  updateStatistics(0);
  clockTime = performance.now();
}

//Event triggered by the insert buttons. Represents the player inserting a token at a slot.
function play(slot){
  if(GAME_STATE!="PLAYER_PLAYING") return;
  if(!isValidMove(slot, board)){
    infoLogAppend("Invalid move!");
    return;
  }
  var dropPos = getDropPos(board, slot);
  board[dropPos][slot] = playerTurn;
  updatePage(slot,playerTurn,dropPos);
  var winner = checkWinner(board);
  if(winner[0]!=0) {
    game_end(winner);
    return;
  }
  playerTurn = swapTurn(playerTurn);
  displayTurn(false,true);
  GAME_STATE = "AI_PLAYING";
  executeAsync(function() {
      playAI();
  });
  return;
}

function playAI(){
  var slot = getBestMove(board, playerTurn);
  var dropPos = getDropPos(board, slot);
  board[dropPos][slot] = playerTurn;
  updatePage(slot,playerTurn,dropPos);
  var winner = checkWinner(board);
  if(winner[0]!=0) {
    game_end(winner);
    return;
  }
  playerTurn = swapTurn(playerTurn);
  displayTurn(false,false);
  GAME_STATE = "PLAYER_PLAYING";
}

//Resets the game.
function reset(){
  var panel = document.getElementById("boardPanel");
  for(var i = 0; i<n; i++) for(var j = 0; j<m; j++) {
    var v = document.getElementById(getId(i,j));
    if(v!=null) panel.removeChild(v);
    board[i][j] = 0;
  }
}

//Adds a win to the winner and draws the pie chart.
function updateStatistics(winnerType){
  if(winnerType == 1) red++;
  if(winnerType == 2) yellow++;
  if(winnerType == 3) draw++;
  drawChart(red,yellow,draw);
}

//Finalizes the game. Triggered on end.
function game_end(winner){
  GAME_STATE = "FINISHED";
  updateStatistics(winner[0]);
  if(winner[0]==3){
    infoLog("Game ended as a draw!");
    infoLogAppend("Red wins: "+red+" | Yellow wins: "+yellow+" | Draws: "+draw);
    return;
  }
  for(var i = 0; i<4; i++){
    var elem = document.getElementById(getId(winner[1][i],winner[2][i]));
    if(elem!=null) elem.className="blinking";
  }
  var color = winner[0]==2?"Yellow":"Red";
  infoLog(color+" player won! Press New Game to play again.");
  infoLogAppend("Red wins: "+red+" | Yellow wins: "+yellow+" | Draws: "+draw);
}

//Updates the board with a new mark.
function updatePage(slot, color, dropPos){
  var panel = document.getElementById("boardPanel");
  var img = genMark(color);
  img.setAttribute('id', getId(dropPos, slot));
  panel.appendChild(img);
  animate(img, 0, (startX + dropPos*delta), (startY + slot*delta));
}

newGame();
