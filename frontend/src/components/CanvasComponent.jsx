import React, { useRef, useState, useEffect } from "react"
import { ReactSketchCanvas } from "react-sketch-canvas"
import { useAddAccessedFilesMutation } from "../slices/periodApiSlice"
import { FiPenTool, FiRotateCcw, FiRotateCw, FiTrash2 } from "react-icons/fi"
import { BiEraser } from "react-icons/bi"
import "react-quill/dist/quill.snow.css" 
import ReactQuill from "react-quill"
import "../index.css" 

const CanvasComponent = () => {
  const [strokeColor, setStrokeColor] = useState("#000000") 
  const [isCanvasView, setIsCanvasView] = useState(true) 
  const [editorContent, setEditorContent] = useState("") 

  const [addAccessedFiles] = useAddAccessedFilesMutation()

  useEffect(() => {
    const fromTime = Date.now() 
    const handleSubmit = async () => {
      try {
        const result = await addAccessedFiles({
          fileUrl: "Canvas",
          portionTitle: "Canvas",
          fromTime,
          toTime: Date.now(), // Get current time
        })
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    }
    return () => {
      handleSubmit()
    }
  }, [addAccessedFiles])

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

  const handleEditorChange = (content) => {
    setEditorContent(content)
  }

  return (
    <div className="d-flex flex-column gap-2 p-2">
      <div className="d-flex gap-2 align-items-center ">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setIsCanvasView(true)}
        >
          View Canvas
        </button>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => setIsCanvasView(false)}
        >
          View Text Editor
        </button>
      </div>
      {isCanvasView ? (
        <>
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
              ref={canvasRef}
              strokeWidth={strokeWidth}
              eraserWidth={eraserWidth}
              strokeColor={strokeColor}
            />
          </div>
        </>
      ) : (
        <div className="text-editor-container">
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
              ]
            }}
            theme="snow"
          />
        </div>
      )}
    </div>
  )
}

export default CanvasComponent
