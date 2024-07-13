import z from 'zod'

export const signupInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phonenumber: z.string().length(10)
})

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const eventInput = z.object({
    title: z.string().max(23),
    description: z.string(),
    images: z.string().optional(),
    date: z.string().refine(dateStr => {
        const inputDate = new Date(dateStr);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return inputDate >= currentDate;
    }, {
        message: "Date must be equal to or greater than the current date"
    }),
    time: z.string(),
    location: z.string().max(27),
    tickets: z.number().min(1),
    fee: z.number().min(0)
})

export const eventTicketInput = z.object({
    quantity: z.number().min(1).max(4)
})

export type SignupInputType = z.infer<typeof signupInput>
export type SigninInputType = z.infer<typeof signinInput>
export type EventInputType = z.infer<typeof eventInput>
export type EventTicketInputType = z.infer<typeof eventTicketInput>
