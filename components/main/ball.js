import * as PIXI from 'pixi.js';
import {gsap, TimelineMax, Linear} from 'gsap';
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(useGSAP);


export default class Ball extends PIXI.Container {
  name = "ball";
  posX = 0;
  posY = 0;
  width = 60;
  height = 60;
  texture = PIXI.Texture.from("/images/ball3.png");

  constructor() {
    super();
    this.sprite = new PIXI.Sprite();
    this.addChild(this.sprite);
    this.sprite.name = "ball";
    this.sprite.texture = this.texture;
    this.sprite.anchor.set(.5, 1);
    this.position.x = this.posX;
    this.position.y = this.posY;
  }

  init({x, y}){
    console.log(y);
    this.posY = y;
    this.posX = x;
    this.position.x = this.posX;
    this.position.y = this.posY;
    console.log(this.posY);
  }

  getWidth(){
    return this.sprite.width;
  }

  jump() {    
    console.log(this.y)
    gsap.fromTo(this, {
      posY: this.y,
    }, {
      posY: this.y + 20,
      ease: "none",
      duration: 30
    })

  }
}
