import React, {useState, useMemo, useEffect, useCallback} from "react";
import './ContentViewer.scss';
import PropTypes from "prop-types";
import Controls from "../controls/Controls";
import ContentView from "../contentView/ContentView";
import Playlist from "../playlist/Playlist";
import MediaPreloader from "../../utils/MediaPreloader";
import FocusController from "../../utils/FocusController";
import VideoProgress from "../progress/VideoProgress";

import {Swiper, SwiperSlide} from "swiper/react";
import getActions from "./getActions";
import Autoplay from "./Autoplay";

const defaults = {
  controls: {
    play: {text: "play"},
    pause: {text: "pause"},
    stop: {text: "stop"},
    reset: undefined,
    volumeMinus: undefined,
    volumePlus: undefined,
    mute: {
      onState: {
        text: "muted"
      },
      offState: {
        text: "unmuted"
      }
    },
    prev: undefined,
    next: undefined,
    playPause: undefined,
    volumeRegulator: undefined
  },
  hideSingleIfImage: true,
  controlsVisible: true,
  contentVisible: true,
  startMuted: false,
  startPlaying: false,
  startFromItem: false,
  playlistVisible: false,
  playListItemTag: "div",
  noContentImage: "",
  previews: false,
  volumePerClick: .1,
  playOnClick: true,
  autoplay: 0,
  pauseAutoplayOnInteraction: 0,
  loop: false,
  preload: false,
  viewClassOverrides: false,
  overlayIcon: undefined,
  volume: 1,
  watchFocus: true,
  swiperParams: {
    allowTouchMove: false
  },
  stopOnChange: false,
  rewindOnDblclick: false,
  hideControls: false,
  swipeScroll: false,
  pressmove: false,
  pressmoveValue: .1,
  singleProgress: false
};

const defaultClasses = {
  contentView: 'content-viewer__content',
  controlsHidden: 'content-viewer__controls_hidden',
  controls: 'content-viewer__controls'
};

