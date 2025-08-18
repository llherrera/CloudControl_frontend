import React, { useState, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";

// POAIViewer.tsx
// Componente React (TSX) para visualizar un archivo Excel (POAI) usando Tailwind con prefijo `tw-`.
// Requiere la librería `xlsx` (npm i xlsx) y opcionalmente `file-saver` para descargas.

type Row = Record<string, any>;

interface POAIViewerProps {
  /** Datos iniciales opcionales (array de objetos) */
  initialData?: Row[];
  /** Nombre del archivo por defecto (solo para mostrar) */
  defaultFileName?: string;
}

export default function POAIViewer({ initialData = [], defaultFileName }: POAIViewerProps) {
  const [data, setData] = useState<Row[]>(initialData);
  const [columns, setColumns] = useState<string[]>(() => getColumnsFromData(initialData));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    columns.forEach((c) => (map[c] = true));
    return map;
  });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(defaultFileName);

  // --- Helpers ---
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const bstr = ev.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      // toma la primera hoja
      const firstSheetName = wb.SheetNames[0];
      const ws = wb.Sheets[firstSheetName];
      const json: Row[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setData(json);
      const cols = getColumnsFromData(json);
      setColumns(cols);
      const vis: Record<string, boolean> = {};
      cols.forEach((c) => (vis[c] = true));
      setVisibleColumns(vis);
      setPage(1);
      setExpandedRow(null);
    };
    reader.readAsBinaryString(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const f = e.dataTransfer.files[0];
      const fake = { target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFile(fake);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = data.slice();
    if (q) {
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    if (sortBy) {
      rows.sort((a, b) => {
        const va = a[sortBy];
        const vb = b[sortBy];
        if (va == null && vb == null) return 0;
        if (va == null) return sortDir === "asc" ? -1 : 1;
        if (vb == null) return sortDir === "asc" ? 1 : -1;
        if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
          return sortDir === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
        }
        return sortDir === "asc"
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }
    return rows;
  }, [data, query, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((v) => ({ ...v, [col]: !v[col] }));
  };

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const exportCSV = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "POAI");
    XLSX.writeFile(wb, (fileName ? fileName.replace(/\.[^/.]+$/, "") : "poai") + "_export.csv");
  }, [filtered, fileName]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (fileName ? fileName.replace(/\.[^/.]+$/, "") : "poai") + "_export.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [filtered, fileName]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4">
      <header className="tw-flex tw-items-center tw-justify-between tw-gap-4">
        <h2 className="tw-text-xl tw-font-semibold">Visor POAI (Excel)</h2>
        <div className="tw-flex tw-items-center tw-gap-2">
          <label className="tw-inline-flex tw-items-center tw-gap-2 tw-cursor-pointer">
            <input type="file" accept=".xlsx,.xls" onChange={handleFile} className="tw-hidden" />
            <span className="tw-bg-blue-600 tw-text-white tw-px-3 tw-py-1 tw-rounded">Cargar Excel</span>
          </label>
          <button className="tw-border tw-rounded tw-px-3 tw-py-1" onClick={exportCSV}>Exportar CSV</button>
          <button className="tw-border tw-rounded tw-px-3 tw-py-1" onClick={exportJSON}>Exportar JSON</button>
        </div>
      </header>

      <div
        className="tw-border-dashed tw-border-2 tw-p-4 tw-rounded tw-bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="tw-text-sm">Arrastra y suelta un archivo .xlsx aquí, o usa el botón "Cargar Excel".</div>
        <div className="tw-text-xs tw-text-muted-foreground">Archivo: {fileName ?? "(ninguno)"}</div>
      </div>

      <div className="tw-flex tw-gap-4 tw-items-center tw-flex-wrap">
        <input
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="tw-border tw-rounded tw-px-2 tw-py-1 tw-w-64"
        />

        <div className="tw-flex tw-items-center tw-gap-2">
          <label className="tw-text-sm">Tamaño página</label>
          <select value={String(pageSize)} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="tw-border tw-rounded tw-px-2 tw-py-1">
            {[10, 15, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="tw-flex tw-gap-2 tw-items-center">
          <details className="tw-bg-white tw-p-2 tw-rounded tw-border">
            <summary className="tw-cursor-pointer">Columnas ({columns.length})</summary>
            <div className="tw-max-h-48 tw-overflow-auto tw-py-2">
              {columns.map((c) => (
                <label key={c} className="tw-flex tw-items-center tw-gap-2 tw-py-1 tw-px-2">
                  <input type="checkbox" checked={!!visibleColumns[c]} onChange={() => toggleColumn(c)} />
                  <span className="tw-text-sm">{c}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="tw-overflow-auto tw-border tw-rounded">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-3 tw-py-2">#</th>
              {columns.filter((c) => visibleColumns[c]).map((col) => (
                <th key={col} className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleSort(col)}>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <span>{col}</span>
                    {sortBy === col && <small>{sortDir === "asc" ? "▲" : "▼"}</small>}
                  </div>
                </th>
              ))}
              <th className="tw-px-3 tw-py-2">Acción</th>
            </tr>
          </thead>
          <tbody className="tw-bg-white tw-divide-y tw-divide-gray-100">
            {paginated.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr className="tw-hover:bg-gray-50">
                  <td className="tw-px-3 tw-py-2">{(page - 1) * pageSize + idx + 1}</td>
                  {columns.filter((c) => visibleColumns[c]).map((col) => (
                    <td key={col} className="tw-px-3 tw-py-2 tw-text-sm">{String(row[col] ?? "")}</td>
                  ))}
                  <td className="tw-px-3 tw-py-2">
                    <button className="tw-text-sm tw-px-2 tw-py-1 tw-rounded tw-border" onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}>
                      {expandedRow === idx ? "Cerrar" : "Ver"}
                    </button>
                  </td>
                </tr>
                {expandedRow === idx && (
                  <tr>
                    <td colSpan={columns.filter((c) => visibleColumns[c]).length + 2} className="tw-px-3 tw-py-2 tw-bg-gray-50">
                      <pre className="tw-text-xs tw-overflow-auto">{JSON.stringify(row, null, 2)}</pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="tw-flex tw-items-center tw-justify-between tw-gap-4">
        <div className="tw-text-sm">Mostrando {filtered.length} filas — Página {page} / {totalPages}</div>
        <div className="tw-flex tw-items-center tw-gap-2">
          <button className="tw-px-2 tw-py-1 tw-border tw-rounded" onClick={() => setPage(1)} disabled={page === 1}>Primera</button>
          <button className="tw-px-2 tw-py-1 tw-border tw-rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
          <button className="tw-px-2 tw-py-1 tw-border tw-rounded" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Siguiente</button>
          <button className="tw-px-2 tw-py-1 tw-border tw-rounded" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Última</button>
        </div>
      </footer>
    </div>
  );
}

// --- Utilities ---
function getColumnsFromData(data: Row[]) {
  const set = new Set<string>();
  data.forEach((r) => Object.keys(r).forEach((k) => set.add(k)));
  return Array.from(set);
}
