import { useEffect, useState } from "react";
import "./CreateEvent.css";
import { Button, Datepicker, Spinner, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage } from "../../firebase";
import { ref , uploadBytes , getDownloadURL} from 'firebase/storage'
import {v4} from 'uuid'
import {toast as toastUpload} from 'react-hot-toast'
import QuillEditor from "../QuillEditor/QuillEditor";

export default function CreateEvent() {
  const navigate = useNavigate()
  const [imageUpload,setImageUpload] = useState(null)
  const [eventDetails,setEventDetails]= useState({
    title:"",
    description:"Compose a Description...",
    date:(new Date()).toDateString(),
    time:"",
    location:"",
    tickets:1,
    fee:0,
    images:""
  })
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    async function getData(){
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,{
          headers:{
            'Authorization':`${localStorage.getItem('token')}`
            }
        })
        
        if (response.data.message === "Unauthorized") {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setLoading(false);
          navigate('/signin')
        } 
        else{
          setLoading(false)
        }
      } catch (error) {
        console.log('error: ',error);
      }
    }
    getData()
  },[])

  async function UploadToFirebase(){
    toastUpload.promise(uploadFile(), {
      loading: "uploading...",
      success: <b>uploaded!</b>,
      error: <b>something went wrong!.</b>,
  })
  }

  async function uploadFile(){
    if(imageUpload === null) throw new Error();
    else{
      //@ts-ignore
      const imageRef = ref(storage, `images/${imageUpload.name+v4()}`)
      await uploadBytes(imageRef,imageUpload);
      const downloadUrl = await getDownloadURL(imageRef)
      setEventDetails({...eventDetails,images:downloadUrl})
    }
  }
  
  
  //@ts-ignore
  async function handleSubmit(e){
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event`,{
        title:eventDetails.title,
        description:eventDetails.description,
        date:eventDetails.date,
        time:eventDetails.time,
        location:eventDetails.location,
        tickets:eventDetails.tickets,
        fee:eventDetails.fee,
        images:eventDetails.images
      },{
        headers:{
          'Authorization' : `${localStorage.getItem('token')}`
        }
      })

      if(response.data.message === "Unauthorized"){
        navigate('/signin')
        toast.info('You must be signed in')
      }
      else{
        navigate(`/event/${response.data.id}`)
        toast.info('event listed successfully!')
      }     
      
    } catch (error) {
      console.log('error: ',error);
      //@ts-ignore
      toast.error(error.response.data.message)      
    }
  } 

  if(loading){
    return (
      <div className="flex justify-center items-center w-screen mt-8">
        <Spinner size="md" />
        <span className="pl-3 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center mt-4">
        <h2 className="text-indigo-600 font-bold text-3xl border-b-2 w-64 text-center p-1">
          Create Event
        </h2>
        <div className="flex flex-col gap-4 w-9/12">
          <div>
            <label>Title</label>
            <TextInput type="text" placeholder="title" maxLength={23} required onChange={(e)=>
              setEventDetails({...eventDetails,title:e.target.value})}
              />
          </div>
          <div className="">
            <label>Location</label>
            <TextInput type="text" placeholder="Location" maxLength={27} required onChange={(e)=>
              setEventDetails({...eventDetails,location:e.target.value})
            } />
          </div>
          <div className="grid grid-cols-12 gap-5">
            <div className=" col-span-6">
              <label>Date</label>
              <Datepicker
                defaultDate={new Date()}
                minDate={new Date()}
                onSelectedDateChanged={(e)=>{
                  console.log(e);
                  
                  setEventDetails ({...eventDetails,date:(e).toDateString()})
                  }}
                  required
                  />
            </div>
            <div className="col-span-6">
              <label>Time</label>
              <TextInput type="time" required onChange={(e)=>{
                setEventDetails({...eventDetails,time:e.target.value})
                }} />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5">
            <div className=" col-span-6">
              <label>Tickets</label>
              <TextInput
                type="number"
                defaultValue={1}
                min={1}
                required
                onChange={(e)=>{
                  setEventDetails({...eventDetails,tickets:Number(e.target.value)})
                  }}
                  />
            </div>
            <div className=" col-span-6">
              <label>Fee</label>
              <TextInput type="number" defaultValue={0} min={0} required  onChange={(e)=>{
                setEventDetails({...eventDetails,fee:Number(e.target.value)})
                }}/>
            </div>
          </div>
          <div>
            <label>Images</label>
            <div className="flex flex-col justify-center items-end">
              <TextInput type="file" placeholder="Image Link" className="w-full" onChange={(e)=>{
                //@ts-ignore
                setImageUpload(e.target.files[0])
                }} />
                <Button className="bg-indigo-600 mt-3 max-w-fit" onClick={UploadToFirebase}>Upload</Button>
            </div>
          </div>
          <QuillEditor setEventDetails={setEventDetails} description={""}/>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 mt-6 pl-6 pr-6 mb-7" type="submit">Create</Button>
      </div>
      </form>
      <br />
    </>
  );
}
