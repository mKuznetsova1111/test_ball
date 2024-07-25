import Button from "../baseComponents/gui/button/Button";
import React from "react";

export default function ControlsButton({data, className, onClick}){
    return (
        data.icon ? <Button onClick={onClick} className={className}><img src={data.icon} alt=""/>{data.text}</Button> :
            <Button onClick={onClick} className={className}>{data.text}</Button>
    )
}
