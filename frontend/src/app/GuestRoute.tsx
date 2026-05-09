import { Navigate } from 'react-router'

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/dashboard" replace /> : <>{children}</>
}
