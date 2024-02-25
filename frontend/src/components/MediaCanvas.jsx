import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

const MediaCanvas = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""
  const [file, setFile] = useState(fileUrl)

  useEffect(() => {
    setFile(fileUrl)
  }, [fileUrl])

  return (
    <>
      <Player>
        <source src={file} />
      </Player>
    </>
  )
}

export default MediaCanvas
