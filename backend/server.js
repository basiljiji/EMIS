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
import subjectRoute from './routes/subjectRoutes.js'
import teacherAuthRoute from './routes/teacherAuthRoutes.js'
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
app.use(express.static(path.join(new URL(import.meta.url).pathname, '../uploads')))
const publicPath = path.join(__dirname, '../uploads') // Assuming your public directory is in the same directory as your server file
app.use(express.static(publicPath))
app.use(cookieParser())



app.use('/api/teacher', teacherRoute)
app.use('/api/admin', adminAuthRoute)
app.use('/api/admin/class', classDetailshRoute)
app.use('/api/admin/section', sectionRoute)
app.use('/api/admin/subject', subjectRoute)
app.use('/api/admin/resource', adminResourceRoute)


app.use('/api/', teacherAuthRoute)
app.use('/api/resource', teacherResourceRoute)
app.use('/api/period', periodRoute)

if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    //any route that is not api will be redirected to index.html
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API IS RUNNING..!')
    })
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))