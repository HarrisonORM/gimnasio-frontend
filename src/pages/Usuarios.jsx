import { useState, useEffect } from 'react'
import api from '../services/api'

const IconUsuario = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconBuscar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconCerrar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const IconEditar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const IconVer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const IconMas = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

function estadoUsuario(usuario) {
  if (!usuario.membresia && !usuario.tiquetera) {
    return { label: 'Sin plan', color: '#555', bg: '#55555515', border: '#55555530' }
  }
  if (usuario.membresia?.activa) {
    return { label: 'Activo', color: '#00c878', bg: '#00c87815', border: '#00c87830' }
  }
  if (usuario.tiquetera?.activa) {
    const restantes = usuario.tiquetera.entradas_totales - usuario.tiquetera.entradas_usadas
    return { label: `${restantes} entradas`, color: '#3b82f6', bg: '#3b82f615', border: '#3b82f630' }
  }
  return { label: 'Vencido', color: '#ef4444', bg: '#ef444415', border: '#ef444430' }
}

function BadgeEstado({ usuario }) {
  const estado = estadoUsuario(usuario)
  return (
    <span
      className="font-ubuntu text-xs px-3 py-1 rounded-full"
      style={{ color: estado.color, background: estado.bg, border: `1px solid ${estado.border}` }}
    >
      {estado.label}
    </span>
  )
}

