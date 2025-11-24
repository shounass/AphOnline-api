import Paciente from "../models/pacienteModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================
   1. REGISTRO DE PACIENTE (DIRECTO)
============================================ */
export const registrarPaciente = async (req, res) => {
  try {
    const {
      tipoDocumento, documento, password, nombre, apellido,
      fechaNacimiento, sexo, eps, estrato, ciudad, estadoCivil, ocupacion,
      telefono, email, direccion, rh,
      enfermedades, alergias, tratamientos
    } = req.body;

    // Validaciones básicas
    if (!documento || !password || !nombre || !apellido || !email) {
      return res.status(400).json({ msg: "Faltan datos obligatorios." });
    }

    // Verificar duplicados
    const existeDoc = await Paciente.findOne({ documento });
    if (existeDoc) return res.status(400).json({ msg: "Documento ya registrado" });

    const existeEmail = await Paciente.findOne({ email });
    if (existeEmail) return res.status(400).json({ msg: "Correo ya registrado" });

    // Encriptar
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Avatar
    let avatar = "https://cdn-icons-png.flaticon.com/512/4140/4140037.png";
    if (sexo === "Femenino") avatar = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";
    if (sexo === "Masculino") avatar = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";

    const nuevoPaciente = new Paciente({
      tipoDocumento, documento, password: passwordHash, nombre, apellido,
      fechaNacimiento, sexo, eps, estrato, ciudad, estadoCivil, ocupacion,
      telefono, email, direccion, rh,
      foto: avatar,
      biografia: `Paciente afiliado a ${eps}`,
      enfermedades, alergias, tratamientos,
      rol: "paciente",
      confirmado: true, // <--- DIRECTO ACTIVO
      tokenConfirmacion: ""
    });

    await nuevoPaciente.save();

    // Opcional: Devolver token de una vez si quieres login automático
    res.status(201).json({
      msg: "Paciente registrado exitosamente. Ya puedes iniciar sesión.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar." });
  }
};

/* ============================================
   2. CONFIRMAR CUENTA (Ya no es necesaria pero la dejamos para no romper rutas)
============================================ */
export const confirmarCuenta = async (req, res) => {
  res.json({ msg: "Cuenta confirmada automáticamente." });
};

/* ============================================
   3. LOGIN DE PACIENTE (SIN RESTRICCIÓN)
============================================ */
export const loginPaciente = async (req, res) => {
  try {
    const { documento, password } = req.body;
    const paciente = await Paciente.findOne({ documento });

    if (!paciente) return res.status(404).json({ msg: "Documento no encontrado" });

    // --- ELIMINAMOS EL BLOQUEO DE 'confirmado' ---
    // if (!paciente.confirmado) ... (YA NO VA)

    const passwordOK = await bcrypt.compare(password, paciente.password);
    if (!passwordOK) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: paciente._id, rol: paciente.rol },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({ msg: "Login exitoso", paciente, token });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// --- RESTO DE FUNCIONES (IGUALES) ---
export const obtenerPerfil = async (req, res) => { try { const p = await Paciente.findById(req.usuario.id).select("-password"); res.json(p); } catch (e) { res.status(500).json({msg:"Error"}); } };
export const actualizarPerfil = async (req, res) => { try { const p = await Paciente.findByIdAndUpdate(req.usuario.id, req.body, {new:true}).select("-password"); res.json({msg:"Ok", paciente:p}); } catch (e) { res.status(500).json({msg:"Error"}); } };
export const buscarPorDocumento = async (req, res) => { try { const p = await Paciente.findOne({documento: req.params.documento}).select("-password"); if(!p) return res.status(404).json({msg:"No existe"}); res.json(p); } catch (e) { res.status(500).json({msg:"Error"}); } };
export const actualizarPacientePorId = async (req, res) => { try { const p = await Paciente.findByIdAndUpdate(req.params.id, req.body, {new:true}).select("-password"); res.json({msg:"Ok", paciente:p}); } catch (e) { res.status(500).json({msg:"Error"}); } };