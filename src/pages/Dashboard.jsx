import { useState, useEffect } from 'react'
import api from '../services/api'

const IconUsuarios = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const IconMembresia = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const IconIngresos = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
)

const IconAlerta = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

const IconReloj = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

function StatCard({ titulo, valor, Icono, color }) {
    return (
        <div
            className="rounded-2xl p-6 flex flex-col justify-between"
            style={{
                background: '#111',
                border: '1px solid #1a1a1a',
                minHeight: '140px'
            }}
        >
            <div className="flex items-center justify-between">
                <p
                    className="font-ubuntu text-xs uppercase tracking-widest"
                    style={{ color: '#444' }}
                >
                    {titulo}
                </p>
                <div style={{ color }}>
                    <Icono />
                </div>
            </div>
            <p
                className="font-ubuntuc mt-4"
                style={{ color, fontSize: '52px', lineHeight: 1 }}
            >
                {valor}
            </p>
        </div>
    )
}

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [alertas, setAlertas] = useState([])
    const [ingresos, setIngresos] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const [statsRes, alertasRes, ingresosRes] = await Promise.all([
                api.get('/dashboard'),
                api.get('/alertas'),
                api.get('/ingresos?limit=10')
            ])
            setStats(statsRes.data)
            setAlertas(alertasRes.data.alertas)
            setIngresos(ingresosRes.data)
        } catch (error) {
            console.error('Error cargando datos:', error)
        } finally {
            setCargando(false)
        }
    }

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                <div className="text-center">
                    <div
                        className="w-10 h-10 border-2 border-t-transparent rounded-full mx-auto mb-4"
                        style={{ borderColor: '#00c878', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
                    />
                    <p className="font-ubuntu text-sm" style={{ color: '#00c878' }}>Cargando...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'url(/src/assets/gym-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative'
        }}>

            {/* Overlay oscuro */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.82)',
                zIndex: 0
            }} />

            {/* Contenido */}
            <div className="max-w-screen-xl mx-auto px-8 py-8" style={{ position: 'relative', zIndex: 1 }}>

                {/* Encabezado */}
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="font-ubuntuc text-5xl" style={{ color: '#00c878' }}>
                            DASHBOARD
                        </h1>
                        <p className="font-ubuntu mt-1 text-sm" style={{ color: '#444' }}>
                            {new Date().toLocaleDateString('es-CO', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={cargarDatos}
                        className="font-ubuntu text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-200"
                        style={{ color: '#00c878', border: '1px solid #00c87840' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#00c87815'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        Actualizar
                    </button>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <StatCard titulo="Total Usuarios" valor={stats?.total_usuarios ?? 0} Icono={IconUsuarios} color="#00c878" />
                    <StatCard titulo="Membresías Activas" valor={stats?.membresias_activas ?? 0} Icono={IconMembresia} color="#00c878" />
                    <StatCard titulo="Ingresos Hoy" valor={stats?.ingresos_hoy ?? 0} Icono={IconIngresos} color="#00c878" />
                </div>

                {/* Sección inferior */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Próximos vencimientos */}
                    <div
                        className="rounded-2xl p-6"
                        style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid #1a1a1a', backdropFilter: 'blur(10px)' }}
                    >
                        <h2
                            className="font-ubuntuc text-lg uppercase tracking-wider mb-5 flex items-center gap-2"
                            style={{ color: '#00c878' }}
                        >
                            <IconAlerta />
                            Próximos Vencimientos
                        </h2>

                        {alertas.length === 0 ? (
                            <div className="flex items-center justify-center h-32">
                                <p className="font-ubuntu text-sm" style={{ color: '#333' }}>
                                    No hay membresías por vencer pronto
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alertas.map((alerta, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded-xl px-4 py-3"
                                        style={{ background: '#0d0d0d', border: '1px solid #1f1f1f' }}
                                    >
                                        <div>
                                            <p className="font-ubuntu text-white text-sm">Usuario #{alerta.usuario_id}</p>
                                            <p className="font-ubuntu text-xs mt-0.5" style={{ color: '#444' }}>
                                                Vence: {new Date(alerta.fecha_fin).toLocaleDateString('es-CO')}
                                            </p>
                                        </div>
                                        <span
                                            className="font-ubuntu text-xs px-3 py-1 rounded-full"
                                            style={{
                                                background: alerta.dias_restantes <= 2 ? '#ef444415' : '#00c87815',
                                                color: alerta.dias_restantes <= 2 ? '#ef4444' : '#00c878',
                                                border: `1px solid ${alerta.dias_restantes <= 2 ? '#ef444430' : '#00c87830'}`
                                            }}
                                        >
                                            {alerta.dias_restantes} días
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Últimos ingresos */}
                    <div
                        className="rounded-2xl p-6"
                        style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid #1a1a1a', backdropFilter: 'blur(10px)' }}
                    >
                        <h2
                            className="font-ubuntuc text-lg uppercase tracking-wider mb-5 flex items-center gap-2"
                            style={{ color: '#00c878' }}
                        >
                            <IconReloj />
                            Últimos Ingresos
                        </h2>

                        {ingresos.length === 0 ? (
                            <div className="flex items-center justify-center h-32">
                                <p className="font-ubuntu text-sm" style={{ color: '#333' }}>
                                    No hay ingresos registrados
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ingresos.map((ingreso) => (
                                    <div
                                        key={ingreso.id}
                                        className="flex items-center justify-between rounded-xl px-4 py-3"
                                        style={{ background: '#0d0d0d', border: '1px solid #1f1f1f' }}
                                    >
                                        <div>
                                            <p className="font-ubuntu text-white text-sm">Usuario #{ingreso.usuario_id}</p>
                                            <p className="font-ubuntu text-xs mt-0.5" style={{ color: '#444' }}>
                                                {new Date(ingreso.fecha_hora).toLocaleTimeString('es-CO')}
                                                {ingreso.tipo_acceso && ` · ${ingreso.tipo_acceso}`}
                                            </p>
                                        </div>
                                        <span
                                            className="font-ubuntu text-xs px-3 py-1 rounded-full"
                                            style={{
                                                background: ingreso.permitido ? '#00c87815' : '#ef444415',
                                                color: ingreso.permitido ? '#00c878' : '#ef4444',
                                                border: `1px solid ${ingreso.permitido ? '#00c87830' : '#ef444430'}`
                                            }}
                                        >
                                            {ingreso.permitido ? 'Permitido' : 'Denegado'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard