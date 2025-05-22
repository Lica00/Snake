
export class Snake{

    x = 10; y = 5;         // Coord. celle griglia ( testa )
    moveX = 0;  moveY = 0; // Movimento su assi x / y
    nCode = [];            // Parti coda con coord.
    tailLength = 0;        // Lunghezza attuale coda

    color = "lightgreen";
    strokeColor = "black";

    constructor(){ this.reset(); }

    // Aggiorna coord attuali in direzione spostamento 
    updatePosition(){ this.x += this.moveX; this.y += this.moveY; }

}