import jsPDF from "jspdf";
import autoTable, { applyPlugin } from "jspdf-autotable";
import { PDTInterface, LevelInterface } from "@/interfaces";

try {
    applyPlugin(jsPDF);
} catch {
    // Plugin ya aplicado o entorno específico
}

interface ManualPdfParams {
    plan?: PDTInterface;
    levels?: LevelInterface[];
    colorimeter?: number[];
}

/**
 * Dibuja un botón con apariencia nativa idéntica a la interfaz web
 */
const drawPdfButton = (
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    options: {
        bgColor?: [number, number, number];
        textColor?: [number, number, number];
        borderColor?: [number, number, number];
        borderWidth?: number;
        borderRadius?: number;
        fontSize?: number;
        bold?: boolean;
    } = {}
) => {
    const {
        bgColor = [20, 57, 85],
        textColor = [255, 255, 255],
        borderColor,
        borderWidth = 0.3,
        borderRadius = 1.5,
        fontSize = 7.5,
        bold = true
    } = options;

    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    if (borderColor) {
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.setLineWidth(borderWidth);
        doc.roundedRect(x, y, w, h, borderRadius, borderRadius, "FD");
    } else {
        doc.roundedRect(x, y, w, h, borderRadius, borderRadius, "F");
    }

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(text, x + w / 2, y + h / 2 + (fontSize * 0.35) / 2, { align: "center" });
};

/**
 * Dibuja un botón cuadrado de la barra lateral (módulos institucionales)
 */
const drawSidebarModuleBtn = (
    doc: jsPDF,
    x: number,
    y: number,
    size: number,
    title: string,
    glyph: string
) => {
    // Fondo azul marino oscuro #143955 con borde ámbar #f59e0b
    doc.setFillColor(20, 57, 85);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, size, size, 2.5, 2.5, "FD");

    // Símbolo o sigla en verde institucional #41a95b
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(65, 169, 91);
    doc.text(glyph, x + size / 2, y + (size * 0.45), { align: "center" });

    // Etiqueta del módulo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);
    doc.text(title, x + size / 2, y + (size * 0.82), { align: "center" });
};

