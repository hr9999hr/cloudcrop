import jsPDF from "jspdf";
import "jspdf-autotable";

interface InvoiceItem {
  name: string;
  emoji: string;
  qty: number;
  price: number;
  paymentType: string;
}

interface MonthData {
  key: string;
  label: string;
  year: number;
  month: number;
  ccEarned: number;
  ccSpent: number;
  rmEarned: number;
  rmSpent: number;
  netCC: number;
  netRM: number;
  totalTxs: number;
}

interface InvoiceData extends MonthData {
  invoiceNo: string;
  ccItems: InvoiceItem[];
  rmItems: InvoiceItem[];
  totalCCSpent: number;
  totalRMSpent: number;
}

interface TransactionInvoiceData {
  invoiceNo: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  source?: string;
  timestamp: number;
  items?: { name: string; emoji: string; quantity: number; price: number; paymentType: "coins" | "money" }[];
}

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  doc.setFillColor(34, 120, 74);
  doc.rect(0, 0, pageW, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("CloudCrop — Virtual Farming Platform", margin, 26);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}`, margin, 32);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(subtitle, pageW - margin, 18, { align: "right" });
}

function addFooter(doc: jsPDF, y: number, invoiceNo: string, label: string) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text("This is a system-generated document from CloudCrop. No signature required.", pageW / 2, y, { align: "center" });
  doc.text(`Invoice ${invoiceNo} • ${label} • CloudCrop Sdn Bhd`, pageW / 2, y + 4, { align: "center" });
}

// =============================================
// Per-transaction invoice
// =============================================
export function generateTransactionInvoicePdf(data: TransactionInvoiceData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  const txDate = new Date(data.timestamp);
  const dateStr = txDate.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  addHeader(doc, "INVOICE", `No: ${data.invoiceNo}`);

  // Period line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Date: ${dateStr}`, pageW - margin, 26, { align: "right" });
  doc.text(`Type: ${data.type === "earn" ? "Earning" : "Purchase"}`, pageW - margin, 32, { align: "right" });

  let y = 48;

  // Bill To / From
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", margin, y);
  doc.text("BILL TO", pageW / 2 + 10, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("CloudCrop Sdn Bhd", margin, y);
  doc.text("Farmer (Player Account)", pageW / 2 + 10, y);
  y += 4.5;
  doc.text("Level 12, Menara Digital", margin, y);
  doc.text("CloudCrop Virtual Farm", pageW / 2 + 10, y);
  y += 4.5;
  doc.text("Kuala Lumpur, Malaysia", margin, y);
  if (data.source) {
    doc.text(`Source: ${data.source}`, pageW / 2 + 10, y);
  }

  y += 12;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Transaction details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 120, 74);
  doc.text("TRANSACTION DETAILS", margin, y);
  y += 6;

  const isRM = data.description.startsWith("[RM]");
  const desc = isRM ? data.description.replace("[RM] ", "") : data.description;

  if (data.items && data.items.length > 0) {
    const rows = data.items.map((item) => {
      const isMoney = item.paymentType === "money";
      const unitPrice = isMoney ? `RM ${item.price.toFixed(2)}` : `${item.price} CC`;
      const total = isMoney ? `RM ${(item.price * item.quantity).toFixed(2)}` : `${item.price * item.quantity} CC`;
      return [`${item.emoji} ${item.name}`, String(item.quantity), unitPrice, total];
    });

    const totalCC = data.items.filter(i => i.paymentType === "coins").reduce((s, i) => s + i.price * i.quantity, 0);
    const totalRM = data.items.filter(i => i.paymentType === "money").reduce((s, i) => s + i.price * i.quantity, 0);

    const footParts: string[] = [];
    if (totalCC > 0) footParts.push(`${totalCC} CC`);
    if (totalRM > 0) footParts.push(`RM ${totalRM.toFixed(2)}`);

    (doc as any).autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Item", "Qty", "Unit Price", "Total"]],
      body: rows,
      foot: [["", "", "TOTAL", footParts.join(" + ")]],
      theme: "grid",
      headStyles: { fillColor: [34, 120, 74], textColor: 255, fontSize: 9, fontStyle: "bold" },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      footStyles: { fillColor: [230, 245, 235], textColor: [34, 120, 74], fontStyle: "bold", fontSize: 9 },
      columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    // Simple single-line transaction
    const amountStr = isRM ? `RM ${data.amount.toFixed(2)}` : `${data.amount} CC`;
    (doc as any).autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Description", "Type", "Amount"]],
      body: [[desc, data.type === "earn" ? "Earning" : "Spending", `${data.type === "earn" ? "+" : "-"}${amountStr}`]],
      theme: "grid",
      headStyles: { fillColor: [34, 120, 74], textColor: 255, fontSize: 9, fontStyle: "bold" },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Summary box
  const amountLabel = isRM ? `RM ${data.amount.toFixed(2)}` : `${data.amount} CC`;
  doc.setFillColor(245, 248, 250);
  doc.roundedRect(margin, y, pageW - margin * 2, 20, 3, 3, "F");
  doc.setDrawColor(34, 120, 74);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageW - margin * 2, 20, 3, 3, "S");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("TOTAL", margin + 6, y + 8);

  const color = data.type === "earn" ? [34, 120, 74] : [180, 60, 60];
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(14);
  doc.text(`${data.type === "earn" ? "+" : "-"}${amountLabel}`, pageW - margin - 6, y + 13, { align: "right" });

  y += 28;

  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text("Exchange rate: 100 CC = RM 1.00", margin + 6, y);

  y += 10;
  addFooter(doc, y, data.invoiceNo, dateStr);

  doc.save(`CloudCrop_Invoice_${data.invoiceNo}.pdf`);
}

