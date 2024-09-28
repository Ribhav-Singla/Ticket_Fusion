import { useEffect, useState } from "react";
import "./Events.css";
import { Checkbox, Datepicker, TextInput } from "flowbite-react";
import EventCard from "../../components/EventCard/EventCard";
import axios from "axios";
import Skeleton from "../../components/Skeleton/Skeleton";
import useDebounce from "../../customHooks/useDebounce";
import {motion} from 'framer-motion'

type filterType = {
  title: string;
  location: string;
  date: string;
};

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  tickets: number;
  fee: number;
  images: string;
}

export default function Events() {
  const [toggleDate, setToggleDate] = useState(false);
  const [dateStr, setDateStr] = useState(new Date().toDateString());
  const [showFilter,setShowFilter] = useState(false);
  const [mobileDisplay,setMobileDisplay] = useState(window.innerWidth <= 640);

  const [filter, setFilter] = useState<filterType>({
    title: "",
    location: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);
  //using debouncing
  const debouncedTitle = useDebounce(filter.title, 1000);
  const debouncedLocation = useDebounce(filter.location, 1000);
  const debouncedDate = useDebounce(filter.date, 1000);

  useEffect(() => {
    async function getEvents() {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/bulk?title=${
          filter.title
        }&location=${filter.location}&date=${filter.date}`
      );
      const data = response.data;
      setEvents(data);
      setLoading(false);
    }
    getEvents();
  }, [debouncedTitle, debouncedLocation, debouncedDate]);

  useEffect(() => {
    const handleResize = () => {
      setMobileDisplay(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [events, setEvents] = useState<Event[]>([]);

  return (
    <div className="grid grid-cols-12">
      <div className="bg-slate-100 col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2 font-medium">
        <div className="flex justify-between items-center border-b-2 border-b-white">
          <h1 className="text-xl  p-2">Filter</h1>
          {
            mobileDisplay ? 
              <div className="px-5 cursor-pointer">
                {
                  showFilter ? 
                  <img src="/up.jpg" alt="Hide" width={20} onClick={()=>setShowFilter(!showFilter)}/>
                  :
                  <img src="/down.png" alt="Show" width={20} onClick={()=>setShowFilter(!showFilter)}/>
                }
              </div>
              : 
              ''
          }
        </div>
        {
          mobileDisplay ? 
          <>
          {
            showFilter ? 
            <motion.div
            initial={{ opacity: 0,
              x:-50
             }}
            animate={{ opacity: 1,
              x:0
             }}
            transition={{ duration: 0.5 }}
            >
              <form className="flex max-w-md flex-col gap-4 p-2">
                <div>
                  <label>Title</label>
                  <TextInput
                    type="text"
                    placeholder="Title"
                    className="mt-1"
                    onChange={(e) => {
                      setFilter((prev) => ({ ...prev, title: e.target.value }));
                    }}
                  />
                </div>
                <div>
                  <label>Location</label>
                  <TextInput
                    type="text"
                    placeholder="Location"
                    className="mt-1"
                    onChange={(e) => {
                      setFilter((prev) => ({ ...prev, location: e.target.value }));
                    }}
                  />
                </div>
                <div className="flex flex-col justify-items-start align-top">
                  <label>Date</label>
                  <div className="flex items-center gap-3">
                    <Datepicker
                      defaultDate={new Date(dateStr)}
                      onSelectedDateChanged={(e) => {
                        if (toggleDate) {
                          setFilter((prev) => ({
                            ...prev,
                            date: e.toDateString(),
                          }));
                        } else {
                          setFilter((prev) => ({ ...prev, date: "" }));
                        }
                        setDateStr(e.toDateString());
                      }}
                      className="mt-1"
                    />
                    <Checkbox
                      className="bg-green-300"
                      onChange={() => {
                        if (toggleDate) {
                          setToggleDate(false);
                          setFilter((prev) => ({ ...prev, date: "" }));
                        } else {
                          setToggleDate(true);
                          setFilter((prev) => ({ ...prev, date: dateStr }));
                        }
                      }}
                    />
                  </div>
                </div>
              </form>
            </motion.div>
            :''
          }
          </>
          :<motion.div
          >
            <form className="flex max-w-md flex-col gap-4 p-2">
              <div>
                <label>Title</label>
                <TextInput
                  type="text"
                  placeholder="Title"
                  className="mt-1"
                  onChange={(e) => {
                    setFilter((prev) => ({ ...prev, title: e.target.value }));
                  }}
                />
              </div>
              <div>
                <label>Location</label>
                <TextInput
                  type="text"
                  placeholder="Location"
                  className="mt-1"
                  onChange={(e) => {
                    setFilter((prev) => ({ ...prev, location: e.target.value }));
                  }}
                />
              </div>
              <div className="flex flex-col justify-items-start align-top">
                <label>Date</label>
                <div className="flex items-center gap-3">
                  <Datepicker
                    defaultDate={new Date(dateStr)}
                    onSelectedDateChanged={(e) => {
                      if (toggleDate) {
                        setFilter((prev) => ({
                          ...prev,
                          date: e.toDateString(),
                        }));
                      } else {
                        setFilter((prev) => ({ ...prev, date: "" }));
                      }
                      setDateStr(e.toDateString());
                    }}
                    className="mt-1"
                  />
                  <Checkbox
                    className="bg-green-300"
                    onChange={() => {
                      if (toggleDate) {
                        setToggleDate(false);
                        setFilter((prev) => ({ ...prev, date: "" }));
                      } else {
                        setToggleDate(true);
                        setFilter((prev) => ({ ...prev, date: dateStr }));
                      }
                    }}
                  />
                </div>
              </div>
            </form>
          </motion.div>
        }
      </div>
      <div className="col-span-12 sm:col-span-8 md:col-span-9 xl:col-span-10 ">
        <h1 className="border-b-2 p-2 font-medium text-xl">
          All Events ({events ? events.length : 0})
        </h1>
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            <div className="flex gap-8 justify-center">
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : (
            events.map((obj) => {
              return (
                <div className="flex justify-center" key={obj.id}>
                  <EventCard
                    id={obj.id}
                    title={obj.title}
                    location={obj.location}
                    date={obj.date}
                    time={obj.time}
                    tickets={obj.tickets}
                    fee={obj.fee}
                    images={obj.images}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