export const generateManualPdf = ({ plan, levels = [], colorimeter = [35, 70, 85, 100] }: ManualPdfParams) => {
    // A4 Portrait: 210mm x 297mm
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const c1 = colorimeter && colorimeter.length > 0 ? colorimeter[0] : 35;
    const c2 = colorimeter && colorimeter.length > 1 ? colorimeter[1] : 70;
    const c3 = colorimeter && colorimeter.length > 2 ? colorimeter[2] : 85;
    const c4 = colorimeter && colorimeter.length > 3 ? colorimeter[3] : 100;

    const municipality = plan?.municipality || "Entidad Territorial";
    const department = plan?.department ? ` - ${plan.department}` : "";
    const planName = plan?.name || "Plan de Desarrollo Territorial";
    const startDate = plan?.start_date ? plan.start_date.split("T")[0] : "2024";
    const endDate = plan?.end_date ? plan.end_date.split("T")[0] : "2027";
    const deadline = plan?.deadline ? plan.deadline.split("T")[0] : "Abierto continuo";
    const generationDate = new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let currentY = 15;

    // Helper para salto de página automático y controlado
    const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > 265) {
            doc.addPage();
            currentY = 20;
        }
    };

    // ========================================================
    // PORTADA / ENCABEZADO INSTITUCIONAL
    // ========================================================
    doc.setFillColor(20, 57, 85);
    doc.rect(15, currentY, 180, 24, "F");

    doc.setFillColor(0, 132, 50);
    doc.rect(15, currentY + 24, 180, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("MANUAL DE USUARIO INSTITUCIONAL", 105, currentY + 10, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 230, 200);
    doc.text("SISTEMA DE SEGUIMIENTO, MONITOREO Y GESTIÓN DE PLANES DE DESARROLLO", 105, currentY + 18, { align: "center" });

    currentY += 34;

    // Título del Plan y Subtítulo
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const planLines = doc.splitTextToSize(planName, 180);
    doc.text(planLines, 105, currentY, { align: "center" });
    currentY += (planLines.length * 6) + 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text("Guía metodológica, procedimental y operativa para el reporte, auditoría y análisis de metas", 105, currentY, { align: "center" });
    currentY += 8;

    // ========================================================
    // FICHA TÉCNICA DEL PLAN ACTIVO
    // ========================================================
    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: {
            fontSize: 8.5,
            cellPadding: 3.5,
            font: "helvetica",
            textColor: [30, 41, 59]
        },
        headStyles: {
            fillColor: [20, 57, 85],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center"
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 50, fillColor: [241, 245, 249] },
            1: { cellWidth: 130 }
        },
        body: [
            ["Entidad Territorial:", `${municipality}${department}`],
            ["Periodo de Vigencia:", `${startDate} a ${endDate}`],
            ["Fecha Límite de Reporte:", deadline],
            ["Niveles Jerárquicos:", `${levels.length > 0 ? levels.length : 4} niveles configurados en la base de datos`],
            ["Fecha de Generación:", generationDate]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 9;

    // ========================================================
    // CAPÍTULO 1: ESTRUCTURA JERÁRQUICA DINÁMICA
    // ========================================================
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("1. Estructura Jerárquica del Plan de Desarrollo en el Sistema", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("La arquitectura del plan es dinámica y adapta sus niveles según los requerimientos territoriales:", 15, currentY);
    currentY += 4;

    const levelsBody = levels && levels.length > 0
        ? levels.map((lvl, idx) => [
            `Nivel ${idx + 1}`,
            lvl.name,
            lvl.description || "Nivel estructural de agregación de objetivos institucionales.",
            idx === levels.length - 1 ? "Operativo (Reporte de Evidencias)" : "Estratégico (Ponderación y Agrupación)"
        ])
        : [
            ["Nivel 1", "Línea Estratégica", "Gran eje programático de gobierno", "Estratégico"],
            ["Nivel 2", "Sector", "Sector administrativo según clasificación MGA", "Estratégico"],
            ["Nivel 3", "Programa", "Conjunto de metas de producto articuladas", "Estratégico"],
            ["Nivel 4", "Meta de Producto", "Unidad operativa de avance físico y financiero", "Operativo (Reporte de Evidencias)"]
        ];

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [0, 132, 50], textColor: 255, fontStyle: "bold" },
        head: [["Nivel", "Denominación Institucional", "Descripción / Alcance", "Función en el Sistema"]],
        body: levelsBody
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 9;

    // ========================================================
    // CAPÍTULO 2: SEMAFORIZACIÓN DINÁMICA
    // ========================================================
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("2. Semaforización y Rangos de Cumplimiento", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("Umbrales matemáticos configurados en este plan para calificar la ejecución física y financiera:", 15, currentY);
    currentY += 4;

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [20, 57, 85], textColor: 255, fontStyle: "bold" },
        head: [["Estado", "Rango Porcentual", "Significado Institucional", "Acción Operativa Requerida"]],
        body: [
            ["CRÍTICO (Rojo)", `0% a ${c1}%`, "Retraso severo o sin ejecución.", "Requiere plan de choque o contingencia inmediato."],
            ["BAJO / ALERTA (Naranja)", `${c1 + 1}% a ${c2}%`, "Ejecución por debajo de la curva programada.", "Alerta de seguimiento preventivo para acelerar contrataciones."],
            ["MEDIO / REGULAR (Amarillo)", `${c2 + 1}% a ${c3}%`, "Avance aceptable con oportunidades de mejora.", "Cumplimiento de hitos principales con necesidad de cierre documental."],
            ["SOBRESALIENTE (Verde)", `${c3 + 1}% a ${c4}%`, "Meta cumplida conforme a la programación anual.", "Hitos concluidos y respaldados con soportes idóneos y aprobados."]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 9;

    // ========================================================
    // CAPÍTULO 3: FLUJO DE REPORTE DE EVIDENCIAS (FUNCIONARIOS)
    // ========================================================
    checkPageBreak(75);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("3. Flujo de Reporte: Cómo Subir y Cargar Evidencias (Funcionario)", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("Secuencia operativa de acceso al módulo de reporte en el aplicativo:", 15, currentY);
    currentY += 5;

    // Panel de 3 Pasos con Botones con formato nativo del sistema
    const stepCardWidth = 57;
    const stepCardHeight = 28;
    const cardY = currentY;

    // Paso 1: Barra lateral
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, cardY, stepCardWidth, stepCardHeight, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Paso 1: Barra lateral", 18, cardY + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Menú de navegación:", 18, cardY + 9);
    drawSidebarModuleBtn(doc, 36, cardY + 11, 15, "Plan Indicat.", "PDT");

    // Paso 2: Botón Añadir Evidencia en UnitNodePage
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(76, cardY, stepCardWidth, stepCardHeight, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Paso 2: En la Meta", 79, cardY + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Botón de reporte en la meta:", 79, cardY + 9);
    drawPdfButton(doc, 81, cardY + 13, 47, 8.5, "Añadir evidencia", {
        bgColor: [148, 163, 184],
        textColor: [255, 255, 255],
        borderRadius: 1.5,
        fontSize: 7.5
    });

    // Paso 3: Botón Mostrar Evidencias en UnitNodePage
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(137, cardY, stepCardWidth, stepCardHeight, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Paso 3: Consulta Historial", 140, cardY + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Ver registros anteriores:", 140, cardY + 9);
    drawPdfButton(doc, 142, cardY + 13, 47, 8.5, "Mostrar evidencias", {
        bgColor: [59, 130, 246],
        textColor: [255, 255, 255],
        borderRadius: 1.5,
        fontSize: 7.5
    });

    currentY += stepCardHeight + 6;

    // Tabla de los 5 Bloques del Formulario
    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [0, 132, 50], textColor: 255, fontStyle: "bold" },
        head: [["Bloque del Formulario", "Campos Requeridos", "Instrucciones de Diligenciamiento"]],
        body: [
            [
                "Bloque 1:\nAvance Cuantitativo",
                "• Vigencia (Año)\n• Cantidad (Magnitud)\n• Descripción de Actividades",
                "Seleccionar el año de reporte. Digitar la magnitud física alcanzada según la unidad de medida de la meta. Redactar las actividades ejecutadas en el periodo."
            ],
            [
                "Bloque 2:\nLocalización Territorial",
                "• Comuna / Corregimiento\n• Barrio / Vereda\n• Georreferenciación",
                "Seleccionar la comuna y barrio impactado (o 'Todas' para cobertura general). Opcionalmente fijar puntos en el mapa interactivo para el geoportal."
            ],
            [
                "Bloque 3:\nRecursos Financieros",
                "• Recursos ejecutados ($ COP)\n• Fuente de financiación",
                "Digitar valor devengado/pagado en pesos colombianos. Seleccionar fuente: SGP Educación, SGP Salud, SGP Libre Inversión, Regalías, Propios, Funcionamiento u Otros."
            ],
            [
                "Bloque 4:\nCargue de Soportes",
                "• Tipo Archivo (PDF)\n• Tipo Enlace (URL)\n• Botón '+ Agregar Soporte'",
                "Adjuntar actas de recibo e informes en PDF (máx. 20 MB) o enlaces web directos a SECOP II / Google Drive. Usar '+ Agregar Soporte' para múltiples archivos."
            ],
            [
                "Bloque 5:\nPoblación Beneficiaria",
                "• Grupo Poblacional\n• Número de beneficiarios",
                "Seleccionar grupo poblacional (Adulto Mayor, Niñez, Mujeres, Víctimas, Discapacidad, etc.) y registrar cantidad de personas beneficiadas con la ejecución."
            ]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 5;

    // Controles en el formulario de reporte
    checkPageBreak(25);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, currentY, 180, 18, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Controles en formulario de reporte:", 18, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Añadir soportes documentales:", 18, currentY + 13);
    drawPdfButton(doc, 58, currentY + 9, 36, 6.5, "+ Agregar Soporte", {
        bgColor: [37, 99, 235],
        textColor: [255, 255, 255],
        borderColor: [0, 0, 0],
        borderWidth: 0.3,
        fontSize: 6.5
    });

    doc.text("Guardar y enviar a auditoría:", 102, currentY + 13);
    drawPdfButton(doc, 140, currentY + 8, 48, 8, "Añadir evidencia", {
        bgColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 7.5
    });

    currentY += 24;

    // ========================================================
    // CAPÍTULO 4: AUDITORÍA Y VALIDACIÓN (PLANEACIÓN)
    // ========================================================
    checkPageBreak(65);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("4. Flujo de Revisión y Validación de Metas (Planeación)", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("Procedimiento para auditores de Planeación y Sectorialistas a través de la bandeja de revisión:", 15, currentY);
    currentY += 5;

    // Panel con Botón de Bandeja Central
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, currentY, 180, 17, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Bandeja de auditoría en Listado de Evidencias:", 18, currentY + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Filtra registros que requieren validación técnica:", 18, currentY + 12);

    drawPdfButton(doc, 115, currentY + 4.5, 52, 8, "Ejecuciones por aprobar", {
        bgColor: [0, 132, 50],
        textColor: [255, 255, 255],
        borderColor: [0, 0, 0],
        borderWidth: 0.5,
        fontSize: 7.5
    });

    currentY += 22;

    // Panel con Botones de Calificación
    checkPageBreak(30);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, currentY, 180, 22, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Controles de calificación en la tabla de evidencias:", 18, currentY + 6);

    // Botón Aprobar
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 132, 50);
    doc.text("Opción Aprobación (Estado 1):", 18, currentY + 13);
    drawPdfButton(doc, 18, currentY + 14.5, 28, 6.5, "Aprobar", {
        bgColor: [0, 132, 50],
        textColor: [255, 255, 255],
        fontSize: 7
    });

    // Botón Rechazar
    doc.setTextColor(220, 38, 38);
    doc.text("Opción Devolución (Estado 2):", 65, currentY + 13);
    drawPdfButton(doc, 65, currentY + 14.5, 28, 6.5, "Rechazar", {
        bgColor: [254, 23, 0],
        textColor: [255, 255, 255],
        fontSize: 7
    });

    // Botón Confirmación Modal
    doc.setTextColor(37, 99, 235);
    doc.text("Confirmación en modal:", 120, currentY + 13);
    drawPdfButton(doc, 120, currentY + 14.5, 24, 6.5, "Enviar", {
        bgColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontSize: 7
    });

    currentY += 27;

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [20, 57, 85], textColor: 255, fontStyle: "bold" },
        head: [["Acción", "Control en Pantalla", "Efecto en el Sistema e Instrucciones"]],
        body: [
            [
                "Bandeja de Pendientes",
                "Botón 'Ejecuciones por aprobar'\n(Verde institucional)",
                "Lista centralizada de evidencias reportadas por dependencias que requieren validación. Permite verificar fecha, actividad, comuna, cantidad y descargar soportes."
            ],
            [
                "Aprobar Evidencia",
                "Botón 'Aprobar'\n(Verde)",
                "Pasa a Estado 1. Suma inmediatamente al avance acumulado físico y financiero del plan, recalcula el semáforo y alimenta los informes ejecutivos del Alcalde."
            ],
            [
                "Rechazar con Observación",
                "Botón 'Rechazar'\n(Rojo)",
                "Abre modal obligatorio para escribir la justificación técnica (motivo de rechazo). Notifica al funcionario y cambia la evidencia a Estado 2."
            ],
            [
                "Subsanación",
                "Botón 'Añadir evidencia'\n(Actualizar registro)",
                "El funcionario localiza la evidencia con observación, lee el requerimiento, reemplaza el archivo o corrige la cifra y reenvía a revisión sin perder historial."
            ]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 9;

    // ========================================================
    // CAPÍTULO 5: INTERPRETACIÓN DE DATOS Y REGLAS DE ACUMULACIÓN
    // ========================================================
    checkPageBreak(55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("5. Interpretación de Datos, Cálculos de Avance y Reglas de Acumulación", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("Cómo se computan los porcentajes de semáforo según la tipología del indicador:", 15, currentY);
    currentY += 4;

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [0, 132, 50], textColor: 255, fontStyle: "bold" },
        head: [["Tipo de Meta", "Fórmula y Comportamiento", "Ejemplo Práctico en el Sistema"]],
        body: [
            [
                "1. Metas de Suma\n(Acumulativas)",
                "Cada reporte se adiciona al acumulado de periodos anteriores.",
                "Meta cuatrienal de 100 km de vías. Año 1: 20 km + Año 2: 30 km = 50 km acumulados (50% de avance cuatrienal)."
            ],
            [
                "2. Metas Constantes\n(Mantenimiento)",
                "Miden el sostenimiento de una capacidad instalada o servicio. NO se suman año a año.",
                "Mantener 10 bibliotecas públicas abiertas. Si en el año operan las 10, el cumplimiento del año es 100%."
            ],
            [
                "3. Metas Decrecientes\n(Reducción)",
                "Indicadores donde el éxito consiste en disminuir una cifra negativa (mortalidad, deserción).",
                "Reducir tasa de accidentalidad del 15% al 9%. Cuanto menor sea el valor reportado, mayor es el avance."
            ]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 6;

    // Caja de Totales idéntica a UnitNodePage
    checkPageBreak(30);
    const boxTotalW = 90;
    const boxStartX = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Caja de balance oficial en pantalla de la meta:", 15, currentY + 4);
    currentY += 6;

    // Cabecera Amarilla "Total"
    doc.setFillColor(253, 224, 71); // yellow-300
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.rect(boxStartX, currentY, boxTotalW, 6, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("Total", boxStartX + boxTotalW / 2, currentY + 4.2, { align: "center" });

    // Cuerpo Blanco con columnas
    currentY += 6;
    doc.setFillColor(255, 255, 255);
    doc.rect(boxStartX, currentY, boxTotalW, 11, "FD");
    // Línea divisoria central
    doc.line(boxStartX + boxTotalW / 2, currentY, boxStartX + boxTotalW / 2, currentY + 11);

    // Columna Izquierda: Física
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(50, 50, 50);
    doc.text("Ejecución física", boxStartX + boxTotalW / 4, currentY + 3.8, { align: "center" });
    doc.setLineWidth(0.2);
    doc.line(boxStartX + 5, currentY + 4.8, boxStartX + (boxTotalW / 2) - 5, currentY + 4.8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text("85.50%", boxStartX + boxTotalW / 4, currentY + 8.8, { align: "center" });

    // Columna Derecha: Financiera
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(50, 50, 50);
    doc.text("Ejecución financiera", boxStartX + (boxTotalW * 3) / 4, currentY + 3.8, { align: "center" });
    doc.line(boxStartX + (boxTotalW / 2) + 5, currentY + 4.8, boxStartX + boxTotalW - 5, currentY + 4.8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text("$ 120.000.000", boxStartX + (boxTotalW * 3) / 4, currentY + 8.8, { align: "center" });

    currentY += 16;

    // ========================================================
    // CAPÍTULO 6: ASISTENTE DE INTELIGENCIA ARTIFICIAL (VOICECHAT)
    // ========================================================
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("6. Uso del Asistente de Inteligencia Artificial (VoiceChat)", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("El sistema cuenta con un asistente interactivo flotante capaz de responder consultas por voz y texto:", 15, currentY);
    currentY += 5;

    // Barra de Controles del Asistente IA
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, currentY, 180, 18, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 57, 85);
    doc.text("Controles del asistente en pantalla:", 18, currentY + 6);

    // Botón flotante píldora
    drawPdfButton(doc, 18, currentY + 9, 38, 7, "✨ Asistente IA", {
        bgColor: [1, 41, 71],
        textColor: [255, 255, 255],
        borderColor: [96, 165, 250],
        borderWidth: 0.4,
        borderRadius: 3.5,
        fontSize: 7
    });

    // Botón de micrófono
    drawPdfButton(doc, 68, currentY + 9, 14, 7, "Voz", {
        bgColor: [241, 245, 249],
        textColor: [71, 85, 105],
        borderColor: [203, 213, 225],
        borderWidth: 0.3,
        borderRadius: 1.5,
        fontSize: 6.5
    });

    // Botón de enviar mensaje
    drawPdfButton(doc, 92, currentY + 9, 28, 7, "Enviar ➤", {
        bgColor: [1, 41, 71],
        textColor: [255, 255, 255],
        fontSize: 7
    });

    currentY += 23;

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [20, 57, 85], textColor: 255, fontStyle: "bold" },
        head: [["Canal / Control", "Mecanismo de Operación", "Ejemplo de Consulta a la Base de Datos"]],
        body: [
            [
                "Botón Flotante\n'✨ Asistente IA'",
                "Ubicado en la esquina inferior derecha. Despliega la ventana de diálogo inteligente.",
                "Accesible desde cualquier vista del sistema para consultas rápidas sin cambiar de pantalla."
            ],
            [
                "Consultas por Voz\n(Micrófono)",
                "Presionar el botón de micrófono. Reconocimiento de voz en español (es-CO).",
                "💬 '¿Cuál es el porcentaje de avance general del Plan de Desarrollo?'"
            ],
            [
                "Consultas por Texto\n(Campo + Enviar)",
                "Escribir la pregunta en el campo de texto y presionar Enter o 'Enviar'.",
                "💬 '¿Qué metas están en semáforo rojo en la Secretaría de Salud para el año actual?'"
            ],
            [
                "Síntesis de Audio",
                "El asistente puede verbalizar la respuesta en voz alta.",
                "Ideal para comités de gobierno, mesas de trabajo y seguimiento directivo del gabinete."
            ]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 9;

    // ========================================================
    // CAPÍTULO 7: MÓDULOS COMPLEMENTARIOS DEL SISTEMA
    // ========================================================
    checkPageBreak(70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("7. Módulos Complementarios de Gestión Territorial", 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text("Módulos disponibles en la barra lateral de navegación para la gestión integral del municipio:", 15, currentY);
    currentY += 5;

    // Botones de Módulos con formato idéntico a la barra lateral
    const modBtnSize = 14;
    const modCardW = 28;
    const modulesY = currentY;

    // 1. Plan Indicativo
    drawSidebarModuleBtn(doc, 15, modulesY, modBtnSize, "Plan Indic.", "PDT");
    // 2. Plan de Acción
    drawSidebarModuleBtn(doc, 46, modulesY, modBtnSize, "Plan Acción", "ACT");
    // 3. POAI
    drawSidebarModuleBtn(doc, 77, modulesY, modBtnSize, "POAI", "POAI");
    // 4. Banco de Proyectos
    drawSidebarModuleBtn(doc, 108, modulesY, modBtnSize, "BPPIM", "BPP");
    // 5. Mapa de Intervención
    drawSidebarModuleBtn(doc, 139, modulesY, modBtnSize, "Mapa Terr.", "MAP");
    // 6. Atención Ciudadana
    drawSidebarModuleBtn(doc, 170, modulesY, modBtnSize, "Atención", "PQRS");

    currentY += modBtnSize + 7;

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [0, 132, 50], textColor: 255, fontStyle: "bold" },
        head: [["Módulo", "Control en Barra Lateral", "Propósito Institucional y Operaciones Clave"]],
        body: [
            [
                "Plan Indicativo\n(PDT)",
                "Botón cuadrado azul #143955\nSigla PDT en verde",
                "Estructura jerárquica del plan, tablero de metas, cargue de evidencias y auditoría de ejecución física y financiera."
            ],
            [
                "Plan de Acción\nAnual",
                "Botón cuadrado azul #143955\nSigla ACT en verde",
                "Desagregación de metas en actividades operativas y cronogramas trimestrales a ejecutar durante la vigencia fiscal."
            ],
            [
                "POAI\n(Inversiones)",
                "Botón cuadrado azul #143955\nSigla POAI en verde",
                "Articulación del presupuesto anual con metas del plan desagregadas por fuentes de financiación (SGP, Regalías, ICLD)."
            ],
            [
                "Banco de Proyectos\n(BPPIM)",
                "Botón cuadrado azul #143955\nSigla BPP en verde",
                "Registro de proyectos de inversión pública formulados bajo metodología MGA / BPIN articulados con las metas de producto."
            ],
            [
                "Mapa de Intervención\nTerritorial",
                "Botón cuadrado azul #143955\nSigla MAP en verde",
                "Geoportal cartográfico con filtros por comuna y corregimiento que muestra la distribución geográfica de obras e inversiones."
            ],
            [
                "Atención Ciudadana\n(PQRS)",
                "Botón cuadrado azul #143955\nSigla PQRS en verde",
                "Canal institucional de radicación, radicado oficial y seguimiento a peticiones, quejas y reclamos de la ciudadanía."
            ]
        ]
    });

    currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 9;

    // ========================================================
    // CAPÍTULO 8: PREGUNTAS FRECUENTES Y PROBLEMAS HABITUALES
    // ========================================================
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 57, 85);
    doc.text("8. Preguntas Frecuentes y Solución de Problemas", 15, currentY);
    currentY += 5;

    autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 3, font: "helvetica" },
        headStyles: { fillColor: [20, 57, 85], textColor: 255, fontStyle: "bold" },
        head: [["Pregunta Frecuente", "Causa Técnica", "Solución / Acción Recomendada"]],
        body: [
            [
                "¿Por qué no guarda el botón 'Añadir evidencia'?",
                "• Fecha límite (deadline) vencida.\n• Falta adjuntar soporte en Bloque 4.\n• Rol sin permiso sobre la dependencia.",
                "Verificar la fecha de corte. Si venció, solicitar prórroga formal a Planeación. Asegurar al menos 1 archivo o enlace de soporte."
            ],
            [
                "¿Qué hacer si me devolvieron una evidencia rechazada?",
                "La evidencia pasa a Estado 2 con el motivo redactado por Planeación.",
                "NO crear una nueva. Ingresar a la meta, hacer clic en 'Editar', corregir el dato o soporte y guardar para reenviar a revisión."
            ],
            [
                "¿Por qué mi reporte no suma al avance municipal?",
                "Las evidencias en borrador/revisión (Estado 0) no impactan cifras oficiales.",
                "El avance se refleja únicamente cuando la Secretaría de Planeación presiona 'Aprobar' (Estado 1)."
            ],
            [
                "¿Cómo subir archivos de más de 20 MB?",
                "El cargue directo de archivos tiene límite sugerido de 20 MB.",
                "En el Bloque 4 seleccionar 'Enlace Web (URL)' y pegar la URL institucional de SECOP II o Google Drive."
            ]
        ]
    });

    // ========================================================
    // PIE DE PÁGINA Y ENCABEZADOS DE PÁGINA (PAGINACIÓN)
    // ========================================================
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Encabezado superior en páginas 2 en adelante
        if (i > 1) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text(`${municipality}${department} | Manual de Usuario - Controland`, 15, 10);
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            doc.line(15, 12, 195, 12);
        }

        // Pie de página en todas las páginas
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(15, 287, 195, 287);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Sistema de Seguimiento, Monitoreo y Evaluación de Planes de Desarrollo Territorial | Controland", 15, 292);
        doc.text(`Página ${i} de ${totalPages}`, 195, 292, { align: "right" });
    }

    // Nombre de archivo limpio
    const cleanMunicipality = municipality.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `Manual_Usuario_${cleanMunicipality}_Controland.pdf`;

    // Descarga directa mediante Blob y fallback a save()
    try {
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 150);
    } catch {
        doc.save(fileName);
    }
};
