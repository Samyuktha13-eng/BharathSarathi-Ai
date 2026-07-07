import { NavLink, useNavigate } from 'react-router-dom'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { MdOutlineReportProblem, MdHistory } from 'react-icons/md'
import { TbMapSearch } from 'react-icons/tb'
import { AiOutlineHome } from 'react-icons/ai'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home', icon: <AiOutlineHome size={16} />, end: true },
  { to: '/assistant', label: 'Assistant', icon: <IoChatbubblesOutline size={16} /> },
  { to: '/schemes', label: 'Schemes', icon: <HiOutlineDocumentText size={16} /> },
  { to: '/complaint', label: 'Complaint', icon: <MdOutlineReportProblem size={16} /> },
  { to: '/track', label: 'Track', icon: <TbMapSearch size={16} /> },
  { to: '/history', label: 'History', icon: <MdHistory size={16} /> },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-brand" role="banner">
        <span className="flag" aria-hidden="true">🇮🇳</span>
        <span className="brand-name">BharatSarthiAI</span>
      </div>

      {user && (
        <div className="navbar-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.icon} <span>{l.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      <div className="navbar-user">
        {user ? (
          <>
            <span className="user-name">👤 {user.name.split(' ')[0]}</span>
            <button className="btn-logout" onClick={handleLogout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <button className="btn-logout" onClick={() => navigate('/login')}>Sign In</button>
        )}
      </div>
    </nav>
  )
}
