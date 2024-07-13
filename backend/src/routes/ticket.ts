import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { auth } from "../middleware";
import { eventTicketInput } from "@ribhavsingla/eventcommon";

export const ticketRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
    }
}>();

ticketRouter.post('/:id', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id')
    const userId = c.get('userId');
    const body = await c.req.json();
    
    const { success , error } = eventTicketInput.safeParse(body)

    if (!success) {        
        return c.json({
            message: "event ticket input are not correct"
        })
    }
    try {

        const response = await prisma.$transaction(async (prisma) => {
            const event = await prisma.event.findFirst({
                where: { id }
            })

            //@ts-ignore
            if (event && event.tickets >= body.quantity) {
                await prisma.event.update({
                    where: { id },
                    data: { tickets: { decrement: body.quantity } }
                })

                const eventTicket = await prisma.eventTicket.create({
                    data: {
                        userId,
                        eventId: id,
                        quantity: body.quantity
                    }
                })

                return c.json({ id: eventTicket.id,
                    status:true
                 })
            }
            else {
                return c.json({
                    status: false
                })
            }
        })

        return response

    } catch (error) {
        console.log('error occured while purchasing ticket');
        return c.json({
            message: 'Failed to purchase ticket',
        })
    }
})