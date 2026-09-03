import type {
  VoucherData,
  VoucherDesglose,
  VoucherItem,
  VoucherPiezaDetalle,
  VoucherPricingTier,
} from "@/types/voucher";

function formatMoney(value: number, currency: string): string {
  const safe = isNaN(value) ? 0 : value;
  return `${safe.toFixed(2).replace(".", ",")} ${currency}`;
}

function formatTiempo(horas: number = 0, minutos: number = 0): string {
  const h = Math.floor(horas || 0);
  const m = Math.round(minutos || 0);
  if (h <= 0 && m <= 0) return "0min";
  if (h <= 0) return `${m}min`;
  if (m <= 0) return `${h}hrs`;
  return `${h}hrs ${m}min`;
}

function renderPricingTier(tier: VoucherPricingTier, currency: string): string {
  return `
    <div class="tierCard">
      <div class="tierLabel">${tier.label} ${tier.conditionLabel || ""}</div>
      <div class="tierPrice">${formatMoney(tier.price, currency)}</div>
      ${tier.discountLabel ? `<div class="tierDiscount">${tier.discountLabel}</div>` : ""}
    </div>
  `;
}

function renderItemRow(item: VoucherItem, currency: string): string {
  return `
    <tr>
      <td class="tdDesc">${item.description}</td>
      <td class="tdCenter">${item.quantity}</td>
      <td class="tdCenter">${formatMoney(item.unitPrice, currency)}</td>
      <td class="tdTotal">${formatMoney(item.total, currency)}</td>
    </tr>
  `;
}

function renderDetailRow(
  label: string,
  value: number,
  currency: string,
  bold = false,
): string {
  const style = bold ? "font-weight:700;" : "";
  return `
    <div class="detailRow">
      <span class="detailLabel" style="${style}">${label}</span>
      <span class="detailValue" style="${style}">${formatMoney(value, currency)}</span>
    </div>
  `;
}

function renderCostBar(desglose: VoucherDesglose, accentColor: string): string {
  const segments = [
    { label: "MATERIAL", value: desglose.costoMaterial, color: "#1F2937" },
    { label: "OPERACIÓN", value: desglose.costoManoObra, color: "#4B5563" },
    { label: "DEPRECIACIÓN", value: desglose.costoDepreciacion, color: "#9CA3AF" },
    { label: "ENERGÍA", value: desglose.costoEnergia, color: "#D1D5DB" },
    { label: "UTILIDAD", value: desglose.montoGanancia, color: accentColor },
  ];
  const bar = segments
    .map(
      (s) =>
        `<div class="progressSegment" style="flex:${s.value > 0 ? s.value : 0.001};background:${s.color}"></div>`,
    )
    .join("");
  const legend = segments
    .map(
      (s) =>
        `<div class="legendItem"><span class="legendDot" style="background:${s.color}"></span>${s.label}</div>`,
    )
    .join("");
  return `<div class="progressBar">${bar}</div><div class="legendContainer">${legend}</div>`;
}

