import { useEffect, useState } from "react";
import ManageEventCard from "../../components/ManageEventCard/ManageEventCard";
import "./ManageEvents.css";
import { Spinner, Table } from "flowbite-react";
import axios from "axios";
import useDebounce from "../../customHooks/useDebounce";
import {v4} from 'uuid'

interface manageEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  setToggleData: () => void;
}

export default function ManageEvents() {
  const [manageEvents, setManageEvents] = useState<manageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleData, setToggleData] = useState(false);
  const [filterTitle,setFilterTitle]= useState("")

  const debouncedTitle = useDebounce(filterTitle,500)

  useEffect(() => {
    async function getDate() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/manageEvents?filterTitle=${filterTitle}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        if(response.data.message === "Unauthorized"){
          await new Promise((resolve)=>setTimeout(resolve,1000))
          setLoading(false)
        }
        else{
          console.log(response.data);
          setManageEvents(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    getDate();
  }, [toggleData,debouncedTitle]);

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-4 pr-4 pl-4">
        <div className="border-b-2 w-full max-w-7xl flex justify-between pb-2">
          <h1 className="p-2 text-2xl font-bold text-indigo-600">
            Manage Events{" "}
            <span className="text-black font-medium">
              ({manageEvents.length})
            </span>
          </h1>
          <div>
            <div className="">
              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 bg-slate-50 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Search..."
                  onChange={(e)=>{
                    setFilterTitle(e.target.value)
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
          </div>
        </div>
        <div className="w-full max-w-7xl">
          <Table striped className="w-full">
            <Table.Head>
              <Table.HeadCell className="text-lg">Name</Table.HeadCell>
              <Table.HeadCell className="text-lg">Location</Table.HeadCell>
              <Table.HeadCell className="text-lg">Date</Table.HeadCell>
              <Table.HeadCell className="text-lg text-center" colSpan={3}>
                Actions
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y relative">
              {loading ? (
                <>
                  <div className="flex justify-center items-center m-4 absolute left-1/2 top-11">
                    <Spinner
                      aria-label="Alternate spinner button example"
                      size="md"
                    />
                    <span className="pl-3 text-lg">Loading...</span>
                  </div>
                </>
              ) : (
                manageEvents.map((obj) => {
                  return (
                    <ManageEventCard
                      key={obj.id+v4()}
                      id={obj.id}
                      title={obj.title}
                      location={obj.location}
                      date={obj.date}
                      setToggleData={setToggleData}
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
