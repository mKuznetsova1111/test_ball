import React, {useEffect, useMemo, useState} from "react";
import SequentialAnimation from "./SequentialAnimation";
import SequenceStorage from "../../utils/sequenceStorage";

function SequentialWrapper({
                             totalFrames, path = "images/sequence", commonName = "",
                             loop = true, width = 500, height = 500
                           }) {
  const [imagesData, setImagesData] = useState([]);
  const memoData = useMemo(() => ({
    isUnmounted: false,
    callbackOnImageLoad(data) {
      if (!this.isUnmounted)
        setImagesData((prevState) => [...prevState, data])
    },
    onUnmount() {
      this.isUnmounted = true;
    }
  }), []);

  const image = useMemo(() => {
    const url = getName(1);
    SequenceStorage
      .instance
      .loadByName({url, id: 1})
      .then(data => memoData.callbackOnImageLoad(data));
    return <img className={"sequential__stub"} src={url}/>
  }, [])

  function getName(id) {
    const src = `${path}${commonName}`;
    let idStr = `${id}`.padStart(4, "0");
    return `${src}${idStr}.png`;
  }

  useEffect(() => {
    for (let i = 2; i <= totalFrames; i++)
      SequenceStorage
        .instance
        .loadByName({url: getName(i), id: i})
        .then(data => memoData.callbackOnImageLoad(data));

    return () => {
      memoData.onUnmount()
    }
  }, []);

  return (
    imagesData.length === totalFrames ?
      <SequentialAnimation
        width={width}
        height={height}
        imagesData={imagesData}
        fps={20}
        loop={loop}
      /> :
      image
  )
}

export default SequentialWrapper;
SequentialWrapper.propTypes = {};


