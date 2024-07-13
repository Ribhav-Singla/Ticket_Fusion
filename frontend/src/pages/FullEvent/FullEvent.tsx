import { useEffect, useState } from "react";
import "./FullEvent.css";
import { Button, Spinner } from "flowbite-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DOMPurify from "dompurify"; // Import dompurify
import { useRecoilValue } from "recoil";
import { userState } from "../../Recoil";

interface Event {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  images: string;
  fee: number;
  tickets: number;
  creator: {
    name: string;
  };
}

export default function FullEvent() {
  const user = useRecoilValue(userState)
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<Event>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    images: "",
    fee: 0,
    tickets: 0,
    creator: { name: "" },
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [eventBool, setEventBool] = useState(false);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/${id}`
      );
      setEventData(response.data);      
      setLoading(false);
    }
    getData();
  }, [eventBool]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen mt-8">
        <Spinner aria-label="Alternate spinner button example" size="md" />
        <span className="pl-3 text-lg">Loading...</span>
      </div>
    );
  }

  async function handleTicket() {
    if (eventData.tickets < quantity) {
      return toast.error("not enough tickets");
    } else if(!user){
      toast.error("Unauthorized. Redirecting to sign in.");
      await new Promise((r)=>setTimeout(r,1000))
      navigate('/signin');
    } else {
      toast.promise(ticketdeduction(), {
        loading: "Please wait...",
        success: <b>Purchased!</b>,
        error: <b>something went wrong!.</b>,
      });
    }
  }

  async function ticketdeduction() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/ticket/${id}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setEventBool((prev) => !prev);
      if (!response.data.status) {
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const dateBool = new Date() <= new Date(eventData.date);

  return (
    <>
      <div className="flex justify-center items-center mt-7">
        <div className="flex flex-col justify-center items-center w-full max-w-7xl pl-2 pr-2">
          <div className="grid grid-cols-12 w-full">
            <div className="col-span-6 bg-slate-100 pt-2 pb-3 rounded-s-lg max-h-96 md:max-h-80">
              <div className="flex flex-col justify-center items-start h-full max-h-96 md:max-h-80 p-2 text-lg gap-1">
                <h1 className="font-bold text-3xl mb-1">{eventData.title}</h1>
                <p>
                  <span className="font-semibold">By: </span>
                  {eventData.creator.name}
                </p>
                <p>
                  <span className="font-semibold">Date: </span>
                  {eventData.date}
                </p>
                <p>
                  <span className="font-semibold">Time: </span>
                  {eventData.time}
                </p>
                <p>
                  <span className="font-semibold">Location: </span>
                  {eventData.location}
                </p>
                <p>
                  <span className="font-semibold">Tickets Left: </span>
                  {eventData.tickets}
                </p>
                <p className="text-xl">
                  <span className="font-semibold">₹</span>
                  {eventData.fee}
                </p>
                <div className="flex gap-3 mt-1">
                  {
                    !dateBool ? 
                    <Button className="red bg-red-600">
                        Sorry event is closed!
                    </Button> 
                    : 
                    <Button
                    className="purple bg-indigo-600"
                    onClick={handleTicket}
                    >
                    Buy Ticket
                    </Button>
                  }
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={4}
                    onChange={(e) => {
                      setQuantity(Number(e.target.value));
                    }}
                    className="rounded-lg bg-slate-100 w-[4.5rem]"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 h-full max-h-96 md:max-h-80">
              <img
                src={eventData.images}
                alt="event-image"
                className="w-full h-full rounded-e-lg"
              />
            </div>
          </div>
          <div className="w-full text-lg mt-2 pl-2 text-justify">
            <h1 className="border-b-2 pb-2 pt-4 font-semibold text-lg mb-2">
              Description
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(eventData.description),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
