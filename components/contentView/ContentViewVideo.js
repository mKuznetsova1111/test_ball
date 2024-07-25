import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";
import objectFit, {fit} from "../../utils/ObjectFit";

export default function ContentViewVideo({
                                           item, classes, playOnClick, actions, playing, showPreview,
                                           setItemProgress, onLoad, refs
                                         }) {

  const video = useRef();

  useEffect(() => {
    if (video.current.readyState === 4) onLoad && onLoad();

    const onResize = () => {
      fit(video.current, item.fit)
    };
    window.addEventListener('resize', onResize);
    objectFit(video, item.fit);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });


  useEffect(()=>{
    refs[item.id].video = video.current;
  }, [video.current]);

  objectFit(video, item.fit);

  return (
    <video
      {...item.params}
      pip="false"
      ref={video}
      onLoadedData={onLoad && onLoad}
      className={
        `${classes.item} ${classes.video} 
         ${showPreview ? classes.videoHidden : ""}
         ${item.contain ? classes.contentContain : classes.contentCover}`}
      src={item.video}

      onClick={() => {
        if (playOnClick) actions[playing ? "pause" : "play"]()
      }}
      onTimeUpdate={() => {
        setItemProgress(video.current.currentTime / video.current.duration);
      }}
      onEnded={actions && actions.onEnded && actions.onEnded}>
      <track src={item.captions} kind="captions"/>
    </video>
  )
}

ContentViewVideo.propTypes = {
  /**
   * Объект с содержимым. Может иметь параметры video с видео и
   * params с параметрами, которые надо добавить элементу video
   */
  item: PropTypes.object,
  /**
   * Объект с данными контента. Используются video для видео и image для превью
   */
  classes: PropTypes.object,
  /**
   * Объект с действиями. При автопроигрывании используется действие next,
   * а так же play и pause при playOnClick
   */
  actions: PropTypes.object,
  /**
   * Проигрывание на клик
   */
  playOnClick: PropTypes.bool,
  /**
   * Сосояние проигрывания. Используется при playOnClick
   */
  playing: PropTypes.bool,
  /**
   * Показ превью
   */
  showPreview: PropTypes.bool,
  /**
   * Метод, который вызывается при изменении прогресса. В него прередаётся прогесс
   * воспроизведения (0-1)
   */
  setItemProgress: PropTypes.func,
  /**
   * Метод, который вызывается по зваершению загрузки
   */
  onLoad: PropTypes.func,
  /**
   * ref который подставляется в элемент video
   */
  video: PropTypes.object,
};
