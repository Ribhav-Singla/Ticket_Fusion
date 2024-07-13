import { useEffect, useState } from "react";
import "./UpdateEvent.css";
import { Button, Datepicker, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../firebase";
import { ref , uploadBytes , getDownloadURL} from 'firebase/storage'
import {v4} from 'uuid'
import {toast as toastUpload} from 'react-hot-toast'
import QuillEditor from "../QuillEditor/QuillEditor";

interface eventdetails {
  id: string,
  title: string,
  description: string,
  date: string,
  time: string,
  tickets:number,
  fee:number,
  images:string,
  location:string,
  creator :{
    name : string
  }
}

export default function UpdateEvent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading,setLoading] = useState(true)
  const [imageUpload,setImageUpload] = useState(null)

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
      const imageRef = ref(storage, `images/${imageUpload.name+v4()}`)
      const response = await uploadBytes(imageRef,imageUpload);
      const downloadUrl = await getDownloadURL(imageRef)
      setEventDetails({...eventDetails,images:downloadUrl})
    }
  }

  useEffect(()=>{
    async function getData(){
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/${id}`)
        setEventDetails(response.data)
        setEventDetails((prev)=>{
          return {
            ...prev,
            date : dateConvert(prev.date)
          }
        })
        setLoading(false)
      } catch (error) {
        console.log('error: ',error);
      }
    }
    getData()
  },[])

  const [eventDetails,setEventDetails]= useState<eventdetails>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    tickets:0,
    fee:0,
    images:"",
    location:"",
    creator:{
      name:""
      }
  })  

  // Date conversion
  function dateConvert(inputDateStr:string){
    console.log(inputDateStr);
    
    if(!inputDateStr){
      return (new Date()).toLocaleString()
    }
    let inputDate = new Date(inputDateStr);
    let months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let month = months[inputDate.getMonth()];
    let day = inputDate.getDate();
    let year = inputDate.getFullYear();

    let formattedDate = `${month} ${day}, ${year}`;
    console.log(formattedDate);
    
    return formattedDate
  }

  //@ts-ignore
  async function handleSubmit(e){
    console.log(eventDetails);
    
    e.preventDefault()
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/${id}`,{
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
      console.log(response.data);
      
      if(response.data.status){
        navigate(`/manageEvents`)
      }
      
    } catch (error) {
      console.log('error: ',error);     
    }
  } 

  if(loading){
    return <div className="flex justify-center items-center w-screen mt-8">
              <Spinner aria-label="Alternate spinner button example" size="md" />
              <span className="pl-3 text-lg">Loading...</span>
            </div>
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
    <div className="flex flex-col justify-center items-center mt-4">
      <h2 className="text-indigo-600 font-bold text-3xl border-b-2 w-64 text-center p-1">
        Update Event
      </h2>
      <div className="flex flex-col gap-4 w-9/12">
        <div>
          <label>Title</label>
          <TextInput type="text" placeholder="title" maxLength={23} required value={eventDetails.title} onChange={(e)=>
            setEventDetails({...eventDetails,title:e.target.value})}
            />
        </div>
        <div className="">
          <label>Location</label>
          <TextInput type="text" placeholder="Location" maxLength={27} required value={eventDetails.location} onChange={(e)=>
            setEventDetails({...eventDetails,location:e.target.value})
          } />
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className=" col-span-6">
            <label>Date</label>
            <Datepicker
              defaultDate={new Date(eventDetails.date)}
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
            <TextInput type="time" value={(eventDetails.time)} required onChange={(e)=>{
              setEventDetails({...eventDetails,time:e.target.value})
              }} />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className=" col-span-6">
            <label>Tickets</label>
            <TextInput
              type="number"
              defaultValue={eventDetails.tickets}
              min={1}
              required
              onChange={(e)=>{
                setEventDetails({...eventDetails,tickets:Number(e.target.value)})
                }}
                />
          </div>
          <div className=" col-span-6">
            <label>Fee</label>
            <TextInput type="number" defaultValue={eventDetails.fee} min={0} required  onChange={(e)=>{
              setEventDetails({...eventDetails,fee:Number(e.target.value)})
              }}/>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-full">
            <label>Images</label>
            <div className="flex flex-col justify-center items-end">
              <TextInput type="file" placeholder="Image Link" className="w-full" onChange={(e)=>{
                setImageUpload(e.target.files[0])
                }} />
                <Button className="bg-indigo-600 mt-3 max-w-fit" onClick={UploadToFirebase}>Upload</Button>
            </div>
          </div>
          <div className="pt-5">
            <img src={eventDetails.images} width={200} className="rounded-lg shadow-md" />
          </div>
        </div>
        <div>
          <QuillEditor setEventDetails={setEventDetails} description={eventDetails.description}/>
        </div>
      </div>
      <Button className="bg-indigo-600 hover:bg-indigo-500 mt-6 pl-6 pr-6" type="submit">Update</Button>
    </div>
    </form>
  );
}
