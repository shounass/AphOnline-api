import Paciente from "../models/pacienteModel.js";
import Medico from "../models/medicoModel.js";
import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUnificado = async (req, res) => {
  try {
    // 'documento' es el nombre del campo que viene del frontend, 
    // pero puede contener un Cédula O un Email.
    const { documento, password } = req.body;

    // ==========================================================
    // CASO A: EL USUARIO INGRESÓ UN CORREO (@) -> Admin o Médico
    // ==========================================================
    if (documento.includes("@")) {
       
       // 1. ¿ES ADMIN?
       const admin = await Admin.findOne({ email: documento });
       if (admin) {
         const passwordOK = await bcrypt.compare(password, admin.password);
         if (passwordOK) {
           const token = jwt.sign({ id: admin._id, rol: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
           return res.json({ msg: "Bienvenido Jefe", usuario: admin, token, rol: "admin" });
         }
         return res.status(400).json({ msg: "Contraseña incorrecta" });
       }

       // 2. ¿ES MÉDICO?
       // Buscamos por EMAIL, no por documento
       const medico = await Medico.findOne({ email: documento });
       if (medico) {
         const passwordOK = await bcrypt.compare(password, medico.password);
         if (passwordOK) {
           const token = jwt.sign({ id: medico._id, rol: "medico" }, process.env.JWT_SECRET, { expiresIn: "12h" });
           return res.json({ msg: "Bienvenido Doctor(a)", usuario: medico, token, rol: "medico" });
         }
         return res.status(400).json({ msg: "Contraseña incorrecta" });
       }

    } 
    
    // ==========================================================
    // CASO B: EL USUARIO INGRESÓ UN NÚMERO -> Paciente
    // ==========================================================
    else {
      
      // 3. ¿ES PACIENTE?
      const paciente = await Paciente.findOne({ documento });
      if (paciente) {
        // Verificar bloqueo por correo no confirmado (Si decidiste dejarlo activo)
        // if (!paciente.confirmado) return res.status(403).json({ msg: "Cuenta no confirmada" });

        const passwordOK = await bcrypt.compare(password, paciente.password);
        if (passwordOK) {
          const token = jwt.sign({ id: paciente._id, rol: "paciente" }, process.env.JWT_SECRET, { expiresIn: "12h" });
          return res.json({ msg: "Bienvenido Paciente", usuario: paciente, token, rol: "paciente" });
        }
        return res.status(400).json({ msg: "Contraseña incorrecta" });
      }
    }

    // Si no encontró nada
    return res.status(404).json({ msg: "Usuario no encontrado o credenciales inválidas" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};