import Receta from "../models/recetaModel.js";

// 1. Ver mis recetas (Paciente Logueado)
export const obtenerMisRecetas = async (req, res) => {
  try {
    const recetas = await Receta.find({ pacienteId: req.usuario.id })
      .populate("medicoId", "nombre apellido especialidad") // Traer datos del doctor
      .sort({ fechaExpedicion: -1 }); // Las más recientes primero

    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener recetas" });
  }
};

// 2. Crear Receta (Para pruebas con Postman, luego lo usa el médico)
export const crearReceta = async (req, res) => {
  try {
    const nuevaReceta = new Receta(req.body);
    await nuevaReceta.save();
    res.status(201).json({ msg: "Receta creada exitosamente", receta: nuevaReceta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear receta" });
  }
};