export default function ContentViewer(props) {

  const settings = {...defaults, ...props};

  const {
    playlist, startFromItem, startPlaying, playOnClick, autoplay, loop, preload,
    playListItemTag, overlayIcon, volume, volumePerClick, pauseAutoplayOnInteraction,
    preloader, previews, swiperParams, stopOnChange, hideControls, overrideClasses,
    className, hideSingleIfImage
  } = settings;

  const classes = {...defaultClasses, ...overrideClasses};

  const [timer, setTimer] = useState(undefined);
  const [playing, setPlaying] = useState(settings.startPlaying);
  const [currentItem, setCurrentItem] = useState(getFirstPlaylistItem(startFromItem, playlist, loop));
  const [showPreview, setShowPreview] = useState(previews);
  const [loaded, setLoaded] = useState(!preload);
  const [vol, setVol] = useState(volume);
  const [volBeforeMute, setVolBeforeMute] = useState(volume);
  const [autoplaying, setAutoplaying] = useState(!!autoplay);
  const [swiper, setSwiper] = useState();
  const [controlsVisible, setControlsVisible] = useState(true);
  const itemID = playlist.indexOf(currentItem);
  const isNext = itemID < playlist.length - 1;
  const isPrev = itemID > 0;
  const [currentItemProgress, setCurrentItemProgress] = useState(0);

  const refs = useMemo(() => {
    const result = {};

    playlist.forEach(({id}) => {
      result[id] = {};
    });
    return result;
  }, [playlist]);

  const {audio, video} = refs && currentItem && playlist.length > 0 ? refs[currentItem.id] : {};

  const actions = useMemo(() => {
    return getActions(currentItem, refs, playing, play, setShowPreview, setPlaying, pause, changeElement,
      reset, setCurrentItem, swiper, previews, playlist, getItem, loop, vol,
      volumePerClick, setVol, volBeforeMute, stopOnChange, setVolBeforeMute, audio, video,
      setTimer, setAutoplaying, autoplay);
  }, [currentItem, refs, swiper, vol, audio, autoplay, loop, playing, playlist, previews, stopOnChange, timer, video
    , volBeforeMute, volumePerClick]);

  const resetTimer = useCallback((interaction) => {
    if (interaction && !pauseAutoplayOnInteraction) return;
    if (currentItem && !currentItem.video && !currentItem.audio && !!autoplay) {
      if (pauseAutoplayOnInteraction && interaction) {
        setAutoplaying(false);
      } else {
        setAutoplaying(true);
      }
    }
  }, [pauseAutoplayOnInteraction, timer, currentItem, autoplay, actions, playlist]);

  useEffect(() => {
    if (preload && !loaded) {
      new MediaPreloader(playlist, () => {
        setLoaded(true);
      });
    }

    const shouldStart = autoplaying && startPlaying;

    autoplaying && resetTimer();

    if (shouldStart && !showPreview && !playing) {
      play(audio, video);
      setPlaying(true);
    }

    if (shouldStart && showPreview) {
      setShowPreview(false);
    }

  }, [swiper, audio, video]);

  useEffect(() => {
    setCurrentItem(getFirstPlaylistItem(startFromItem, playlist, loop, currentItem));
  }, [playlist]);


  return !loaded ?
    null : /*заменить null прелоадером по необходимости*/
    (<div
        className={`content-viewer ${className}`}
        onPointerDown={() => {
          autoplaying && resetTimer(true);
        }}
      >
        {settings.autoplay && autoplaying && !(currentItem.video || currentItem.audio) ? <Autoplay time={autoplay} onNext={()=>{actions.next()}} autoplaying={autoplaying}/> : ""}
        {settings.contentVisible &&
        <Swiper
          onSwiper={(swiper) => {
            setSwiper(swiper)
          }}
          onSlideChange={({realIndex}) => {
            setCurrentItem(playlist[realIndex]);
            setPlaying(false);
            setShowPreview(previews);
          }}
          {...swiperParams}
          noSwiping={true}
        >
          {playlist && playlist.map((item) =>
            <SwiperSlide
              onPointerDown={() => {
                if (hideControls) {
                  if (hideControls) {
                    setControlsVisible(!controlsVisible);
                  }
                }
              }}
              key={item.id}
            >
              <ContentView
                {...props}
                className={classes.contentView}
                item={item}
                playOnClick={playOnClick}
                actions={actions}
                playing={playing && (currentItem === item)}
                video={item && refs[item.id].video}
                audio={item && refs[item.id].audio}
                progress={settings.progress}
                classOverrides={settings.viewClassOverrides}
                overlayIcon={overlayIcon}
                volume={vol}
                preloader={preloader}
                autoplay={autoplaying}
                showPreview={showPreview}
                setCurrentItemProgress={setCurrentItemProgress}
                refs={refs}
              />
            </SwiperSlide>)}
        </Swiper>}
        {
          settings.singleProgress &&
          currentItem &&
          refs[currentItem.id] &&
          <VideoProgress
            {...props}
            className={classes.contentView}
            item={currentItem ? currentItem : {}}
            actions={actions}
            playing={playing && (currentItem === currentItem)}
            video={playlist.length > 0 && refs[currentItem.id].video}
            audio={playlist.length > 0 && refs[currentItem.id].audio}
            showPreview={showPreview}
            value={currentItemProgress}
            isHidden={(hideSingleIfImage && !currentItem.audio && !currentItem.video)}
          />}
        {settings.controlsVisible && currentItem && <Controls
          className={`${classes.controls}`}
          hiddenClass={classes.controlsHidden}
          actions={actions}
          isNext={isNext}
          isPrev={isPrev}
          controls={settings.controls}
          volume={vol}
          setVolume={actions.setVolume}
          playing={playing}
          muted={vol !== 0}
          hideControls={hideControls}
          hiddenSetter={setControlsVisible}
          controlsVisible={controlsVisible}
        />}
        {settings.playlistVisible && <Playlist
          list={playlist}
          TagName={playListItemTag}
          current={currentItem}
          onClick={actions.select}
        />}
        {settings.watchFocus && <FocusController
          value={playing}
          onBlur={actions.onBlur}
          onFocus={actions.onFocus}
        />
        }
      </div>
    )
}

function handleChange(audio, video, stopOnChange, setPlaying) {
  pause(audio, video);
  stopOnChange && reset(audio, video);
  setPlaying(false);
}

function pause(audio, video) {
  audio && audio.pause();
  video && video.pause();
}

function play(audio, video) {
  audio && audio.play();
  video && video.play();
}

function reset(audio, video) {
  if (audio) {
    audio.currentTime = 0;
    audio.playing = false;
  }
  if (video) {
    video.currentTime = 0;
    video.playing = false;
  }
}

function changeElement(mod, currentItem, audio, video, stopOnChange,
                       setPlaying, setCurrentItem, swiper, setShowPreview, previews, playlist, loop) {
  const itemData = getItem(playlist, currentItem.id, mod, loop);
  if (itemData === currentItem) return;
  handleChange(audio, video, stopOnChange, setPlaying);
  setCurrentItem(itemData);
  swiper.slideTo(playlist.indexOf(itemData));
  setShowPreview(previews);
}

function getItem(playlist, id, modifier, loop) {
  let index = 0;
  playlist.forEach((item, i) => {
    if (item.id === id) index = i
  });

  const nextItem = index + modifier;

  if (loop) {
    if (nextItem < 0) {
      return playlist[playlist.length - 1]
    }
    if (nextItem >= playlist.length) {
      return playlist[0]
    }
  }
  return playlist[nextItem] ? playlist[nextItem] : playlist[index]
}

