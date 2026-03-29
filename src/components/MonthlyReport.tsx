import { useState, useMemo } from "react";
import { Transaction } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronUp, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ccCoin from "@/assets/cc-coin.png";
import { generateInvoicePdf, generateSummaryReportPdf } from "@/lib/generateInvoicePdf";

interface MonthlyReportProps {
  transactions: Transaction[];
}

interface MonthData {
  key: string;
  label: string;
  year: number;
  month: number;
  txs: Transaction[];
  ccEarned: number;
  ccSpent: number;
  rmEarned: number;
  rmSpent: number;
  netCC: number;
  netRM: number;
  totalTxs: number;
}

function groupByMonth(transactions: Transaction[]): MonthData[] {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const d = new Date(tx.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, txs]) => {
      const [year, month] = key.split('-').map(Number);
      const d = new Date(year, month - 1);
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });

      const ccTxs = txs.filter(t => !t.description.startsWith('[RM]'));
      const rmTxs = txs.filter(t => t.description.startsWith('[RM]'));

      const ccEarned = ccTxs.filter(t => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
      const ccSpent = ccTxs.filter(t => t.type === 'spend').reduce((s, t) => s + t.amount, 0);
      const rmEarned = rmTxs.filter(t => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
      const rmSpent = rmTxs.filter(t => t.type === 'spend').reduce((s, t) => s + t.amount, 0);

      return {
        key, label, year, month, txs,
        ccEarned, ccSpent, rmEarned, rmSpent,
        netCC: ccEarned - ccSpent,
        netRM: rmEarned - rmSpent,
        totalTxs: txs.length,
      };
    });
}

function getInvoiceItems(txs: Transaction[]) {
  const spendTxs = txs.filter(t => t.type === 'spend');
  const allItems: { name: string; emoji: string; qty: number; price: number; paymentType: string }[] = [];

  spendTxs.forEach(tx => {
    if (tx.items) {
      tx.items.forEach(item => {
        allItems.push({ name: item.name, emoji: item.emoji, qty: item.quantity, price: item.price * item.quantity, paymentType: item.paymentType });
      });
    } else {
      const isRM = tx.description.startsWith('[RM]');
      allItems.push({
        name: isRM ? tx.description.replace('[RM] ', '') : tx.description,
        emoji: '📦', qty: 1, price: tx.amount,
        paymentType: isRM ? 'money' : 'coins',
      });
    }
  });

  const ccItems = allItems.filter(i => i.paymentType === 'coins');
  const rmItems = allItems.filter(i => i.paymentType === 'money');
  return { ccItems, rmItems, totalCCSpent: ccItems.reduce((s, i) => s + i.price, 0), totalRMSpent: rmItems.reduce((s, i) => s + i.price, 0) };
}

