import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './utils/errorMiddleware.js'
import path from 'path'
import { fileURLToPath } from 'url'

import teacherRoute from './routes/teacherRoutes.js'
import adminAuthRoute from './routes/adminAuthRoutes.js'
import classDetailshRoute from './routes/classDetailsRoutes.js'
import sectionRoute from './routes/sectionRoutes.js'
import hourRoute from './routes/hourRoutes.js'
import subjectRoute from './routes/subjectRoutes.js'
import teacherAuthRoute from './routes/teacherAuthRoutes.js'
import reportRoute from './routes/reportRoutes.js'
import adminResourceRoute from './routes/adminResource.js'
import teacherResourceRoute from './routes/teacherResourceRoutes.js'
import periodRoute from './routes/periodRoutes.js'


connectDB()

const port = process.env.PORT || 5000


const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(new URL(import.meta.url).pathname, '../public')))
const publicPath = path.join(__dirname, 'public') // Assuming your public directory is in the same directory as your server file
app.use(express.static(publicPath))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('API IS RUNNING..!')
})

app.use('/teacher', teacherRoute)
app.use('/admin', adminAuthRoute)
app.use('/admin/class', classDetailshRoute)
app.use('/admin/section', sectionRoute)
app.use('/admin/hour', hourRoute)
app.use('/admin/subject', subjectRoute)
app.use('/admin/report', reportRoute)
app.use('/admin/resource', adminResourceRoute)


app.use('/', teacherAuthRoute)
app.use('/resource', teacherResourceRoute)
app.use('/period', periodRoute)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))