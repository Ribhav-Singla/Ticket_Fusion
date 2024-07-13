import z from 'zod';
export declare const signupInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phonenumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phonenumber: string;
}, {
    name: string;
    email: string;
    password: string;
    phonenumber: string;
}>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const eventInput: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    images: z.ZodOptional<z.ZodString>;
    date: z.ZodEffects<z.ZodString, string, string>;
    time: z.ZodString;
    location: z.ZodString;
    tickets: z.ZodNumber;
    fee: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    tickets: number;
    fee: number;
    images?: string | undefined;
}, {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    tickets: number;
    fee: number;
    images?: string | undefined;
}>;
export declare const eventTicketInput: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export type SignupInputType = z.infer<typeof signupInput>;
export type SigninInputType = z.infer<typeof signinInput>;
export type EventInputType = z.infer<typeof eventInput>;
export type EventTicketInputType = z.infer<typeof eventTicketInput>;
