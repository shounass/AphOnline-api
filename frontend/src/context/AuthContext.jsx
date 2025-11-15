import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Necesitaremos esto para redirigir

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  
  // --- NUEVO: Estados para la inactividad ---
  const [mostrarAlertaSesion, setMostrarAlertaSesion] = useState(false);
  
  // Referencias para los timers (para poder cancelarlos)
  const advertenciaTimerRef = useRef(null);
  const cierreTimerRef = useRef(null);

  // --- CONFIGURACIÓN DE TIEMPOS (En milisegundos) ---
  // Para pruebas rápidas usa: 10000 (10s) y 15000 (15s)
  // Para producción (30 min total): 
  // Advertencia a los 20 min (1200000 ms)
  // Cierre total a los 30 min (1800000 ms)
  const TIEMPO_ADVERTENCIA = 20 * 60 * 1000; 
  const TIEMPO_MAXIMO = 30 * 60 * 1000; 

  // --- FUNCIÓN DE LOGIN ---
  const login = (userData, userToken) => {
    setUsuario(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('usuario', JSON.stringify(userData));
    
    // Al iniciar sesión, arrancamos el reloj
    iniciarContadorInactividad();
  };

  // --- FUNCIÓN DE LOGOUT ---
  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    setMostrarAlertaSesion(false); // Ocultar modal si estaba abierto
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Limpiar timers al salir
    limpiarTimers();
    
    // Redirigir (opcional, si usas window.location es más brusco pero efectivo)
    window.location.href = '/login-paciente'; 
  }, []);

  // --- MANEJO DE TIMERS ---
  const limpiarTimers = () => {
    if (advertenciaTimerRef.current) clearTimeout(advertenciaTimerRef.current);
    if (cierreTimerRef.current) clearTimeout(cierreTimerRef.current);
  };

  const iniciarContadorInactividad = useCallback(() => {
    limpiarTimers(); // Limpiamos cualquier timer previo

    // 1. Programar la advertencia (Ej: a los 20 min)
    advertenciaTimerRef.current = setTimeout(() => {
      setMostrarAlertaSesion(true); // ¡Muestra el modal!
    }, TIEMPO_ADVERTENCIA);

    // 2. Programar el cierre forzoso (Ej: a los 30 min)
    cierreTimerRef.current = setTimeout(() => {
      logout(); // ¡Adios!
      alert("Tu sesión ha expirado por inactividad.");
    }, TIEMPO_MAXIMO);

  }, [logout, TIEMPO_ADVERTENCIA, TIEMPO_MAXIMO]);

  // --- FUNCIÓN PARA EXTENDER SESIÓN ---
  const extenderSesion = () => {
    setMostrarAlertaSesion(false); // Ocultar modal
    iniciarContadorInactividad(); // Reiniciar los relojes desde cero
  };

  // --- EFECTO PARA DETECTAR ACTIVIDAD (Opcional) ---
  // Si quieres que se reinicie solo con mover el mouse, descomenta esto:
  
  useEffect(() => {
    const eventos = ['click', 'keypress', 'scroll', 'mousemove'];
    const resetear = () => {
      if (usuario) iniciarContadorInactividad();
    };
    
    eventos.forEach(e => window.addEventListener(e, resetear));
    return () => eventos.forEach(e => window.removeEventListener(e, resetear));
  }, [usuario, iniciarContadorInactividad]);
  
  // Por ahora lo dejaremos MANUAL (solo botón extender) como pediste.

  // --- RECUPERAR SESIÓN AL RECARGAR ---
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
      iniciarContadorInactividad(); // Arrancar reloj si recarga la página
    }
  }, [iniciarContadorInactividad]);

  const value = {
    usuario,
    token,
    login,
    logout,
    mostrarAlertaSesion, // El modal usará esto
    extenderSesion       // El botón del modal usará esto
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext); // Export adicional por si acaso
export { AuthContext }; // Exportar el contexto por defecto