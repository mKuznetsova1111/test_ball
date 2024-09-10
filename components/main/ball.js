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
    this.posY = y;
    this.posX = x;
    this.position.x = this.posX;
    this.position.y = this.posY;
  }

  getWidth(){
    return this.sprite.width;
  }

  jump(onComplite) {  
    const timeline = gsap.timeline();  
    const duration = 0.4; 
    const ease = gsap.parseEase(".17,.89,.48,1.33");
    const from = this.y;
    const to = this.y - 150;

    timeline
      .to(this, {
        y: to,
        ease: "Circ.easeOut",
        duration: duration
      })
      .to(this, {
        y: from,
        ease: "Circ.easeIn",
        duration: duration * 0.8
      }, duration)
      .to(this.scale, {
        x: 1.5,
        y: 0.6,
        ease: "none",
        duration: duration * 0.25
      }, duration * 1.7)
      .to(this.scale, {
        x: 1,
        y: 1,
        ease: "Power1.easeInOut",
        duration: duration * 0.25
      }, duration * 1.9)
      .then(() => {
        onComplite();
      })

  }
}
