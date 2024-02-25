import React, { useRef, useState, useEffect } from "react"
import { ReactSketchCanvas } from "react-sketch-canvas"
import { useParams, useLocation } from "react-router-dom"
import { FiPenTool, FiRotateCcw, FiRotateCw, FiTrash2 } from "react-icons/fi"
import { BiEraser } from "react-icons/bi"

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
  const [preserveAspectRatio, setPreserveAspectRatio] = useState("none")
  const [backgroundImage, setBackgroundImage] = useState(fileUrl)

  useEffect(() => {
    setBackgroundImage(fileUrl)
  }, [fileUrl])

  const handlePreserveAspectRatioChange = (event) => {
    setPreserveAspectRatio(event.target.value)
  }

  const handleBackgroundImageChange = (event) => {
    setBackgroundImage(event.target.value)
  }

  const canvasRef = useRef(null)
  const [eraseMode, setEraseMode] = useState(false)
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [eraserWidth, setEraserWidth] = useState(10)
  const [strokeColor, setStrokeColor] = useState("#000000")

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

  const handleStrokeColorChange = (event) => {
    setStrokeColor(event.target.value)
  }

  return (
    <div className="d-flex flex-column gap-2 p-2">
      <h3>Tools</h3>
      <div className="d-flex gap-2 align-items-center ">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          <FiPenTool /> Pen
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
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
          className="btn btn-sm btn-outline-primary"
          onClick={handleUndoClick}
        >
          <FiRotateCcw /> Undo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleRedoClick}
        >
          <FiRotateCw /> Redo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleClearClick}
        >
          <FiTrash2 /> Clear
        </button>
      </div>
      <div className="d-flex gap-2 flex-column">
        <label htmlFor="preserveAspectRatio" className="form-label">
          Preserve Aspect Ratio
        </label>
        <select
          id="preserveAspectRatio"
          className="form-select form-select-sm"
          aria-label="Preserve Aspect Ratio options"
          value={preserveAspectRatio}
          onChange={handlePreserveAspectRatioChange}
        >
          {somePreserveAspectRatio.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <h1>Canvas</h1>
      <ReactSketchCanvas
        backgroundImage={backgroundImage}
        preserveBackgroundImageAspectRatio={preserveAspectRatio}
        ref={canvasRef}
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
        strokeColor={strokeColor}
      />
    </div>
  )
}

export default ImageCanvas
