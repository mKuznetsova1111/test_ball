import React from "react";
import PropTypes from "prop-types";

export default function ContentViewPauseOverlay({className, iconClassName, icon}) {
  return <div className={className}>
    <img src={icon} alt={icon} className={iconClassName}/>
  </div>
}

ContentViewPauseOverlay.propTypes = {
  /**
   * Класс для оверлея
   */
  className: PropTypes.string,
  /**
   * Иконка
   */
  icon: PropTypes.string,
  /**
   * Класс иконки
   */
  iconClassName: PropTypes.string,
};
