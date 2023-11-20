import React from "react";
import video from "../images/loading-circle.gif"
export default function Loading(){
    return (
        <div>
            <img src={video} alt="Loading..." style={{width:"70px", height:"70px"}}/>
        </div>
    )
}