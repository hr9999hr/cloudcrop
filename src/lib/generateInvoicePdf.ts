import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export function generateInvoicePdf(data: InvoiceData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Header bar
  doc.setFillColor(34, 120, 74); // brand green
  doc.rect(0, 0, pageW, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("CloudCrop — Virtual Farming Platform", margin, 26);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}`, margin, 32);

  // Invoice number & period (right side)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`No: ${data.invoiceNo}`, pageW - margin, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(`Period: ${data.label}`, pageW - margin, 26, { align: "right" });
  doc.text(`Transactions: ${data.totalTxs}`, pageW - margin, 32, { align: "right" });

  y = 48;

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

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // === EARNINGS SECTION ===
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 120, 74);
  doc.text("EARNINGS", margin, y);
  y += 6;

  autoTable(doc, {
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

  // === SPENDING — CC ===
  if (data.ccItems.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 60, 60);
    doc.text("SPENDING — CC Coins", margin, y);
    y += 6;

    const ccRows = data.ccItems.map((i) => [
      `${i.emoji} ${i.name}`,
      String(i.qty),
      `${(i.price / i.qty).toFixed(0)} CC`,
      `${i.price} CC`,
    ]);

    autoTable(doc, {
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

  // === SPENDING — RM ===
  if (data.rmItems.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 60, 60);
    doc.text("SPENDING — Real Money (RM)", margin, y);
    y += 6;

    const rmRows = data.rmItems.map((i) => [
      `${i.emoji} ${i.name}`,
      String(i.qty),
      `RM ${(i.price / i.qty).toFixed(2)}`,
      `RM ${i.price.toFixed(2)}`,
    ]);

    autoTable(doc, {
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

  // === NET SUMMARY BOX ===
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

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text("This is a system-generated document from CloudCrop. No signature required.", pageW / 2, y, { align: "center" });
  doc.text(`Invoice ${data.invoiceNo} • ${data.label} • CloudCrop Sdn Bhd`, pageW / 2, y + 4, { align: "center" });

  doc.save(`CloudCrop_Invoice_${data.key}.pdf`);
}

export function generateSummaryReportPdf(months: MonthData[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Header
  doc.setFillColor(34, 120, 74);
  doc.rect(0, 0, pageW, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("MONTHLY SUMMARY REPORT", margin, 16);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`CloudCrop — Generated ${new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}`, margin, 24);

  y = 42;

  // Overview table
  const rows = months.map((m) => [
    m.label,
    String(m.totalTxs),
    `+${m.ccEarned}`,
    `-${m.ccSpent}`,
    `${m.netCC >= 0 ? "+" : ""}${m.netCC}`,
    `+RM ${m.rmEarned.toFixed(2)}`,
    `-RM ${m.rmSpent.toFixed(2)}`,
    `${m.netRM >= 0 ? "+" : ""}RM ${m.netRM.toFixed(2)}`,
  ]);

  // Totals
  const totCCE = months.reduce((s, m) => s + m.ccEarned, 0);
  const totCCS = months.reduce((s, m) => s + m.ccSpent, 0);
  const totRME = months.reduce((s, m) => s + m.rmEarned, 0);
  const totRMS = months.reduce((s, m) => s + m.rmSpent, 0);

  autoTable(doc, {
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
      0: { cellWidth: 35 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right", fontStyle: "bold" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "right", fontStyle: "bold" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text("Exchange rate: 100 CC = RM 1.00 • This is a system-generated report from CloudCrop.", pageW / 2, y, { align: "center" });

  doc.save(`CloudCrop_Summary_Report.pdf`);
}
