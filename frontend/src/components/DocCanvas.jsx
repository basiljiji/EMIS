import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const DocCanvas = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""

  console.log(fileUrl)

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <iframe
        src={`../assets/ViewerJS/viewer.html?file=${encodeURIComponent(
          fileUrl
        )}`}
        title="PPTX Viewer"
        style={{ width: "100%", height: "100%" }}
        frameBorder="0"
      />
    </div>
  )
}

export default DocCanvas
