import jsPDF from "jspdf";
import "jspdf-autotable"; // Importante: extiende jsPDF
import { ReportPDTInterface2 } from "@/interfaces";

export const generatePdfReportBlob = (
    data: ReportPDTInterface2[],
    levels: any[] = [],
    years: string[] = []
): Blob => {
    const doc = new jsPDF("l", "pt", "a4");

    const staticBefore = ["Código de la meta producto", "Meta", "Responsable"];
    const staticAfter = ["Indicador", "Línea base"];
    const dynamicHeaders = levels.length > 0 ? levels.map(l => l.name || "") : ["Dimensión", "Sector", "Programa", "Subprograma"];
    const headers = [...staticBefore, ...dynamicHeaders, ...staticAfter];
    const yearHeaders = years.flatMap(y => [`Programado ${y}`, `Ejecutado ${y}`, `% ejecución ${y}`]);
    const allHeaders = [...headers, ...yearHeaders];

    const safeParse = (str: string | undefined): (string | number)[] => {
        if (!str) return [];
        try {
            const parsed = JSON.parse(str);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // si no es JSON válido, intentar separarlo por comas
            return str.split(",").map(s => s.trim());
        }
        return [];
    };


    const body = data.map(item => {
        const row: any[] = [];
        row.push(item.goalCode ?? "");
        row.push(item.goalDescription ?? "");
        row.push(item.responsible ?? "");

        dynamicHeaders.forEach((_, idx) => {
            const parts = (item.full_path || item.planSpecific || "").split(">").map(p => p.trim());
            row.push(parts[idx] ?? "");
        });

        row.push(item.indicator ?? "");
        row.push(item.base ?? "");

        const programedArr = safeParse(item.programed);
        const executedArr = safeParse(item.executed);
        const percentArr = safeParse(item.percentExecuted);

        years.forEach((_, i) => row.push(programedArr[i] ?? ""));
        years.forEach((_, i) => row.push(executedArr[i] ?? ""));
        years.forEach((_, i) => row.push(percentArr[i] ?? ""));

        return row;
    });

    // Usar as any para forzar acceso a autoTable
    (doc as any).autoTable({
        head: [allHeaders],
        body,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [200, 200, 200] },
    });

    const pdfBlob = doc.output("blob");
    return pdfBlob;
};

