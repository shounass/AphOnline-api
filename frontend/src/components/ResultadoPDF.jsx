import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },

  // Encabezado
  header: {
    borderBottom: "3px solid #27ae60",
    paddingBottom: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#2c3e50" },
  subtitle: {
    fontSize: 10,
    color: "#27ae60",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 5,
  },

  // Información General
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 4,
  },
  infoColumn: { width: "48%" },
  label: { fontSize: 8, color: "#7f8c8d", fontWeight: "bold", marginBottom: 2 },
  value: { fontSize: 10, color: "#2c3e50", marginBottom: 8 },

  // Caja de Resultados
  resultBox: {
    border: "1px solid #eee",
    padding: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
    minHeight: 200,
  },
  examTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
    borderBottom: "1px dashed #eee",
    paddingBottom: 5,
  },
  resultContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#333",
    fontFamily: "Helvetica",
  },

  // Pie de página
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#aaa",
    borderTop: "1px solid #eee",
    paddingTop: 10,
  },
});

const ResultadoPDF = ({ examen }) => {
  const fechaReporte = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>APHONLINE</Text>
            <Text style={styles.subtitle}>Informe de Resultados Clínicos</Text>
          </View>
          <View>
            <Text style={{ fontSize: 9, color: "#555" }}>
              Folio: {examen._id.slice(-6).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Información del Examen */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>EXAMEN REALIZADO:</Text>
            <Text style={styles.value}>{examen.nombre}</Text>

            <Text style={styles.label}>TIPO:</Text>
            <Text style={styles.value}>{examen.tipo}</Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.label}>FECHA DE REPORTE:</Text>
            <Text style={styles.value}>{fechaReporte}</Text>

            <Text style={styles.label}>PROFESIONAL RESPONSABLE:</Text>
            <Text style={styles.value}>
              Dr. {examen.medicoId?.nombre} {examen.medicoId?.apellido}
            </Text>
          </View>
        </View>

        {/* Cuerpo del Resultado */}
        <View style={styles.resultBox}>
          <Text style={styles.examTitle}>HALLAZGOS / CONCLUSIONES</Text>
          <Text style={styles.resultContent}>
            {examen.resultado ||
              "No se ha registrado información detallada para este resultado."}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Documento generado electrónicamente por la plataforma Aphonline.
          </Text>
          <Text>
            Este informe es confidencial y para uso exclusivo del paciente y su
            médico tratante.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ResultadoPDF;
