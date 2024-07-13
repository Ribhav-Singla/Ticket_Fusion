import './UserCard.css'
import { Table } from 'flowbite-react'

export default function UserCard({id,name,email,phonenumber,quantity,purchasedDate}:{id:string,name:string,email:string,phonenumber:string,quantity:number,purchasedDate:string}){
    return (
        <>
            <Table.Row className="bg-white">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                {name}
              </Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>{phonenumber}</Table.Cell>
              <Table.Cell>{quantity}</Table.Cell>
              <Table.Cell>{(new Date(purchasedDate)).toLocaleString()}</Table.Cell>
            </Table.Row>
        </>
    )
}