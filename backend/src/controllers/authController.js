import Paciente from "../models/pacienteModel.js";
import Medico from "../models/medicoModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUnificado = async (req, res) => {
  try {
    const { documento, password } = req.body;

    // ----------------------------------------------------------
    // INTENTO 1: ¿ES UN MÉDICO? (Prioridad Alta)
    // ----------------------------------------------------------
    const medico = await Medico.findOne({ documento });
    
    if (medico) {
      // Verificamos contraseña de médico
      const passwordOK = await bcrypt.compare(password, medico.password);
      if (passwordOK) {
        const token = jwt.sign(
          { id: medico._id, rol: "medico" },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );
        return res.json({ 
          msg: "Bienvenido Doctor(a)", 
          usuario: medico, 
          token, 
          rol: "medico" 
        });
      }
      // Si es médico pero la clave está mal, retornamos error aquí 
      // (No buscamos en pacientes para no confundir credenciales)
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // ----------------------------------------------------------
    // INTENTO 2: ¿ES UN PACIENTE?
    // ----------------------------------------------------------
    const paciente = await Paciente.findOne({ documento });

    if (paciente) {
      const passwordOK = await bcrypt.compare(password, paciente.password);
      if (!passwordOK) {
        return res.status(400).json({ msg: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: paciente._id, rol: "paciente" },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      return res.json({ 
        msg: "Bienvenido Paciente", 
        usuario: paciente, 
        token, 
        rol: "paciente" 
      });
    }

    // Si no se encontró en ninguno
    return res.status(404).json({ msg: "Usuario no encontrado con ese documento" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};