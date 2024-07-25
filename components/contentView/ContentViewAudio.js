import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";

export default function ContentViewAudio({item, classes, actions, setItemProgress, onLoad, refs}) {
  const audio = useRef();

  useEffect(() => {
    if (audio.current.readyState === 4) onLoad && onLoad();
  });

  useEffect(()=>{
    refs[item.id].video = audio.current;
  }, [audio.current]);
  return (
    <audio ref={audio} className={classes && classes.audio}
           {...item.params}
           src={item.audio}
           onEnded={actions && actions.onEnded && actions.onEnded}
           onLoadedData={() => {
             onLoad && onLoad()
           }}
           onTimeUpdate={() => {
             setItemProgress && setItemProgress(audio.current.currentTime / audio.current.duration);
           }}
    >
      <track src={item.captions} kind="captions"/>
    </audio>
  )
}

ContentViewAudio.propTypes = {
  /**
   * Объект с контентои. Может иметь параметры audio с аудио и
   * params с параметрами, которые надо добавить элементу audio
   */
  item: PropTypes.object,
  /**
   * Объект с классами. Подставляется элемент по параметру audio
   */
  classes: PropTypes.object,
  /**
   * Объект с действиями. При автопроигрывании используется действие next
   */
  actions: PropTypes.object,
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
   * ref который подставляется в элемент audio
   */
  audio: PropTypes.object,
};
