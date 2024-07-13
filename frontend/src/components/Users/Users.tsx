import {  Spinner, Table } from "flowbite-react";
import "./Users.css";
import UserCard from "../UserCard.tsx/UserCard";
import { useEffect, useState } from "react";
import axios from "axios";
import CsvDownloader from "react-csv-downloader";

const columns = [
  {
    id: "Name",
    displayName: "Name",
  },
  {
    id: "Email",
    displayName: "Email",
  },
  {
    id: "MobileNo",
    displayName: "MobileNo",
  },
  {
    id: "Tickets",
    displayName: "Tickets",
  },
  {
    id: "Time",
    displayName: "Time",
  },
];

interface user {
  id: string;
  quantity: number;
  purchasedDate: string;
  user: {
    name: string;
    email: string;
    phonenumber: string;
  };
}

export default function Users({ id }: { id: string }) {
  const [CSVData, setCSVData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<user[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/manageEvents/user/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
        const datas = [];
        for (let i = 0; i < response.data.length; ++i) {
          datas.push({
            Name: response.data[i].user.name,
            Email: response.data[i].user.email,
            MobileNo: response.data[i].user.phonenumber,
            Tickets: response.data[i].quantity,
            Time: response.data[i].purchasedDate,
          });
        }
        //@ts-ignore
        setCSVData(datas)
      } catch (error) {
        console.log("error: ", error);
      }
    }
    getData();
  }, []);

  console.log(CSVData);
  

  return (
    <div>
      <div className="flex justify-between items-center pb-1">
        <h1 className="text-2xl font-bold pb-1 text-indigo-600">
          Users <span className="font-medium text-black">({users.length})</span>
        </h1>
        <div>
          <CsvDownloader
            filename="user"
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
      <div className="">
        <Table className="border-b-2">
          <Table.Head className="">
            <Table.HeadCell className="bg-indigo-100 text-[1rem]">
              Name
            </Table.HeadCell>
            <Table.HeadCell className="bg-indigo-100 text-[1rem]">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="bg-indigo-100 text-[1rem]">
              Mobile No.
            </Table.HeadCell>
            <Table.HeadCell className="bg-indigo-100 text-[1rem]">
              Tickets
            </Table.HeadCell>
            <Table.HeadCell className="bg-indigo-100 text-[1rem]">
              Time
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <div className="flex justify-center items-center w-full mt-1">
                    <Spinner
                      aria-label="Alternate spinner button example"
                      size="md"
                    />
                    <span className="pl-3 text-lg">Loading...</span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((obj) => {
                return (
                  <UserCard
                    key={obj.id}
                    id={obj.id}
                    quantity={obj.quantity}
                    purchasedDate={obj.purchasedDate}
                    name={obj.user.name}
                    email={obj.user.email}
                    phonenumber={obj.user.phonenumber}
                  />
                );
              })
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
