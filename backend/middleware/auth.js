import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  // 1. Leer el token del header
  const token = req.header("Authorization");

  // 2. Revisar si no hay token
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no válido" });
  }

  try {
    // 3. Limpiar el token (quitar la palabra "Bearer " si el frontend la envía)
    // Si tu frontend envía "Bearer eyJhb...", nos quedamos solo con el código.
    const tokenReal = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

    // 4. Verificar el token
    const cifrado = jwt.verify(tokenReal, process.env.JWT_SECRET);

    // 5. Guardar el usuario en el request para usarlo en el controlador
    req.usuario = cifrado;
    
    next(); // Pasar al siguiente paso (el controlador)
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};

export default auth;