import React, {useState, useEffect} from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {useContent} from "../../redux/reducer/content";
import Form from "../baseComponents/gui/form/Form";
import Button from "../baseComponents/gui/button/Button";
import Input from "../baseComponents/gui/input/Input";
import {setToken} from "../../redux/reducer/content";
import shuffle from "../../utils/Shuffle";
import {required} from "../../constants/form";
import requests, {useRequestData} from "../../redux/reducer/requests";
import {useDispatch} from "react-redux";
import user, {useUser} from "../../redux/reducer/user";

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
  const {request} = useRequestData("main/send");

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
    dispatch(requests.thunks.mainLoad());
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
