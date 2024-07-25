import React, {useState, useEffect, createRef} from "react";
import './Progress.scss';
import PropTypes from "prop-types";

const defaultClasses = {
  element: 'progress',
  verticalModifier: '_vertical',
  line: 'progress__line',
  lineInner: 'progress__line-inner',
  point: 'progress__line-point',
  pointBlock: 'progress__line-point-block'
};

export default function Progress(props) {
  const {value = .5, progressChanged, onChangeStarted, onChangeEnded, isVertical, hasDot, overrideClasses} = props;

  const classes = {...defaultClasses, ...overrideClasses};

  const [pointerdown, setPointerdown] = useState(false);

  const clearPointerdownState = () => {
    setPointerdown(false);
    onChangeEnded && onChangeEnded();
  };

  const changeVal = (e) => {
    calculateValue(e, line, pointerdown, isVertical, progressChanged)
  };

  const line = createRef();

  useEffect(() => {
    window.addEventListener('pointerup', clearPointerdownState);
    return () => {
      window.removeEventListener('pointerup', clearPointerdownState);
    };
  });

  return (
    <div
      className={`${classes.element} ${isVertical && `${classes.element}${classes.verticalModifier}`}`}
      role={"button"}
      tabIndex={"0"}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <div className={`${classes.line} ${isVertical && `${classes.line}${classes.verticalModifier}`}`}
           ref={line}
           onPointerDown={() => {
             onChangeStarted && onChangeStarted();
             setPointerdown(true);
           }}
           role={"button"}
           tabIndex={"0"}
           onMouseMove={changeVal}
           onTouchMove={changeVal}
           onMouseDown={changeVal}
           onTouchStart={changeVal}
      >
        <div
          className={`${classes.lineInner} ${isVertical && `${classes.lineInner}${classes.verticalModifier}`}`}
          style={isVertical ? {height: `${value * 100}%`} : {width: `${value * 100}%`}}/>
        {(hasDot) &&
        <div
          className={`${classes.point} ${isVertical && `${classes.point}${classes.verticalModifier}`}`}
          style={isVertical ? {bottom: `${value * 100}%`} : {left: `${value * 100}%`}}>
          <div
            className={`${classes.pointBlock} 
              ${isVertical && `${classes.pointBlock}${classes.verticalModifier}`}`}/>
        </div>
        }
      </div>
    </div>
  )
}

function calculateValue({pageX, pageY, touches}, line, pointerdown, isVertical, progressChanged) {

  const x = touches ? touches[0].pageX : pageX;
  const y = touches ? touches[0].pageY : pageY;
  let val;
  const rect = line.current.getBoundingClientRect();

  if (!pointerdown) return;
  if (isVertical) {
    val = 1 - (y - rect.y) / rect.height;
  } else {
    val = (x - rect.x) / rect.width;
  }

  progressChanged && progressChanged(Math.min(Math.max(val, 0), 1));
}

Progress.propTypes = {
  /**
   * Значение прогресса (0-1)
   */
  value: PropTypes.number,
  /**
   * Метод, который вызывается когда действие пользователя поменяло значение прогресса
   */
  progressChanged: PropTypes.func,
  /**
   * Метод, который вызывается когда пользователь начал пепретаскивать прогресс
   */
  onChangeStarted: PropTypes.func,
  /**
   * Метод, который вызывается когда пользователь закончил пепретаскивать прогресс
   */
  onChangeEnded: PropTypes.func,
  /**
   * Вертикальный прогресс
   */
  isVertical: PropTypes.bool,
  /**
   * Наличие точки в конце линии
   */
  hasDot: PropTypes.bool,
  /**
   * Классы для перегрузки стандартных
   */
  overrideClasses: PropTypes.object,
};

Progress.displayName = "Progress";