function getFirstPlaylistItem(startFromItem, playlist, loop, current) {
  return startFromItem && playlist.length ?
    current ? getItem(playlist, startFromItem, 0, loop) : getItem(playlist, current, 0, loop) :
    playlist[0]
}

ContentViewer.propTypes = {
  /**
   * Элементы управления
   */
  controls: PropTypes.object,
  /**
   * Видимость элементов управления
   */
  controlsVisible: PropTypes.bool,
  /**
   * Видимость окна контента (для аудиоплеера)
   */
  contentVisible: PropTypes.bool,
  /**
   * Начать с отключенным звуком
   */
  startMuted: PropTypes.bool,
  /**
   * Начать проигрывая контент
   */
  startPlaying: PropTypes.bool,
  /**
   * Плейлист
   */
  playlist: PropTypes.array,
  /**
   * Номер элемента плейлиста, с которого начинается воспроизведение
   */
  startFromItem: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Видимость плейлиста
   */
  playlistVisible: PropTypes.bool,
  /**
   * Тег для элементов плейлиста
   */
  playListItemTag: PropTypes.string,
  /**
   * Изначальная громкость
   */
  noContentImage: PropTypes.string,
  /**
   * Показывать ли превью видео до начала проигрывания
   */
  previews: PropTypes.bool,
  /**
   * Значение на которое изменяется громкость при клике на кнопки увеличения и уменьшения громкости
   */
  volumePerClick: PropTypes.number,
  /**
   * Проигрывание и пауза видео/аудио по клику на видео или превью
   */
  playOnClick: PropTypes.bool,
  /**
   * Цикличность проигрывания элементов
   */
  loop: PropTypes.bool,
  /**
   * Автопроигрывание. Задаётся числом, которое является временем в мс на которое оно будет задерживаться
   * на изображениях. На аудио и видео задержка будет идти до конца ролика
   */
  autoplay: PropTypes.number,
  /**
   * Пауза автопроигрывания при действиях пользователя. Если задано число то автопроигрывание начнётся через
   * указанное время после последнего действия пользователя, если уазано true то автопроигрывание не включится
   */
  pauseAutoplayOnInteraction: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Классы, которые будут заменять стандартные классы элемента contentView
   */
  viewClassOverrides: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  /**
   * URL картинки, которая будет использоваться как иконка оверлея, который будет виден на видео и аудио когда
   * они не вопспроизводятся
   */
  overlayIcon: PropTypes.string,
  /**
   * Объект с пропами компонента Progress, который будет отображаться для видео и аудио. Если undefined,
   * то progress не будет отображаться
   */
  progress: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  /**
   * Единый progress для всех элементов, который не будет ездить при смене слайдов. Важно не включать опцию progress
   * и эту одновременно, иначе будут дублирующиеся прогрессбары
   */
  singleProgress: PropTypes.bool,
  /**
   * Скрытие единого прогрессбара если на текущем слайде картинка
   */
  hideSingleIfImage: PropTypes.bool,
  /**
   * Проверка на потерю фокуса. При потере фокуса будет устанавливатся пауза, по возвращению
   * будет устанавливаться состояние до потери фокуса
   */
  watchFocus: PropTypes.bool,
  /**
   * Компонент прелоадера, которй будет отображатсья пока элемент не прогрузился
   */
  preloader: PropTypes.object,
  /**
   * Останавливать аудио/видео при смене текущего элемента вместо паузы
   */
  stopOnChange: PropTypes.bool,
  /**
   * Количество времени до скрытия элементов управления. Происходиит при помощи добавления
   * на элемент управления класса content-viewer__controls_hidden
   */
  hideControls: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Объект с классами, перезаписывающими стандартные (константа defaultClasses)
   */
  overrideClasses: PropTypes.object,
  /**
   * Расстояние в пикселях, на которое надо свайпнуть для смены текущего элемента.
   * Если !!swipeScroll === false, то поведение не будет работать
   */
  swipeScroll: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Задержка после нажатия на элемент, после которого аудио или видео начнёт пролистываться при движении курсора.
   * Если !!pressmove === false, то поведение не будет работать
   */
  pressmove: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Скорость промотки при pressmove
   */
  pressmoveValue: PropTypes.number,
  /**
   * Количество секунд на которое видео или аудио будет промотано при двойном клике на элемент.
   * Направление определяется по положению кликов относительно середины. Если !!rewindOnDblclick === false
   * , то поведение не будет работать
   */
  rewindOnDblclick: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  /**
   * Настройки карусели, используемой компонентом. См. документацию Swiper.
   * При изменениях рекомендуется оставить allowTouchMove: false чтобы избежать наложений с поведениями компонента.
   * Если нужна смена на свайп, то лучше использовать проп swipeScroll
   */
  swiperParams: PropTypes.object,
};

ContentViewer.displayName = "ContentViewer";

ContentViewer.defaultProps = defaults;
