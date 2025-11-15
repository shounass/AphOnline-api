import Cita from "../models/citaModel.js";
import Medico from "../models/medicoModel.js";

// 1. Agendar una nueva cita
export const agendarCita = async (req, res) => {
  try {
    const { medicoId, fecha, hora, motivo, tipo } = req.body;
    // El ID del paciente viene del token (req.usuario.id) gracias al middleware de auth
    // OJO: Como en tu login guardamos { id, rol }, aquí lo usamos.
    
    // Validar datos básicos
    if (!medicoId || !fecha || !hora || !motivo) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    // Crear la cita
    const nuevaCita = new Cita({
      pacienteId: req.usuario.id, // <-- IMPORTANTE: Esto lo pondremos en el middleware
      medicoId,
      fecha,
      hora,
      motivo,
      tipo
    });

    await nuevaCita.save();
    res.status(201).json({ msg: "Cita agendada correctamente", cita: nuevaCita });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agendar la cita" });
  }
};

// 2. Obtener citas del paciente logueado
export const obtenerMisCitas = async (req, res) => {
  try {
    const citas = await Cita.find({ pacienteId: req.usuario.id })
      .populate("medicoId", "nombre apellido especialidad") // Traer datos del médico
      .sort({ fecha: 1 }); // Ordenar por fecha más próxima
      
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener citas" });
  }
};

// ... (tus funciones anteriores: agendarCita, obtenerMisCitas) ...

// 3. Cancelar Cita (Cambiar estado a 'Cancelada')
export const cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;
    // Verificamos que la cita pertenezca al usuario que la quiere cancelar
    const cita = await Cita.findOne({ _id: id, pacienteId: req.usuario.id });

    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    cita.estado = "Cancelada";
    await cita.save();

    res.json({ msg: "Cita cancelada correctamente", cita });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cancelar la cita" });
  }
};

// 4. Reprogramar Cita (Cambiar fecha y hora)
export const reprogramarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora } = req.body;

    const cita = await Cita.findOneAndUpdate(
      { _id: id, pacienteId: req.usuario.id },
      { fecha, hora },
      { new: true } // Devolver el objeto actualizado
    );

    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    res.json({ msg: "Cita reprogramada exitosamente", cita });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al reprogramar" });
  }
};

// ... (tus funciones anteriores) ...

// 5. Ver citas asignadas al médico logueado
export const verCitasMedico = async (req, res) => {
  try {
    // Busamos citas donde el medicoId sea el del usuario logueado
    const citas = await Cita.find({ medicoId: req.usuario.id })
      .populate("pacienteId", "nombre apellido documento edad sexo") // Traemos datos del paciente
      .sort({ fecha: 1, hora: 1 }); // Ordenadas por fecha y hora

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cargar la agenda" });
  }
};

// 6. Marcar cita como Completada (Atender)
export const atenderCita = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cita = await Cita.findOneAndUpdate(
      { _id: id, medicoId: req.usuario.id }, // Solo el médico dueño puede atenderla
      { estado: "Completada" },
      { new: true }
    );

    if (!cita) return res.status(404).json({ msg: "Cita no encontrada o no autorizada" });

    res.json({ msg: "Cita finalizada exitosamente", cita });
  } catch (error) {
    res.status(500).json({ msg: "Error al finalizar cita" });
  }
};