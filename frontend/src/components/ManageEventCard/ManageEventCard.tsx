import axios from 'axios'
import './ManageEventCard.css'
import { Table } from 'flowbite-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Users from '../Users/Users'

export default function({id,title,location,date,setToggleData}:{id:string,title:string,location:string,date:string,setToggleData: ()=>void}){
    
    const [toggleDelete ,setToggleDelete] = useState(false)
    const [list,setList] = useState(false)

    async function deleteEvent(){
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/${id}`,{
                headers:{
                    'Authorization': `${localStorage.getItem('token')}`
                    }
            })
            
            toast.info("event deleted")
            //@ts-ignore
            setToggleData((prev)=>!prev)
        } catch (error) {
            console.log("error: ",error);
        }
    }

    if(toggleDelete){
        return(
            <>
                <div className='delete-outer-container'>
                    <div className='delete-inner-container font-semibold text-lg text-black flex flex-col gap-5 p-5 rounded-lg'>
                        <div>
                            Are you sure you want to delete this event?
                        </div>
                        <div className='flex justify-center items-center gap-16'>
                            <p className=' cursor-pointer text-red-500 hover:underline' onClick={deleteEvent}>Yes</p>
                            <p className=' cursor-pointer  text-green-500 hover:underline' onClick={()=>setToggleDelete((prev)=>!prev)}>No</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Table.Row className="bg-white ">
                <Table.Cell className={`whitespace-nowrap font-semibold text-gray-900 ${list ? 'bg-indigo-100' : ''}`}>
                    <Link to={`/event/${id}`}>{title}</Link>
                </Table.Cell>
                <Table.Cell className={`font-semibold list`}>{location}</Table.Cell>
                <Table.Cell className='font-semibold'>{date}</Table.Cell>
                <Table.Cell>
                    <Link to="" className=" text-indigo-600 hover:underline font-semibold" onClick={()=>setList(prev=>!prev)}>Users</Link>
                </Table.Cell>
                <Table.Cell>
                    <Link to={`/updateEvent/${id}`} className=" text-green-600 hover:underline font-semibold ">Edit</Link>
                </Table.Cell>
                <Table.Cell>
                    <Link to="" className=" text-red-600 hover:underline font-semibold" onClick={()=>setToggleDelete((prev)=>!prev)}>Delete</Link>
                </Table.Cell>
          </Table.Row>
          {list ? <Table.Row>
            <Table.Cell colSpan={6}>
                <Users key={id} id={id}/>
            </Table.Cell>
          </Table.Row> : ""}
        </>
    )
}