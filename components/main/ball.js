import * as PIXI from 'pixi.js';
import {gsap, TimelineMax, Linear} from 'gsap';
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(useGSAP);


export default class Ball extends PIXI.Container {
  name = "ball";
  posX = 0;
  posY = 0;
  texture = PIXI.Texture.from("/images/ball3.png");
  textureShadow = PIXI.Texture.from("/images/shadow.png");

  constructor() {
    super();

    // create shadow
    this.shadow = new PIXI.Sprite();
    this.addChild(this.shadow);
    this.shadow.name = "shadow";
    this.shadow.texture = this.textureShadow;
    this.shadow.anchor.set(.5, .5);
    this.shadow.position.x = this.posX;
    this.shadow.position.y = this.posY;

    // create ball
    this.sprite = new PIXI.Sprite();
    this.addChild(this.sprite);
    this.sprite.name = "ball";
    this.sprite.texture = this.texture;
    this.sprite.anchor.set(.5, 1);
    this.sprite.position.x = this.posX;
    this.sprite.position.y = this.posY;
  }

  init({x, y, width, height}){
    // init ball
    this.sprite.posY = y;
    this.sprite.posX = x;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.width = width;
    this.sprite.height = height;

    // init shadow
    this.shadow.position.x = x;
    this.shadow.position.y = y;
    this.shadow.width = width * 0.9;
    this.shadow.height = width * 0.9 * 0.139;
  }

  jump(onComplite) {  
    const timeline = gsap.timeline();  
    const timelineShadow = gsap.timeline();  
    const duration = 0.4; 
    const ease = gsap.parseEase(".17,.89,.48,1.33");
    const from = this.sprite.y;
    const to = this.sprite.y - 150;

    timeline
      .to(this.sprite, {
        y: to,
        ease: "Circ.easeOut",
        duration: duration
      })
      .to(this.sprite, {
        y: from,
        ease: "Circ.easeIn",
        duration: duration * 0.8
      }, duration)
      .to(this.sprite.scale, {
        x: 1.5,
        y: 0.6,
        ease: "none",
        duration: duration * 0.25
      }, duration * 1.7)
      .to(this.sprite.scale, {
        x: 0.8,
        y: 0.8,
        ease: "Power1.easeInOut",
        duration: duration * 0.25
      }, duration * 1.9)
      .then(() => {
        onComplite();
      })

    timelineShadow
      .to(this.shadow.scale, {
        x: 0.7,
        y: 0.7,
        ease: "none",
        duration: duration
      })
      .to(this.shadow.scale, {
        x: 1,
        y: 1,
        ease: "none",
        duration: duration * 0.8
      }, duration)
      .to(this.shadow.scale, {
        x: 1.5,
        y: 1.5,
        ease: "none",
        duration: duration * 0.25
      }, duration * 1.7)
      .to(this.shadow.scale, {
        x: 1,
        y: 1,
        ease: "none",
        duration: duration * 0.25
      }, duration * 1.9)
  }
}
