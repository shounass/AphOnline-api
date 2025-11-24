import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },

  // Encabezado
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "3px solid #2c3e50",
    paddingBottom: 10,
  },
  brand: { fontSize: 24, fontWeight: "bold", color: "#2c3e50" },
  brandSub: { fontSize: 10, color: "#aaa" },
  metaInfo: { textAlign: "right" },
  date: { fontSize: 10, color: "#555", marginBottom: 4 },

  // Título Principal
  titleBox: {
    backgroundColor: "#f0f8ff",
    padding: 10,
    marginBottom: 20,
    borderLeft: "4px solid #3498db",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    textTransform: "uppercase",
  },

  // Info del Paciente y Médico
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 11,
  },
  column: { width: "48%" },
  label: { fontWeight: "bold", color: "#555", fontSize: 9, marginBottom: 2 },
  value: { marginBottom: 10, color: "#000" },

  // Detalles del Examen
  detailsBox: {
    border: "1px solid #eee",
    borderRadius: 5,
    padding: 15,
    marginBottom: 40,
  },
  examType: {
    fontSize: 10,
    color: "#3498db",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  examName: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  examObsLabel: { fontSize: 10, fontWeight: "bold", marginTop: 10 },
  examObs: { fontSize: 10, fontStyle: "italic", color: "#555", marginTop: 2 },

  // Firma
  footer: {
    position: "absolute",
    bottom: 50,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  signLine: {
    borderTop: "1px solid #333",
    width: "60%",
    margin: "0 auto 10px auto",
  },
  signText: { fontSize: 10, fontWeight: "bold" },
  signSub: { fontSize: 9, color: "#777" },

  disclaimer: {
    marginTop: 20,
    fontSize: 8,
    color: "#aaa",
    textAlign: "center",
  },
});

const OrdenExamenPDF = ({ examen, paciente }) => {
  const fecha = new Date(examen.fechaRealizacion).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>APHONLINE</Text>
            <Text style={styles.brandSub}>Orden Médica Electrónica</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.date}>Fecha: {fecha}</Text>
            <Text style={styles.date}>
              Orden #: {examen._id.slice(-6).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Título */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>Solicitud de {examen.tipo}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.column}>
            <Text style={styles.label}>PACIENTE:</Text>
            <Text style={styles.value}>
              {paciente?.nombre || "Paciente"} {paciente?.apellido}
            </Text>

            <Text style={styles.label}>IDENTIFICACIÓN:</Text>
            <Text style={styles.value}>
              {paciente?.tipoDocumento} {paciente?.documento}
            </Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>MÉDICO SOLICITANTE:</Text>
            <Text style={styles.value}>
              Dr. {examen.medicoId?.nombre} {examen.medicoId?.apellido}
            </Text>

            <Text style={styles.label}>ESPECIALIDAD:</Text>
            <Text style={styles.value}>{examen.medicoId?.especialidad}</Text>
          </View>
        </View>

        {/* Detalles Examen */}
        <View style={styles.detailsBox}>
          <Text style={styles.examType}>Examen Solicitado:</Text>
          <Text style={styles.examName}>{examen.nombre}</Text>

          <Text style={styles.examObsLabel}>
            Indicaciones Clínicas / Observaciones:
          </Text>
          <Text style={styles.examObs}>
            {examen.observaciones || "Sin observaciones adicionales."}
          </Text>
        </View>

        {/* Firma */}
        <View style={styles.footer}>
          <View style={styles.signLine} />
          <Text style={styles.signText}>Firma del Profesional</Text>
          <Text style={styles.signSub}>
            Reg. Médico: {examen.medicoId?.numeroLicencia || "N/A"}
          </Text>

          <Text style={styles.disclaimer}>
            Este documento es una orden médica válida para la realización del
            examen solicitado en la entidad prestadora de salud correspondiente.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default OrdenExamenPDF;
