import { useRef, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Webcam from 'react-webcam'
import { useCamera } from '../context/CameraContext'
import api from '../services/api'

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

function Notificacion({ resultado, estado }) {
    if (!resultado || estado === 'esperando') return null

    const permitido = estado === 'permitido'

    return (
        <div
            className="fixed bottom-6 left-6 rounded-2xl p-4 transition-all duration-300"
            style={{
                background: permitido ? 'rgba(0,200,120,0.95)' : 'rgba(239,68,68,0.95)',
                border: `1px solid ${permitido ? '#00c87860' : '#ef444460'}`,
                backdropFilter: 'blur(10px)',
                zIndex: 200,
                minWidth: '260px',
                boxShadow: `0 8px 32px ${permitido ? '#00c87840' : '#ef444440'}`
            }}
        >
            <div className="flex items-center gap-3 mb-1">
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.2)', color: 'white' }}
                >
                    {permitido ? <IconCheck /> : <IconX />}
                </div>
                <p className="font-ubuntuc text-white text-sm tracking-wider">
                    {permitido ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
                </p>
            </div>

            {resultado.usuario && (
                <p className="font-ubuntu text-white font-medium text-sm ml-9">
                    {resultado.mensaje_bienvenida ? `${resultado.mensaje_bienvenida} —` : ''} {resultado.usuario.nombre} {resultado.usuario.apellido}
                </p>
            )}

            <p className="font-ubuntu text-xs ml-9 mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {resultado.mensaje}
            </p>
        </div>
    )
}

function FloatingCamera() {
    const webcamRef = useRef(null)
    const location = useLocation()
    const { camaraActiva, resultado, estado, mostrarResultado, cooldownRef } = useCamera()
    const [camaraDisponible, setCamaraDisponible] = useState(false)
    const [minimizada, setMinimizada] = useState(false)
    const [procesando, setProcesando] = useState(false)

    const enPaginaAcceso = location.pathname === '/acceso'
    const mostrarFlotante = camaraActiva && !enPaginaAcceso

    const capturarYValidar = useCallback(async () => {
        if (!webcamRef.current || cooldownRef.current || procesando || !camaraDisponible) return

        const imageSrc = webcamRef.current.getScreenshot()
        if (!imageSrc) return

        setProcesando(true)
        try {
            const blob = await fetch(imageSrc).then(r => r.blob())
            const formData = new FormData()
            formData.append('file', blob, 'captura.jpg')

            const response = await api.post('/facial/identificar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data.usuario) {
                mostrarResultado(response.data)
            }
        } catch (error) {
            console.error('Error en reconocimiento flotante:', error)
        } finally {
            setProcesando(false)
        }
    }, [webcamRef, procesando, camaraDisponible, mostrarResultado, cooldownRef])

    useEffect(() => {
        if (!mostrarFlotante) return
        const intervalo = setInterval(capturarYValidar, 2500)
        return () => clearInterval(intervalo)
    }, [mostrarFlotante, capturarYValidar])

    if (!mostrarFlotante) return (
        <Notificacion resultado={resultado} estado={estado} />
    )

    return (
        <>
            {/* Cámara flotante */}
            <div
                className="fixed rounded-2xl overflow-hidden"
                style={{
                    bottom: '24px',
                    right: '24px',
                    width: minimizada ? '60px' : '220px',
                    background: 'rgba(13,13,13,0.95)',
                    border: `1px solid ${estado === 'denegado' ? '#ef444440' : '#00c87840'}`,
                    backdropFilter: 'blur(20px)',
                    zIndex: 100,
                    transition: 'all 0.3s',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-3 py-2"
                    style={{ borderBottom: minimizada ? 'none' : '1px solid #1a1a1a' }}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{
                                background: camaraDisponible ? '#00c878' : '#555',
                                boxShadow: camaraDisponible ? '0 0 6px #00c878' : 'none'
                            }}
                        />
                        {!minimizada && (
                            <span className="font-ubuntu text-xs" style={{ color: '#555' }}>
                                {procesando ? 'Analizando...' : 'En vivo'}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setMinimizada(prev => !prev)}
                        className="font-ubuntu text-xs"
                        style={{ color: '#555' }}
                    >
                        {minimizada ? '⬆' : '⬇'}
                    </button>
                </div>

                {/* Video */}
                {!minimizada && (
                    <div style={{ aspectRatio: '4/3', background: '#000' }}>
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            screenshotQuality={0.7}
                            className="w-full h-full object-cover"
                            onUserMedia={() => setCamaraDisponible(true)}
                            onUserMediaError={() => setCamaraDisponible(false)}
                            style={{ display: 'block' }}
                        />
                    </div>
                )}
            </div>

            {/* Notificación */}
            <Notificacion resultado={resultado} estado={estado} />
        </>
    )
}

export default FloatingCamera