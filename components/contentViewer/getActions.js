export default function getActions(currentItem, refs, playing, play, setShowPreview, setPlaying, pause, changeElement,
                                   reset, setCurrentItem, swiper, previews, playlist, getItem, loop, vol,
                                   volumePerClick, setVol, volBeforeMute, stopOnChange, setVolBeforeMute, audio, video,
                                   setTimer, setAutoplaying, autoplay
                                   ){
  const actions = currentItem ? {
    play: () => {
      if (playing || (currentItem && !currentItem.video && !currentItem.audio)) return;
      const {audio, video} = refs[currentItem.id];
      play(audio, video);
      setShowPreview(false);
      setPlaying(true);
    },
    pause: () => {
      const {audio, video} = refs[currentItem.id];
      pause(audio, video);
      setPlaying(false);
    },
    stop: () => {
      const {audio, video} = refs[currentItem.id];
      pause(audio, video);
      reset(audio, video);
      setPlaying(false);
    },
    reset: () => {
      const {audio, video} = refs[currentItem.id];
      reset(audio, video);
      play(audio, video);
      setShowPreview(false);
      setPlaying(true);
    },
    next: () => {
      changeElement(1, currentItem, refs[currentItem.id].audio, refs[currentItem.id].video, stopOnChange,
        setPlaying, setCurrentItem, swiper, setShowPreview, previews, playlist, loop);
    },
    prev: () => {
      changeElement(-1, currentItem, refs[currentItem.id].audio, refs[currentItem.id].video, stopOnChange,
        setPlaying, setCurrentItem, swiper, setShowPreview, previews, playlist, loop);
    },
    select: (item) => {
      const diff = playlist.indexOf(getItem(playlist, item, 0, loop)) - (playlist.indexOf(currentItem) || 0);
      changeElement(diff, currentItem, refs[currentItem.id].audio, refs[currentItem.id].video, stopOnChange,
        setPlaying, setCurrentItem, swiper, setShowPreview, previews, playlist, loop);
    },
    volumePlus: () => {
      setVol(Math.min(1, vol + volumePerClick));
    },
    volumeMinus: () => {
      setVolBeforeMute(1);
      setVol(Math.max(0, vol - volumePerClick));
    },
    mute: () => {
      setVolBeforeMute(vol);
      setVol(0);
    },
    unmute: () => {
      setVol(volBeforeMute);
    },
    setVolume: (val) => {
      setVolBeforeMute(1);
      setVol(val);
    },
    onBlur: () => {
      pause(audio, video);
      setAutoplaying(false);
      setPlaying(false);
    },
    onFocus: (val) => {
      if (val) {
        play(audio, video)
      }
      setPlaying(val);
      setAutoplaying(!!autoplay);
    },
  } : {};

  if (actions){
    actions.onEnded = ()=>{
      if (autoplay) {
        actions.next();
      } else {
        actions.pause();
      }
    }
  }

  return actions;
}
