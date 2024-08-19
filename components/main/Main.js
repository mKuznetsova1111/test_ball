import React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import {useContent} from "../../redux/reducer/content";
import {useUser} from "../../redux/reducer/user";


export default function Main({className, children}) {
  const {data} = useContent();
  const {profile} = useUser();

  console.log(data);

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

