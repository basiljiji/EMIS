import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/highlight/lib/styles/index.css"
import * as PDFJS from "pdfjs-dist/build/pdf"
import * as PDFJSWorker from "pdfjs-dist/build/pdf.worker"
import { useAddAccessedFilesMutation } from "../slices/periodApiSlice"

PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker

const PdfCanvas = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""
  const portionTitle = location.state?.portionTitle || ""

  const [file, setFile] = useState(fileUrl)

  const [addAccessedFiles] = useAddAccessedFilesMutation()

  useEffect(() => {
    const fromTime = Date.now()
    const handleSubmit = async () => {
      try {
        const result = await addAccessedFiles({
          fileUrl,
          portionTitle,
          fromTime,
          toTime: Date.now(),
        })
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    }

    // Cleanup function to trigger handleSubmit on unmount
    return () => {
      handleSubmit()
    }
  }, [fileUrl, portionTitle, addAccessedFiles])

  useEffect(() => {
    setFile(fileUrl)
  }, [fileUrl])

  const renderToolbar = (toolbarSlot) => {
    return (
      <div className="rpv-toolbar">
        <div className="rpv-toolbar__item">
          <div className="rpv-core__display--toolbar">
            {toolbarSlot.toggleSidebarButton}
            {toolbarSlot.searchPopover}
            {toolbarSlot.previousPageButton}
            {toolbarSlot.currentPageInput}
            {toolbarSlot.nextPageButton}
            {toolbarSlot.zoomOutButton}
            {toolbarSlot.zoomPopover}
            {toolbarSlot.zoomInButton}
            {toolbarSlot.fullScreenButton}
            {toolbarSlot.downloadButton}
            {/* Add the pen draw feature icon */}
            <button className="rpv-core__button" onClick={handlePenDrawClick}>
              Pen Draw
            </button>
            {/* Add any other custom toolbar elements here */}
          </div>
        </div>
      </div>
    )
  }

  const handlePenDrawClick = () => {
    console.log("Pen Draw clicked")
  }

  return (
    <div
      className="pdf-viewer-container"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        height: "750px",
      }}
    >
      <Worker workerUrl="../../node_modules/pdfjs-dist/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[
            defaultLayoutPlugin(),
            highlightPlugin({ trigger: Trigger.None }),
          ]}
          renderToolbar={renderToolbar}
        />
      </Worker>
    </div>
  )
}

export default PdfCanvas
