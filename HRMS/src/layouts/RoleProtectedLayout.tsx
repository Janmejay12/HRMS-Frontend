import React, { type JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
interface props {
  children: JSX.Element;
  allowedRole: string;
}
const RoleProtectedLayout: React.FC<props> = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const hasAccess = user.role === allowedRole;
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
interface props {
  children: JSX.Element;
}
export default RoleProtectedLayout;
