import React, {useState} from "react";
import './ContentView.scss';
import ContentViewImage from "./ContentViewImage";
import ContentViewPlayableItem from "./ContentViewPlayableItem";
import PropTypes from "prop-types";

const defaultClasses = {
  element: "content-view",
  item: "content-view__content",
  image: "content-view__content-image",
  video: "content-view__content-video",
  videoHidden: "content-view__content-video_hidden",
  audio: "content-view__content-audio",
  contentCover: "content-view__content_cover",
  contentContain: "content-view__content_contain",
  centerV: "content-view_v-centered",
  centerH: "content-view_h-centered",
  contain: "content-view_contain",
  cover: "content-view_cover",
  overlay: "content-view__overlay",
  overlayIcon: "content-view__overlay-icon",
  progress: "content-view__content-progress",
  playableItem: "content-view__playable-item"
};

export default function ContentView(props) {
  const {item, overrideClasses, preloader, swipeScroll, actions} = props;

  const classes = overrideClasses ? {...defaultClasses, ...overrideClasses} : defaultClasses;

  const [loaded, setLoaded] = useState(false);
  const [currentContent, setCurrentContent] = useState(item.image);
  const [pointerLocation, setPointerLocation] = useState(null);
  const [lastPointerLocation, setLastPointerLocation] = useState(null);
  const [isSwipe, setIsSwipe] = useState(null);

  const onLoad = () => {
    setLoaded(true)
  };

  if (currentContent !== item.id) {
    setLoaded(false);
    setCurrentContent(item.id);
  }

  return (
    <>
      {preloader && !loaded ? preloader : null}
      <div className={`
        ${classes.element}
        ${!item.notCenterV ? classes.centerV : ''}
        ${!item.notCenterH ? classes.centerH : ''}
        // ${item.contain ? classes.contain : classes.cover}
      `}
           style={{
             display: preloader && !loaded ? "none" : ""
           }}
           onPointerDown={({clientX}) => {
             // setStartTouchTimestamp(Date.now());
             setIsSwipe(true);
             setPointerLocation(clientX);
             setLastPointerLocation(clientX);
           }}
           onPointerUp={() => {
             if (!pointerLocation) return;
             const range = pointerLocation - lastPointerLocation;
             if (isSwipe) {
               if (pointerLocation && swipeScroll && actions && Math.abs(range) >= swipeScroll) {
                 range < 0 ? actions.prev() : actions.next();
               }
             }
             // setStartTouchTimestamp(null);
             setPointerLocation(null);
           }}
           onPointerCancel={() => {
             setPointerLocation(null);
           }}
           onPointerMove={({clientX}) => {
             setLastPointerLocation(clientX);
           }}
      >
        {
          (!item.video && !item.audio) &&
          <ContentViewImage
            {...props}
            classes={classes}
            onLoad={onLoad}
          />
        }
        {
          (item.audio || item.video) &&
          <ContentViewPlayableItem
            {...props}
            isSwipe={isSwipe}
            setIsSwipe={setIsSwipe}
            classes={classes}
            onLoad={onLoad}
          />
        }
      </div>
    </>
  )
}

ContentView.propTypes = {
  /**
   * Объект с контентом. Используются параметры notCenterV, notCenterH и contain
   * для позиционирования и встраивания контента. Передаётся детям
   */
  item: PropTypes.object,
  /**
   * Отображение превью для видео и аудио
   */
  overrideClasses: PropTypes.object,
  /**
   * Компонент прелоадера, который будет виден пока контент не загрузился
   */
  preloader: PropTypes.object,
  /**
   * Расстояние на которое нужно свайпнуть для смены элемента, не работает если !!swipeScroll === false.
   * Вызывает действия prev и next
   */
  swipeScroll: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Объект с действиями
   */
  actions: PropTypes.object
};
