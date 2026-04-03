import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">💪 GimnasioApp</span>
      </div>
      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="hover:text-blue-200 transition">
          Dashboard
        </Link>
        <Link to="/usuarios" className="hover:text-blue-200 transition">
          Usuarios
        </Link>
        <Link to="/acceso" className="hover:text-blue-200 transition">
          Acceso
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar