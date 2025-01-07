


// Nota                                     
// • Griglia gestisce elementi ma converti coord. in px per disegnare ( coordCella * widthCella ) 
// • Funzione converte coord. griglia ( x / y ) in coord. px ( x / y ) 
function convertCell( coord ){ return coord * dimensioneCella };


const canvas = document.querySelector("canvas");   // <canvas>
const divScore = document.getElementById("score"); // <div> 
const btnReset = document.querySelector("button"); // <button>

const ctx = canvas.getContext("2d");               // Contesto rendering 
const nCelleGriglia = 20;                          // N. max celle nella griglia
const dimensioneCella =  canvas.width / nCelleGriglia ; // Dimensione in px di ciascuna cella 

let speed = 7; // Velocità 
let score = 0; // Punteggio


const snake = {
  x : 10,  y : 5,         // Coord. celle griglia ( testa )
  moveX : 0, moveY : 0,   // Movimento su assi x / y
  nCode : [],      // Parti coda con coord.
  tailLength : 0,  // Lunghezza attuale coda

  
  draw(){ // Disegna testa + code 
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "black";
    ctx.fillRect( convertCell(this.x), convertCell(this.y), dimensioneCella, dimensioneCella );
    ctx.strokeRect( convertCell(this.x), convertCell(this.y), dimensioneCella, dimensioneCella );
    this.drawCoda();
  },

  drawCoda(){  
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "black";

    // Disegna n. code quanti elementi in nCode[] 
    for( let coda of this.nCode){
      ctx.fillRect( convertCell(coda.x), convertCell(coda.y), dimensioneCella, dimensioneCella );
      ctx.strokeRect( convertCell(coda.x), convertCell(coda.y), dimensioneCella, dimensioneCella );
    }

    // Inserisce coda con coord. == x / y testa, muovendo testa la coda ha vecchie coord. diventando visibile 
    this.nCode.push( { x : this.x, y : this.y } );

    // Se pezzi coda > lunghezza max. --> tagli 1° elemento coda   
    if( this.nCode.length > this.tailLength ){ this.nCode.shift(); }
  },

  // Aggiorna coord attuali in direzione spostamento 
  upPosition(){ this.x += snake.moveX; this.y += snake.moveY; },

}



const mela = { 

  // Coord. celle griglia
  x : Math.floor( Math.random() * 20),
  y : Math.floor( Math.random() * 20),

  draw(){ // Disegna mela 
    ctx.fillStyle = "red"; 
    ctx.fillRect( convertCell(this.x), convertCell(this.y), dimensioneCella, dimensioneCella );
  },

  isEaten(){ 

    // Coord. mela == coord. testa snake --> mela mangiata 
    if( this.x == snake.x && this.y == snake.y ){ 

      // Nuove coordinate  ( ri-disegna nuova mela )
      this.x = Math.floor( Math.random() * 20);
      this.y = Math.floor( Math.random() * 20);
  
      snake.tailLength++;             // Incrementa lunghezza max. code
      divScore.textContent = ++score; // incrementa punteggio
      speed += 0.5;                   // Incrementa velocità
    }
  }

}


const game = {

  clearCanvas(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.width, canvas.height);
  },

  // Game loop 
  startGame(){
    snake.upPosition();
    if(  game.isGameOver()  ){ return } 
    game.clearCanvas();
    mela.isEaten();
    snake.draw();
    mela.draw();
    
    // Ri-esegue game loop ogni n. ms
    setTimeout( () => { game.startGame() }, 1000 / speed); 
  },
 
  resetGame(){           
    score = 0;                        // Reset score
    speed = 7;                        // Reset velocità
    snake.x = 10; snake.y = 5;        // Reset coord. 
    snake.moveX = 0; snake.moveY = 0; // Reset movimento 
    snake.tailLength = 0;             // Reset length coda
    snake.nCode = [];                 // Reset nCode
    game.startGame();                 // Reset game
  },
  


  tastoPremuto( event ){

    // if evita move in direzione inversa ad attuale
    switch( event.keyCode ){
          
      case 38: // arrow down
        if( snake.moveY == 1 ){ return } 
        snake.moveY = -1; snake.moveX = 0; 
        break;
      
      case 40: // arrow up
        if( snake.moveY == -1 ){ return }
        snake.moveY = 1; snake.moveX = 0;
        break;
  
      case 37: // arrow right
        if( snake.moveX == 1 ){ return }
        snake.moveY = 0; snake.moveX = -1;
        break;
  
      case 39: // arrow left
        if( snake.moveX == -1 ){ return }
        snake.moveY = 0; snake.moveX = 1;
        break;
    }
  },

  isGameOver(){
    let gameOver = false;

    // Ad inizio gioco sono 0 ( no check game-over )
    if( snake.moveX === 0 && snake.moveY === 0){ return false; }

    // Snake coord. x < 0 --> collisione bordo sx
    else if( snake.x < 0 ){ gameOver = true; }

    // Snake coord. y < 0 --> collisione bordo up
    else if( snake.y < 0 ){ gameOver = true; }

    // Snake coord. x > max. celle griglia --> collisione bordo dx
    else if( snake.x > nCelleGriglia - 1){ gameOver = true; }

    // Snake coord. y > max. celle griglia --> collisione bordo down
    else if( snake.y > nCelleGriglia - 1){ gameOver = true; }

    // Snake coord. x / y == coda coord. x / y  --> collisione coda
    for( let coda of snake.nCode ){
      if ( coda.x == snake.x && coda.y == snake.y){ gameOver = true; break; }
    }

    // Messagio game over 
    if( gameOver ){
      ctx.font = "50px Cursive";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER!", canvas.width  / 2, canvas.height / 2);
    }

    return gameOver;
  }

}


document.body.addEventListener("keydown", game.tastoPremuto);
btnReset.addEventListener("click", game.resetGame);

game.startGame();
