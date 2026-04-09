import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import api from '../services/api'

const IconCheck = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const IconX = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)

const IconBorrar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
    <line x1="18" y1="9" x2="12" y2="15"/>
    <line x1="12" y1="9" x2="18" y2="15"/>
  </svg>
)

function ResultadoOverlay({ estado, resultado }) {
  if (estado === 'esperando') return null

  const permitido = estado === 'permitido'

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: permitido ? 'rgba(0,200,120,0.15)' : 'rgba(239,68,68,0.15)',
        zIndex: 10
      }}
    >
      <div style={{ color: permitido ? '#00c878' : '#ef4444' }}>
        {permitido ? <IconCheck /> : <IconX />}
      </div>
    </div>
  )
}

function TecladoNumerico({ cedula, onChange, onConfirmar, onBorrar, cargando }) {
  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓']

  const handleTecla = (tecla) => {
    if (tecla === 'C') {
      onBorrar()
    } else if (tecla === '✓') {
      if (cedula.length > 0) onConfirmar()
    } else {
      if (cedula.length < 12) onChange(cedula + tecla)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') onChange(prev => prev.length < 12 ? prev + e.key : prev)
      if (e.key === 'Backspace') onBorrar()
      if (e.key === 'Enter' && cedula.length > 0) onConfirmar()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cedula])

  return (
    <div className="space-y-4">
      <div>
        <p className="font-ubuntu text-xs uppercase tracking-widest mb-2" style={{ color: '#555' }}>
          Ingreso por cédula
        </p>

        {/* Display de cédula */}
        <div
          className="rounded-xl px-4 py-3 text-center font-ubuntuc text-2xl tracking-widest mb-4"
          style={{
            background: '#0d0d0d',
            border: '1px solid #1f1f1f',
            color: cedula ? 'white' : '#333',
            minHeight: '56px'
          }}
        >
          {cedula || '_ _ _ _ _ _ _ _ _ _'}
        </div>

        {/* Teclado */}
        <div className="grid grid-cols-3 gap-2">
          {teclas.map((tecla) => (
            <button
              key={tecla}
              type="button"
              onClick={() => handleTecla(tecla)}
              disabled={cargando}
              className="font-ubuntuc py-4 rounded-xl transition-all duration-150 text-lg"
              style={{
                background: tecla === '✓'
                  ? (cedula.length > 0 ? '#00c878' : '#1a1a1a')
                  : tecla === 'C'
                  ? '#1a1a1a'
                  : '#0d0d0d',
                color: tecla === '✓'
                  ? (cedula.length > 0 ? '#000' : '#333')
                  : tecla === 'C'
                  ? '#ef4444'
                  : 'white',
                border: `1px solid ${tecla === '✓' && cedula.length > 0 ? '#00c87840' : '#1f1f1f'}`,
                cursor: cargando ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={e => {
                if (!cargando && tecla !== '✓') {
                  e.currentTarget.style.background = '#1a1a1a'
                }
              }}
              onMouseLeave={e => {
                if (tecla === '✓') {
                  e.currentTarget.style.background = cedula.length > 0 ? '#00c878' : '#1a1a1a'
                } else if (tecla === 'C') {
                  e.currentTarget.style.background = '#1a1a1a'
                } else {
                  e.currentTarget.style.background = '#0d0d0d'
                }
              }}
            >
              {tecla === 'C' ? <span className="flex items-center justify-center"><IconBorrar /></span> : tecla}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Acceso() {
  const webcamRef = useRef(null)
  const intervaloRef = useRef(null)
  const cooldownRef = useRef(false)

  const [estado, setEstado] = useState('esperando')
  const [resultado, setResultado] = useState(null)
  const [camaraActiva, setCamaraActiva] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [cedula, setCedula] = useState('')
  const [cargandoCedula, setCargandoCedula] = useState(false)

  const mostrarResultado = useCallback((data) => {
    setResultado(data)
    setEstado(data.permitido ? 'permitido' : 'denegado')
    cooldownRef.current = true

    setTimeout(() => {
      setEstado('esperando')
      setResultado(null)
      cooldownRef.current = false
    }, 4000)
  }, [])

  const capturarYValidar = useCallback(async () => {
    if (
      !webcamRef.current ||
      cooldownRef.current ||
      procesando ||
      !camaraActiva
    ) return

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
      console.error('Error en reconocimiento:', error)
    } finally {
      setProcesando(false)
    }
  }, [webcamRef, procesando, camaraActiva, mostrarResultado])

  const handleCedulaConfirmar = async () => {
    if (!cedula || cargandoCedula) return
    setCargandoCedula(true)
    try {
      const response = await api.post(`/acceso/cedula/${cedula}`)
      mostrarResultado(response.data)
      setCedula('')
    } catch (error) {
      mostrarResultado({
        permitido: false,
        mensaje: 'Error al verificar la cédula',
        usuario: null
      })
    } finally {
      setCargandoCedula(false)
    }
  }

  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      capturarYValidar()
    }, 2500)

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current)
    }
  }, [capturarYValidar])

  const colorEstado = estado === 'denegado' ? '#ef4444' : '#00c878'

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/src/assets/gym-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 0 }} />

      <div className="max-w-screen-xl mx-auto px-8 py-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="font-ubuntuc text-5xl" style={{ color: '#00c878' }}>ACCESO</h1>
          <p className="font-ubuntu text-sm mt-1" style={{ color: '#444' }}>
            Detección automática activa — o ingresa tu cédula
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Panel izquierdo — Cámara */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(17,17,17,0.85)',
              border: `1px solid ${colorEstado}40`,
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.3s'
            }}
          >
            {/* Header cámara */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #1a1a1a' }}
            >
              <span className="font-ubuntuc text-lg tracking-wider" style={{ color: '#00c878' }}>
                DETECCIÓN AUTOMÁTICA
              </span>
              <div className="flex items-center gap-2">
                {procesando && (
                  <span className="font-ubuntu text-xs" style={{ color: '#00c878' }}>
                    Analizando...
                  </span>
                )}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: camaraActiva ? '#00c878' : '#555',
                    boxShadow: camaraActiva ? '0 0 8px #00c878' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Video */}
            <div className="relative" style={{ aspectRatio: '4/3', background: '#000' }}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.8}
                className="w-full h-full object-cover"
                onUserMedia={() => setCamaraActiva(true)}
                onUserMediaError={() => setCamaraActiva(false)}
                style={{ display: 'block' }}
              />

              <ResultadoOverlay estado={estado} resultado={resultado} />

              {/* Marco de detección */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '15%', left: '20%',
                  width: '60%', height: '70%',
                  border: `2px solid ${colorEstado}50`,
                  borderRadius: '8px',
                  transition: 'border-color 0.3s'
                }}
              >
                {[
                  { top: -2, left: -2, borderTop: true, borderLeft: true },
                  { top: -2, right: -2, borderTop: true, borderRight: true },
                  { bottom: -2, left: -2, borderBottom: true, borderLeft: true },
                  { bottom: -2, right: -2, borderBottom: true, borderRight: true },
                ].map((esquina, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      ...esquina,
                      width: '20px',
                      height: '20px',
                      borderTop: esquina.borderTop ? `2px solid ${colorEstado}` : 'none',
                      borderLeft: esquina.borderLeft ? `2px solid ${colorEstado}` : 'none',
                      borderRight: esquina.borderRight ? `2px solid ${colorEstado}` : 'none',
                      borderBottom: esquina.borderBottom ? `2px solid ${colorEstado}` : 'none',
                      transition: 'border-color 0.3s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Estado resultado */}
            <div className="px-6 py-4">
              {estado === 'esperando' ? (
                <p className="font-ubuntu text-sm text-center" style={{ color: '#444' }}>
                  {camaraActiva
                    ? 'Posiciona tu rostro frente a la cámara'
                    : 'Esperando acceso a la cámara...'}
                </p>
              ) : (
                <div className="text-center">
                  <p
                    className="font-ubuntuc text-2xl"
                    style={{ color: colorEstado }}
                  >
                    {estado === 'permitido' ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
                  </p>
                  {resultado?.usuario && (
                    <p className="font-ubuntu text-white mt-1">
                      {resultado.usuario.nombre} {resultado.usuario.apellido}
                    </p>
                  )}
                  <p className="font-ubuntu text-xs mt-1" style={{ color: '#555' }}>
                    {resultado?.mensaje}
                  </p>
                  {resultado?.entradas_restantes !== undefined && (
                    <p className="font-ubuntu text-xs mt-1" style={{ color: '#3b82f6' }}>
                      Entradas restantes: {resultado.entradas_restantes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho — Teclado */}
          <div className="space-y-4">

            {/* Teclado numérico */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(17,17,17,0.85)',
                border: '1px solid #1a1a1a',
                backdropFilter: 'blur(10px)'
              }}
            >
              <TecladoNumerico
                cedula={cedula}
                onChange={setCedula}
                onConfirmar={handleCedulaConfirmar}
                onBorrar={() => setCedula(prev => prev.slice(0, -1))}
                cargando={cargandoCedula}
              />

              {/* Resultado cédula */}
              {cargandoCedula && (
                <div className="mt-4 text-center">
                  <p className="font-ubuntu text-sm" style={{ color: '#00c878' }}>
                    Verificando...
                  </p>
                </div>
              )}
            </div>

            {/* Instrucciones */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(17,17,17,0.85)',
                border: '1px solid #1a1a1a',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p className="font-ubuntu text-xs uppercase tracking-widest mb-4" style={{ color: '#444' }}>
                Instrucciones
              </p>
              <div className="space-y-3">
                {[
                  'La cámara te identifica automáticamente',
                  'Mira directamente a la cámara al llegar',
                  'Si la cámara falla, usa el teclado de cédula',
                  'Espera el resultado antes de pasar'
                ].map((inst, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-ubuntu text-xs"
                      style={{ background: '#00c87820', color: '#00c878' }}
                    >
                      {i + 1}
                    </div>
                    <p className="font-ubuntu text-sm" style={{ color: '#555' }}>{inst}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Acceso