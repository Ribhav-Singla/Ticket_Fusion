import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const bulkRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>()

bulkRouter.get('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const filterTitle = c.req.query('title')
    const filterLocation = c.req.query('location')
    const fileterDate = c.req.query('date')
    console.log(filterLocation,filterTitle);
    
    try {
        const events = await prisma.event.findMany({
            where:{
                AND:[
                    { title : {contains : filterTitle}},
                    { location : {contains : filterLocation}},
                    { date : {contains : fileterDate}}
                ]
            },
            select:{
                id:true,
                title:true,
                description:true,
                images:true,
                date:true,
                time: true,
                location:true,
                tickets:true,
                fee:true,
                creator:{
                    select:{
                        name:true
                    }
                }
            },
            orderBy:{
                date:'asc'
            }
        })
        
        return c.json(events)
    } catch (error) {
        console.log("event bulk error: ", error);

        return c.json({
            message: "error while getting events"
        })
    }
})

bulkRouter.get('/upcomingEvent', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Step 1: Fetch all events' id and date
        const allEvents = await prisma.event.findMany({
            select: {
                id: true,
                date: true
            }
        });

        // Step 2: Convert the dates to Date objects
        const today = new Date();
        const upcomingEventIds = allEvents
            .filter(event => new Date(event.date) >= today)
            .map(event => event.id);

        // Step 3: Fetch the full event details for the filtered event ids
        const events = await prisma.event.findMany({
            where: {
                id: { in: upcomingEventIds }
            },
            select: {
                id: true,
                title: true,
                description: true,
                images: true,
                date: true,
                time: true,
                location: true,
                tickets: true,
                fee: true,
                creator: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                date: "asc"
            },
            take: 4
        });

        return c.json(events);
    } catch (error) {
        console.log("event bulk error: ", error);
        return c.json({
            message: "error while getting events"
        });
    }
});