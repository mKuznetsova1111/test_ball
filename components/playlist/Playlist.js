import React from "react";
import "./Playlist.scss";

export default function Playlist({list, TagName, onClick, current}) {
  return (
    <div className="playlist">
      {
        list.map((item, index) => {
          return <TagName
            className={`playlist__item ${item === current ? 'playlist__item_chosen' : ''}`}
            key={index}
            onClick={() => {
              onClick && onClick(item.id)
            }}
          >{item.title}</TagName>
        })
      }
    </div>
  )
}
