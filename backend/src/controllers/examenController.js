import Examen from "../models/examenModel.js";

// 1. Ver mis exámenes (PACIENTE)
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

// 2. Crear Orden de Examen (MÉDICO)
export const crearOrdenExamen = async (req, res) => {
  try {
    const { pacienteId, tipo, nombre, observaciones } = req.body;

    const nuevoExamen = new Examen({
      pacienteId,
      medicoId: req.usuario.id, // El médico logueado es quien ordena
      tipo,
      nombre,
      observaciones,
      estado: "Pendiente", // Nace pendiente hasta que el laboratorio suba el resultado
      fechaRealizacion: new Date()
    });

    await nuevoExamen.save();
    
    // Devolvemos el examen con datos del médico poblados para mostrarlo en la lista al instante
    const examenPoblado = await Examen.findById(nuevoExamen._id).populate("medicoId", "nombre apellido");

    res.status(201).json({ msg: "Orden creada exitosamente", examen: examenPoblado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear la orden" });
  }
};

// 3. Ver exámenes de un paciente específico (MÉDICO)
export const verExamenesPorPaciente = async (req, res) => {
  try {
    const { id } = req.params; // ID del paciente
    const examenes = await Examen.find({ pacienteId: id })
      .populate("medicoId", "nombre apellido")
      .sort({ fechaRealizacion: -1 });

    res.json(examenes);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener historial de exámenes" });
  }
};

// Función antigua para pruebas (se puede dejar o borrar)
export const crearExamen = async (req, res) => {
  /* ... lógica legacy ... */
};

// 4. Subir Resultado (MÉDICO)
export const subirResultado = async (req, res) => {
  try {
    const { id } = req.params; // ID del examen
    const { resultado } = req.body; // El texto del resultado

    const examen = await Examen.findByIdAndUpdate(
      id,
      { 
        resultado: resultado, 
        estado: "Disponible" // ¡Aquí cambia el estado!
      },
      { new: true }
    ).populate("medicoId", "nombre apellido");

    if (!examen) return res.status(404).json({ msg: "Examen no encontrado" });

    res.json({ msg: "Resultados cargados exitosamente", examen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al subir resultados" });
  }
};