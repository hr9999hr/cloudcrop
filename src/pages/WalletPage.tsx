import { useState } from "react";
import { useGameStore, Transaction } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, Plus, X, ChevronDown, ChevronUp, ShoppingCart, Sprout, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ccCoin from "@/assets/cc-coin.png";

function getTransactionTitle(tx: Transaction) {
  if (tx.items && tx.items.length > 0) {
    if (tx.items.length === 1) {
      return `${tx.items[0].emoji} ${tx.items[0].name}`;
    }
    return `${tx.items[0].emoji} ${tx.items[0].name} +${tx.items.length - 1} more`;
  }
  const isRM = tx.description.startsWith('[RM]');
  return isRM ? tx.description.replace('[RM] ', '') : tx.description;
}

function getSourceIcon(source?: string) {
  switch (source) {
    case 'Supermarket': return <ShoppingCart className="w-4 h-4 text-primary" />;
    case 'Fertilizer Shop': return <Store className="w-4 h-4 text-accent" />;
    case 'Garden': return <Sprout className="w-4 h-4 text-growth" />;
    default: return null;
  }
}

export default function WalletPage() {
  const { coins, realMoney, transactions, topUpRealMoney } = useGameStore();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const ccTransactions = transactions.filter((t) => !t.description.startsWith('[RM]'));
  const rmTransactions = transactions.filter((t) => t.description.startsWith('[RM]'));

  const totalCCEarned = ccTransactions.filter((t) => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
  const totalCCSpent = ccTransactions.filter((t) => t.type === 'spend').reduce((s, t) => s + t.amount, 0);
  const totalRMSpent = rmTransactions.filter((t) => t.type === 'spend').reduce((s, t) => s + t.amount, 0);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0 || amount > 10000) {
      toast.error("Enter a valid amount (RM 0.01 - RM 10,000)");
      return;
    }
    topUpRealMoney(amount);
    toast.success(`Successfully topped up RM ${amount.toFixed(2)}!`);
    setTopUpAmount('');
    setShowTopUp(false);
  };

  const quickAmounts = [10, 20, 50, 100];

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Wallet 💰</h1>

      {/* Dual Currency Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="gradient-coin rounded-2xl p-5 text-center shadow-lg">
          <p className="text-xs font-semibold opacity-80">CC Balance</p>
          <div className="flex items-center justify-center gap-2 my-1">
            <img src={ccCoin} alt="CC" className="w-8 h-8" />
            <p className="text-3xl font-extrabold">{coins}</p>
          </div>
          <p className="text-[10px] opacity-70">CloudCrop Coins</p>
          <p className="text-xs opacity-60 mt-1">Use to buy real plants</p>
        </motion.div>

        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-[hsl(210,60%,45%)] to-[hsl(210,70%,35%)] text-white rounded-2xl p-5 text-center shadow-lg relative">
          <p className="text-xs font-semibold opacity-80">RM Balance</p>
          <div className="flex items-center justify-center gap-2 my-1">
            <Banknote className="w-7 h-7" />
            <p className="text-3xl font-extrabold">{realMoney.toFixed(2)}</p>
          </div>
          <p className="text-[10px] opacity-70">Real Money (MYR)</p>
          <Button size="sm" onClick={() => setShowTopUp(!showTopUp)} className="mt-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs px-3 py-1 h-auto">
            <Plus className="w-3 h-3 mr-1" /> Top Up
          </Button>
        </motion.div>
      </div>

      {/* Top Up Panel */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-card border rounded-2xl p-4 mb-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-sm">Top Up Real Money</h3>
              <button onClick={() => setShowTopUp(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="flex gap-2 mb-3">
              {quickAmounts.map((amt) => (
                <button key={amt} onClick={() => setTopUpAmount(amt.toString())}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${topUpAmount === amt.toString() ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-accent'}`}>
                  RM {amt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input type="number" placeholder="Custom amount" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className="rounded-xl flex-1" min="0.01" max="10000" step="0.01" />
              <Button onClick={handleTopUp} className="gradient-farm text-primary-foreground rounded-xl font-bold px-6">Pay 💳</Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Payment processed via FPX (simulated)</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold">CC Earned</p>
          <p className="text-lg font-extrabold text-growth">+{totalCCEarned}</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold">CC Spent</p>
          <p className="text-lg font-extrabold text-destructive">-{totalCCSpent}</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold">RM Spent</p>
          <p className="text-lg font-extrabold text-money">RM {totalRMSpent.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="font-bold text-foreground mb-3">Transaction History</h2>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <span className="text-3xl block mb-2">📋</span>
          <p className="text-sm">No transactions yet. Start farming!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isRM = tx.description.startsWith('[RM]');
            const title = getTransactionTitle(tx);
            const hasItems = tx.items && tx.items.length > 0;
            const isExpanded = expandedTx === tx.id;

            return (
              <div key={tx.id} className="bg-card border rounded-xl overflow-hidden">
                <button
                  onClick={() => (hasItems || tx.source) && setExpandedTx(isExpanded ? null : tx.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left ${(hasItems || tx.source) ? 'cursor-pointer hover:bg-accent/50' : 'cursor-default'}`}
                >
                  {isRM ? (
                    <Banknote className="w-5 h-5 text-money flex-shrink-0" />
                  ) : (
                    <img src={ccCoin} alt="CC" className="w-5 h-5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`font-bold text-sm whitespace-nowrap ${tx.type === 'earn' ? 'text-growth' : 'text-destructive'}`}>
                    {tx.type === 'earn' ? '+' : '-'}{isRM ? `RM ${tx.amount.toFixed(2)}` : tx.amount}
                  </span>
                  {(hasItems || tx.source) && (
                    isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-3 space-y-2">
                        {tx.source && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {getSourceIcon(tx.source)}
                            <span>Purchased from <span className="font-bold text-foreground">{tx.source}</span></span>
                          </div>
                        )}
                        {hasItems && (
                          <>
                            <p className="text-xs font-bold text-muted-foreground">Items:</p>
                            {tx.items!.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{item.emoji}</span>
                                  <span className="text-foreground">{item.name}</span>
                                  <span className="text-muted-foreground text-xs">x{item.quantity}</span>
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground">
                                  {item.paymentType === 'coins' ? `${item.price * item.quantity} CC` : `RM ${(item.price * item.quantity).toFixed(2)}`}
                                </span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
