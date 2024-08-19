import React, {useState} from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {useContent} from "../../redux/reducer/content";
import {useUser} from "../../redux/reducer/user";
import Form from "../baseComponents/gui/form/Form";
import Button from "../baseComponents/gui/button/Button";
import Input from "../baseComponents/gui/input/Input";


const INPUTS = [
  {
    name: "username",
    placeholder: "Username",
  },
  {
    name: "password",
    placeholder: "Password",
  }
]

export default function Main({className, children}) {
  const {data} = useContent();
  const {profile} = useUser();
  const [isAuth, setIsAuth] = useState(false);

  console.log(data);

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
    .then(() => setIsAuth(true));
  }

  return (
    <div className={classNames("main", className)}>
      { !isAuth ? <Form className={"main__form"} onSubmit={(data) => {
        console.log(data)
        sendInfo({username: data.username, password: data.password})
      }}>
        {inputsContent()}
        <Button text={"Send"} type={"submit"}/>
      </Form> : null }
    </div>
  );

  function inputsContent() {
    return INPUTS.map((item, index) => {
      return (
        <Input
          key={"mainInput-" + index}
          {...item}
          className={"main__input input"}
        />
      );
    });
  }
}
Main.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};