function PanelDetalle({ usuario, onCerrar, onRenovar }) {
  const [historial, setHistorial] = useState([])
  const [membresia, setMembresia] = useState(null)
  const [tiquetera, setTiquetera] = useState(null)

  useEffect(() => {
    if (usuario) cargarDetalle()
  }, [usuario])

  const cargarDetalle = async () => {
    try {
      const [histRes] = await Promise.all([
        api.get(`/ingresos/${usuario.id}`)
      ])
      setHistorial(histRes.data)

      try {
        const membRes = await api.get(`/usuarios/${usuario.id}/membresia`)
        setMembresia(membRes.data)
      } catch { setMembresia(null) }

      try {
        const tiqRes = await api.get(`/usuarios/${usuario.id}/tiquetera`)
        setTiquetera(tiqRes.data)
      } catch { setTiquetera(null) }

    } catch (error) {
      console.error(error)
    }
  }

  if (!usuario) return null

  return (
    <div
      className="fixed top-0 right-0 h-full w-96 overflow-y-auto"
      style={{
        background: 'rgba(13,13,13,0.97)',
        borderLeft: '1px solid #1a1a1a',
        backdropFilter: 'blur(20px)',
        zIndex: 50
      }}
    >
      {/* Header del panel */}
      <div
        className="flex items-center justify-between p-6"
        style={{ borderBottom: '1px solid #1a1a1a' }}
      >
        <h2 className="font-ubuntuc text-xl" style={{ color: '#00c878' }}>
          DETALLE
        </h2>
        <button
          onClick={onCerrar}
          className="p-2 rounded-xl transition-all duration-200"
          style={{ color: '#555' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#555'}
        >
          <IconCerrar />
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* Foto y datos básicos */}
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: '#00c87820', border: '2px solid #00c87840' }}
          >
            <div style={{ color: '#00c878' }}>
              <IconUsuario />
            </div>
          </div>
          <h3 className="font-ubuntuc text-2xl text-white">
            {usuario.nombre} {usuario.apellido}
          </h3>
          <p className="font-ubuntu text-sm mt-1" style={{ color: '#555' }}>
            {usuario.email}
          </p>
          {usuario.telefono && (
            <p className="font-ubuntu text-sm mt-0.5" style={{ color: '#555' }}>
              {usuario.telefono}
            </p>
          )}
          <div className="mt-3">
            <BadgeEstado usuario={usuario} />
          </div>
        </div>

        {/* Membresía */}
        {membresia && (
          <div
            className="rounded-xl p-4"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}
          >
            <p className="font-ubuntu text-xs uppercase tracking-widest mb-3" style={{ color: '#555' }}>
              Membresía Activa
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>Inicio</span>
                <span className="font-ubuntu text-sm text-white">
                  {new Date(membresia.fecha_inicio).toLocaleDateString('es-CO')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>Vencimiento</span>
                <span className="font-ubuntu text-sm" style={{ color: '#00c878' }}>
                  {new Date(membresia.fecha_fin).toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tiquetera */}
        {tiquetera && (
          <div
            className="rounded-xl p-4"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}
          >
            <p className="font-ubuntu text-xs uppercase tracking-widest mb-3" style={{ color: '#555' }}>
              Tiquetera
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>Entradas usadas</span>
                <span className="font-ubuntu text-sm text-white">
                  {tiquetera.entradas_usadas} / {tiquetera.entradas_totales}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>Disponibles</span>
                <span className="font-ubuntu text-sm" style={{ color: '#3b82f6' }}>
                  {tiquetera.entradas_totales - tiquetera.entradas_usadas}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>Vence</span>
                <span className="font-ubuntu text-sm text-white">
                  {new Date(tiquetera.fecha_vencimiento).toLocaleDateString('es-CO')}
                </span>
              </div>
              {/* Barra de progreso */}
              <div
                className="rounded-full mt-2"
                style={{ background: '#1a1a1a', height: '6px' }}
              >
                <div
                  className="rounded-full h-full transition-all duration-500"
                  style={{
                    width: `${(tiquetera.entradas_usadas / tiquetera.entradas_totales) * 100}%`,
                    background: '#3b82f6'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Botón renovar */}
        <button
          onClick={() => onRenovar(usuario)}
          className="w-full font-ubuntuc tracking-wider py-3 rounded-xl transition-all duration-200"
          style={{ background: '#00c878', color: '#000', fontSize: '16px' }}
          onMouseEnter={e => e.currentTarget.style.background = '#00a86b'}
          onMouseLeave={e => e.currentTarget.style.background = '#00c878'}
        >
          RENOVAR / CAMBIAR PLAN
        </button>

        {/* Historial */}
        <div>
          <p className="font-ubuntu text-xs uppercase tracking-widest mb-3" style={{ color: '#555' }}>
            Últimos Ingresos
          </p>
          {historial.length === 0 ? (
            <p className="font-ubuntu text-sm text-center py-4" style={{ color: '#333' }}>
              Sin ingresos registrados
            </p>
          ) : (
            <div className="space-y-2">
              {historial.slice(0, 8).map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: '#111', border: '1px solid #1a1a1a' }}
                >
                  <p className="font-ubuntu text-xs" style={{ color: '#555' }}>
                    {new Date(ing.fecha_hora).toLocaleDateString('es-CO')} ·{' '}
                    {new Date(ing.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span
                    className="font-ubuntu text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: ing.permitido ? '#00c878' : '#ef4444',
                      background: ing.permitido ? '#00c87815' : '#ef444415'
                    }}
                  >
                    {ing.permitido ? 'Permitido' : 'Denegado'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function ModalNuevoUsuario({ onCerrar, onCreado, planes }) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: ''
  })
  const [planId, setPlanId] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const usuarioRes = await api.post('/usuarios/', form)
      const usuarioId = usuarioRes.data.id

      if (planId) {
        const planSeleccionado = planes.find(p => p.id === parseInt(planId))
        if (planSeleccionado?.nombre === 'Tiquetera') {
          await api.post(`/usuarios/${usuarioId}/tiquetera`)
        } else {
          await api.post(`/usuarios/${usuarioId}/membresia`, { plan_id: parseInt(planId) })
        }
      }
      onCreado()
      onCerrar()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el usuario')
    } finally {
      setCargando(false)
    }
  }

  const inputStyle = {
    background: '#0d0d0d',
    border: '1px solid #1f1f1f',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    fontFamily: 'Ubuntu, sans-serif',
    fontSize: '14px'
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', zIndex: 100 }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: '#111', border: '1px solid #1a1a1a' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-ubuntuc text-2xl" style={{ color: '#00c878' }}>
            NUEVO USUARIO
          </h2>
          <button onClick={onCerrar} style={{ color: '#555' }}>
            <IconCerrar />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-ubuntu text-xs uppercase tracking-wider block mb-2" style={{ color: '#555' }}>
                Nombre
              </label>
              <input
                style={inputStyle}
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                required
                onFocus={e => e.target.style.borderColor = '#00c878'}
                onBlur={e => e.target.style.borderColor = '#1f1f1f'}
              />
            </div>
            <div>
              <label className="font-ubuntu text-xs uppercase tracking-wider block mb-2" style={{ color: '#555' }}>
                Apellido
              </label>
              <input
                style={inputStyle}
                value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })}
                required
                onFocus={e => e.target.style.borderColor = '#00c878'}
                onBlur={e => e.target.style.borderColor = '#1f1f1f'}
              />
            </div>
          </div>

          <div>
            <label className="font-ubuntu text-xs uppercase tracking-wider block mb-2" style={{ color: '#555' }}>
              Email
            </label>
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              onFocus={e => e.target.style.borderColor = '#00c878'}
              onBlur={e => e.target.style.borderColor = '#1f1f1f'}
            />
          </div>

          <div>
            <label className="font-ubuntu text-xs uppercase tracking-wider block mb-2" style={{ color: '#555' }}>
              Teléfono
            </label>
            <input
              style={inputStyle}
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#00c878'}
              onBlur={e => e.target.style.borderColor = '#1f1f1f'}
            />
          </div>

          <div>
            <label className="font-ubuntu text-xs uppercase tracking-wider block mb-2" style={{ color: '#555' }}>
              Plan
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={planId}
              onChange={e => setPlanId(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#00c878'}
              onBlur={e => e.target.style.borderColor = '#1f1f1f'}
            >
              <option value="">Sin plan por ahora</option>
              {planes.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre} — ${plan.precio.toLocaleString('es-CO')} COP
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: '#ef444415', border: '1px solid #ef444430' }}
            >
              <p className="font-ubuntu text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full font-ubuntuc tracking-wider py-3 rounded-xl transition-all duration-200 mt-2"
            style={{
              background: cargando ? '#035c34' : '#00c878',
              color: '#000',
              fontSize: '18px',
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            {cargando ? 'Registrando...' : 'REGISTRAR'}
          </button>
        </form>
      </div>
    </div>
  )
}

function ModalRenovar({ usuario, planes, onCerrar, onRenovado }) {
  const [planId, setPlanId] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleRenovar = async () => {
    if (!planId) return
    setCargando(true)
    setError('')
    try {
      const planSeleccionado = planes.find(p => p.id === parseInt(planId))
      if (planSeleccionado?.nombre === 'Tiquetera') {
        await api.post(`/usuarios/${usuario.id}/tiquetera`)
      } else {
        await api.post(`/usuarios/${usuario.id}/membresia`, { plan_id: parseInt(planId) })
      }
      onRenovado()
      onCerrar()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al renovar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', zIndex: 100 }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: '#111', border: '1px solid #1a1a1a' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-ubuntuc text-xl" style={{ color: '#00c878' }}>
            RENOVAR PLAN
          </h2>
          <button onClick={onCerrar} style={{ color: '#555' }}>
            <IconCerrar />
          </button>
        </div>

        <p className="font-ubuntu text-sm mb-6" style={{ color: '#555' }}>
          Selecciona el nuevo plan para{' '}
          <span className="text-white">{usuario.nombre} {usuario.apellido}</span>
        </p>

        <div className="space-y-2 mb-6">
          {planes.map(plan => (
            <button
              key={plan.id}
              onClick={() => setPlanId(plan.id.toString())}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
              style={{
                background: planId === plan.id.toString() ? '#00c87820' : '#0d0d0d',
                border: `1px solid ${planId === plan.id.toString() ? '#00c87840' : '#1f1f1f'}`,
                color: planId === plan.id.toString() ? '#00c878' : '#555'
              }}
            >
              <span className="font-ubuntu text-sm">{plan.nombre}</span>
              <span className="font-ubuntu text-sm">
                ${plan.precio.toLocaleString('es-CO')} COP
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-4"
            style={{ background: '#ef444415', border: '1px solid #ef444430' }}
          >
            <p className="font-ubuntu text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleRenovar}
          disabled={!planId || cargando}
          className="w-full font-ubuntuc tracking-wider py-3 rounded-xl transition-all duration-200"
          style={{
            background: !planId || cargando ? '#035c34' : '#00c878',
            color: '#000',
            fontSize: '18px',
            cursor: !planId || cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? 'Renovando...' : 'CONFIRMAR'}
        </button>
      </div>
    </div>
  )
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [planes, setPlanes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [cargando, setCargando] = useState(true)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [usuarioRenovar, setUsuarioRenovar] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [usuariosRes, planesRes] = await Promise.all([
        api.get('/usuarios/'),
        api.get('/planes')
      ])
      
      const usuariosConDetalle = await Promise.all(
        usuariosRes.data.map(async (u) => {
          let membresia = null
          let tiquetera = null
          try { membresia = (await api.get(`/usuarios/${u.id}/membresia`)).data } catch {}
          try { tiquetera = (await api.get(`/usuarios/${u.id}/tiquetera`)).data } catch {}
          return { ...u, membresia, tiquetera }
        })
      )

      setUsuarios(usuariosConDetalle)
      setPlanes(planesRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase()
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase())

    if (!coincideBusqueda) return false
    if (filtro === 'todos') return true
    if (filtro === 'activos') return u.membresia?.activa
    if (filtro === 'vencidos') return !u.membresia?.activa && !u.tiquetera?.activa && (u.membresia || u.tiquetera)
    if (filtro === 'tiquetera') return u.tiquetera?.activa
    if (filtro === 'sinplan') return !u.membresia && !u.tiquetera
    return true
  })

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full"
          style={{ borderColor: '#00c878', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
        />
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
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 0 }} />

      <div className="max-w-screen-xl mx-auto px-8 py-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-ubuntuc text-5xl" style={{ color: '#00c878' }}>USUARIOS</h1>
            <p className="font-ubuntu text-sm mt-1" style={{ color: '#444' }}>
              {usuarios.length} miembros registrados
            </p>
          </div>
          <button
            onClick={() => setMostrarNuevo(true)}
            className="flex items-center gap-2 font-ubuntu px-5 py-3 rounded-xl transition-all duration-200"
            style={{ background: '#00c878', color: '#000' }}
            onMouseEnter={e => e.currentTarget.style.background = '#00a86b'}
            onMouseLeave={e => e.currentTarget.style.background = '#00c878'}
          >
            <IconMas />
            Nuevo Usuario
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1"
            style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid #1a1a1a', minWidth: '200px' }}
          >
            <div style={{ color: '#555' }}><IconBuscar /></div>
            <input
              className="bg-transparent outline-none font-ubuntu text-sm flex-1"
              style={{ color: 'white' }}
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          {['todos', 'activos', 'vencidos', 'tiquetera', 'sinplan'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="font-ubuntu text-xs px-4 py-2 rounded-xl uppercase tracking-wider transition-all duration-200"
              style={{
                background: filtro === f ? '#00c878' : 'rgba(17,17,17,0.85)',
                color: filtro === f ? '#000' : '#555',
                border: `1px solid ${filtro === f ? '#00c878' : '#1a1a1a'}`
              }}
            >
              {f === 'todos' ? 'Todos' :
               f === 'activos' ? 'Activos' :
               f === 'vencidos' ? 'Vencidos' :
               f === 'tiquetera' ? 'Tiquetera' : 'Sin plan'}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(17,17,17,0.85)', border: '1px solid #1a1a1a', backdropFilter: 'blur(10px)' }}
        >
          {/* Header tabla */}
          <div
            className="grid px-6 py-3"
            style={{
              gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr',
              borderBottom: '1px solid #1a1a1a'
            }}
          >
            {['Nombre', 'Email', 'Plan', 'Vencimiento', 'Acciones'].map(h => (
              <span key={h} className="font-ubuntu text-xs uppercase tracking-widest" style={{ color: '#444' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Filas */}
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-ubuntu text-sm" style={{ color: '#333' }}>
                No se encontraron usuarios
              </p>
            </div>
          ) : (
            usuariosFiltrados.map((usuario, i) => (
              <div
                key={usuario.id}
                className="grid px-6 py-4 items-center transition-all duration-200"
                style={{
                  gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr',
                  borderBottom: i < usuariosFiltrados.length - 1 ? '1px solid #1a1a1a' : 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ffffff08'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#00c87820', color: '#00c878' }}
                  >
                    <IconUsuario />
                  </div>
                  <span className="font-ubuntu text-sm text-white">
                    {usuario.nombre} {usuario.apellido}
                  </span>
                </div>

                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>
                  {usuario.email}
                </span>

                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>
                  {usuario.membresia?.activa
                    ? 'Membresía'
                    : usuario.tiquetera?.activa
                    ? 'Tiquetera'
                    : '—'}
                </span>

                <span className="font-ubuntu text-sm" style={{ color: '#555' }}>
                  {usuario.membresia?.activa
                    ? new Date(usuario.membresia.fecha_fin).toLocaleDateString('es-CO')
                    : usuario.tiquetera?.activa
                    ? new Date(usuario.tiquetera.fecha_vencimiento).toLocaleDateString('es-CO')
                    : '—'}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setUsuarioSeleccionado(usuario)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ color: '#555', border: '1px solid #1a1a1a' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#00c878'; e.currentTarget.style.borderColor = '#00c87840' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#1a1a1a' }}
                  >
                    <IconVer />
                  </button>
                  <button
                    onClick={() => setUsuarioRenovar(usuario)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ color: '#555', border: '1px solid #1a1a1a' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#00c878'; e.currentTarget.style.borderColor = '#00c87840' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#1a1a1a' }}
                  >
                    <IconEditar />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Panel de detalle */}
      {usuarioSeleccionado && (
        <PanelDetalle
          usuario={usuarioSeleccionado}
          onCerrar={() => setUsuarioSeleccionado(null)}
          onRenovar={(u) => { setUsuarioSeleccionado(null); setUsuarioRenovar(u) }}
        />
      )}

      {/* Modal nuevo usuario */}
      {mostrarNuevo && (
        <ModalNuevoUsuario
          onCerrar={() => setMostrarNuevo(false)}
          onCreado={cargarDatos}
          planes={planes}
        />
      )}

      {/* Modal renovar */}
      {usuarioRenovar && (
        <ModalRenovar
          usuario={usuarioRenovar}
          planes={planes}
          onCerrar={() => setUsuarioRenovar(null)}
          onRenovado={cargarDatos}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Usuarios