import os
import subprocess
import sys

html_content = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Manual de Usuario - Controland</title>
<style>
  @page {
    size: A4;
    margin: 15mm 14mm 15mm 14mm;
    @bottom-right {
      content: counter(page);
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.48;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }

  .cover {
    height: 94vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    page-break-after: always;
    border: 2px solid #012947;
    padding: 30px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
    border-radius: 12px;
  }

  .cover-badge {
    background-color: #FD8E19;
    color: white;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10.5pt;
    letter-spacing: 2px;
    padding: 5px 14px;
    border-radius: 9999px;
    margin-bottom: 20px;
    display: inline-block;
  }

  .cover h1 {
    font-size: 30pt;
    color: #012947;
    margin: 0 0 8px 0;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .cover h2 {
    font-size: 15pt;
    color: #475569;
    font-weight: 500;
    margin: 0 0 25px 0;
  }

  .cover-meta {
    margin-top: 40px;
    border-top: 1px solid #cbd5e1;
    padding-top: 20px;
    width: 80%;
    display: flex;
    justify-content: space-around;
    font-size: 9.5pt;
    color: #334155;
  }

  .page-break {
    page-break-after: always;
  }

  h1.section-title {
    color: #012947;
    font-size: 16pt;
    border-bottom: 2px solid #012947;
    padding-bottom: 5px;
    margin-top: 18px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }

  h2 {
    color: #0f172a;
    font-size: 12pt;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
    border-left: 3.5px solid #FD8E19;
    padding-left: 7px;
  }

  h3 {
    color: #334155;
    font-size: 10.5pt;
    margin-top: 10px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 6px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 3px 0 10px 18px;
    padding: 0;
  }

  li {
    margin-bottom: 3px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px 0;
    font-size: 8.5pt;
    break-inside: auto;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 5px 8px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #012947;
    color: white;
    font-weight: 600;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  .callout {
    padding: 8px 12px;
    border-radius: 6px;
    margin: 8px 0;
    font-size: 8.5pt;
    break-inside: avoid;
  }

  .callout-info {
    background-color: #eff6ff;
    border-left: 3.5px solid #3b82f6;
    color: #1e40af;
  }

  .callout-tip {
    background-color: #f0fdf4;
    border-left: 3.5px solid #10b981;
    color: #065f46;
  }

  .step-box {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 9px 12px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    break-inside: auto;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 4px;
  }

  .step-number {
    background-color: #012947;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 8pt;
    font-weight: 700;
  }

  .step-title {
    font-weight: 700;
    font-size: 9.5pt;
    color: #012947;
  }

  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 600;
    text-transform: uppercase;
  }

  .badge-admin { background-color: #fee2e2; color: #991b1b; }
  .badge-planeacion { background-color: #fef3c7; color: #92400e; }
  .badge-funcionario { background-color: #dbeafe; color: #1e40af; }
  .badge-public { background-color: #e2e8f0; color: #334155; }

  .toc {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 12px 18px;
    border-radius: 8px;
    margin: 12px 0 18px 0;
  }

  .toc ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc li {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    font-size: 9pt;
    border-bottom: 1px dotted #cbd5e1;
    padding-bottom: 2px;
  }

  .toc li a {
    text-decoration: none;
    color: #012947;
    font-weight: 600;
  }

  .workflow-diagram {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px;
    break-inside: avoid;
  }

  .wf-node {
    background: white;
    border: 1.5px solid #012947;
    border-radius: 5px;
    padding: 5px 6px;
    text-align: center;
    font-size: 7.5pt;
    font-weight: 600;
    color: #012947;
    width: 18%;
  }

  .wf-arrow {
    color: #FD8E19;
    font-size: 12pt;
    font-weight: bold;
  }

  /* ESPACIOS DE IMÁGENES COMPACTOS Y PROPORCIONALES */
  .screenshot-placeholder {
    border: 1.5px dashed #94a3b8;
    background-color: #f8fafc;
    border-radius: 6px;
    padding: 8px 10px;
    text-align: center;
    margin: 6px 0 10px 0;
    break-inside: avoid;
    box-sizing: border-box;
  }

  .screenshot-placeholder .img-icon {
    font-size: 13pt;
    display: block;
    margin-bottom: 1px;
    color: #012947;
  }

  .screenshot-title {
    font-size: 8pt;
    font-weight: 700;
    color: #012947;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
  }

  .screenshot-desc {
    font-size: 7.5pt;
    color: #64748b;
    font-style: italic;
    margin-top: 1px;
    display: block;
  }
</style>
</head>
<body>

<!-- PORTADA -->
<div class="cover">
  <div class="cover-badge">SISTEMA INTEGRAL DE GESTIÓN PÚBLICA</div>
  <h1>CONTROLAND</h1>
  <h2>Manual Oficial de Usuario y Procedimientos Operativos</h2>
  <p style="text-align: center; max-width: 500px; color: #64748b; font-size: 9.5pt;">
    Guía práctica de operación para el registro de avances, reporte de evidencias, georreferenciación y auditoría del Plan de Desarrollo Municipal.
  </p>
  
  <div class="cover-meta">
    <div><strong>Aplicativo:</strong> Controland</div>
    <div><strong>Área:</strong> Planeación y Secretarías</div>
    <div><strong>Vigencia:</strong> 2026</div>
    <div><strong>Entidad:</strong> Administración Municipal</div>
  </div>
</div>

<!-- ÍNDICE GENERAL -->
<h1 class="section-title">Contenido General</h1>
<div class="toc">
  <ul>
    <li><span>1. Introducción y Propósito del Sistema</span><span>Pág. 2</span></li>
    <li><span>2. Perfiles de Usuario y Niveles de Acceso</span><span>Pág. 3</span></li>
    <li><span>3. Ciclo de Reporte y Semaforización</span><span>Pág. 4</span></li>
    <li><span>4. Acceso al Sistema y Menú Principal</span><span>Pág. 5</span></li>
    <li><span>5. Guía de Tareas: Secretarías y Reportantes</span><span>Pág. 6</span></li>
    <li><span>6. Guía de Tareas: Planeación y Supervisión</span><span>Pág. 8</span></li>
    <li><span>7. Guía de Tareas: Administración del Sistema</span><span>Pág. 9</span></li>
    <li><span>8. Módulos Adicionales: Mapa, POAI, Banco y PQRS</span><span>Pág. 10</span></li>
    <li><span>9. Catálogos Oficiales de Consulta Rápida</span><span>Pág. 11</span></li>
    <li><span>10. Preguntas Frecuentes y Solución de Errores</span><span>Pág. 12</span></li>
  </ul>
</div>

<!-- SECCIÓN 1: INTRODUCCIÓN -->
<h1 class="section-title">1. Introducción y Propósito del Sistema</h1>
<p>
  <strong>Controland</strong> es la herramienta oficial de la administración para realizar el seguimiento, control y evaluación del Plan de Desarrollo Municipal. Permite a cada secretaría reportar periódicamente el avance físico y financiero de sus metas, respaldar cada cifra con documentos probatorios válidos (archivos y enlaces) y registrar la ubicación geográfica de las obras en el mapa del territorio.
</p>

<h2>1.1 Beneficios Principales para los Funcionarios</h2>
<ul>
  <li><strong>Claridad en las Metas:</strong> Visualice en un solo lugar los compromisos, indicadores y metas anuales asignados a su dependencia.</li>
  <li><strong>Facilidad de Reporte:</strong> Cargue evidencias documentales y fotográficas directamente desde cualquier computador con conexión a internet.</li>
  <li><strong>Control de Plazos:</strong> Conozca con anticipación las fechas límite de reporte y evite rezagos o alertas en la rendición de cuentas.</li>
  <li><strong>Seguimiento Territorial:</strong> Localice las obras públicas en el mapa oficial para mostrar el impacto en barrios, veredas y comunas.</li>
</ul>

<h2>1.2 Estructura Dinámica y Adaptable del Plan de Desarrollo</h2>
<div class="callout callout-info">
  <strong>Estructura Flexible:</strong> La jerarquía del árbol del Plan en Controland es completamente <strong>dinámica</strong> y se adapta a las necesidades y a la metodología adoptada por cada entidad o municipio (aprobada por Acuerdo Municipal o Decreto).
</div>
<p>
  El sistema no impone un esquema fijo; según la configuración de la entidad territorial, el árbol puede estructurarse en 3, 4, 5 o más niveles jerárquicos:
</p>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">Modelo de Entidad</th>
      <th style="width: 45%;">Niveles Jerárquicos en el Sistema</th>
      <th style="width: 30%;">Nivel de Reporte</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Esquema de 3 Niveles</strong></td>
      <td>Eje Estratégico &rarr; Programa &rarr; <strong>Meta de Producto</strong></td>
      <td>Meta de Producto (Hoja)</td>
    </tr>
    <tr>
      <td><strong>Esquema de 4 Niveles</strong></td>
      <td>Línea Estratégica &rarr; Sector &rarr; Programa &rarr; <strong>Meta de Producto</strong></td>
      <td>Meta de Producto (Hoja)</td>
    </tr>
    <tr>
      <td><strong>Esquema de 5 Niveles</strong></td>
      <td>Línea &rarr; Sector &rarr; Programa &rarr; Subprograma &rarr; <strong>Meta de Producto</strong></td>
      <td>Meta de Producto (Hoja)</td>
    </tr>
  </tbody>
</table>
<p>
  El sistema genera automáticamente la navegación, los filtros y la consolidación de cálculos respetando la estructura configurada para el municipio. <em>Independientemente del número de niveles superiores, el nivel final sobre el cual el funcionario siempre reporta avances y evidencias es la <strong>Meta de Producto (nivel hoja)</strong>.</em>
</p>

<!-- SECCIÓN 2: ROLES Y PERMISOS -->
<h1 class="section-title">2. Perfiles de Usuario y Niveles de Acceso</h1>
<p>
  Cada funcionario cuenta con un usuario y contraseña institucional que define las funciones a las que tiene acceso:
</p>

<table>
  <thead>
    <tr>
      <th>Perfil</th>
      <th>¿Quién lo Utiliza?</th>
      <th>Funciones Permitidas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-funcionario">Secretaría / Reportante</span></td>
      <td>Enlaces y secretarios responsables de ejecutar metas.</td>
      <td>
        • Consultar las metas de su dependencia.<br>
        • Reportar cantidades físicas y montos ejecutados.<br>
        • Cargar soportes (actas, fotos, enlaces web).<br>
        • Marcar en el mapa la ubicación geográfica de las obras.
      </td>
    </tr>
    <tr>
      <td><span class="badge badge-planeacion">Planeación / Supervisor</span></td>
      <td>Equipo de seguimiento de la Secretaría de Planeación.</td>
      <td>
        • Supervisar el semáforo de cumplimiento de todo el plan.<br>
        • Revisar y auditar los documentos subidos por cada secretaría.<br>
        • Validar (aprobar) o solicitar corrección (rechazar) de evidencias.<br>
        • Descargar reportes consolidados en Excel para rendición de cuentas.
      </td>
    </tr>
    <tr>
      <td><span class="badge badge-admin">Administrador</span></td>
      <td>Responsable de la plataforma en la administración.</td>
      <td>
        • Crear usuarios y asignar secretarías.<br>
        • Configurar las fechas límite de reporte (fechas de corte).<br>
        • Actualizar la estructura general del plan.
      </td>
    </tr>
    <tr>
      <td><span class="badge badge-public">Ciudadano / Control Social</span></td>
      <td>Comunidad y entes de control.</td>
      <td>
        • Consultar el avance público de las metas.<br>
        • Radicar y consultar el estado de peticiones ciudadanas (PQRS).
      </td>
    </tr>
  </tbody>
</table>

<!-- SECCIÓN 3: CICLO DE VIDA DEL REPORTE -->
<h1 class="section-title">3. Ciclo de Reporte y Semaforización</h1>
<p>
  El proceso para certificar un avance consta de cinco pasos consecutivos:
</p>

<div class="workflow-diagram">
  <div class="wf-node">1. Asignación<br><small>Secretaría responsable</small></div>
  <div class="wf-arrow">&rarr;</div>
  <div class="wf-node">2. Reporte<br><small>Cantidad y soportes</small></div>
  <div class="wf-arrow">&rarr;</div>
  <div class="wf-node">3. Revisión<br><small>Planeación audita</small></div>
  <div class="wf-arrow">&rarr;</div>
  <div class="wf-node">4. Decisión<br><small>Aprobación o devolución</small></div>
  <div class="wf-arrow">&rarr;</div>
  <div class="wf-node">5. Semáforo<br><small>Avance oficial</small></div>
</div>

<h2>3.1 Código de Colores del Semáforo</h2>
<p>
  El sistema calcula automáticamente el cumplimiento comparando lo ejecutado frente a lo programado para el año:
</p>
<table>
  <thead>
    <tr>
      <th>Porcentaje de Avance</th>
      <th>Estado</th>
      <th>Color</th>
      <th>Significado Práctico</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>0% a 39%</strong></td>
      <td>Crítico</td>
      <td>Rojo</td>
      <td>Meta con atraso considerable. Requiere acciones correctivas urgentes.</td>
    </tr>
    <tr>
      <td><strong>40% a 69%</strong></td>
      <td>Alerta</td>
      <td>Naranja</td>
      <td>Ejecución por debajo de lo previsto. Requiere acelerar contrataciones u obras.</td>
    </tr>
    <tr>
      <td><strong>70% a 89%</strong></td>
      <td>Aceptable</td>
      <td>Amarillo</td>
      <td>Avance adecuado con pequeños pendientes por certificar.</td>
    </tr>
    <tr>
      <td><strong>90% a 100%</strong></td>
      <td>Exitoso</td>
      <td>Verde</td>
      <td>Meta cumplida conforme a lo programado para la vigencia.</td>
    </tr>
    <tr>
      <td><strong>Más del 100%</strong></td>
      <td>Destacado</td>
      <td>Azul</td>
      <td>La secretaría superó la cantidad programada para el año.</td>
    </tr>
  </tbody>
</table>

<!-- SECCIÓN 4: ACCESO Y LOBBY -->
<h1 class="section-title">4. Acceso al Sistema y Menú Principal</h1>

<div class="step-box">
  <div class="step-header">
    <span class="step-number">1</span>
    <span class="step-title">Inicio de Sesión</span>
  </div>
  <p>Abra su navegador de internet (Google Chrome, Microsoft Edge o Firefox) e ingrese a la dirección del portal institucional:</p>
  <ul>
    <li>Escriba su <strong>Correo Electrónico Institucional</strong> y su <strong>Contraseña</strong>.</li>
    <li>Haga clic en <strong>"Iniciar Sesión"</strong>. El sistema reconocerá automáticamente su entidad y le dará ingreso directo a su Plan de Desarrollo.</li>
    <li><em>¿Olvidó su clave?:</em> Pulse en "¿Olvidó su contraseña?", ingrese su correo y recibirá el enlace para crear una nueva clave.</li>
  </ul>
</div>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 1: Pantalla de Inicio de Sesión</span>
  <span class="screenshot-desc">[Captura del formulario de Login con campos de correo y contraseña]</span>
</div>

<div class="step-box">
  <div class="step-header">
    <span class="step-number">2</span>
    <span class="step-title">Menú Principal (Panel del Plan)</span>
  </div>
  <p>Al iniciar sesión, verá el panel principal con los módulos activos según su perfil:</p>
  <ul>
    <li><strong>Plan Indicativo:</strong> Consulta de metas, avances físicos/financieros y registro de evidencias.</li>
    <li><strong>Mapa de Intervención:</strong> Mapa geográfico de todas las obras y reportes registrados.</li>
    <li><strong>POAI y Banco de Proyectos:</strong> Proyectos presupuestales asociados.</li>
    <li><strong>PQRS:</strong> Solicitudes y peticiones ciudadanas.</li>
  </ul>
</div>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 2: Menú Principal con Tarjetas de Módulos</span>
  <span class="screenshot-desc">[Captura del menú principal de bienvenida con acceso a los módulos operativos]</span>
</div>

<!-- SECCIÓN 5: GUÍA PARA SECRETARÍAS -->
<h1 class="section-title">5. Guía de Tareas: Secretarías y Reportantes</h1>

<h2>Tarea 5.1: Localizar la Meta que Desea Reportar</h2>
<div class="step-box">
  <ol>
    <li>En el menú principal, haga clic en la tarjeta <strong>"Plan Indicativo"</strong>.</li>
    <li>Navegue en la estructura haciendo clic en su línea, sector y programa correspondiente.</li>
    <li>Encuentre la <strong>Meta de Producto</strong> asignada a su secretaría y haga clic para abrir su ficha completa.</li>
  </ol>
</div>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 3: Navegación del Árbol de Metas en el Plan Indicativo</span>
  <span class="screenshot-desc">[Captura de la estructura multinivel del árbol con los semáforos de cumplimiento]</span>
</div>

<h2>Tarea 5.2: Abrir el Formulario de Reporte</h2>
<div class="step-box">
  <p>Dentro de la ficha de la meta:</p>
  <ul>
    <li>Revise la unidad de medida, la cantidad programada para este año y el acumulado actual.</li>
    <li>Haga clic en el botón <strong>"Adicionar Reporte / Evidencias"</strong> ubicado en la parte superior.</li>
  </ul>
</div>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 4: Ficha de la Meta y Botón de Reporte</span>
  <span class="screenshot-desc">[Captura de la ficha técnica de la meta con el botón para reportar evidencias]</span>
</div>

<h2>Tarea 5.3: Diligenciamiento Completo del Reporte de Evidencia</h2>
<p>
  El formulario de reporte agrupa toda la información probatoria en 5 bloques continuos. Complete cada sección según los documentos contractuales y de ejecución:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 25%;">Bloque del Formulario</th>
      <th style="width: 35%;">Campos a Diligenciar</th>
      <th style="width: 40%;">Instrucciones Prácticas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Actividad y Cantidad</strong></td>
      <td>• Vigencia (Año)<br>• Descripción de Actividades<br>• Unidad de Medida<br>• Cantidad Física</td>
      <td>Redacte de forma detallada las obras o bienes entregados. Indique la cantidad física lograda (mayor a 0) en la unidad oficial de la meta.</td>
    </tr>
    <tr>
      <td><strong>2. Ubicación Territorial</strong></td>
      <td>• Comuna / Corregimiento<br>• Barrio / Vereda</td>
      <td>Seleccione la zona beneficiada. Si la obra impacta todo el municipio, elija la opción <em>Todas</em>.</td>
    </tr>
    <tr>
      <td><strong>3. Coordenada en Mapa</strong></td>
      <td>• Punto GPS en mapa interactivo</td>
      <td>Pulse el botón de mapa, haga un clic sobre el lugar exacto de la intervención territorial hasta ver la confirmación verde <em>"Ubicación asignada"</em>.</td>
    </tr>
    <tr>
      <td><strong>4. Población y Recursos</strong></td>
      <td>• Grupo Poblacional<br>• No. Beneficiados<br>• Recursos Ejecutados ($)<br>• Fuente de Financiación</td>
      <td>Indique el grupo humano beneficiado, el número de personas y el valor presupuestal ejecutado con su respectiva fuente (ICLD, SGP, Regalías, etc.).</td>
    </tr>
    <tr>
      <td><strong>5. Soportes (PDF y Web)</strong></td>
      <td>• Archivo PDF (Actas, fotos)<br>• Enlace Web (Drive, SECOP)<br>• Nombre, Lugar y Fecha</td>
      <td>Pulse <em>"+ Agregar Soporte"</em>. Adjunte el PDF con actas y fotos, o pegue el enlace web iniciando con <code>https://</code>. Indique nombre, lugar del archivo y fecha.</td>
    </tr>
  </tbody>
</table>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 5: Formulario de Reporte de Evidencias - Datos Generales</span>
  <span class="screenshot-desc">[Captura de pantalla de los campos de actividades, cantidades, población y recursos financieros]</span>
</div>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 6: Selector Geográfico en Mapa y Carga Dinámica de Soportes</span>
  <span class="screenshot-desc">[Captura de la ventana interactiva de mapa y la sección para adjuntar archivos PDF y enlaces web]</span>
</div>

<div class="callout callout-tip">
  <strong>Recomendación práctica:</strong> Recomendamos unir el acta de recibo a satisfacción y el registro fotográfico en un solo documento PDF antes de subirlo.
</div>

<div class="step-box">
  <div class="step-header"><span class="step-number">&check;</span><span class="step-title">Guardar y Confirmar el Reporte</span></div>
  <p>Una vez verificada la información, haga clic en el botón inferior <strong>"Guardar Evidencia"</strong>. El sistema procesará el envío y mostrará la notificación de confirmación exitosa.</p>
</div>

<!-- SECCIÓN 6: GUÍA PARA SUPERVISORES -->
<h1 class="section-title">6. Guía de Tareas: Planeación y Supervisión</h1>

<h2>Tarea 6.1: Monitoreo del Semáforo</h2>
<div class="step-box">
  <ul>
    <li>Ingrese a <strong>Plan Indicativo</strong> y revise el color de cada programa y meta.</li>
    <li>Filtre por año para identificar rápidamente las metas en rojo o naranja que requieren atención inmediata.</li>
  </ul>
</div>

<h2>Tarea 6.2: Revisión y Auditoría de Evidencias</h2>
<div class="step-box">
  <ol>
    <li>Abra la meta a auditar y haga clic en <strong>"Ver Evidencias"</strong>.</li>
    <li>Revise el historial con cada uno de los reportes enviados por la secretaría (fecha, responsable, cantidad, población y recursos).</li>
    <li>Haga clic sobre el icono del documento para abrir el archivo PDF y verificar las firmas y anexos. Si hay un enlace web, haga clic para verificar los soportes en línea.</li>
  </ol>
</div>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 7: Bandeja de Revisión y Auditoría de Evidencias</span>
  <span class="screenshot-desc">[Captura del listado de evidencias reportadas con opciones de descarga y revisión]</span>
</div>

<h2>Tarea 6.3: Aprobación o Devolución con Observaciones</h2>
<div class="step-box">
  <ul>
    <li><strong>Aprobar:</strong> Si los documentos cumplen con los requisitos contractuales y técnicos, confirme la validación. La cantidad reportada se sumará al porcentaje oficial de cumplimiento.</li>
    <li><strong>Rechazar / Devolver:</strong> Si el soporte está incompleto o ilegible, marque la evidencia para ajuste y escriba la observación para que la secretaría la corrija.</li>
  </ul>
</div>

<h2>Tarea 6.4: Descarga de Reportes en Excel</h2>
<div class="step-box">
  <p>Para generar el informe oficial consolidado:</p>
  <ul>
    <li>En la cabecera del Plan Indicativo, haga clic en <strong>"Exportar a Excel"</strong>.</li>
    <li>Se descargará un archivo con el consolidado de programación, ejecución física, presupuestal y porcentajes de cada meta.</li>
  </ul>
</div>

<!-- SECCIÓN 7: GUÍA ADMINISTRADOR TI -->
<h1 class="section-title">7. Guía de Tareas: Administración del Sistema</h1>

<h2>Tarea 7.1: Gestión de Usuarios</h2>
<div class="step-box">
  <ul>
    <li><strong>Crear Usuarios:</strong> Ingrese a la sección de gestión de usuarios, registre el nombre del funcionario, correo institucional, clave inicial y asigne el perfil correspondiente (Secretaría o Planeación).</li>
    <li><strong>Desactivar Accesos:</strong> En caso de cambio de personal, desactive el usuario para proteger la información del municipio.</li>
  </ul>
</div>

<h2>Tarea 7.2: Configuración de Fechas Límite (Fechas de Corte)</h2>
<div class="step-box">
  <ul>
    <li><strong>Fecha de Corte:</strong> Defina el día y hora límite tras el cual el sistema cerrará el formulario para una vigencia (por ejemplo: cierre de reportes del año anterior). Una vez pasada la fecha, los funcionarios no podrán modificar ni crear nuevos reportes sin autorización.</li>
  </ul>
</div>

<!-- SECCIÓN 8: MÓDULOS ESTRATÉGICOS -->
<h1 class="section-title">8. Módulos Adicionales: Mapa, POAI, Banco y PQRS</h1>

<h2>8.1 Mapa de Intervenciones Territoriales</h2>
<p>
  Muestra sobre el mapa del municipio todas las obras y actividades que tienen coordenadas asignadas. Permite filtrar por secretaría o sector para ver la distribución de la inversión en el territorio.
</p>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 8: Visor Geográfico de Obras y Reportes</span>
  <span class="screenshot-desc">[Captura de pantalla del mapa territorial con marcadores georreferenciados]</span>
</div>

<h2>8.2 POAI y Banco de Proyectos</h2>
<p>
  Permite consultar la relación entre los proyectos de inversión pública y las metas del Plan de Desarrollo, asegurando la articulación entre el presupuesto municipal y los compromisos de gobierno.
</p>

<h2>8.3 Módulo de Atención Ciudadana (PQRS)</h2>
<p>
  Canal oficial para gestionar las peticiones, quejas, reclamos y sugerencias de la ciudadanía:
</p>
<ul>
  <li><strong>Radicación:</strong> El ciudadano registra su solicitud y recibe un número único de radicado.</li>
  <li><strong>Trámite:</strong> Los funcionarios reciben la notificación, preparan la respuesta oficial y adjuntan los documentos de solución.</li>
  <li><strong>Consulta:</strong> Con su número de radicado, el ciudadano consulta el estado de su trámite en cualquier momento.</li>
</ul>

<div class="screenshot-placeholder">
  <span class="img-icon">🖼️</span>
  <span class="screenshot-title">Figura 9: Bandeja de Gestión de Solicitudes Ciudadanas (PQRS)</span>
  <span class="screenshot-desc">[Captura del panel de peticiones ciudadanas y seguimiento de tiempos de respuesta]</span>
</div>

<!-- SECCIÓN 9: CATÁLOGO DE REFERENCIA -->
<h1 class="section-title">9. Catálogos Oficiales de Consulta Rápida</h1>

<h2>9.1 Catálogo de Grupos Poblacionales</h2>
<table>
  <thead>
    <tr><th>Opción en el Sistema</th><th>Grupo Poblacional</th><th>Cuándo Usarlo</th></tr>
  </thead>
  <tbody>
    <tr><td><code>AdultoMayor</code></td><td>Adulto Mayor</td><td>Programas y subsidios para mayores de 60 años.</td></tr>
    <tr><td><code>Afrodescendientes</code></td><td>Comunidades Negras y Afro</td><td>Iniciativas concertadas con comunidades afrodescendientes.</td></tr>
    <tr><td><code>Adolescentes</code></td><td>Niños, Niñas y Adolescentes</td><td>Programas de primera infancia, escolares y jóvenes menores de edad.</td></tr>
    <tr><td><code>Discapacitados</code></td><td>Personas con Discapacidad</td><td>Proyectos de inclusión, ayudas técnicas y accesibilidad.</td></tr>
    <tr><td><code>Indigenas</code></td><td>Comunidades Indígenas</td><td>Inversión en resguardos y comunidades originarias.</td></tr>
    <tr><td><code>Jovenes</code></td><td>Juventud</td><td>Capacitación, empleo y proyectos juveniles (18 a 28 años).</td></tr>
    <tr><td><code>Mujeres</code></td><td>Mujeres y Equidad de Género</td><td>Programas de autonomía económica y prevención de violencias.</td></tr>
    <tr><td><code>Victimas</code></td><td>Víctimas del Conflicto</td><td>Atención integral, proyectos productivos y retornos.</td></tr>
    <tr><td><code>Todos</code></td><td>Población General</td><td>Obras de uso común como vías, puentes, parques y alumbrado.</td></tr>
  </tbody>
</table>

<h2>9.2 Catálogo de Fuentes de Recursos</h2>
<table>
  <thead>
    <tr><th>Opción en el Sistema</th><th>Descripción Presupuestal</th></tr>
  </thead>
  <tbody>
    <tr><td><code>RecursosPropiosICLD</code></td><td>Ingresos Corrientes de Libre Destinación (predial, industria y comercio)</td></tr>
    <tr><td><code>RecursosPropiosICDE</code></td><td>Ingresos Corrientes de Destinación Específica</td></tr>
    <tr><td><code>SGP</code> (Educación / Salud / General)</td><td>Recursos del Sistema General de Participaciones girados por la Nación</td></tr>
    <tr><td><code>Regalias</code></td><td>Recursos del Sistema General de Regalías</td></tr>
    <tr><td><code>Credito</code></td><td>Recursos obtenidos por préstamos o endeudamiento municipal</td></tr>
    <tr><td><code>Cofinanciacion</code></td><td>Recursos aportados en convenio con la Gobernación o Ministerios</td></tr>
  </tbody>
</table>

<!-- SECCIÓN 10: SOLUCIÓN DE PROBLEMAS -->
<h1 class="section-title">10. Preguntas Frecuentes y Solución de Errores</h1>

<table>
  <thead>
    <tr>
      <th style="width: 32%;">Mensaje o Situación</th>
      <th style="width: 28%;">¿Por qué Ocurre?</th>
      <th style="width: 40%;">¿Cómo Solucionarlo?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>"El archivo debe ser PDF"</strong></td>
      <td>Se intentó subir una foto o documento en Word o Excel.</td>
      <td>Guarde o convierta el archivo a formato <code>.pdf</code> en su computador antes de subirlo.</td>
    </tr>
    <tr>
      <td><strong>"El enlace debe iniciar con http:// o https://"</strong></td>
      <td>El enlace se escribió incompleto (ejemplo: <code>drive.google.com...</code>).</td>
      <td>Agregue <code>https://</code> al principio del enlace en la casilla correspondiente.</td>
    </tr>
    <tr>
      <td><strong>"Ubicación no asignada" en rojo</strong></td>
      <td>No se ha hecho clic en el mapa para marcar el punto de la obra.</td>
      <td>Abra el botón de mapa y haga un clic sobre el lugar donde se ubica la actividad hasta que el mensaje cambie a verde.</td>
    </tr>
    <tr>
      <td><strong>"No se ha seleccionado una meta"</strong></td>
      <td>Se actualizó el navegador mientras estaba dentro del formulario.</td>
      <td>Regrese al Plan Indicativo, busque nuevamente la meta y pulse "Adicionar Reporte".</td>
    </tr>
    <tr>
      <td><strong>El botón de guardar no aparece o está bloqueado</strong></td>
      <td>La fecha límite (fecha de corte) para el año ya se cumplió.</td>
      <td>Comuníquese con Planeación o el Administrador para solicitar una prórroga justificada de reporte.</td>
    </tr>
  </tbody>
</table>

<div style="margin-top: 30px; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; color: #94a3b8; font-size: 8pt;">
  Controland &copy; 2026 &bull; Sistema de Gestión y Control del Plan de Desarrollo Municipal &bull; Uso Institucional
</div>

</body>
</html>
"""

output_pdf_targets = [
    r"c:\Users\inkSh\OneDrive\Documents\GitHub\Controland\CloudControl_frontend\MANUAL_DE_USUARIO_CONTROLAND_VITE.pdf",
    r"c:\Users\inkSh\OneDrive\Documents\GitHub\Controland\CloudControl_frontend\MANUAL_DE_USUARIO_CONTROLAND.pdf",
]
html_path = r"c:\Users\inkSh\OneDrive\Documents\GitHub\Controland\CloudControl_frontend\MANUAL_DE_USUARIO_CONTROLAND.html"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generado exitosamente en: {html_path}")

chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_exe):
    chrome_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

print(f"Compilando PDF con motor: {chrome_exe}...")

for target_pdf in output_pdf_targets:
    cmd = [
        chrome_exe,
        "--headless=new",
        "--disable-gpu",
        f"--print-to-pdf={target_pdf}",
        "--no-pdf-header-footer",
        html_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(target_pdf):
        size_kb = os.path.getsize(target_pdf) / 1024
        print(f"PDF generado: {target_pdf} ({size_kb:.2f} KB)")
    else:
        print(f"Error generando PDF {target_pdf}: {res.stderr}")
