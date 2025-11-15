import Examen from "../models/examenModel.js";

// 1. Ver mis exámenes
export const obtenerMisExamenes = async (req, res) => {
  try {
    const examenes = await Examen.find({ pacienteId: req.usuario.id })
      .populate("medicoId", "nombre apellido especialidad")
      .sort({ fechaRealizacion: -1 });

    res.json(examenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener exámenes" });
  }
};

// 2. Crear Examen (Para pruebas con Postman)
export const crearExamen = async (req, res) => {
  try {
    const nuevoExamen = new Examen(req.body);
    await nuevoExamen.save();
    res.status(201).json({ msg: "Examen registrado", examen: nuevoExamen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear examen" });
  }
};