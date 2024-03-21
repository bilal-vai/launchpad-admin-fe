
import React, { useState, useEffect } from "react";
function TimeDuration({ createdAt }) {   
    const [days, setDays] = useState();
    const [hours, setHours] = useState();
    const [minitues, setMinitues] = useState();
    const [seconds, setSeconds] = useState();

    useEffect(() => {

        if (createdAt) {
            getPendingTime();
        }

    }, [createdAt]);


    const getPendingTime = () => {
        if (createdAt) {

            let currentDate = new Date().getTime();

            let newDate2 = new Date(createdAt).getTime();
            let dif =  currentDate - newDate2;

            let days = Math.floor(dif / (1000 * 60 * 60 * 24));
            days = days.toString();
            days = days.padStart(2, "0")
            let hours = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            hours = hours.toString();
            hours = hours.padStart(2, "0")
            let minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
            minutes = minutes.toString();
            minutes = minutes.padStart(2, "0")
            let seconds = Math.floor((dif % (1000 * 60)) / 1000);
            seconds = seconds.toString();
            seconds = seconds.padStart(2, "0")          
           
            setDays(days);
            setHours(hours);
            setMinitues(minutes);
            setSeconds(seconds);
        }

    }



    return (
        <>
           <label className="timer">
                {<><span>{days>0 ?  <> {days}<span>d</span></> : ""} </span> <span>{hours>0 ?  <>{hours}<span>h</span></> : ""}</span> <span>{minitues>0 ?  <>{minitues}<span>m</span></> : ""}</span> {days > 0 || hours > 0 || minitues > 0 ? "ago"  : "0m ago"}</>}
            </label>
        </>

    );
}

export default TimeDuration;