function generateInvoiceNo(month: MonthData) {
  return `CC-${month.year}${String(month.month).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function MonthlyReport({ transactions }: MonthlyReportProps) {
  const months = useMemo(() => groupByMonth(transactions), [transactions]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [invoiceMonth, setInvoiceMonth] = useState<MonthData | null>(null);

  if (months.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No transactions to report yet.</p>
      </div>
    );
  }

  const handleDownloadReport = () => {
    generateSummaryReportPdf(months);
  };

  return (
    <>
      {/* Download full report button */}
      <div className="mb-3">
        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs" onClick={handleDownloadReport}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download Full Summary Report (PDF)
        </Button>
      </div>

      <div className="space-y-2">
        {months.map((m) => {
          const isExpanded = selectedMonth === m.key;
          return (
            <div key={m.key} className="bg-card border rounded-xl overflow-hidden">
              <button
                onClick={() => setSelectedMonth(isExpanded ? null : m.key)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="rounded-lg p-2 bg-primary/10">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.totalTxs} transaction{m.totalTxs !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right mr-2">
                  <p className={`text-xs font-bold ${m.netCC >= 0 ? 'text-growth' : 'text-destructive'}`}>
                    {m.netCC >= 0 ? '+' : ''}{m.netCC} CC
                  </p>
                  <p className={`text-[10px] font-semibold ${m.netRM >= 0 ? 'text-money' : 'text-destructive'}`}>
                    {m.netRM >= 0 ? '+' : ''}RM {m.netRM.toFixed(2)}
                  </p>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted rounded-lg p-2.5">
                          <p className="text-[10px] text-muted-foreground font-semibold">CC Earned</p>
                          <p className="text-sm font-extrabold text-growth">+{m.ccEarned}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-2.5">
                          <p className="text-[10px] text-muted-foreground font-semibold">CC Spent</p>
                          <p className="text-sm font-extrabold text-destructive">-{m.ccSpent}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-2.5">
                          <p className="text-[10px] text-muted-foreground font-semibold">RM Top-ups</p>
                          <p className="text-sm font-extrabold text-money">+RM {m.rmEarned.toFixed(2)}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-2.5">
                          <p className="text-[10px] text-muted-foreground font-semibold">RM Spent</p>
                          <p className="text-sm font-extrabold text-destructive">-RM {m.rmSpent.toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-muted-foreground mb-1.5">Transactions ({m.totalTxs})</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {m.txs.slice(0, 10).map((tx) => {
                            const isRM = tx.description.startsWith('[RM]');
                            const desc = isRM ? tx.description.replace('[RM] ', '') : tx.description;
                            return (
                              <div key={tx.id} className="flex items-center justify-between text-xs py-1">
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  {isRM ? <span className="text-money text-[10px]">RM</span> : <img src={ccCoin} alt="CC" className="w-3 h-3" />}
                                  <span className="text-foreground truncate">{desc}</span>
                                </div>
                                <span className={`font-bold ml-2 whitespace-nowrap ${tx.type === 'earn' ? 'text-growth' : 'text-destructive'}`}>
                                  {tx.type === 'earn' ? '+' : '-'}{isRM ? `RM ${tx.amount.toFixed(2)}` : `${tx.amount} CC`}
                                </span>
                              </div>
                            );
                          })}
                          {m.totalTxs > 10 && (
                            <p className="text-[10px] text-muted-foreground text-center pt-1">+{m.totalTxs - 10} more</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-xs"
                          onClick={() => setInvoiceMonth(m)}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          View Invoice
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs"
                          onClick={() => {
                            const { ccItems, rmItems, totalCCSpent, totalRMSpent } = getInvoiceItems(m.txs);
                            generateInvoicePdf({
                              ...m,
                              invoiceNo: generateInvoiceNo(m),
                              ccItems, rmItems, totalCCSpent, totalRMSpent,
                            });
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoiceMonth && (
          <InvoiceModal month={invoiceMonth} onClose={() => setInvoiceMonth(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function InvoiceModal({ month, onClose }: { month: MonthData; onClose: () => void }) {
  const [invoiceNo] = useState(() => generateInvoiceNo(month));
  const { ccItems, rmItems, totalCCSpent, totalRMSpent } = useMemo(() => getInvoiceItems(month.txs), [month.txs]);

  const handleDownload = () => {
    generateInvoicePdf({
      ...month,
      invoiceNo,
      ccItems, rmItems, totalCCSpent, totalRMSpent,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Invoice Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Invoice</h2>
              <p className="text-[10px] text-muted-foreground font-mono">{invoiceNo}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              <p className="font-bold text-foreground">CloudCrop</p>
              <p>Monthly Summary</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">{month.label}</p>
              <p>{month.totalTxs} transactions</p>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground mb-2">💰 EARNINGS</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <img src={ccCoin} alt="CC" className="w-4 h-4" />
                <span className="text-foreground">CC Coins Earned</span>
              </div>
              <span className="font-bold text-growth">+{month.ccEarned} CC</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">RM Top-ups</span>
              <span className="font-bold text-money">+RM {month.rmEarned.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Spending Section */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground mb-2">🛒 SPENDING BREAKDOWN</p>

          {ccItems.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-bold text-muted-foreground mb-1 flex items-center gap-1">
                <img src={ccCoin} alt="CC" className="w-3 h-3" /> CC Purchases
              </p>
              <div className="space-y-1">
                {ccItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{item.emoji} {item.name} {item.qty > 1 ? `x${item.qty}` : ''}</span>
                    <span className="text-muted-foreground font-semibold">{item.price} CC</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs font-bold mt-1 pt-1 border-t border-dashed border-border">
                <span className="text-foreground">CC Subtotal</span>
                <span className="text-destructive">{totalCCSpent} CC</span>
              </div>
            </div>
          )}

          {rmItems.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-muted-foreground mb-1">💵 RM Purchases</p>
              <div className="space-y-1">
                {rmItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{item.emoji} {item.name} {item.qty > 1 ? `x${item.qty}` : ''}</span>
                    <span className="text-muted-foreground font-semibold">RM {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs font-bold mt-1 pt-1 border-t border-dashed border-border">
                <span className="text-foreground">RM Subtotal</span>
                <span className="text-destructive">RM {totalRMSpent.toFixed(2)}</span>
              </div>
            </div>
          )}

          {ccItems.length === 0 && rmItems.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No spending this month.</p>
          )}
        </div>

        {/* Net Summary */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground mb-2">📊 NET SUMMARY</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold">Net CC</p>
              <p className={`text-lg font-extrabold ${month.netCC >= 0 ? 'text-growth' : 'text-destructive'}`}>
                {month.netCC >= 0 ? '+' : ''}{month.netCC}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold">Net RM</p>
              <p className={`text-lg font-extrabold ${month.netRM >= 0 ? 'text-money' : 'text-destructive'}`}>
                {month.netRM >= 0 ? '+' : ''}RM {month.netRM.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 text-center">
          <p className="text-[10px] text-muted-foreground mb-3">
            Exchange rate: 100 CC = RM 1.00 · Generated by CloudCrop
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl flex-1">
              Close
            </Button>
            <Button onClick={handleDownload} className="rounded-xl flex-1 gap-1.5">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
