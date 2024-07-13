import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import "./EventCard.css";

export default function EventCard({
  id,
  title,
  location,
  images,
  date,
  time,
  fee,
  tickets,
}: {
  id: string;
  title: string;
  location: string;
  images: string;
  date: string;
  time: string;
  fee: number;
  tickets: number;
}) {
  const dateBool = new Date() <= new Date(date);

  return (
    <>
      <div
        className={
          `max-w-[21.4rem] rounded-md shadow-lg h-fit relative` +
          `${tickets > 0 ? " bg-white" : " bg-slate-50"}` +
          `${dateBool ? "" : "select-none"}`
        }
      >
        {dateBool ? (
          tickets > 0 ? (
            ""
          ) : (
            <div className="ribbon-card">Sold</div>
          )
        ) : (
          <div className="ribbon-card">Closed</div>
        )}
        <div className="w-full h-48">
          <Link to={`/event/${id}`}>
            <img
              src={images}
              alt="event-image"
              className="rounded-t cursor-pointer w-full h-full"
            />
          </Link>
        </div>
        <div className="p-2">
          <h5 className="text-2xl font-bold text-gray-900">{title}</h5>
          <div className="mt-1">
            Location: {location}
            <br />
            Date: {date}
            <br />
            Time: {time}
            <br />
            Fee: <span className="font-semibold">₹</span>
            {fee}
            <br />
            <Link to={`/event/${id}`}>
              <div className="flex justify-center items-center">
                <Button
                  className={`hover:bg-indigo-600 w-full mt-2 mb-1 ${
                    dateBool ? "bg-indigo-600" : "bg-red-600"
                  }`}
                >
                  {dateBool ? "Buy Tickets" : "Oops! Event Closed"}
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
