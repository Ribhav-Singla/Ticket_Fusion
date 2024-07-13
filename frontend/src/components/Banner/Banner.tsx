import { useEffect, useState } from "react";
import "./Banner.css";
import { Link } from "react-router-dom";
import { WhatsappShareButton,WhatsappIcon } from "react-share";

export default function Banner({id,date,title,time}:{id:string,date:string,title:string,time:string}) {

  const calculateTimeLeft = () => {
    const now:Date = new Date();
    const eventDate:Date = new Date(`${date}`);
    const difference:number = eventDate.getTime() - now.getTime();
    let timeLeft = {
      Days: 0,
      Hours: 0,
      Minutes: 0,
      Seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / (1000 * 60)) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [timeLeft, setTimeLeft] = useState<{
    Days: number;
    Hours: number;
    Minutes: number;
    Seconds: number;
  }>(calculateTimeLeft());
 

  return (
    <div className="text-white">
      <div className="ribbon">{(new Date(date)).toLocaleDateString()+ " - " + `${time}`}</div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-5xl mb-7 text-center blackShadow ">
          DONT MISS THE UPCOMING EVENT
          <br />
          <span className=" font-bold text-orange-500 text-[1.9rem] orangeShadow banner-title">{title}</span> 
        </h2>
        <div className="flex justify-center items-center gap-6 mb-9">
          <div className="flex flex-col items-center justify-center text-2xl font-semibold orangeShadow text-orange-500 ">
            <p>{`${timeLeft.Days}`}</p>
            <p className="text-orange-500 orangeShadow">{`Days`}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-2xl font-semibold blackShadow">
            <p>{`${timeLeft.Hours}`}</p>
            <p className="text-white blackShadow">{`Hours`}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-2xl font-semibold orangeShadow text-orange-500 ">
            <p>{`${timeLeft.Minutes}`}</p>
            <p className="text-orange-500 orangeShadow">{`Minutes`}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-2xl font-semibold blackShadow">
            <p>{`${timeLeft.Seconds}`}</p>
            <p className="text-white blackShadow">{`Seconds`}</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Link to={`/event/${id}`}>
            <button className="bg-red-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded opacity-100 z-10 register-btn">{`REGISTER NOW`}</button>
          </Link>
          <WhatsappShareButton url={`${import.meta.env.VITE_BACKEND_URL}/event/${id}`} title={`${title} ${date} ${time}`}>
            <div className="flex justify-center items-center gap-3 py-1 px-4 rounded bg-slate-500 hover:bg-slate-600 text-white">
              <p className="font-bold ">Share on WhatsApp</p>
              <WhatsappIcon size={30} round/>
            </div>
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
}
