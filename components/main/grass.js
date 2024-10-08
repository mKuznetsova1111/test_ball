import * as PIXI from 'pixi.js';
import { Assets } from 'pixi.js';

Assets.add("grass", "/images/grass.png");


export default class Grass extends PIXI.Container {
  name = "grass";
  posX = 0;
  posY = 0;
  texture = null;

  constructor() {
    super();
    const asset1 = Assets.load("grass");
    const texture = PIXI.Texture.from("/images/grass.png");
    this.sprite = new PIXI.Sprite();
    this.addChild(this.sprite);
    this.sprite.name = "grass";
    this.sprite.texture = texture;
    this.sprite.anchor.set(0, 1);
    this.sprite.position.x = this.posX;
    this.sprite.position.y = this.posY;
  }

  init({x, y, width, height}){
    this.sprite.posY = y;
    this.sprite.posX = x;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.width = width;
    this.sprite.height = height;
  }

  getHeight(){
    return this.sprite.height;
  }
}
