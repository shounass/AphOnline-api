import Usuario from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar si el usuario existe
    const userExistente = await Usuario.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHasheado = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHasheado,
      rol,
    });

    await nuevoUsuario.save();

    res.json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Validar contraseña
    const passOk = await bcrypt.compare(password, usuario.password);
    if (!passOk) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


