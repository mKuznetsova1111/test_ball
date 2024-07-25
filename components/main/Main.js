import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
// import axios from "axios";
import {useContent} from "../../redux/reducer/content";
import {useUser} from "../../redux/reducer/user";
// import {get, post} from "../../hooks/api/api";


export default function Main({className, children}) {
  const {data} = useContent();
  const {profile} = useUser();
  // console.log(get('https://jsonplaceholder.typicode.com/todos'))

  console.log(data);

  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  // })
  // .then(function (response) {
  //   console.log(response.data)
  // });

  return (
    <div className={classNames("main", className)}>
      {children}
    </div>
  );
}
Main.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