function renderPiezasResumen(piezas: VoucherPiezaDetalle[]): string {
  return `
    <div class="piezasResumenContainer">
      <div class="piezasResumenTitle">DETALLE DE PIEZAS</div>
      ${piezas
        .map(
          (p, idx) => `
        <div class="piezaCard">
          <div class="piezaCardNombre">${idx + 1}. ${p.nombrePieza}</div>
          <div class="piezaStatsRow">
            <div class="piezaStatCard">
              <div class="piezaStatLabel">Peso de Pieza</div>
              <div class="piezaStatValue">${p.pesoGramos ?? 0}g</div>
            </div>
            <div class="piezaStatCard">
              <div class="piezaStatLabel">Duración de Pieza</div>
              <div class="piezaStatValue">${formatTiempo(p.tiempoImpresionHoras, p.tiempoImpresionMinutos)}</div>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function renderTabPanel(
  id: string,
  currency: string,
  accent: string,
  opts: {
    isGeneral: boolean;
    titulo: string;
    desglose: VoucherDesglose;
    piezas?: VoucherPiezaDetalle[];
    cantidad: number;
    active: boolean;
  },
): string {
  const { isGeneral, titulo, desglose, piezas, cantidad, active } = opts;
  const subtotalDirecto =
    desglose.costoMaterial + desglose.costoManoObra + desglose.costoDepreciacion + desglose.costoEnergia;

  return `
  <div class="tabPanel" id="${id}" style="display:${active ? "block" : "none"}">
    <div class="panelHeaderRow">
      <div class="panelTitle">${titulo}</div>
      <div class="badge">x${cantidad} ${cantidad === 1 ? "unidad" : "unidades"}</div>
    </div>

    <div class="panelHeaderLabel">${isGeneral ? "PRECIO TOTAL (VENTA)" : "PRECIO SUGERIDO DE ESTA PIEZA (TOTAL)"}</div>
    <div class="priceRow"><span class="priceValue">${formatMoney(desglose.precioTotal, currency)}</span></div>
    <div class="subtextNotice">
      ${
        isGeneral
          ? "Precio total de venta de todas las piezas de este proyecto."
          : "Precio sugerido de esta pieza según su proporción dentro del costo directo total del proyecto."
      }
    </div>

    ${renderCostBar(desglose, accent)}

    ${
      isGeneral && piezas && piezas.length
        ? renderPiezasResumen(piezas)
        : `<div class="statsRow">
            <div class="statBox"><div class="statLabel">Peso de Pieza</div><div class="statValue">${desglose.pesoGramos ?? 0}g</div></div>
            <div class="statBox"><div class="statLabel">Duración de Pieza</div><div class="statValue">${formatTiempo(desglose.tiempoImpresionHoras, desglose.tiempoImpresionMinutos)}</div></div>
          </div>`
    }

    <div class="costDetails">
      ${renderDetailRow("Material directo", desglose.costoMaterial, currency)}
      ${renderDetailRow("Mano de obra / Preparación", desglose.costoManoObra, currency)}
      ${renderDetailRow("Depreciación de máquina", desglose.costoDepreciacion, currency)}
      ${renderDetailRow("Energía eléctrica", desglose.costoEnergia, currency)}
      <div class="subDivider"></div>
      ${renderDetailRow("Subtotal directo", subtotalDirecto, currency, true)}
      ${renderDetailRow(isGeneral ? "Fondo de riesgo / Fallos" : "Fondo de riesgo (prorrateado)", desglose.costoFallos, currency)}
      <div class="subDivider"></div>
      ${renderDetailRow("Costo fabricación base (sin utilidad)", desglose.costoBase, currency, true)}
      <div class="profitBox">
        <div class="profitInfo">
          <div class="profitLabel">${isGeneral ? "Utilidad total del proyecto" : "Utilidad de esta pieza"}</div>
          <div class="profitSubtext">Margen aplicado: ${desglose.margenAplicadoPct.toFixed(1)}%</div>
        </div>
        <div class="profitValue">+ ${formatMoney(desglose.montoGanancia, currency)}</div>
      </div>
    </div>
  </div>
  `;
}

function renderTabsBar(tabs: { id: string; label: string }[]): string {
  const buttons = tabs
    .map(
      (t, idx) => `
      <button type="button" class="tabChip${idx === 0 ? " active" : ""}" data-tab="${t.id}"
        onclick="window.__cotizacionSwitchTab && window.__cotizacionSwitchTab('${t.id}', this)">
        ${t.label}
      </button>`,
    )
    .join("");
  return `<div class="tabsScroll"><div class="tabsContainer">${buttons}</div></div>`;
}

/**
 * Genera la vista completa del documento.
 * @param data Datos de la cotización/voucher
 * @param viewState Estado actual: 'cotizacion', 'pago' o 'cancelado'
 */
export function buildVoucherHtml(
  data: VoucherData,
  viewState: "cotizacion" | "pago" | "cancelado" = "cotizacion",
): string {
  const {
    companyName,
    companyTagline,
    documentTitle,
    issueDateLabel,
    validityLabel,
    logoUri,
    productImageUri,
    unitPriceLabel,
    unitPrice,
    especificaciones,
    pricingTiers = [],
    items,
    policies,
    footerNote,
    websiteUrl,
    currencySymbol,
    codigoPedido = "COT-3D",
    clienteNombre = "Estimado Cliente",
    montoTotal = unitPrice,
    montoAnticipo = unitPrice * 0.5,
    saldoPendiente = unitPrice,
    qrUrl,
    generalDesglose,
    piezas = [],
  } = data;

  const COLOR_ACCENT = "#B91C3C";
  const COLOR_ACCENT_BG = "#FDEEF0";
  const COLOR_DARK = "#111827";
  const COLOR_GRAY_TEXT = "#6B7280";
  const COLOR_BORDER = "#E5E7EB";

  const tieneCotizacionPorPiezas = Boolean(generalDesglose && piezas.length > 0);

  // --- SECCIÓN DENTRO DEL BODY SEGÚN EL ESTADO ---
  let bodyContent = "";

  if (viewState === "cancelado") {
    bodyContent = `
      <div class="status-card cancelled">
        <div class="status-icon">✕</div>
        <h2>Cotización Cancelada</h2>
        <p>Has cancelado el proceso de esta cotización. Si requieres reajustar los parámetros o solicitar un nuevo diseño, por favor ponte en contacto con nosotros.</p>
        <button onclick="window.parent.postMessage({ type: 'RESET_QUOTE' }, '*')" class="btn btn-secondary">Volver a revisar</button>
      </div>
    `;
  } else if (viewState === "pago") {
    const qrSection = qrUrl
      ? `<div class="qr-container">
          <p class="qr-title">Escanea el código QR para realizar el pago por transferencia o Simple QR:</p>
          <img src="${qrUrl}" alt="Código QR de Pago" class="qr-image" />
         </div>`
      : `<div class="qr-placeholder">
          <p>Contacta con el comercio para obtener los datos directos de transferencia bancaria.</p>
         </div>`;

    bodyContent = `
      <div class="headerRow">
        <div>
          <div class="brandLabel">${companyName} · LAB</div>
          <div class="title">Recordatorio de Pago</div>
          <div class="subtitle">Código de Pedido / Cotización: <strong>${codigoPedido}</strong></div>
          <div class="issueDate">Fecha de Emisión: ${issueDateLabel}</div>
        </div>
        ${logoUri ? `<img class="logoBox" src="${logoUri}" alt="Logo" />` : ""}
      </div>

      <div class="divider"></div>

      <div class="client-card">
        <p><strong>Cliente:</strong> ${clienteNombre}</p>
        <p><strong>Detalle de la Orden:</strong> ${documentTitle}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>DETALLE DEL PEDIDO</th>
            <th class="thCenter">CANT.</th>
            <th class="thRight">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td class="tdDesc">${item.description}</td>
              <td class="tdCenter">${item.quantity}</td>
              <td class="tdTotal">${formatMoney(item.total, currencySymbol)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="summary-card">
        <div class="summary-row">
          <span>Monto Total del Pedido:</span>
          <span>${formatMoney(montoTotal, currencySymbol)}</span>
        </div>
        <div class="summary-row">
          <span>Anticipo Requerido (50%):</span>
          <span>${formatMoney(montoAnticipo, currencySymbol)}</span>
        </div>
        <div class="summary-row total">
          <span>Saldo Pendiente a Cancelar:</span>
          <span>${formatMoney(saldoPendiente, currencySymbol)}</span>
        </div>
      </div>

      ${qrSection}

      <div class="action-bar no-print">
        <button onclick="window.parent.postMessage({ type: 'BACK_TO_QUOTE' }, '*')" class="btn btn-secondary">
          ← Volver a la Cotización
        </button>
        <button onclick="window.print()" class="btn btn-primary">
          🖨 Imprimir / Guardar Comprobante
        </button>
      </div>
    `;
  } else {
    // VISTA POR DEFECTO: COTIZACIÓN
    const logoHtml = logoUri ? `<img class="logoBox" src="${logoUri}" alt="Logo" />` : "";

    const productImageHtml = productImageUri
      ? `<div class="productImageContainer"><img class="productImage" src="${productImageUri}" alt="Imagen del producto" /></div>`
      : `<div class="productImagePlaceholder"><span>Sin Imagen de Referencia</span></div>`;

    const especificacionesHtml =
      especificaciones && especificaciones.materialNombre
        ? `
      <div class="specsRow">
        <div class="specChip">
          <span class="specChipLabel">MATERIAL</span>
          <span class="specChipValue">${especificaciones.materialNombre}</span>
        </div>
        ${
          especificaciones.materialColor
            ? `
        <div class="specChip">
          <span class="specChipLabel">COLOR</span>
          <span class="specChipValue">${especificaciones.materialColor}</span>
        </div>`
            : ""
        }
      </div>
    `
        : "";

    let cotizacionSectionHtml = "";

    if (tieneCotizacionPorPiezas && generalDesglose) {
      const tabs = [
        { id: "panel-general", label: "Cotización General" },
        ...piezas.map((p, idx) => ({
          id: `panel-${p.id || idx}`,
          label: p.nombrePieza?.trim() ? p.nombrePieza : `Pieza ${idx + 1}`,
        })),
      ];

      const cantidadGeneral = piezas.reduce((acc, p) => acc + (p.cantidad || 0), 0) || 1;

      const generalPanel = renderTabPanel("panel-general", currencySymbol, COLOR_ACCENT, {
        isGeneral: true,
        titulo: `Cotización General (${piezas.length} ${piezas.length === 1 ? "pieza" : "piezas"})`,
        desglose: generalDesglose,
        piezas,
        cantidad: cantidadGeneral,
        active: true,
      });

      const piezaPanels = piezas
        .map((p, idx) =>
          renderTabPanel(`panel-${p.id || idx}`, currencySymbol, COLOR_ACCENT, {
            isGeneral: false,
            titulo: p.nombrePieza?.trim() ? p.nombrePieza : `Pieza ${idx + 1}`,
            desglose: p,
            cantidad: p.cantidad,
            active: false,
          }),
        )
        .join("");

      cotizacionSectionHtml = `
        <div class="contentRow">
          ${productImageHtml}
          <div class="priceSection">
            ${especificacionesHtml}
          </div>
        </div>
        ${renderTabsBar(tabs)}
        <div class="tabPanelsContainer">
          ${generalPanel}
          ${piezaPanels}
        </div>
      `;
    } else {
      // LAYOUT CLÁSICO (sin datos por pieza)
      const tiersHtml = pricingTiers.length
        ? `<div class="tiersRow">${pricingTiers.map((t) => renderPricingTier(t, currencySymbol)).join("")}</div>`
        : "";

      cotizacionSectionHtml = `
        <div class="contentRow">
          ${productImageHtml}
          <div class="priceSection">
            <div>
              <div class="sectionLabel">ESTRUCTURA DE PRECIOS</div>
              <div class="unitPriceBox">
                <div class="unitPriceLabel">${unitPriceLabel}</div>
                <div class="unitPriceValue">${formatMoney(unitPrice, currencySymbol)}</div>
              </div>
              ${especificacionesHtml}
            </div>
            ${tiersHtml}
          </div>
        </div>
      `;
    }

    const rowsHtml = items.map((item) => renderItemRow(item, currencySymbol)).join("");

    bodyContent = `
      <div class="headerRow">
        <div>
          <div class="brandLabel">${companyName} · ${companyTagline}</div>
          <div class="title">${documentTitle}</div>
          <div class="subtitle">Servicios de manufactura, prototipado e impresión 3D</div>
          <div class="issueDate">Fecha de emisión: ${issueDateLabel}</div>
          ${validityLabel ? `<div class="validity">★ ${validityLabel}</div>` : ""}
        </div>
        ${logoHtml}
      </div>

      <div class="divider"></div>

      ${cotizacionSectionHtml}

      <table>
        <thead>
          <tr>
            <th>DETALLE DEL PEDIDO</th>
            <th class="thCenter">CANTIDAD</th>
            <th class="thCenter">P. UNITARIO</th>
            <th class="thRight">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="policiesBox">
        <div class="policiesTitle">Políticas de contratación y servicio</div>
        ${policies
          .map(
            (p) => `<div class="policyLine"><span class="policyLabel">${p.label}:</span> ${p.text}</div>`,
          )
          .join("")}
      </div>

      <!-- BOTONES INTERACTIVOS DE ACCIÓN -->
      <div class="action-bar no-print">
        <button onclick="window.parent.postMessage({ type: 'CANCEL_QUOTE' }, '*')" class="btn btn-danger">
          Cancelar Cotización
        </button>
        <button onclick="window.parent.postMessage({ type: 'CONFIRM_QUOTE' }, '*')" class="btn btn-confirm">
          Confirmar Cotización y Pagar
        </button>
      </div>
    `;
  }

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${documentTitle}</title>
    <style>
      * { 
        box-sizing: border-box; 
        -webkit-print-color-adjust: exact; 
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: ${COLOR_DARK};
        padding: 24px 28px;
        margin: 0;
        background-color: #FFFFFF;
      }
      .brandLabel {
        color: ${COLOR_ACCENT};
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }
      .headerRow {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .title {
        font-size: 26px;
        font-weight: 800;
        margin: 4px 0;
        line-height: 1.2;
      }
      .subtitle {
        color: ${COLOR_GRAY_TEXT};
        font-size: 12px;
        margin-bottom: 4px;
      }
      .issueDate {
        color: ${COLOR_GRAY_TEXT};
        font-size: 11px;
        margin-bottom: 4px;
      }
      .validity {
        color: ${COLOR_ACCENT};
        font-size: 11px;
        font-weight: 700;
      }
      .logoBox {
        width: 64px;
        height: 64px;
        max-width: 64px;
        max-height: 64px;
        border-radius: 8px;
        object-fit: contain;
        display: block;
      }
      .divider {
        height: 3px;
        background: ${COLOR_ACCENT};
        margin: 14px 0 20px;
        border-radius: 2px;
      }
      .contentRow {
        display: flex;
        gap: 20px;
        align-items: stretch;
        margin-bottom: 16px;
      }
      .productImageContainer {
        width: 260px;
        height: 220px;
        min-width: 260px;
        border-radius: 10px;
        overflow: hidden;
        background: #F3F4F6;
        border: 1px solid ${COLOR_BORDER};
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .productImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .productImagePlaceholder {
        width: 260px;
        height: 220px;
        min-width: 260px;
        border-radius: 10px;
        background: #F3F4F6;
        border: 1px dashed ${COLOR_BORDER};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${COLOR_GRAY_TEXT};
        font-size: 11px;
        font-weight: 600;
      }
      .priceSection { 
        flex: 1; 
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .sectionLabel {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
        color: ${COLOR_GRAY_TEXT};
        margin-bottom: 6px;
      }
      .unitPriceBox {
        background: ${COLOR_ACCENT_BG};
        border-left: 4px solid ${COLOR_ACCENT};
        border-radius: 6px;
        padding: 12px 14px;
        margin-bottom: 10px;
      }
      .unitPriceLabel {
        color: ${COLOR_ACCENT};
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .unitPriceValue {
        font-size: 22px;
        font-weight: 800;
        margin-top: 2px;
      }
      .specsRow {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }
      .specChip {
        flex: 1;
        border: 1px solid ${COLOR_BORDER};
        border-radius: 6px;
        padding: 6px 10px;
        display: flex;
        flex-direction: column;
        background: #FAFAFA;
      }
      .specChipLabel {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: ${COLOR_GRAY_TEXT};
        margin-bottom: 2px;
      }
      .specChipValue {
        font-size: 12px;
        font-weight: 700;
        color: ${COLOR_DARK};
      }
      .tiersRow {
        display: flex;
        gap: 8px;
      }
      .tierCard {
        flex: 1;
        border: 1px solid ${COLOR_BORDER};
        border-radius: 6px;
        padding: 8px 10px;
        background: #FAFAFA;
      }
      .tierLabel {
        font-size: 9px;
        font-weight: 700;
        color: ${COLOR_GRAY_TEXT};
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .tierPrice {
        font-size: 15px;
        font-weight: 800;
      }
      .tierDiscount {
        display: inline-block;
        margin-top: 4px;
        background: ${COLOR_ACCENT_BG};
        color: ${COLOR_ACCENT};
        font-size: 9px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }

      /* PESTAÑAS: Cotización General / Piezas */
      .tabsScroll {
        overflow-x: auto;
        margin-bottom: 10px;
      }
      .tabsContainer {
        display: flex;
        gap: 8px;
        min-width: max-content;
      }
      .tabChip {
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid ${COLOR_BORDER};
        background: #FFFFFF;
        color: ${COLOR_DARK};
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
      }
      .tabChip.active {
        background: ${COLOR_ACCENT};
        border-color: ${COLOR_ACCENT};
        color: #FFFFFF;
        font-weight: 700;
      }
      .tabPanelsContainer { margin-top: 4px; }
      .panelHeaderRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .panelTitle { font-size: 15px; font-weight: 700; }
      .badge {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        background: ${COLOR_ACCENT_BG};
        color: ${COLOR_ACCENT};
      }
      .panelHeaderLabel {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        color: ${COLOR_GRAY_TEXT};
        margin-top: 8px;
      }
      .priceRow { margin-top: 2px; }
      .priceValue { font-size: 24px; font-weight: 800; }
      .subtextNotice { font-size: 11px; color: ${COLOR_GRAY_TEXT}; margin-bottom: 6px; }

      .progressBar {
        height: 8px;
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 8px;
      }
      .progressSegment { height: 100%; }
      .legendContainer {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 6px;
        margin-bottom: 4px;
      }
      .legendItem {
        display: flex;
        align-items: center;
        font-size: 9px;
        font-weight: 700;
        color: ${COLOR_GRAY_TEXT};
      }
      .legendDot {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        margin-right: 4px;
        display: inline-block;
      }

      .statsRow { display: flex; gap: 8px; margin-top: 10px; }
      .statBox {
        flex: 1;
        border: 1px solid ${COLOR_BORDER};
        border-radius: 8px;
        padding: 10px;
        background: #FAFAFA;
      }
      .statLabel { font-size: 10px; font-weight: 600; color: ${COLOR_GRAY_TEXT}; }
      .statValue { font-size: 13px; font-weight: 700; margin-top: 2px; }

      .piezasResumenContainer { margin-top: 10px; }
      .piezasResumenTitle {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.6px;
        color: ${COLOR_GRAY_TEXT};
        margin-bottom: 8px;
      }
      .piezaCard {
        border: 1px solid ${COLOR_BORDER};
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 8px;
        background: #FAFAFA;
      }
      .piezaCardNombre { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
      .piezaStatsRow { display: flex; gap: 8px; }
      .piezaStatCard {
        flex: 1;
        border: 1px solid ${COLOR_BORDER};
        border-radius: 8px;
        padding: 8px;
        background: #FFFFFF;
      }
      .piezaStatLabel { font-size: 10px; font-weight: 600; color: ${COLOR_GRAY_TEXT}; }
      .piezaStatValue { font-size: 13px; font-weight: 700; margin-top: 2px; }

      .costDetails { margin-top: 10px; }
      .detailRow {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 13px;
      }
      .subDivider { height: 1px; background: ${COLOR_BORDER}; margin: 6px 0; }
      .profitBox {
        border: 1px dashed ${COLOR_ACCENT};
        border-radius: 8px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0;
        background: ${COLOR_ACCENT_BG};
      }
      .profitInfo { flex: 1; }
      .profitLabel { font-size: 13px; font-weight: 700; color: ${COLOR_ACCENT}; }
      .profitSubtext { font-size: 11px; color: ${COLOR_GRAY_TEXT}; margin-top: 2px; }
      .profitValue { font-size: 15px; font-weight: 700; color: ${COLOR_ACCENT}; margin-left: 8px; }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 24px;
        page-break-inside: avoid;
      }
      thead tr {
        background: ${COLOR_DARK};
      }
      thead th {
        color: #FFFFFF;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-align: left;
        padding: 8px 12px;
      }
      thead th.thCenter { text-align: center; }
      thead th.thRight { text-align: right; }
      tbody td {
        padding: 10px 12px;
        font-size: 11px;
        border-bottom: 1px solid ${COLOR_BORDER};
      }
      .tdDesc { text-align: left; }
      .tdCenter { text-align: center; }
      .tdTotal { text-align: right; font-weight: 700; }
      .policiesBox {
        background: ${COLOR_DARK};
        color: #FFFFFF;
        border-radius: 8px;
        padding: 16px 18px;
        margin-top: 24px;
        page-break-inside: avoid;
      }
      .policiesTitle {
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }
      .policyLine {
        font-size: 10px;
        line-height: 1.5;
        color: #E5E7EB;
        margin-bottom: 4px;
      }
      .policyLabel { font-weight: 700; color: #FFFFFF; }

      /* ESTILOS DE PAGO Y DE ESTADO */
      .client-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
      .client-card p { margin-bottom: 4px; color: #475569; font-size: 13px; }
      .client-card p strong { color: #0f172a; }

      .summary-card { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 20px; }
      .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #334155; }
      .summary-row.total { border-top: 1px dashed #93c5fd; padding-top: 10px; margin-top: 4px; font-size: 15px; font-weight: 700; color: #1e3a8a; }

      .qr-container { text-align: center; margin-top: 20px; padding: 16px; border: 1px dashed #cbd5e1; border-radius: 8px; page-break-inside: avoid; }
      .qr-title { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 12px; }
      .qr-image { width: 180px; height: 180px; object-fit: contain; margin: 0 auto; display: block; }
      .qr-placeholder { text-align: center; font-style: italic; color: #64748b; margin-top: 20px; padding: 12px; }

      .status-card { text-align: center; padding: 48px 20px; border-radius: 12px; margin-top: 20px; }
      .status-card.cancelled { background-color: #fef2f2; border: 1px solid #fecaca; }
      .status-icon { font-size: 48px; margin-bottom: 12px; color: #ef4444; }

      /* BARRA DE BOTONES INTERACTIVOS */
      .action-bar {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 28px;
        padding-top: 16px;
        border-top: 1px solid ${COLOR_BORDER};
      }
      .btn {
        padding: 10px 18px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s ease, transform 0.1s ease;
      }
      .btn:active { transform: scale(0.98); }
      .btn-danger { background-color: #fee2e2; color: #991b1b; }
      .btn-danger:hover { background-color: #fca5a5; }
      .btn-confirm { background-color: ${COLOR_ACCENT}; color: #ffffff; }
      .btn-confirm:hover { background-color: #9f1239; }
      .btn-primary { background-color: #2563eb; color: #ffffff; }
      .btn-primary:hover { background-color: #1d4ed8; }
      .btn-secondary { background-color: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
      .btn-secondary:hover { background-color: #e5e7eb; }

      @media print {
        .no-print { display: none !important; }
        .tabsScroll { display: none !important; }
        .tabPanel { display: block !important; margin-bottom: 18px; page-break-inside: avoid; }
        body { padding: 0; }
      }
    </style>
  </head>
  <body>
    ${bodyContent}
    <div class="footer no-print" style="text-align: center; margin-top: 24px; color: ${COLOR_GRAY_TEXT}; font-size: 10px;">
      ${footerNote}
      ${websiteUrl ? `<div style="margin-top: 2px;">${websiteUrl}</div>` : ""}
    </div>
    <script>
      window.__cotizacionSwitchTab = function(tabId, btn) {
        var panels = document.querySelectorAll('.tabPanel');
        panels.forEach(function (p) { p.style.display = (p.id === tabId) ? 'block' : 'none'; });
        var chips = document.querySelectorAll('.tabChip');
        chips.forEach(function (c) { c.classList.remove('active'); });
        if (btn) btn.classList.add('active');
      };
    </script>
  </body>
  </html>
  `;
}