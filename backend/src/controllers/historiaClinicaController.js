import HistoriaClinica from "../models/historiaClinicaModel.js";
import Paciente from "../models/pacienteModel.js";
import Medico from "../models/medicoModel.js"; // <-- 1. IMPORTANTE: Importar el modelo Médico

// 1. Ver mi historia (Paciente)
export const verMiHistoria = async (req, res) => {
  try {
    const historia = await HistoriaClinica.findOne({ pacienteId: req.usuario.id })
      .populate({
        path: 'historiaCitas',
        populate: { path: 'medicoId', select: 'nombre apellido' }
      });
    if (!historia) return res.status(404).json({ msg: "Historia no encontrada" });
    res.json(historia);
  } catch (error) { res.status(500).json({ msg: "Error del servidor" }); }
};

// 2. Ver historia por ID de Paciente (Médico)
export const verHistoriaPorPacienteId = async (req, res) => {
  try {
    const { id } = req.params;
    let historia = await HistoriaClinica.findOne({ pacienteId: id });

    if (!historia) {
      // Si no existe, la creamos vacía para que no rompa el frontend
      historia = new HistoriaClinica({ pacienteId: id });
      await historia.save();
    }

    res.json(historia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener historia" });
  }
};

// 3. Crear Historia (Admin/Postman)
export const crearHistoria = async (req, res) => {
  try {
    const nuevaHistoria = new HistoriaClinica(req.body);
    await nuevaHistoria.save();
    res.status(201).json(nuevaHistoria);
  } catch (error) { res.status(500).json({ msg: "Error al crear" }); }
};

// 4. AGREGAR EVOLUCIÓN (CORREGIDO)
export const agregarEvolucion = async (req, res) => {
  try {
    const { id } = req.params; // ID del Paciente
    const { nota } = req.body;

    // 2. BUSCAR DATOS DEL MÉDICO EN LA BD
    // Usamos el ID que viene del token (req.usuario.id)
    const medicoData = await Medico.findById(req.usuario.id);
    
    // Si encontramos al médico, usamos su nombre. Si no, ponemos un genérico.
    const nombreMedico = medicoData 
      ? `Dr. ${medicoData.nombre} ${medicoData.apellido}` 
      : "Dr. Desconocido";

    const historia = await HistoriaClinica.findOne({ pacienteId: id });
    if (!historia) return res.status(404).json({ msg: "Historia no encontrada" });

    // Push al array de evoluciones
    historia.evoluciones.push({ 
      nota, 
      medico: nombreMedico, // Ahora sí guarda el nombre real
      fecha: new Date() 
    });
    
    await historia.save();

    res.json({ msg: "Evolución agregada", historia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al guardar nota" });
  }
};

// 5. Editar Datos Clínicos
export const actualizarDatosClinicos = async (req, res) => {
  try {
    const { id } = req.params; // ID del Paciente
    const { antecedentes, alergias, enfermedadesActuales, medicamentosActuales } = req.body;

    const historia = await HistoriaClinica.findOneAndUpdate(
      { pacienteId: id },
      { antecedentes, alergias, enfermedadesActuales, medicamentosActuales },
      { new: true }
    );

    res.json({ msg: "Datos actualizados", historia });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar" });
  }
};