import React, {useEffect, useRef, useState} from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {useContent} from "../../redux/reducer/content";
import Form from "../baseComponents/gui/form/Form";
import Button from "../baseComponents/gui/button/Button";
import Input from "../baseComponents/gui/input/Input";
import shuffle from "../../utils/Shuffle";
import {required} from "../../constants/form";
import requests from "../../redux/reducer/requests";
import {useDispatch} from "react-redux";
import user, {useUser} from "../../redux/reducer/user";
import * as PIXI from 'pixi.js';
import Ball from "./ball";
import Grass from "./grass";

const INPUTS = [
  {
    name: "username",
    placeholder: "Username",
    rules: required(),
    autoComplete: "username"
  },
  {
    name: "password",
    placeholder: "Password",
    rules: required("password")
  }
]

export default function Main({className, children}) {
  const {data} = useContent();
  const dispatch = useDispatch();
  const {token, requestStatus} = useUser();
  const isAuth = !!token;
  const [_data, setData] = useState(data);
  const [activeItem, setActiveItem] = useState(null);
  const sceneRef = useRef();

  useEffect(() => {
    if (!localStorage) {
      return
    }
    const token = localStorage.getItem('TOKEN_KEY');
    if(token)
      dispatch(user.actions.saveToken(token));
  }, [])

  function sendInfo(data) {
    dispatch(requests.thunks.mainSend(data));
    //     username: emilys
    //     password: emilyspass
  }

  function onClick() {
    let newData = null;
    let testData = [..._data];
    if (testData.length < 1) {
      setData(data);
      testData = [...data];
    }
    newData = shuffle(testData);
    let item = newData.shift();
    setData(newData);
    setActiveItem(item);
  }

  useEffect(() => {
    if(!sceneRef.current) return;
    const height = sceneRef?.current?.clientHeight;
    const width = sceneRef?.current?.clientWidth;
    const app = new PIXI.Application({ width: width, height: height, backgroundColor: `b7efff` })
    sceneRef?.current?.appendChild(app.view);
    const grass = new Grass;
    const ball = new Ball;
    app.stage.addChild(grass);
    app.stage.addChild(ball);
    console.log(height, grass.getHeight(), height - grass.getHeight())
    ball.init({x: width / 2, y: height - grass.getHeight()})
    grass.init({x: 0, y: height, width: width})
    // ball.jump()
    console.log(ball.getWidth())
    console.log(grass.getHeight())
  }, [sceneRef.current])

  return (
    <div className={classNames("main", className)}>
      {!isAuth ? <Form className={"main__form"} onSubmit={(item) => {
        sendInfo({username: item.username, password: item.password})
      }}>
        {inputsContent()}
        <Button text={"Send"} type={"submit"}/>
      </Form> : <div className={"main__block"}>
        <div className={"main__scene"} onClick={() => onClick()} ref={sceneRef}>
        </div>
        {activeItem && <div className={"main__text"}>
          <span>{activeItem.title}</span>
        </div>}
      </div>}
    </div>
  );

  function inputsContent() {
    return INPUTS.map((item, index) => {
      return (
        <Input
          key={"mainInput-" + index}
          {...item}
          comp={"main__input input"}
        />
      );
    });
  }
}
Main.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
