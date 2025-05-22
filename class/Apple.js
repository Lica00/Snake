

export class Apple{

  x = Math.floor( Math.random() * 20);
  y = Math.floor( Math.random() * 20);
  moveX = 0;  moveY = 0;
 
  color = "red";
  strokeColor = "red";

  // Aggiorna coord attuali in direzione spostamento 
  updatePosition(){ this.x += this.moveX; this.y += this.moveY; }
    
}