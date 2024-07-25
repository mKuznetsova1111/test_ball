import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";
import objectFit, {fit} from "../../utils/ObjectFit";

export default function ContentViewImage({item, classes, playOnClick, actions, playing, onLoad}) {
  const img = useRef();

  useEffect(() => {
    if (img.current.complete) onLoad && onLoad();

    const onResize = () => fit(img.current, item.fit);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  function onSelect() {
    if ((item.video || item.audio) && playOnClick)
      actions && actions[playing ? "pause" : "play"]()

  }

  objectFit(img, item.fit);

  return (
    <div
      role="button"
      tabIndex="0"
      onClick={onSelect}
      onKeyDown={event => (event.key === 'Enter' && onSelect())}
      className={classes ? `
                  ${classes.item} 
                  ${classes.image} 
                  ${item.contain ? classes.contentContain : classes.contentCover}` : ''}
    >
      <img
        ref={img}
        alt={"img"}
        draggable={false}
        {...item.params}
        src={item.image}
        onLoad={() => {
          onLoad && onLoad()
        }}
      />
    </div>
  )
}

ContentViewImage.propTypes = {
  /**
   * Объект с контентом. Изображение подставляется из параметра img.
   * Так же используется объект params с параметрами которые надо добавить элементу img
   */
  item: PropTypes.object,
  /**
   * Объект с классами. Подставляется элемент по параметру image
   * а так же contentContain или contentCover  в зависимости от значения
   * пропа contain
   */
  classes: PropTypes.object,
  /**
   * Объект с действиями
   */
  actions: PropTypes.object,
  /**
   * Вызов действия play или pause по клику, если объект item содержит
   * параметры audio или video
   */
  playOnClick: PropTypes.bool,
  /**
   * Метод, который вызывается по зваершению загрузки
   */
  onLoad: PropTypes.func,
  /**
   * Состояния проигрывания. Используется для работы пропа playOnClick
   */
  playing: PropTypes.bool,
};
