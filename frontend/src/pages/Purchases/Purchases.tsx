import { useEffect, useState } from "react";
import PurchasedEventCard from "../../components/PurchasedEventCard/PurchasedEventCard";
import "./Purchases.css";
import { Spinner, Table } from "flowbite-react";
import axios from "axios";
import CsvDownloader from "react-csv-downloader";
import useDebounce from "../../customHooks/useDebounce";
import {v4} from 'uuid'

const columns = [
  {
    id: "Name",
    displayName: "Name",
  },
  {
    id: "Location",
    displayName: "Location",
  },
  {
    id: "EventDate",
    displayName: "EventDate",
  },
  {
    id: "Time",
    displayName: "Time",
  },
  {
    id: "Fee",
    displayName: "Fee",
  },
  {
    id: "Tickets",
    displayName: "Tickets",
  },
  {
    id: "PurchaseDate",
    displayName: "PurchaseDate",
  },
];

interface myEvent {
  event: {
    id: string;
    title: string;
    location: string;
    date: string;
    fee: number;
    time: string;
  };
  quantity: number;
  purchasedDate: string;
}

export default function Purchases() {
  const [CSVData, setCSVDate] = useState([]);
  const [myEvents, setMyEvents] = useState<myEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTitle, setFilterTitle] = useState("");

  const debouncedTitle = useDebounce(filterTitle,500)

  useEffect(() => {
    async function getDate() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/myEvents?filterTitle=${filterTitle}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.message === "Unauthorized") {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setLoading(false);
        } else {
          console.log(response.data);
          setMyEvents(response.data);
          setLoading(false);
          const datas = [];
          for (let i = 0; i < response.data.length; ++i) {
            datas.push({
              Name: response.data[i].event.title,
              Location: response.data[i].event.location,
              EventDate: response.data[i].event.date,
              Time: response.data[i].event.time,
              Fee: response.data[i].event.fee,
              Tickets: response.data[i].quantity,
              PurchaseDate: response.data[i].purchasedDate,
            });
          }
          //@ts-ignore
          setCSVDate(datas);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    getDate();
  }, [debouncedTitle]);

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-4 pr-4 pl-4">
        <div className="border-b-2 w-full max-w-7xl flex justify-between pb-2">
          <h1 className="p-2 text-2xl font-bold text-indigo-600">
            Purchases{" "}
            <span className="text-black font-medium">({myEvents.length})</span>
          </h1>
          <div className="flex justify-center items-center gap-4">
            <div className="">
              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 bg-slate-50 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Search..."
                  onChange={(e) => {
                    setFilterTitle(e.target.value);
                  }}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <CsvDownloader
                filename="purchase"
                extension=".csv"
                separator=","
                wrapColumnChar=""
                columns={columns}
                datas={CSVData}
                className="text-indigo-600 font-semibold bg-slate-50 p-3 rounded-md border-2 border-gray-200 download-btn"
                text="DOWNLOAD"
              />
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl">
          <Table striped className="w-full">
            <Table.Head>
              <Table.HeadCell className="text-lg">Name</Table.HeadCell>
              <Table.HeadCell className="text-lg">Location</Table.HeadCell>
              <Table.HeadCell className="text-lg">Event Date</Table.HeadCell>
              <Table.HeadCell className="text-lg">Time</Table.HeadCell>
              <Table.HeadCell className="text-lg">Fee</Table.HeadCell>
              <Table.HeadCell className="text-lg">Tickets</Table.HeadCell>
              <Table.HeadCell className="text-lg">Purchase Date</Table.HeadCell>
              <Table.HeadCell className="text-lg">Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {loading ? (
                <>
                  <div className="flex justify-center items-center m-4 absolute left-1/2 top-11 mt-14">
                    <Spinner
                      aria-label="Alternate spinner button example"
                      size="md"
                    />
                    <span className="pl-3 text-lg">Loading...</span>
                  </div>
                </>
              ) : (
                myEvents.map((obj) => {
                  return (
                    <PurchasedEventCard
                      id={obj.event.id}
                      key={obj.event.id+v4()}
                      title={obj.event.title}
                      location={obj.event.location}
                      date={obj.event.date}
                      time={obj.event.time}
                      fee={obj.event.fee}
                      quantity={obj.quantity}
                      purchasedDate={obj.purchasedDate}
                    />
                  );
                })
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
