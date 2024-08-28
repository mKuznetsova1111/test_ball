import React, {useState, useEffect} from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {useContent} from "../../redux/reducer/content";
import {useUser} from "../../redux/reducer/user";
import Form from "../baseComponents/gui/form/Form";
import Button from "../baseComponents/gui/button/Button";
import Input from "../baseComponents/gui/input/Input";
import {setToken} from "../../redux/reducer/content";


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

const TEST = [
  {userId: 1, id: 1, title: 'delectus aut autem', completed: false},
  {userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed: false},
  {userId: 1, id: 3, title: 'fugiat veniam minus', completed: false},
  {userId: 1, id: 4, title: 'et porro tempora', completed: true}
]

export default function Main({className, children}) {
  const {data} = useContent();
  const [isAuth, setIsAuth] = useState(false);
  const [_data, setData] = useState(TEST);
  const [activeItem, setActiveItem] = useState(null);

  // console.log(data);

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

  // useEffect(() => {
  //   const item = _data[activeIndex];
  //   let newData = _data;
  //   delete newData[activeIndex];
  //   setData(newData);
  // }, [activeIndex])


  // useEffect(() => {
  //   console.log(_data)
  // }, [_data])

  function random(n) {
    return Math.floor(Math.random() * Math.floor(n));
  }

  function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
      let j = random(arr.length);
      let k = random(arr.length);
      let t = arr[j];
      arr[j] = arr[k];
      arr[k] = t;
    }
    return arr;
  }

  function getFirstItem(){
    const newData = shuffle(_data);
    setData(newData);
    // console.log(TEST, newData)
  }

  // useEffect(() => {
  //   _data.shift();
  // }, [_data])

  // useEffect(() => {
  //  console.log(_data)
  // }, [_data])


  return (
    <div className={classNames("main", className)}>
      { !isAuth ? <Form className={"main__form"} onSubmit={(data) => {
        sendInfo({username: data.username, password: data.password})
      }}>
        {inputsContent()}
        <Button text={"Send"} type={"submit"}/>
      </Form> : <div className={"main__block"}>
        <div className={"main__scene"} onClick={() => {
          // let newData = null;
          // console.log(_data, _data.length)
          // if (_data.length < 1){
          //   console.log("wcm?")
          //   setData(TEST);
          //   newData = TEST;
          //   newData = shuffle(newData);
          // }
          // newData = shuffle(_data);
          // let item = newData.shift();
          // setActiveItem(item);

          let newData = null;
          let testData = _data;
          console.log(_data, _data.length)
          if (testData.length < 1){
            console.log("wcm?")
            setData(TEST);
            testData = TEST;
            console.log("1 ", _data)
          }
          console.log("2 ", _data)
          newData = shuffle(testData);
          let item = newData.shift();
          setActiveItem(item);

        }}>
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