import { Canvas } from "./class/Canvas.js";
import { Snake } from "./class/Snake.js";
import { Apple } from "./class/Apple.js";


const canva = new Canvas(new Snake(), new Apple());
canva.startGame();



