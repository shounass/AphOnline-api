import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Definimos los estilos del PDF (similar a CSS pero para documentos)
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "2px solid #a7d9d0",
    paddingBottom: 10,
  },
  brand: { fontSize: 24, fontWeight: "bold", color: "#2c3e50" },
  brandSub: { fontSize: 10, color: "#aaa" },

  metaInfo: { textAlign: "right" },
  date: { fontSize: 10, color: "#7f8c8d", marginBottom: 4 },

  doctorSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f4f6f8",
    borderRadius: 5,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  doctorSpec: { fontSize: 10, color: "#3498db", marginBottom: 4 },
  license: { fontSize: 9, color: "#555" },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    color: "#2c3e50",
    textTransform: "uppercase",
    borderBottom: "1px solid #eee",
    paddingBottom: 5,
  },

  medContainer: { marginBottom: 10 },
  medItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "1px dashed #eee",
  },
  medName: { fontSize: 12, fontWeight: "bold", marginBottom: 2 },
  medDetails: { fontSize: 10, color: "#555", marginBottom: 2 },
  medInstruction: { fontSize: 10, fontStyle: "italic", color: "#444" },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#aaa",
    borderTop: "1px solid #eee",
    paddingTop: 10,
  },

  vencimiento: {
    marginTop: 30,
    fontSize: 10,
    color: "#e74c3c",
    textAlign: "right",
    fontWeight: "bold",
  },
});

// El Componente del Documento
const RecetaPDF = ({ receta }) => {
  // Formatear fechas para que se vean bien en el PDF
  const fechaExp = new Date(receta.fechaExpedicion).toLocaleDateString(
    "es-CO",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const fechaVen = receta.fechaVencimiento
    ? new Date(receta.fechaVencimiento).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Indefinida";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>APHONLINE</Text>
            <Text style={styles.brandSub}>Plataforma de Gestión Médica</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.date}>Fecha de Expedición: {fechaExp}</Text>
            <Text style={styles.date}>
              Folio: #{receta._id.slice(-6).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Datos del Doctor */}
        <View style={styles.doctorSection}>
          <Text style={styles.doctorName}>
            Dr. {receta.medicoId?.nombre} {receta.medicoId?.apellido}
          </Text>
          <Text style={styles.doctorSpec}>
            {receta.medicoId?.especialidad || "Medicina General"}
          </Text>
          {receta.medicoId?.numeroLicencia && (
            <Text style={styles.license}>
              Licencia Médica: {receta.medicoId.numeroLicencia}
            </Text>
          )}
        </View>

        {/* Título */}
        <Text style={styles.sectionTitle}>Prescripción Médica</Text>

        {/* Lista de Medicamentos */}
        <View style={styles.medContainer}>
          {receta.medicamentos.map((med, index) => (
            <View key={index} style={styles.medItem}>
              <Text style={styles.medName}>
                • {med.nombre} ({med.dosis})
              </Text>
              <Text style={styles.medDetails}>
                Duración del tratamiento: {med.duracion}
              </Text>
              <Text style={styles.medInstruction}>
                Instrucciones: {med.indicaciones}
              </Text>
            </View>
          ))}
        </View>

        {/* Vencimiento */}
        <Text style={styles.vencimiento}>
          Esta fórmula es válida hasta: {fechaVen}
        </Text>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>
            Generado electrónicamente por Aphonline. Este documento es válido
            para dispensación en farmacias autorizadas.
          </Text>
          <Text>
            Calle 12 # 25 - 18, Yarumal, Antioquia | Tel: +57 300 123 4567
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default RecetaPDF;
