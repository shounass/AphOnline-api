import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  const [mostrarAlertaSesion, setMostrarAlertaSesion] = useState(false);
  const advertenciaTimerRef = useRef(null);
  const cierreTimerRef = useRef(null);

  const TIEMPO_ADVERTENCIA = 20 * 60 * 1000;
  const TIEMPO_MAXIMO = 30 * 60 * 1000;

  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    setMostrarAlertaSesion(false);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    limpiarTimers();
    window.location.href = "/";
  }, []);

  const limpiarTimers = () => {
    if (advertenciaTimerRef.current) clearTimeout(advertenciaTimerRef.current);
    if (cierreTimerRef.current) clearTimeout(cierreTimerRef.current);
  };

  const iniciarContadorInactividad = useCallback(() => {
    limpiarTimers();
    advertenciaTimerRef.current = setTimeout(() => {
      setMostrarAlertaSesion(true);
    }, TIEMPO_ADVERTENCIA);
    cierreTimerRef.current = setTimeout(() => {
      logout();
      alert("Tu sesión ha expirado por inactividad.");
    }, TIEMPO_MAXIMO);
  }, [logout, TIEMPO_ADVERTENCIA, TIEMPO_MAXIMO]);

  const login = (userData, userToken) => {
    setUsuario(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("usuario", JSON.stringify(userData));
    iniciarContadorInactividad();
  };

  const extenderSesion = () => {
    setMostrarAlertaSesion(false);
    iniciarContadorInactividad();
  };

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
      iniciarContadorInactividad();
    }
  }, [iniciarContadorInactividad]);

  const value = {
    usuario,
    token,
    login,
    logout,
    mostrarAlertaSesion,
    extenderSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
