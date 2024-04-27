import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const DocCanvas = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""
  const portionTitle = location.state?.portionTitle || ""


  console.log(fileUrl)

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <h1>File Not Supported</h1>
    </div>
  )
}

export default DocCanvas
