import React, {useState, useEffect} from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {useContent} from "../../redux/reducer/content";
import {useUser} from "../../redux/reducer/user";
import Form from "../baseComponents/gui/form/Form";
import Button from "../baseComponents/gui/button/Button";
import Input from "../baseComponents/gui/input/Input";
import {setToken} from "../../redux/reducer/content";
import shuffle from "../../utils/Shuffle";
import {required} from "../../constants/form";


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
  const [isAuth, setIsAuth] = useState(false);
  const [_data, setData] = useState(data);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (!localStorage) {return};
    const token = localStorage.getItem('TOKEN_KEY');
    setIsAuth((token !== null && token !== undefined) ? true : false)
  }, [])

  function sendInfo({username, password}){
    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username, //emilys
        password: password, //emilyspass
      })
    })
    .then(res => res.json())
    .then((e) => {
      if (e.token){
        localStorage.setItem("TOKEN_KEY", e.token);
        setIsAuth(true);
      }
    });
  }

  function onClick(){
    let newData = null;
    let testData = [..._data];
    if (testData.length < 1){
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
      { !isAuth ? <Form className={"main__form"} onSubmit={(data) => {
        sendInfo({username: data.username, password: data.password})
      }}>
        {inputsContent()}
        <Button text={"Send"} type={"submit"}/>
      </Form> : <div className={"main__block"}>
        <div className={"main__scene"} onClick={() => onClick()}>
        </div>
        { activeItem && <div className={"main__text"}>
          <span>{activeItem.title}</span>
        </div> }
      </div> }
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