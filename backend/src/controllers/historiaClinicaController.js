import HistoriaClinica from "../models/historiaClinicaModel.js";

// 1. Ver la historia del paciente logueado
export const verMiHistoria = async (req, res) => {
  try {
    // Buscamos por el pacienteId que viene del token
    const historia = await HistoriaClinica.findOne({ pacienteId: req.usuario.id })
      .populate({
        path: 'historiaCitas',     // Llenamos los datos de las citas
        populate: { path: 'medicoId', select: 'nombre apellido especialidad' } // Y dentro de las citas, los datos del médico
      });

    if (!historia) {
      return res.status(404).json({ msg: "No se encontró historia clínica para este paciente." });
    }

    res.json(historia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la historia clínica" });
  }
};

// 2. Crear/Inicializar historia (Para pruebas con Postman)
export const crearHistoria = async (req, res) => {
  try {
    const { pacienteId, antecedentes, enfermedadesActuales, medicamentosActuales, cirugias } = req.body;

    // Verificar si ya existe
    const existe = await HistoriaClinica.findOne({ pacienteId });
    if (existe) {
      return res.status(400).json({ msg: "Este paciente ya tiene historia clínica." });
    }

    const nuevaHistoria = new HistoriaClinica({
      pacienteId,
      antecedentes,
      enfermedadesActuales,
      medicamentosActuales,
      cirugias
    });

    await nuevaHistoria.save();
    res.status(201).json({ msg: "Historia clínica creada", historia: nuevaHistoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear historia" });
  }
};