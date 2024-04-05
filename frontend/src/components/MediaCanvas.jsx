import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import ReactPlayer from "react-player"
import { useAddAccessedFilesMutation } from "../slices/periodApiSlice"

const MediaCanvas = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""
  const [totalPlayTime, setTotalPlayTime] = useState(0) // State to store total play time

  const [addAccessedFiles] = useAddAccessedFilesMutation()

  // Update total play time when video progresses
  const handleProgress = (state) => {
    setTotalPlayTime(state.playedSeconds)
  }

  useEffect(() => {
    const fromTime = Date.now() // Get current time

    const handleSubmit = async () => {
      try {
        const result = await addAccessedFiles({
          fileUrl,
          fromTime,
          toTime: Date.now(),
          duration: totalPlayTime,
        })
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    }

    // Cleanup function to trigger handleSubmit on unmount
    return () => {
      handleSubmit()
    }
  }, [fileUrl, totalPlayTime, addAccessedFiles])

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
        className="my-2"
      >
        <ReactPlayer
          url={fileUrl}
          controls={true}
          onProgress={handleProgress}
          width="100%"
          height="100%"
        />
      </div>
    </>
  )
}

export default MediaCanvas
