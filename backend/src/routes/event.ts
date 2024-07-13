import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { auth } from "../middleware";
import { eventInput } from "@ribhavsingla/eventcommon";
import { bulkRouter } from "./bulk";

export const eventRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>()

eventRouter.route('/bulk',bulkRouter)

eventRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id');
    try {

        const event = await prisma.event.findFirst({
            where: {
                id
            },
            select:{
                id:true,
                title: true,
                description: true,
                date: true,
                time:true,
                location: true,
                images : true,
                fee : true,
                tickets:true,
                creator:{
                    select:{
                        name:true,
                    }
                }
            }
        })

        return c.json(event)

    } catch (error) {
        console.log("error occured while getting a specific event:", error);
        return c.json({
            message: "error while getting a specific event"
        })
    }
})

eventRouter.post('/', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    //@ts-ignore
    const userId = c.get('userId');
    const body = await c.req.json();
    if(body.images.length == 0){
        body.images = undefined
    }    
    
    body.images = body.images === undefined ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGV2ZW50fGVufDB8fDB8fHww" : body.images
    const {success,error}= eventInput.safeParse(body)
    
    if(!success){        
        return c.json({
            message : "event post inputs are not correct"
        })
    }
    
    try {        

        const event = await prisma.event.create({
            data: {
                title: body.title,
                description: body.description,
                images: body.images,
                date: body.date,
                time : body.time,
                location: body.location,
                tickets: body.tickets,
                fee: body.fee,
                creatorId: userId
            }
        })
        if(!event) throw new Error()

        return c.json({
            id: event.id
        })

    } catch (error) {
        console.log("error occured while inserting event",error);
        return c.json({
            message: "Title must be unique"
        })
    }

})

eventRouter.put('/:id', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id');
    const body = await c.req.json();
    if(body.images.length == 0){
        body.images = undefined
    }
    // @ts-ignore
    const userId = c.get('userId');

    body.images = body.images === undefined ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGV2ZW50fGVufDB8fDB8fHww" : body.images
    const {success}= eventInput.safeParse(body)
    
    if(!success){    
        return c.json({
            message : "event updtae inputs are not correct"
        })
    }

    try {
        const event = await prisma.event.findFirst({
            where: { id: id }
        })
        //@ts-ignore
        if (userId === event.creatorId) {
            const updatedEvent = await prisma.event.update({
                where: {
                    id: id
                },
                data: {
                    title: body.title,
                    description: body.description,
                    images: body.images,
                    date: body.date,
                    time: body.time,
                    location: body.location,
                    tickets: body.tickets,
                    fee: body.fee,
                }
            })

            return c.json({
                status: true
            })
        }
        else {
            return c.json({
                message: "you are not creator of this event"
            })
        }

    } catch (error) {
        console.log("error occured while updating event");
        return c.json({
            message: "error while updating event"
        })
    }
})

eventRouter.delete('/:id', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id');
    //@ts-ignore
    const userId = c.get('userId');
    try {

        const event = await prisma.event.findFirst({
            where: { id: id }
        })
        console.log("event found");
        
        //@ts-ignore
        if (userId === event.creatorId) {
            console.log("user and creator is same");
            
            const deletedEvent = await prisma.event.delete({
                where: { id }
            })

            return c.json({ id: deletedEvent.id })
        }
        else {
            return c.json({
                message: "you are not creator of this event"
            })
        }
    } catch (error) {
        console.log("error occured while deleting event: ",error);
        return c.json({
            message: "error while deleting event"
        })
    }
})

