import React, { useRef, useState, useEffect } from "react"
import { Breadcrumb, Row } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { ReactSketchCanvas } from "react-sketch-canvas"
import { useParams, useLocation } from "react-router-dom"
import { FiPenTool, FiRotateCcw, FiRotateCw, FiTrash2 } from "react-icons/fi"
import { BiEraser } from "react-icons/bi"
import { useAddAccessedFilesMutation } from "../slices/periodApiSlice"

const somePreserveAspectRatio = [
  "none",
  "xMinYMin",
  "xMidYMin",
  "xMaxYMin",
  "xMinYMid",
  "xMidYMid",
  "xMaxYMid",
  "xMinYMax",
  "xMidYMax",
  "xMaxYMax",
]

const ImageCanvas = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""
  const [backgroundImage, setBackgroundImage] = useState(fileUrl)
  const [strokeColor, setStrokeColor] = useState("#000000") // Default color

  const [addAccessedFiles] = useAddAccessedFilesMutation()

  useEffect(() => {
    const fromTime = Date.now() // Get current time
    const handleSubmit = async () => {
      try {
        const result = await addAccessedFiles({
          fileUrl,
          fromTime,
          toTime: Date.now(), // Get current time
        })
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    }

    // Cleanup function to trigger handleSubmit on unmount
    return () => {
      handleSubmit()
    }
  }, [fileUrl, addAccessedFiles])

  useEffect(() => {
    setBackgroundImage(fileUrl)
  }, [fileUrl])

  const canvasRef = useRef(null)
  const [eraseMode, setEraseMode] = useState(false)
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [eraserWidth, setEraserWidth] = useState(10)

  const handleEraserClick = () => {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  const handlePenClick = () => {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  const handleUndoClick = () => {
    canvasRef.current?.undo()
  }

  const handleRedoClick = () => {
    canvasRef.current?.redo()
  }

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas()
  }

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas()
  }

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(+event.target.value)
  }

  const handleEraserWidthChange = (event) => {
    setEraserWidth(+event.target.value)
  }

  const handleStrokeColorChange = (color) => {
    setStrokeColor(color)
  }

  const parts = fileUrl.replace("http://", "").split("/")

  let extractedPath = ""

  if (parts.length === 5) {
    // Case: http://localhost:3000/resource/X/CC/filename
    extractedPath = `/${parts[3]}/${parts[4]}`
  } else if (parts.length === 4 && !parts[3].includes(".")) {
    // Case: http://localhost:3000/resource/X/filename
    extractedPath = `/${parts[3]}`
  } else {
    // Handle other cases or throw an error for unexpected URLs
    extractedPath = "" // Or whatever default value you want to set
  }
  console.log(extractedPath) // Output: /X/CC

  return (
    <div className="d-flex flex-column gap-2 p-2">
      <Row>
        <Breadcrumb>
          <LinkContainer to={`/dashboard`}>
            <Breadcrumb.Item active>Back</Breadcrumb.Item>
          </LinkContainer>
        </Breadcrumb>
      </Row>
      <div className="d-flex gap-2 align-items-center ">
        <button
          type="button"
          className="btn btn-outline-success"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          <FiPenTool /> Pen
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          <BiEraser /> Eraser
        </button>

        <div className="d-flex gap-2 align-items-center ">
          <label htmlFor="strokeWidth" className="form-label">
            Stroke width
          </label>
          <input
            disabled={eraseMode}
            type="range"
            className="form-range"
            min="1"
            max="20"
            step="1"
            id="strokeWidth"
            value={strokeWidth}
            onChange={handleStrokeWidthChange}
          />
          <label htmlFor="eraserWidth" className="form-label">
            Eraser width
          </label>
          <input
            disabled={!eraseMode}
            type="range"
            className="form-range"
            min="1"
            max="20"
            step="1"
            id="eraserWidth"
            value={eraserWidth}
            onChange={handleEraserWidthChange}
          />
        </div>
        <div className="vr" />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleUndoClick}
        >
          <FiRotateCcw />
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleRedoClick}
        >
          <FiRotateCw />
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleClearClick}
        >
          <FiTrash2 /> Clear
        </button>
        <div>
          <label htmlFor="colorPicker" className="form-label">
            Pen Color
          </label>
          <input
            type="color"
            id="colorPicker"
            value={strokeColor}
            onChange={(e) => handleStrokeColorChange(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{ width: "100%", height: "100vh", border: "2px solid black" }}
      >
        <ReactSketchCanvas
          style={{ width: "100%", height: "100%" }}
          backgroundImage={backgroundImage}
          ref={canvasRef}
          strokeWidth={strokeWidth}
          eraserWidth={eraserWidth}
          strokeColor={strokeColor}
        />
      </div>
    </div>
  )
}

export default ImageCanvas
