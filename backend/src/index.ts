import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { cors } from 'hono/cors'
import { eventRouter } from './routes/event';
import { ticketRouter } from './routes/ticket';
const app = new Hono()

app.use('/*',cors());

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1/user',userRouter)
app.route('/api/v1/event',eventRouter)
app.route('/api/v1/ticket',ticketRouter)

export default app
