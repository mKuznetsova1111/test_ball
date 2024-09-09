import React, {useState, useEffect, useMemo, useRef} from "react";
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

import { BlurFilter, TextStyle } from 'pixi.js';
import { Stage, Container, Sprite, Text } from '@pixi/react';

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
  const [grassPos, setGrassPos] = useState({x: 0, y: 0});
  const [ballPos, setballPos] = useState({x: 0, y: 0});
  const [activeItem, setActiveItem] = useState(null);
  const [test, setTest] = useState(false);
  const sceneRef = useRef();
  const grassRef = useRef();
  const ballRef = useRef();

  useEffect(() => {
     // console.log( sceneRef.current.props.height,  grassRef.current.height);
    if (test){
      const grassTop = sceneRef.current.props.height - grassRef.current.height;
      const ballTop = grassTop - (ballRef.current.height * 0.5);
      const ballLeft = (sceneRef.current.props.width * 0.5) - (ballRef.current.width * 0.5);
     console.log( sceneRef.current.props.height,  grassRef.current.height, grassTop,  ballTop);
      setGrassPos({x: 0, y: grassTop})
      setballPos({x: ballLeft, y: ballTop})
    }
  }, [test])

  useEffect(() => {
     setTest( true );
  }, [])

  useEffect(() => {
     console.log( grassPos );
  }, [grassPos])

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

  return (
    <div className={classNames("main", className)}>
      {!isAuth ? <Form className={"main__form"} onSubmit={(item) => {
        sendInfo({username: item.username, password: item.password})
      }}>
        {inputsContent()}
        <Button text={"Send"} type={"submit"}/>
      </Form> : <div className={"main__block"}>
        <div className={"main__scene"} onClick={() => onClick()}>
          <Stage width={400} height={400} options={{ background: `#b7efff` }} ref={sceneRef}>
            <Sprite image={"/images/ball3.png"} x={ballPos.x} y={ballPos.y} ref={ballRef}/>
            <Sprite image={"/images/grass.png"} x={grassPos.x} y={grassPos.y} ref={grassRef}/>
          </Stage>
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
