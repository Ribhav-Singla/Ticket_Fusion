import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from "hono/jwt";
import { auth } from "../middleware";
import { signupInput, signinInput } from "@ribhavsingla/eventcommon";
import bcyrpt from 'bcryptjs'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signupInput.safeParse(body)
    if (!success) {
        return c.json({
            message: "signin inputs not correct"
        })
    }
    const salt = bcyrpt.genSaltSync(10)
    const hash = bcyrpt.hashSync(body.password, salt)

    try {
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hash,
                phonenumber: body.phonenumber
            }
        })

        const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET)
        return c.json({ token: token })

    } catch (error) {
        console.log("signup error: ", error);
        return c.json({
            message: "Email or Mobile No. already registered"
        }, 403)
    }
})

userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const { success } = signinInput.safeParse(body)
    if (!success) {
        return c.json({
            message: "signin inputs not correct"
        })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email
            }
        })
        //@ts-ignore
        if (!bcyrpt.compareSync(body.password, user.password)) {
            throw new Error()
        }

        if (user) {
            const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET)
            return c.json({
                token: token,
                name : user.name
            })
        }

    } catch (error) {
        console.log("signin error: ", error);
        return c.json({
            message: "Invalid email or password"
        }, 403)
    }
})

userRouter.get('/me', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    //@ts-ignore
    const userId = c.get('userId')
    try {
        const user = await prisma.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phonenumber: true,
            }
        })

        return c.json(user)
    } catch (error) {
        console.log('error occurred while getting userData: ', error);
        return c.json({
            message: "error occurred while getting userData"
        })
    }
})

userRouter.get('/myEvents', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const filterTitle = c.req.query('filterTitle')

    //@ts-ignore
    const userId = c.get('userId')
    try {       

        const eventTickets = await prisma.eventTicket.findMany({
            where: { AND:[
                {userId},
                {event:{
                    title:{
                        contains:filterTitle
                    }
                }}
            ] },
            select:{
                event:{
                    select:{
                        id:true,
                        title:true,
                        location:true,
                        date:true,
                        time:true,
                        fee:true
                    }
                },
                quantity:true,
                purchasedDate:true,
            },
            orderBy:{
                purchasedDate:'desc'
            }
        })
        
        return c.json(eventTickets)

    } catch (error) {
        console.log('error while getting my events');
        return c.json({
            message: "error while getting my events"
        })
    }
})

userRouter.get('/manageEvents', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const filterTitle = c.req.query('filterTitle')

    //@ts-ignore
    const userId = c.get('userId')
    try {

        const events = await prisma.event.findMany({
            where: { AND:[
                {creatorId: userId},
                {title: {contains:filterTitle}}
            ] },
            select:{
                id: true,
                title:true,
                location:true,
                date:true
            },
            orderBy:{
                title:'asc'
            }
        })

        return c.json(events)

    } catch (error) {
        console.log('error while getting manage events');
        return c.json({
            message: "error while getting manage events"
        })
    }
})

userRouter.get('/manageEvents/user/:id', auth, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id');
    //@ts-ignore
    const userId = c.get('userId')
    try {

        const events = await prisma.eventTicket.findMany({
            where:{
                eventId : id
            },
            select:{
                quantity : true,
                purchasedDate : true,
                user:{
                    select:{
                        name:true,
                        email : true,
                        phonenumber:true
                    }
                }
            },
            orderBy:{
                purchasedDate:'desc'
            }
        })

        return c.json(events)

    } catch (error) {
        console.log('error while getting manage user events: ',error);
        return c.json({
            message: "error while getting manage user events"
        })
    }
})

