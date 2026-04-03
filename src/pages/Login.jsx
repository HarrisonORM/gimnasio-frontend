import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const textos = {
    es: {
        titulo1: "Bienvenido al",
        gym: "GYM",
        titulo2: "DE LA",
        evo: "EVO",
        titulo3: "LUCIÓN",
        frase: "Entrena. Evoluciona. Domina.",
        usuario: "Usuario",
        contrasena: "Contraseña",
        mostrar: "Mostrar",
        ocultar: "Ocultar",
        ingresar: "Ingresar",
        ingresando: "Ingresando...",
        error: "Usuario o contraseña incorrectos",
    },
    en: {
        titulo1: "Welcome to the",
        gym: "GYM",
        titulo2: "OF",
        evo: "EVO",
        titulo3: "LUTION",
        frase: "Train. Evolve. Dominate.",
        usuario: "Username",
        contrasena: "Password",
        mostrar: "Show",
        ocultar: "Hide",
        ingresar: "Sign In",
        ingresando: "Signing in...",
        error: "Invalid username or password",
    },
};

function Login() {
    const [idioma, setIdioma] = useState("es");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const t = textos[idioma];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError("");
        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            setError(t.error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Lado izquierdo */}
            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Círculos de fondo */}
                <div className="absolute inset-0 opacity-5">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute border rounded-full"
                            style={{
                                borderColor: "#00c878",
                                width: `${(i + 1) * 60}px`,
                                height: `${(i + 1) * 60}px`,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </div>

                {/* Línea decorativa izquierda */}
                <div
                    className="absolute left-0 top-0 w-1 h-full"
                    style={{
                        background:
                            "linear-gradient(to bottom, transparent, #00c878, transparent)",
                    }}
                />

                {/* Contenido izquierdo */}
                <div className="relative z-10 text-center">
                    <div className="mb-6">
                        <span
                            className="font-ubuntuc tracking-widest"
                            style={{ fontSize: "96px", color: "#00c878", lineHeight: 1 }}
                        >
                            EVO
                        </span>
                        <span
                            className="font-ubuntuc tracking-widest"
                            style={{ fontSize: "96px", color: "white", lineHeight: 1 }}
                        >
                            GYM
                        </span>
                    </div>

                    {/* Línea decorativa */}
                    <div
                        className="mx-auto mb-8 rounded-full"
                        style={{ width: "80px", height: "3px", background: "#00c878" }}
                    />

                    <p
                        className="font-ubuntuc tracking-widest uppercase"
                        style={{
                            color: "#80e8b0",
                            fontSize: "18px",
                            letterSpacing: "0.3em",
                        }}
                    >
                        {t.frase}
                    </p>

                    {/* Puntos decorativos */}
                    <div className="mt-12 flex gap-3 justify-center">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#00c878" }}
                        />
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#00c878", opacity: 0.6 }}
                        />
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#00c878", opacity: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Lado derecho */}
            <div className="w-full lg:w-1/2 bg-gray-950 flex flex-col items-center justify-center p-8 relative">
                {/* Botón de idioma */}
                <button
                    onClick={() => setIdioma(idioma === "es" ? "en" : "es")}
                    className="absolute top-6 right-6 flex items-center gap-2 text-sm px-4 py-2 rounded-full font-ubuntuc font-semibold uppercase tracking-wider transition-all duration-200"
                    style={{
                        color: "#00c878",
                        border: "1px solid #00c87840",
                        background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#00c878";
                        e.currentTarget.style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#00c878";
                    }}
                >
                    🌐 {idioma === "es" ? "EN" : "ES"}
                </button>

                {/* Formulario */}
                <div className="w-full max-w-md">
                    {/* Logo mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="font-ubuntuc text-5xl" style={{ color: "#00c878" }}>
                            EVO
                        </span>
                        <span className="font-ubuntuc text-5xl text-white">GYM</span>
                    </div>

                    {/* Título */}
                    <div className="mb-10">
                        <p
                            className="font-ubuntuc uppercase tracking-widest mb-2"
                            style={{
                                color: "#80e8b0",
                                fontSize: "13px",
                                letterSpacing: "0.25em",
                            }}
                        >
                            {t.titulo1}
                        </p>
                        <h1
                            className="font-ubuntuc leading-none"
                            style={{ fontSize: "52px" }}
                        >
                            <span style={{ color: "#00c878" }}>{t.gym}</span>
                            <span className="text-white"> {t.titulo2} </span>
                            <span style={{ color: "#00c878" }}>{t.evo}</span>
                            <span className="text-white">{t.titulo3}</span>
                        </h1>
                        <div
                            className="mt-4 rounded-full"
                            style={{ width: "48px", height: "2px", background: "#00c878" }}
                        />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Campo usuario */}
                        <div>
                            <label
                                className="block mb-2 font-ubuntuc uppercase tracking-wider"
                                style={{ color: "#80e8b0", fontSize: "12px" }}
                            >
                                {t.usuario}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder={t.usuario}
                                    className="w-full rounded-xl pl-4 pr-4 py-4 outline-none transition-all duration-200 font-ubuntuc"
                                    style={{
                                        background: "#0d0d0d",
                                        border: "1px solid #1f1f1f",
                                        color: "white",
                                        fontSize: "15px",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#00c878")}
                                    onBlur={(e) => (e.target.style.borderColor = "#1f1f1f")}
                                />
                            </div>
                        </div>

                        {/* Campo contraseña */}
                        <div>
                            <label
                                className="block mb-2 font-ubuntuc uppercase tracking-wider"
                                style={{ color: "#80e8b0", fontSize: "12px" }}
                            >
                                {t.contrasena}
                            </label>
                            <div className="relative">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder={t.contrasena}
                                    className="w-full rounded-xl pl-4 pr-24 py-4 outline-none transition-all duration-200 font-ubuntuc"
                                    style={{
                                        background: "#0d0d0d",
                                        border: "1px solid #1f1f1f",
                                        color: "white",
                                        fontSize: "15px",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#00c878")}
                                    onBlur={(e) => (e.target.style.borderColor = "#1f1f1f")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 font-ubuntuc uppercase transition-colors duration-200"
                                    style={{
                                        color: "#80e8b0",
                                        fontSize: "11px",
                                        letterSpacing: "0.1em",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.color = "#00c878")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.color = "#80e8b0")
                                    }
                                >
                                    {mostrarPassword ? t.ocultar : t.mostrar}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="rounded-xl px-4 py-3"
                                style={{
                                    background: "#ef444415",
                                    border: "1px solid #ef444430",
                                }}
                            >
                                <p className="text-red-400 text-sm text-center font-ubuntuc">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full font-ubuntuc tracking-widest rounded-xl py-4 transition-all duration-200 relative overflow-hidden"
                            style={{
                                background: cargando ? "#035c34" : "#00c878",
                                color: "#000",
                                fontSize: "20px",
                                letterSpacing: "0.2em",
                                cursor: cargando ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => {
                                if (!cargando) e.currentTarget.style.background = "#069e5a";
                            }}
                            onMouseLeave={(e) => {
                                if (!cargando) e.currentTarget.style.background = "#00c878";
                            }}
                        >
                            {cargando ? (
                                <span className="flex items-center justify-center gap-3">
                                    <span
                                        className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                                        style={{ animation: "spin 0.8s linear infinite" }}
                                    />
                                    {t.ingresando}
                                </span>
                            ) : (
                                t.ingresar
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p
                        className="text-center mt-10 font-ubuntuc uppercase tracking-widest"
                        style={{ color: "#1f1f1f", fontSize: "11px" }}
                    >
                        EvoGym © {new Date().getFullYear()}
                    </p>
                </div>
            </div>

            {/* Animación del spinner */}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default Login;
