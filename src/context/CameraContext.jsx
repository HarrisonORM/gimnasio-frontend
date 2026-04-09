import { createContext, useContext, useState, useRef, useCallback } from 'react'

const CameraContext = createContext()

export function CameraProvider({ children }) {
    const [camaraActiva, setCamaraActiva] = useState(false)
    const [resultado, setResultado] = useState(null)
    const [estado, setEstado] = useState('esperando')
    const cooldownRef = useRef(false)

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

    const toggleCamara = () => setCamaraActiva(prev => !prev)

    return (
        <CameraContext.Provider value={{
            camaraActiva,
            toggleCamara,
            resultado,
            estado,
            mostrarResultado,
            cooldownRef
        }}>
            {children}
        </CameraContext.Provider>
    )
}

export function useCamera() {
    return useContext(CameraContext)
}