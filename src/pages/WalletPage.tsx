import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { Banknote } from "lucide-react";
import ccCoin from "@/assets/cc-coin.png";

export default function WalletPage() {
  const { coins, realMoney, transactions } = useGameStore();

  const ccTransactions = transactions.filter((t) => !t.description.startsWith('[RM]'));
  const rmTransactions = transactions.filter((t) => t.description.startsWith('[RM]'));

  const totalCCEarned = ccTransactions.filter((t) => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
  const totalCCSpent = ccTransactions.filter((t) => t.type === 'spend').reduce((s, t) => s + t.amount, 0);
  const totalRMSpent = rmTransactions.filter((t) => t.type === 'spend').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Wallet 💰</h1>

      {/* Dual Currency Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="gradient-coin rounded-2xl p-5 text-center shadow-lg"
        >
          <p className="text-xs font-semibold opacity-80">CC Balance</p>
          <div className="flex items-center justify-center gap-2 my-1">
            <img src={ccCoin} alt="CC" className="w-8 h-8" />
            <p className="text-3xl font-extrabold">{coins}</p>
          </div>
          <p className="text-[10px] opacity-70">CloudCrop Coins</p>
          <p className="text-xs opacity-60 mt-1">Use to buy real plants</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-5 text-center shadow-lg"
        >
          <p className="text-xs font-semibold opacity-80">RM Balance</p>
          <div className="flex items-center justify-center gap-2 my-1">
            <Banknote className="w-7 h-7" />
            <p className="text-3xl font-extrabold">{realMoney.toFixed(2)}</p>
          </div>
          <p className="text-[10px] opacity-70">Real Money (MYR)</p>
          <p className="text-xs opacity-60 mt-1">Buy seeds & fertilizer</p>
        </motion.div>
      </div>

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
            const displayDesc = isRM ? tx.description.replace('[RM] ', '') : tx.description;
            return (
              <div key={tx.id} className="flex items-center gap-3 bg-card border rounded-xl p-3">
                {isRM ? (
                  <Banknote className="w-5 h-5 text-money flex-shrink-0" />
                ) : (
                  <img src={ccCoin} alt="CC" className="w-5 h-5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{displayDesc}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`font-bold text-sm whitespace-nowrap ${tx.type === 'earn' ? 'text-growth' : 'text-destructive'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{isRM ? `RM ${tx.amount.toFixed(2)}` : tx.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
