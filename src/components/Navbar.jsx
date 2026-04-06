import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

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
                <span className="font-ubuntuc text-2xl" style={{ color: "#00c878" }}>
                    EVO
                </span>
                <span className="font-ubuntuc text-2xl text-white">GYM</span>
            </div>

            <div className="flex gap-2 items-center">
                {[
                    { path: "/dashboard", label: "Dashboard" },
                    { path: "/usuarios", label: "Usuarios" },
                    { path: "/acceso", label: "Acceso" },
                ].map(({ path, label }) => (
                    <Link
                        key={path}
                        to={path}
                        className="font-ubuntu px-4 py-2 rounded-xl text-sm transition-all duration-200"
                        style={{
                            color: isActive(path) ? "#000" : "#555",
                            background: isActive(path) ? "#00c878" : "transparent",
                            border: `1px solid ${isActive(path) ? "#00c878" : "#1a1a1a"}`,
                        }}
                    >
                        {label}
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="font-ubuntu px-4 py-2 rounded-xl text-sm transition-all duration-200 ml-2"
                    style={{
                        color: "#ef4444",
                        background: "transparent",
                        border: "1px solid #1a1a1a",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ef444420";
                        e.currentTarget.style.borderColor = "#ef444440";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#1a1a1a";
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
