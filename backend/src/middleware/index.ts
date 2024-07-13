import { verify } from "hono/jwt";
import { Hono, Context, Next } from "hono";

const app = new Hono<{
    Bindings: {
        JWT_SECRET: string
    }
}>();

export async function auth(c: Context, next: Next) {
    const header = c.req.header("Authorization") || "";
    
    const token = header.split(" ")[1]
    try {
        const response = await verify(token, c.env.JWT_SECRET)
        if (response.id) {
            c.set("userId",`${response.id}`)
            await next();
        }
        else {
            return c.json({ message: "Unauthorized" })
        }
    } catch (error) {
        return c.json({ message: "Unauthorized" })
    }
}