import React, {useEffect} from "react";
import ControlsButton from "./ControlsButton";
import './Controls.scss';
import Progress from "../progress/Progress";

export default function Controls(props) {
  const {
    actions, controls, volume, setVolume, className, hideControls,
    hiddenSetter, hiddenClass, controlsVisible, isNext, isPrev
  } = props;
  const keys = Object.keys(controls);

  let hideTimeout;

  useEffect(() => {
    if (hideControls && controlsVisible) {
      hideTimeout = setTimeout(() => {
        hiddenSetter && hiddenSetter(false)
      }, hideControls);
    }
    return () => {
      clearTimeout(hideTimeout);
    }
  });

  return (
    <div
      className={
        `controls ${className || ""} 
        ${controlsVisible ? '' : hiddenClass} 
        ${isNext && "controls_has-next" || ""} 
        ${isPrev && "controls_has-prev" || ""}`
      }>
      <div className="controls-buttons">
        {
          keys.map(key => {
            const current = controls[key];
            if (key === "volumeRegulator") {
              return <Progress
                value={volume}
                progressChanged={setVolume}
                className={`controls-button__volume-regulator`}
                key={key}
                {...controls[key]}
              />
            }
            {
              if (current.prop) {
                return <ControlsButton
                  key={key}
                  className={`
                            controls-button-${key}
                            controls-button-${key}_on
                            controls-button
                            ${current.class && current.class}
                          `}
                  data={props[current.prop] ? current.onState : current.offState}
                  onClick={props[current.prop] ?
                    actions[current.onState.action] :
                    actions[current.offState.action]
                  }
                />
              } else {
                return <ControlsButton
                  key={key}
                  className={`controls-button-${key} controls-button ${current.class && current.class}`}
                  data={current}
                  onClick={actions[key]}
                />
              }
            }
          })
        }
      </div>
    </div>
  )
}
