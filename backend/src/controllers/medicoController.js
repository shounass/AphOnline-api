import Medico from "../models/medicoModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. Registrar Médico (Nuevo)
export const registrarMedico = async (req, res) => {
  try {
    const { documento, nombre, apellido, especialidad, numeroLicencia, email, password, telefono, consultorio } = req.body;

    // Validar existencia
    const existe = await Medico.findOne({ email });
    if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoMedico = new Medico({
      documento, nombre, apellido, especialidad, numeroLicencia, email, telefono, consultorio,
      password: passwordHash,
      rol: "medico",
      foto: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png" // Avatar de doctor por defecto
    });

    await nuevoMedico.save();
    res.status(201).json({ msg: "Médico registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar médico" });
  }
};

// 2. Login Médico (Nuevo)
export const loginMedico = async (req, res) => {
  try {
    const { email, password } = req.body;

    const medico = await Medico.findOne({ email });
    if (!medico) return res.status(404).json({ msg: "Médico no encontrado" });

    const passwordOK = await bcrypt.compare(password, medico.password);
    if (!passwordOK) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Token con Rol de Médico
    const token = jwt.sign(
      { id: medico._id, rol: "medico" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ msg: "Login exitoso", medico, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el login" });
  }
};

// 3. Obtener todos (Ya existía, lo dejamos para el select del paciente)
export const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Medico.find({ estado: true }).select("-password");
    res.json(medicos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener médicos" });
  }
};