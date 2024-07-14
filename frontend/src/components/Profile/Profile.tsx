import {  Spinner, TextInput } from "flowbite-react";
import "./Profile.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface user{
    name :string,
    email:string,
    phonenumber : string
}

export default function Profile() {
  const [loading,setLoading] = useState(true)
  const [userData,setUserData] = useState<user>({
    name:"",
    email:"",
    phonenumber:""
  })

useEffect(()=>{
    async function getData(){
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,{
                headers:{
                    'Authorization':`${localStorage.getItem('token')}`
                }
            })
            setUserData(response.data)
            setLoading(false)
        } catch (error) {
            console.log('error: ',error);
        }
    }
    getData()
},[])

  if(loading){
    return (
      <div className="flex justify-center items-center w-screen mt-8">
        <Spinner size="md" />
        <span className="pl-3 text-lg">Loading...</span>
      </div>
    )
  }
  return (
    <div className="bg-slate-50 h-screen profile">
      <form>
        <div className="flex flex-col justify-center items-center mt-4">
          <h2 className="text-indigo-600 font-bold text-3xl border-b-2 w-48 text-center p-1 ">
            Profile
          </h2>
            <div className="flex justify-end items-start gap-1 mt-2">
                <p className="text-end">readonly</p>
                <img
                src="https://st2.depositphotos.com/12042916/43654/i/450/depositphotos_436548338-stock-photo-raster-star-flat-icon-symbol.jpg"
                alt=""
                width={10}
                />
            </div>
          <div className="flex flex-col gap-4 w-3/4 md:w-2/4 mt-6">
            <div>
              <label>Name</label>
              <TextInput
                type="text"
                value={userData.name}
                readOnly
                maxLength={23}
                required
                className="mt-1"
              />
            </div>
            <div className="">
              <div className="flex justify-between items-center">
                <label>Email</label>
              </div>
              <TextInput
                type="email"
                value={userData.email}
                readOnly={true}
                className="mt-1"
              />
            </div>
            <div className="">
              <label>Mobile No.</label>
              <TextInput
                type="text"
                value={userData.phonenumber}
                readOnly={true}
                className="mt-1"
              />
            </div>
            </div>
        </div>
      </form>
    </div>
  );
}
