import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Assistant from './pages/Assistant'
import Schemes from './pages/Schemes'
import Complaint from './pages/Complaint'
import Track from './pages/Track'
import History from './pages/History'
import Login from './pages/Login'
import Signup from './pages/Signup'

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/assistant" element={<Protected><Assistant /></Protected>} />
          <Route path="/schemes" element={<Protected><Schemes /></Protected>} />
          <Route path="/complaint" element={<Protected><Complaint /></Protected>} />
          <Route path="/track" element={<Protected><Track /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
