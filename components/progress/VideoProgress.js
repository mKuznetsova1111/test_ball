import React, {useState} from "react";
import Progress from "./Progress";
import {defaultProgressOverrideClasses} from "../contentView/ContentViewPlayableItem";

const VideoProgress = (props) => {

  const {actions, video, audio, progress, playing, item, value, isHidden} = props;

  const [wasPaused, setWasPaused] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const defaultClasses = {...defaultProgressOverrideClasses};
  defaultClasses.element = `${defaultClasses.element} progress_video ${isHidden && "progress_hidden"}`;

  const setTimeFromProgress = (val) => {
    if (item.video)
      video.currentTime = video.duration * val;
    if (item.audio)
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

  return(
    <Progress
      {...{
        ...progress,
        value:value,
        onChangeStarted,
        onChangeEnded,
        progressChanged:setTimeFromProgress
      }}
      overrideClasses = {{...defaultClasses, ...progress.classes}}/>
  )

};

export default VideoProgress;