// =============================================
// Monthly invoice (existing)
// =============================================
export function generateInvoicePdf(data: InvoiceData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  addHeader(doc, "INVOICE", `No: ${data.invoiceNo}`);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Period: ${data.label}`, pageW - margin, 26, { align: "right" });
  doc.text(`Transactions: ${data.totalTxs}`, pageW - margin, 32, { align: "right" });

  let y = 48;

  // Bill To / From
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", margin, y);
  doc.text("BILL TO", pageW / 2 + 10, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("CloudCrop Sdn Bhd", margin, y);
  doc.text("Farmer (Player Account)", pageW / 2 + 10, y);
  y += 4.5;
  doc.text("Level 12, Menara Digital", margin, y);
  doc.text("CloudCrop Virtual Farm", pageW / 2 + 10, y);
  y += 4.5;
  doc.text("Kuala Lumpur, Malaysia", margin, y);
  doc.text("Monthly Statement", pageW / 2 + 10, y);

  y += 12;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Earnings
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 120, 74);
  doc.text("EARNINGS", margin, y);
  y += 6;

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Description", "Amount"]],
    body: [
      ["CC Coins Earned (Harvesting)", `+${data.ccEarned} CC`],
      ["RM Top-ups", `+RM ${data.rmEarned.toFixed(2)}`],
    ],
    theme: "grid",
    headStyles: { fillColor: [34, 120, 74], textColor: 255, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Spending CC
  if (data.ccItems.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 60, 60);
    doc.text("SPENDING — CC Coins", margin, y);
    y += 6;

    const ccRows = data.ccItems.map((i) => [
      `${i.emoji} ${i.name}`, String(i.qty),
      `${(i.price / i.qty).toFixed(0)} CC`, `${i.price} CC`,
    ]);

    (doc as any).autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Item", "Qty", "Unit Price", "Total"]],
      body: ccRows,
      foot: [["", "", "Subtotal", `${data.totalCCSpent} CC`]],
      theme: "grid",
      headStyles: { fillColor: [180, 60, 60], textColor: 255, fontSize: 9, fontStyle: "bold" },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      footStyles: { fillColor: [245, 235, 235], textColor: [180, 60, 60], fontStyle: "bold", fontSize: 9 },
      columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Spending RM
  if (data.rmItems.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 60, 60);
    doc.text("SPENDING — Real Money (RM)", margin, y);
    y += 6;

    const rmRows = data.rmItems.map((i) => [
      `${i.emoji} ${i.name}`, String(i.qty),
      `RM ${(i.price / i.qty).toFixed(2)}`, `RM ${i.price.toFixed(2)}`,
    ]);

    (doc as any).autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Item", "Qty", "Unit Price", "Total"]],
      body: rmRows,
      foot: [["", "", "Subtotal", `RM ${data.totalRMSpent.toFixed(2)}`]],
      theme: "grid",
      headStyles: { fillColor: [180, 60, 60], textColor: 255, fontSize: 9, fontStyle: "bold" },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      footStyles: { fillColor: [245, 235, 235], textColor: [180, 60, 60], fontStyle: "bold", fontSize: 9 },
      columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Net Summary
  doc.setFillColor(245, 248, 250);
  doc.roundedRect(margin, y, pageW - margin * 2, 28, 3, 3, "F");
  doc.setDrawColor(34, 120, 74);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageW - margin * 2, 28, 3, 3, "S");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("NET SUMMARY", margin + 6, y + 8);

  doc.setFontSize(10);
  const netCCColor = data.netCC >= 0 ? [34, 120, 74] : [180, 60, 60];
  const netRMColor = data.netRM >= 0 ? [34, 120, 180] : [180, 60, 60];
  doc.setTextColor(netCCColor[0], netCCColor[1], netCCColor[2]);
  doc.text(`Net CC: ${data.netCC >= 0 ? "+" : ""}${data.netCC} CC`, margin + 6, y + 17);
  doc.setTextColor(netRMColor[0], netRMColor[1], netRMColor[2]);
  doc.text(`Net RM: ${data.netRM >= 0 ? "+" : ""}RM ${data.netRM.toFixed(2)}`, pageW / 2, y + 17);

  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text("Exchange rate: 100 CC = RM 1.00", margin + 6, y + 24);

  y += 36;
  addFooter(doc, y, data.invoiceNo, data.label);

  doc.save(`CloudCrop_Invoice_${data.key}.pdf`);
}

export function generateSummaryReportPdf(months: MonthData[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  doc.setFillColor(34, 120, 74);
  doc.rect(0, 0, pageW, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MONTHLY SUMMARY REPORT", margin, 16);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`CloudCrop — Generated ${new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}`, margin, 24);

  let y = 42;

  const rows = months.map((m) => [
    m.label, String(m.totalTxs),
    `+${m.ccEarned}`, `-${m.ccSpent}`, `${m.netCC >= 0 ? "+" : ""}${m.netCC}`,
    `+RM ${m.rmEarned.toFixed(2)}`, `-RM ${m.rmSpent.toFixed(2)}`, `${m.netRM >= 0 ? "+" : ""}RM ${m.netRM.toFixed(2)}`,
  ]);

  const totCCE = months.reduce((s, m) => s + m.ccEarned, 0);
  const totCCS = months.reduce((s, m) => s + m.ccSpent, 0);
  const totRME = months.reduce((s, m) => s + m.rmEarned, 0);
  const totRMS = months.reduce((s, m) => s + m.rmSpent, 0);

  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Month", "Txns", "CC +", "CC −", "Net CC", "RM +", "RM −", "Net RM"]],
    body: rows,
    foot: [["TOTAL", String(months.reduce((s, m) => s + m.totalTxs, 0)), `+${totCCE}`, `-${totCCS}`, `${totCCE - totCCS >= 0 ? "+" : ""}${totCCE - totCCS}`, `+RM ${totRME.toFixed(2)}`, `-RM ${totRMS.toFixed(2)}`, `${totRME - totRMS >= 0 ? "+" : ""}RM ${(totRME - totRMS).toFixed(2)}`]],
    theme: "grid",
    headStyles: { fillColor: [34, 120, 74], textColor: 255, fontSize: 8, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
    footStyles: { fillColor: [230, 245, 235], textColor: [34, 120, 74], fontStyle: "bold", fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 35 }, 1: { halign: "center" },
      2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right", fontStyle: "bold" },
      5: { halign: "right" }, 6: { halign: "right" }, 7: { halign: "right", fontStyle: "bold" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text("Exchange rate: 100 CC = RM 1.00 • This is a system-generated report from CloudCrop.", pageW / 2, y, { align: "center" });

  doc.save(`CloudCrop_Summary_Report.pdf`);
}
