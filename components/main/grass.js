import * as PIXI from 'pixi.js';


export default class Grass extends PIXI.Container {
  name = "grass";
  posX = 0;
  posY = 0;
  texture = PIXI.Texture.from("/images/grass.png");

  constructor() {
    super();
    this.sprite = new PIXI.Sprite();
    this.addChild(this.sprite);
    this.sprite.name = "grass";
    this.sprite.texture = this.texture;
    this.sprite.anchor.set(0, 1);
    this.position.x = this.posX;
    this.position.y = this.posY;
  }

  init({x, y, width}){
    console.log(width)
    this.posY = y;
    this.posX = x;
    this.position.x = this.posX;
    this.position.y = this.posY;
    // this.width = 400;
    // this.height = 67;
    // console.log(this.sprite.width, this.sprite.height)
  }

  getHeight(){
    console.log(this, this.texture.height)
    return this.sprite.height;
  }
}
