import React, {useState, useEffect, useRef} from "react";
import ContentViewPauseOverlay from "./ContentViewPauseOverlay";
import Progress from "../progress/Progress";
import ContentViewVideo from "./ContentViewVideo";
import ContentViewAudio from "./ContentViewAudio";
import PropTypes from "prop-types";
import ContentViewImage from "./ContentViewImage";

export const defaultProgressOverrideClasses = {
  element: 'progress content-view__progress',
  line: 'progress__line content-view__progress-line',
};

export default function ContentViewPlayableItem(props) {
  const {
    classes, actions, playing, video, audio, overlayIcon, progress, volume, showPreview, previews, item,
    rewindOnDblclick, onRewind, isSwipe = false, pressmove, pressmoveValue, setIsSwipe, singleProgress,
    setCurrentItemProgress
  } = props;
  const type = item.audio ? "audio" : "video";
  const [itemProgress, setItemProgress] = useState(0);
  const [wasPaused, setWasPaused] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [timeBeforePressmove, setTimeBeforePressmove] = useState(null);
  const [pointerLocation, setPointerLocation] = useState(null);
  const [startTouchTimestamp, setStartTouchTimestamp] = useState(null);

  useEffect(() => {
    if (audio) audio.volume = volume;
    if (video) video.volume = volume;
  }, [audio, video, volume]);

  const setTimeFromProgress = (val) => {
    setItemProgress(val);
    if (type === "video")
      video.currentTime = video.duration * val;
    if (type === "audio")
      audio.currentTime = audio.duration * val;
  };

  const onChangeStarted = () => {
    setWasPaused(!playing);
    setSeeking(true);
    actions.pause();
  };

  const onChangeEnded = () => {
    if (!seeking) return;
    setSeeking(false);
    if (!wasPaused) actions.play();
  };

  const previewVisible = (showPreview && previews && item.image) || item.audio;

  const self = useRef();

  return (
    <div
      ref={self}
      className={classes.playableItem}
      onPointerDown={({clientX}) => {
        setStartTouchTimestamp(Date.now());
        setPointerLocation(clientX);
      }}
      onDoubleClick={({clientX}) => {
        if (!item.audio && !item.video || !rewindOnDblclick) return;
        const br = self.current.getBoundingClientRect();
        const direction = br.x + br.width / 2 > clientX ? -1 : 1;
        const playableItem = item.audio ? audio : video;
        playableItem.currentTime = Math.min(
          Math.max(
            playableItem.currentTime + direction * rewindOnDblclick,
            0)
          , playableItem.duration
        );
        onRewind && onRewind(playableItem.currentTime, direction * rewindOnDblclick, direction);
      }}
      onPointerMove={({clientX}) => {
        if (!pointerLocation) return;
        if ((item.audio || item.video) && isSwipe && pressmove && startTouchTimestamp + pressmove < Date.now()) {
          isSwipe && setIsSwipe && setIsSwipe(false);
          onChangeStarted();
          setTimeBeforePressmove(item.video ? video.currentTime : audio.currentTime)
        }
        if (!isSwipe) {
          const range = pointerLocation - clientX;
          const newTime = timeBeforePressmove - range * pressmoveValue;
          const el = item.video ? video : audio;
          el.currentTime = newTime;
          // actions && actions.updateTimeBy && actions.updateTimeBy(-range/pressmoveValue)
        }
      }}
      onPointerUp={() => {
        setPointerLocation(null);
        onChangeEnded();
      }}
      onPointerCancel={() => {
        onChangeEnded();
      }}
      onPointerUpCapture={() => {
        onChangeEnded();
      }}
    >
      {(previewVisible) &&
      <ContentViewImage
        {...props}
        classes={classes}
      />
      }
      {(type === "video") &&
      <ContentViewVideo {...{...props, setItemProgress: singleProgress ? setCurrentItemProgress :setItemProgress}}/>
      }
      {(type === "audio") &&
      <ContentViewAudio {...{...props, setItemProgress: singleProgress ? setCurrentItemProgress :setItemProgress}}/>
      }
      {
        progress && <Progress
          {...{
            ...progress,
            value: itemProgress,
            onChangeStarted,
            onChangeEnded,
            progressChanged: setTimeFromProgress
          }}
          overrideClasses={{...defaultProgressOverrideClasses, ...progress.classes}}/>
      }
      {(overlayIcon && (!playing && ((wasPaused && seeking) || !seeking))) &&
      <ContentViewPauseOverlay
        className={classes.overlay}
        icon={overlayIcon}
        iconClassName={classes.overlayIcon}/>
      }
    </div>
  )
}

ContentViewPlayableItem.propTypes = {
  /**
   * Объект с классами. Используются для оверлея и перезаписывания классов прогресса поумолчанию
   */
  classes: PropTypes.object,
  /**
   * Объект с действиями. Используются действия play и pause чтобы менять состояние воспроизведения
   * во время взаимодействия пользователя progress и в конце него
   */
  actions: PropTypes.object,
  /**
   * Состояние проигрывания
   */
  playing: PropTypes.bool,
  /**
   * Ref видео
   */
  video: PropTypes.object,
  /**
   * Ref аудио
   */
  audio: PropTypes.object,
  /**
   * Картинка иконки оверлея
   */
  overlayIcon: PropTypes.string,
  /**
   * Нужно ли создавать Progress
   */
  progress: PropTypes.bool,
  /**
   * Единый progress для всех элементов, который не будет ездить при смене слайдов. Важно не включать опцию progress
   * и эту одновременно, иначе будут дублирующиеся прогрессбары
   */
  singleProgress: PropTypes.bool,
  /**
   * Тип контента в компонение. "audio" или "видео"
   */
  type: PropTypes.string,
  /**
   * Громкость (0-1)
   */
  volume: PropTypes.number,
  /**
   * Количество секунд, на которые будет проматываться видео или аудио по двойному клику
   * на элемент. Направление промотки зависит от положения клика относительно центра
   * элемента
   */
  rewindOnDblclick: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Метод, который будет вызываться каждый раз когда пользователь перематывает
   * видео или аудио на двойной клик (см rewindOnDblclick)
   */
  onRewind: PropTypes.func,
  /**
   * Задержка с начала касания для того чтобы включилось поведение перематывания аудио\видео зажав тач
   * и перемещая его, не работает если !!swipeScroll === false.
   */
  pressmove: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Соотношение секунды видео с количеством пикселей, на который сдвинулся тач.
   */
  pressmoveValue: PropTypes.number,
  /**
   * Должны ли отображаться превью в данный момент
   */
  showPreview: PropTypes.bool,
  /**
   * Должны ли отображаться превью вообще
   */
  previews: PropTypes.bool,
  /**
   * Контент
   */
  item: PropTypes.object,
  /**
   * Активен ли свайп в ContentView
   */
  isSwipe: PropTypes.bool,
  /**
   * Сеттер состояния свайпа для ContentView
   */
  setIsSwipe: PropTypes.func
};
