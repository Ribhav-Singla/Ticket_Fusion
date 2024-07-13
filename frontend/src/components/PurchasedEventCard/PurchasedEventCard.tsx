import './PurchasedEventCard.css'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function PurchasedEventCard({id,title,location,date,time,fee,quantity,purchasedDate}:{
    id:string,
    title:string,
    location:string,
    date:string,
    time:string,
    fee:number,
    quantity:number,
    purchasedDate:string
}){

    function checkStatus(date:string){
        const today = new Date();
        const eventDate = new Date(date);
        
        today.setHours(0,0,0,0)
        return eventDate >= today
    }

    return (
        <>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                    <Link to={`/event/${id}`}>{title}</Link>
                </Table.Cell>
                <Table.Cell className='font-semibold'>{location}</Table.Cell>
                <Table.Cell className='font-semibold'>{date}</Table.Cell>
                <Table.Cell className='font-semibold'>{time}</Table.Cell>
                <Table.Cell className='font-semibold'>₹{fee}</Table.Cell>
                <Table.Cell className='font-semibold'>{quantity}</Table.Cell>
                <Table.Cell className='font-semibold'>{(new Date(purchasedDate)).toLocaleString()}</Table.Cell>
                {
                    checkStatus(date) ? 
                    <Table.Cell className='font-semibold text-green-500'>{'Upcoming'}</Table.Cell>
                    :
                    <Table.Cell className='font-semibold text-red-500'>{'Expired'}</Table.Cell>
                }
          </Table.Row>
        </>
    )
}