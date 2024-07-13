import { useState, useEffect } from "react";
import Banner from "../../components/Banner/Banner";
import EventCard from "../../components/EventCard/EventCard";
import "./Home.css";
import axios from "axios";
import { Spinner } from "flowbite-react";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time:string
  tickets: number;
  fee: number;
  images: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEvents() {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/bulk/upcomingEvent`
      );
      const data = response.data;
      setEvents(data);
      setLoading(false);
    }
    getEvents();
  }, []);

  const [events, setEvents] = useState<Event[]>([]);  

  if(loading){
    return (
      <div className="flex justify-center items-center w-screen mt-8">
        <Spinner aria-label="Alternate spinner button example" size="md" />
        <span className="pl-3 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center flex-1 mb-6">
      <div className="bg-slate-100 w-full pt-7 pb-14 mb-3 banner-container">
            <Banner
              id={events.length >0 ? events[0].id : ""}
              date={events.length > 0 ? events[0].date : ""}
              title={ events.length>0 ?  events[0].title : ""}
              time={events.length>0 ? events[0].time:""}
            />       
      </div>
      <div className="flex items-center justify-center border-b-2 w-[15rem] mt-3 mb-3 pb-1">
        <h3 className="text-xl font-bold">Upcoming Events</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-3 mr-3 mt-2">
        {
          events.map((obj) => {
            return (
              <EventCard
                key={obj.id}
                id={obj.id}
                title={obj.title}
                location={obj.location}
                date={obj.date}
                time={obj.time}
                tickets={obj.tickets}
                fee={obj.fee}
                images={obj.images}
              />
            );
          })
        }
      </div>
    </div>
  );
}
