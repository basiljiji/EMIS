import React from "react"
import { useLocation } from "react-router-dom"
import ImageCanvas from "../components/ImageCanvas"
import PdfCanvas from "../components/PdfCanvas"
import MediaCanvas from "../components/MediaCanvas"

const AdminResourceViewerScreen = () => {
  const location = useLocation()
  const fileUrl = location.state?.fileUrl || ""

  let content = null

  if (fileUrl.endsWith(".pdf")) {
    content = <PdfCanvas fileUrl={fileUrl} />
  } else if (
    fileUrl.endsWith(".mp4") ||
    fileUrl.endsWith(".mpeg") ||
    fileUrl.endsWith(".webm") ||
    fileUrl.endsWith(".mp3") ||
    fileUrl.endsWith(".mkv") ||
    fileUrl.endsWith(".mov") ||
    fileUrl.endsWith(".avi")
  ) {
    content = <MediaCanvas fileUrl={fileUrl} />
  } else {
    content = <ImageCanvas fileUrl={fileUrl} />
  }

  return content
}

export default AdminResourceViewerScreen
