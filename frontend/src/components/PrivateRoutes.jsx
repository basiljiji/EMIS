import React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const isAdmin = userInfo && userInfo.role === "admin"

  return userInfo && !isAdmin ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
