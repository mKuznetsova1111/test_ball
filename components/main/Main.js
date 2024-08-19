import React from "react";
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

  console.log(data);

  return (
    <div className={classNames("main", className)}>
      {/*<Form className={"main__form"} onSubmit={data => callbacks[form.onSubmitCallback]?.(data)}/>*/}
      <Form className={"main__form"}>
        {inputsContent()}
        <Button text={"Send"} type={"submit"}/>
      </Form>
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