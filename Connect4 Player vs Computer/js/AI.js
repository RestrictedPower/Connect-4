var inf = 1000000, SEARCH_DEPTH = 6;

//Using Minimax algorithm to guess the best move.
function getBestMove(b, color){
  return dfs(cloneBoard(b),SEARCH_DEPTH,color)[0];
}

//Search function. Tries all the states up to the given depth, and uses
//heuristic evaluation for deeper states.
function dfs(b, depth, color){
  var v = checkWinner(b);
  //If we reached a final state (draw, or win) or run out of depth to search,
  //return a heuristic evaluation of the position.
  if(v[0]!=0 || depth == 0) return [-1, eval(b,color, v), depth];

  //Otherwise try all possible states (we keep the best one that has also the smallest depth).
  var value = -inf - 5, from = 0, maxDepth = -1;
  for(var move = 0; move<7; move++){
    if(!isValidMove(move, b)) continue;
    var dropPos = getDropPos(b, move);
    b[dropPos][move] = color;
    var evax = dfs(b, depth-1, swapTurn(color));
    b[dropPos][move] = 0;
    var cur = -evax[1];
    if(cur>value || (cur == value && evax[2]>maxDepth)){
      value = cur;
      from = move;
      maxDepth = evax[2];
    }
  }
  return [from,value,maxDepth];
}

//Heuristic evaluation on a position.
function eval(b, color, v){
  if(v[0] == 3) return 0;
  if(v[0]!=0) return v[0]==color?inf:-inf;
  var col = color, sign = 1;
  var ff = [0,0,0,0,0];
  for(var turn = 0; turn<2; turn++){
    for(var i = 0; i<n; i++){
      for(var j = 0; j<m; j++){
        {
          var f = [0,0,0];
          for(var k = 0; k+j<m && k<4; k++) f[b[i][j+k]]++;
          if(f[swapTurn(col)]==0) ff[f[col]] += sign;
        }
        {
          var f = [0,0,0];
          for(var k = 0; k+i<n && k<4; k++) f[b[i+k][j]]++;
          if(f[swapTurn(col)]==0) ff[f[col]] += sign;
        }
        {
          var f = [0,0,0];
          for(var k = 0; k+i<n && k+j<m && k<4; k++) f[b[i+k][j+k]]++;
          if(f[swapTurn(col)]==0) ff[f[col]] += sign;
        }
        {
          var f = [0,0,0];
          for(var k = 0; k+i<n && j-k>=0 && k<4; k++) f[b[i+k][j-k]]++;
          if(f[swapTurn(col)]==0) ff[f[col]] += sign;
        }
      }
    }
    sign = -1;
    col = swapTurn(col);
  }
  return ff[3]*100+ff[2]*10+ff[1];
}
