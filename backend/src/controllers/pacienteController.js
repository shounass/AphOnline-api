import Paciente from "../models/pacienteModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================
   1. REGISTRO DE PACIENTE
   (Incluye lógica de Avatar Automático)
============================================ */
export const registrarPaciente = async (req, res) => {
  try {
    const {
      tipoDocumento, documento, password, nombre, apellido,
      fechaNacimiento, sexo, eps, estrato, ciudad, estadoCivil, ocupacion,
      telefono, email, direccion, rh,
      enfermedades, alergias, tratamientos
    } = req.body;

    // Validar campos obligatorios (incluyendo los nuevos)
    if (!documento || !password || !nombre || !apellido || !fechaNacimiento || !sexo || !eps || !estrato) {
      return res.status(400).json({ msg: "Faltan datos obligatorios." });
    }

    // Verificar si ya existe
    const existe = await Paciente.findOne({ documento });
    if (existe) {
      return res.status(400).json({ msg: "El documento ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // --- LÓGICA DE AVATAR AUTOMÁTICO ---
    let avatarPorDefecto = "";
    if (sexo === "Femenino") {
      avatarPorDefecto = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"; // Mujer
    } else if (sexo === "Masculino") {
      avatarPorDefecto = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; // Hombre
    } else {
      avatarPorDefecto = "https://cdn-icons-png.flaticon.com/512/4140/4140037.png"; // Neutro
    }

    // Crear el paciente
    const nuevoPaciente = new Paciente({
      tipoDocumento, documento, password: passwordHash, nombre, apellido,
      fechaNacimiento, sexo, eps, estrato, ciudad, estadoCivil, ocupacion,
      telefono, email, direccion, rh,
      foto: avatarPorDefecto, // Guardamos el avatar automático
      biografia: `Paciente afiliado a ${eps}`,
      enfermedades, alergias, tratamientos,
      rol: "paciente"
    });

    const pacienteGuardado = await nuevoPaciente.save();

    // Generar Token
    const token = jwt.sign(
      { id: pacienteGuardado._id, rol: "paciente" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(201).json({
      msg: "Paciente registrado exitosamente",
      paciente: pacienteGuardado,
      token
    });

  } catch (error) {
    console.error("Error en registrarPaciente:", error);
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};

/* ============================================
   2. LOGIN DE PACIENTE
============================================ */
export const loginPaciente = async (req, res) => {
  try {
    const { documento, password } = req.body;

    const paciente = await Paciente.findOne({ documento });
    if (!paciente) {
      return res.status(400).json({ msg: "Documento no encontrado" });
    }

    const passwordOK = await bcrypt.compare(password, paciente.password);
    if (!passwordOK) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: paciente._id, rol: paciente.rol },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      msg: "Login exitoso",
      paciente,
      token
    });

  } catch (error) {
    console.error("Error en loginPaciente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/* ============================================
   3. OBTENER PERFIL (Ver mis datos)
============================================ */
export const obtenerPerfil = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.usuario.id).select("-password");
    if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado" });
    res.json(paciente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener perfil" });
  }
};

/* ============================================
   4. ACTUALIZAR PERFIL (Editar datos)
============================================ */
export const actualizarPerfil = async (req, res) => {
  try {
    // Permitimos editar datos de contacto, biografía y foto
    const { 
      telefono, direccion, email, biografia, foto,
      estadoCivil, ocupacion, ciudad // Agregamos estos por si se mudan o cambian
    } = req.body;
    
    const pacienteActualizado = await Paciente.findByIdAndUpdate(
      req.usuario.id,
      { telefono, direccion, email, biografia, foto, estadoCivil, ocupacion, ciudad },
      { new: true }
    ).select("-password");

    res.json({ msg: "Perfil actualizado correctamente", paciente: pacienteActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar perfil" });
  }
};