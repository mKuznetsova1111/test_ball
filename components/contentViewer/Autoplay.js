import React, {useState, useEffect} from "react";


export default function Autoplay({onNext, active, time, autoplaying}){

  const [delay, setDelay] = useState();

  useEffect(()=>{
    clearInterval(delay);
    if (autoplaying) setDelay(
      setInterval(()=>{
        onNext();
      }, time)
    );

    return ()=>{
      let delayVal;
      setDelay((val)=>{delayVal = val; return null});
      clearInterval(delayVal);
    };
  }, [active, onNext, autoplaying]);


  return <div className={"AUTOPLAY"}></div>;
}
