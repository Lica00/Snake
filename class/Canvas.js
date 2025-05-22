import { Snake } from "./Snake.js";
import { Apple } from "./Apple.js";

export class Canvas{

    canvas;  divScore; ctx;
    width = 500; height = 500;
    maxGridCell = 20;                            // n. max celle nella griglia
    widthCell =  this.width / this.maxGridCell ; // width px ciascuna cella 
    speed = 7; // Velocità 
    score = 0; // Punteggio
    entities = [];



    constructor( snake, apple ){ 

        const html = `
            <div>
                <h1> Snake </h1> 
                <canvas width="${this.width}" height="${this.height}"></canvas>
                <div id="score"> 0 </div>
                <button> Reset </button>
            </div>
        `;

        // inserisce html nel <body>
        document.body.innerHTML = html;

        // Prende ref tag html e salva in proprietà
        this.canvas = document.querySelector("canvas");   
        this.divScore = document.getElementById("score"); 
        this.ctx = this.canvas.getContext("2d");              
        
        // Prende ref btn reset con event listener click per reset game 
        const btnReset = document.querySelector("button"); 
        btnReset.addEventListener("click", () => { this.resetGame() }); 

        // Salva entità di gioco in array
        this.entities.push(snake, apple);

        // Event listener su body per keydown movimento snake 
        document.body.addEventListener("keydown", ( event ) => { 
            this.moveEntity( event.code.slice(5).toLowerCase(), this.entities[0] );
        });


    }


    // Converte coord. griglia x-y  in coord px --> ( coordCella * widthCella ) 
    convertCell( coord ){ return coord * this.widthCell };


    clearCanvas(){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0,0, this.width, this.height);
    }

    // Avvia gameLoop
    startGame(){

        this.clearCanvas();

        // Disegna entità di gioco - aggiorna coord. per posizione futura
        for( let entity of this.entities ){ this.drawEntity(entity);  entity.updatePosition(); }
        if(  this.collisionManager( this.checkCollision() )  ){ return } 

        // Ri-esegue game loop ogni n. ms
        setTimeout( () => { this.startGame() }, 1000 / this.speed); 
    }




    drawEntity( entity ){

        this.ctx.fillStyle = entity.color;
        this.ctx.strokeStyle = entity.strokeColor;
        this.ctx.fillRect(   this.convertCell(entity.x), this.convertCell(entity.y), this.widthCell, this.widthCell );
        this.ctx.strokeRect( this.convertCell(entity.x), this.convertCell(entity.y), this.widthCell, this.widthCell );

        // Se snake disegna anche la coda 
        if( entity instanceof Snake ){
            this.ctx.fillStyle = entity.color;
            this.ctx.strokeStyle = entity.strokeColor;

            // Disegna n. code quanti elementi in nCode[] 
            for( let coda of entity.nCode ){
                this.ctx.fillRect(  this.convertCell(coda.x), this.convertCell(coda.y), this.widthCell, this.widthCell );
                this.ctx.strokeRect( this.convertCell(coda.x), this.convertCell(coda.y), this.widthCell, this.widthCell );
            }

            // Inserisce coda con coord. == x / y testa, muovendo testa la coda ha vecchie coord. diventando visibile 
            entity.nCode.push( { x : entity.x, y : entity.y } );

            // Se pezzi coda > lunghezza max. --> tagli 1° elemento coda   
            if( entity.nCode.length > entity.tailLength ){ entity.nCode.shift(); }

        }

    }


    moveEntity( direction, entity ){

        // if evita move in direzione inversa ad attuale
        switch( direction ){
            
        case "up": 
            if( entity.moveY == 1 ){ return } 
            entity.moveY = -1; entity.moveX = 0; 
            break;
        
        case "down": 
            if( entity.moveY == -1 ){ return }
            entity.moveY = 1; entity.moveX = 0;
            break;
    
        case "left": 
            if( entity.moveX == 1 ){ return }
            entity.moveY = 0; entity.moveX = -1;
            break;
    
        case "right":
            if( entity.moveX == -1 ){ return }
            entity.moveY = 0; entity.moveX = 1;
            break;
        }
    }

    // 0 --> collisione tra due entità --> ossia tra snake e apple
    // 1 --> collisione tra entità e bordo griglia --> ossia tra snake e bordo griglia
    // 2 --> collisione tra entità e coda entità --> ossia tra snake e coda snake
    checkCollision(){

        // Verifica collisizione tra due entità
        for( let ent1 of this.entities ){ 
            for( let ent2 of this.entities ){
                if( ent1 == ent2 ){ continue }
                if( ent1.x == ent2.x && ent1.y == ent2.y ){ return 0; }
            }            
        }

        // Verifica collisizione tra entità e bordi griglia
        for( let entity of this.entities ){ 
            if( entity.x < 0 ){ return 1; }                          // coord. x < 0 --> collisione bordo sx
            else if( entity.y < 0 ){ return  1; }                    //  coord. y < 0 --> collisione bordo up
            else if( entity.x > this.maxGridCell - 1){ return 1; }   //  coord. x > max. celle  --> collisione bordo dx
            else if( entity.y > this.maxGridCell - 1){ return 1; }   //  coord. y > max. celle  --> collisione bordo down
            
        }

        // Verifica collisione entità snake con coda snake
        for( let entity of this.entities ){ 
            if( entity instanceof Snake ){
                for( let coda of entity.nCode ){
                    if ( coda.x == entity.x && coda.y == entity.y){ return 2; } // Snake coord. x / y == coda coord. x / y  --> collisione coda
                }
            }
            else{ continue }
        }

    }




    
    // Riceve e gestice il tipo di collisione
    collisionManager( c ){

        let gameOver = false;

        switch( c ){

            // Collisione tra due entità ( snake e apple )
            case 0:
                this.entities[1].x = Math.floor( Math.random() * 20);
                this.entities[1].y = Math.floor( Math.random() * 20);
            
                this.entities[0].tailLength++;            // Incrementa lunghezza max. code
                this.divScore.textContent = ++this.score; // incrementa punteggio
                this.speed += 0.5;                        // Incrementa velocità

                gameOver = false;
            break;

            // Collisione tra snake e bordo || snake e coda snake
            case 1:
            case 2:
                this.ctx.font = "50px Cursive";
                this.ctx.fillStyle = "black";
                this.ctx.textAlign = "center";
                this.ctx.fillText("GAME OVER!", this.canvas.width  / 2, this.canvas.height / 2);
                gameOver = true;
            break;
        }

        return gameOver;

    }

    resetGame(){           
        this.score = 0;     // Reset score
        this.speed = 7;     // Reset velocità
        this.entities = []; // Reset array entità 

        // Reset: coord - movimento - length coda - nCode di snake
        this.entities.push( new Snake(), new Apple()); 
        this.startGame();                 // Reset game
    }


}












 

 