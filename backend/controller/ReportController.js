import Fixture from "../models/fixtureModel.js"
import HttpError from "../utils/httpErrorMiddleware.js"
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'

export const listAllFixtures = async (req, res, next) => {
    try {
        const fixtures = await Fixture.find({ 'isDeleted.status': false })
            .populate('teacher', 'firstName middleName lastName')
            .populate('class', 'class')
            .populate('subject', 'subject')
            .populate('section', 'section')
            .populate('hour', 'hour')
        res.status(200).json(fixtures)
    } catch (err) {
        const error = new HttpError("Something Went Wrong", 500)
        return next(error)
    }
}

export const generatePdf = async (req, res, next) => {
    // try {
    // Fetch data from MongoDB
    const data = await Fixture.find()

    // Create a new PDF document
    const doc = new PDFDocument()
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    const pdfPath = join(__dirname, '../public', 'report.pdf')
    const stream = doc.pipe(fs.createWriteStream(pdfPath))

    // Add content to the PDF
    doc.fontSize(20).text('PDF Report', { align: 'center' }).moveDown()
    data.forEach(item => {
        doc.fontSize(12).text(`Teacher: ${item.teacher.firstName}`)
        doc.fontSize(12).text(`Class: ${item.class}`)
        doc.fontSize(12).text(`Section: ${item.section}`)
        doc.fontSize(12).text(`Subject: ${item.subject}`)
        doc.fontSize(12).text(`Hour: ${item.hour}`)
        doc.moveDown()
    })

    // Finalize the PDF
    doc.end()

    res.send({ success: true, message: 'PDF report generated successfully.' })
    // } catch (err) {
    //     console.error(err)
    //     res.status(500).send('Internal Server Error')
    // }
}