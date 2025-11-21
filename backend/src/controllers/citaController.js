import Cita from "../models/citaModel.js";
import Medico from "../models/medicoModel.js"; // Importamos modelo médico para ver sus días

/* ==========================================
   1. FUNCIONES PARA EL PACIENTE
========================================== */

// --- VALIDAR DISPONIBILIDAD (DÍAS Y HORAS) ---
export const obtenerHorasOcupadas = async (req, res) => {
  try {
    const { medicoId, fecha } = req.query; 

    if (!medicoId || !fecha) return res.status(400).json({ msg: "Faltan parámetros" });

    // 1. Verificar si el médico trabaja ese día de la semana
    const medico = await Medico.findById(medicoId);
    if (!medico) return res.status(404).json({ msg: "Médico no encontrado" });

    // Obtenemos el día de la semana de la fecha solicitada (0=Dom, 6=Sab)
    // Usamos UTC para evitar problemas de zona horaria al parsear 'YYYY-MM-DD'
    const diaSemana = new Date(fecha).getUTCDay();

    // Si el día NO está en la lista de días laborales del médico...
    if (!medico.diasLaborales.includes(diaSemana)) {
      return res.json({ 
        bloqueado: true, 
        mensaje: "El médico no atiende este día de la semana." 
      });
    }

    // 2. Si sí trabaja, buscamos las horas ocupadas
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);

    const citas = await Cita.find({
      medicoId,
      fecha: { $gte: fechaInicio, $lt: fechaFin },
      estado: { $ne: "Cancelada" }
    }).select("hora");

    const horasOcupadas = citas.map(c => c.hora);

    res.json({ bloqueado: false, horasOcupadas });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al verificar disponibilidad" });
  }
};

// ... (El resto de funciones agendarCita, etc. siguen igual que antes) ...
// Solo asegúrate de que agendarCita TAMBIÉN valide esto por seguridad:

export const agendarCita = async (req, res) => {
  try {
    const { medicoId, fecha, hora, motivo, tipo } = req.body;

    // Validación Doble: ¿El médico trabaja ese día?
    const medico = await Medico.findById(medicoId);
    const diaSemana = new Date(fecha).getUTCDay();
    if (!medico.diasLaborales.includes(diaSemana)) {
      return res.status(400).json({ msg: "El médico no atiende este día." });
    }

    // Validación Doble: ¿Hora ocupada?
    const ocupado = await Cita.findOne({
      medicoId,
      fecha,
      hora,
      estado: { $in: ["Pendiente", "Confirmada", "Propuesta"] }
    });

    if (ocupado) return res.status(400).json({ msg: "Hora ya ocupada." });

    const nuevaCita = new Cita({
      pacienteId: req.usuario.id,
      medicoId,
      fecha,
      hora,
      motivo,
      tipo,
      estado: "Pendiente"
    });

    await nuevaCita.save();
    res.status(201).json({ msg: "Solicitud enviada", cita: nuevaCita });

  } catch (error) {
    res.status(500).json({ msg: "Error al agendar" });
  }
};

// ... (Mantén las demás funciones: obtenerMisCitas, cancelarCita, reprogramarCita, aceptarPropuesta, verCitasMedico, confirmarCita, proponerCambio, atenderCita) ...
// Asegúrate de exportarlas todas.
export const obtenerMisCitas = async (req, res) => { /* ...código anterior... */ try { const citas = await Cita.find({ pacienteId: req.usuario.id }).populate("medicoId", "nombre apellido especialidad").sort({ fecha: 1, hora: 1 }); res.json(citas); } catch (error) { res.status(500).json({ msg: "Error" }); } };
export const cancelarCita = async (req, res) => { /* ...código anterior... */ try { await Cita.findOneAndUpdate({_id: req.params.id, pacienteId: req.usuario.id}, {estado:"Cancelada"}); res.json({msg:"Cancelada"}); } catch(e){res.status(500).json({msg:"Error"});} };
export const reprogramarCita = async (req, res) => { /* ... */ try { await Cita.findOneAndUpdate({_id: req.params.id, pacienteId: req.usuario.id}, {fecha:req.body.fecha, hora:req.body.hora, estado:"Pendiente"}); res.json({msg:"Reprogramada"}); } catch(e){res.status(500).json({msg:"Error"});} };
export const aceptarPropuesta = async (req, res) => { /* ... */ try { const c = await Cita.findOne({_id:req.params.id}); c.fecha=c.propuesta.fecha; c.hora=c.propuesta.hora; c.estado="Confirmada"; c.propuesta=undefined; await c.save(); res.json({msg:"Ok"}); } catch(e){res.status(500).json({msg:"Error"});} };
export const verCitasMedico = async (req, res) => { /* ... */ try { const c = await Cita.find({ medicoId: req.usuario.id }).populate("pacienteId", "-password").sort({ fecha: 1, hora: 1 }); res.json(c); } catch (e) { res.status(500).json({ msg: "Error" }); } };
export const confirmarCita = async (req, res) => { /* ... */ try { await Cita.findByIdAndUpdate(req.params.id, {estado:"Confirmada"}); res.json({msg:"Ok"}); } catch(e){res.status(500).json({msg:"Error"});} };
export const proponerCambio = async (req, res) => { /* ... */ try { await Cita.findByIdAndUpdate(req.params.id, {estado:"Propuesta", propuesta: req.body}); res.json({msg:"Ok"}); } catch(e){res.status(500).json({msg:"Error"});} };
export const atenderCita = async (req, res) => { /* ... */ try { await Cita.findByIdAndUpdate(req.params.id, {estado:"Completada"}); res.json({msg:"Ok"}); } catch(e){res.status(500).json({msg:"Error"});} };