import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCamera } from '../context/CameraContext'

const IconCamara = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
)

function Navbar() {
    const { logout } = useAuth()
    const { camaraActiva, toggleCamara } = useCamera()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path
    const enPaginaAcceso = location.pathname === '/acceso'

    return (
        <nav
            className="px-8 py-4 flex items-center justify-between"
            style={{
                background: '#0d0d0d',
                borderBottom: '1px solid #1a1a1a',
                position: 'relative',
                zIndex: 10
            }}
        >
            <div className="flex items-center gap-2">
                <span className="font-ubuntuc text-2xl" style={{ color: '#00c878' }}>EVO</span>
                <span className="font-ubuntuc text-2xl text-white">GYM</span>
            </div>

            <div className="flex gap-2 items-center">
                {[
                    { path: '/dashboard', label: 'Dashboard' },
                    { path: '/usuarios', label: 'Usuarios' },
                    { path: '/acceso', label: 'Acceso' },
                ].map(({ path, label }) => (
                    <Link
                        key={path}
                        to={path}
                        className="font-ubuntu px-4 py-2 rounded-xl text-sm transition-all duration-200"
                        style={{
                            color: isActive(path) ? '#000' : '#555',
                            background: isActive(path) ? '#00c878' : 'transparent',
                            border: `1px solid ${isActive(path) ? '#00c878' : '#1a1a1a'}`
                        }}
                    >
                        {label}
                    </Link>
                ))}

                {/* Botón cámara flotante */}
                {!enPaginaAcceso && (
                    <button
                        onClick={toggleCamara}
                        className="flex items-center gap-2 font-ubuntu px-3 py-2 rounded-xl text-sm transition-all duration-200"
                        style={{
                            color: camaraActiva ? '#000' : '#555',
                            background: camaraActiva ? '#00c878' : 'transparent',
                            border: `1px solid ${camaraActiva ? '#00c878' : '#1a1a1a'}`
                        }}
                    >
                        <IconCamara />
                        {camaraActiva ? 'Cámara ON' : 'Cámara OFF'}
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="font-ubuntu px-4 py-2 rounded-xl text-sm transition-all duration-200 ml-2"
                    style={{
                        color: '#ef4444',
                        background: 'transparent',
                        border: '1px solid #1a1a1a'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#ef444420'
                        e.currentTarget.style.borderColor = '#ef444440'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = '#1a1a1a'
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    )
}

export default Navbar