import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

export default function WalletPage() {
  const { coins, transactions } = useGameStore();
  const totalEarned = transactions.filter((t) => t.type === 'earn').reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter((t) => t.type === 'spend').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Wallet 💰</h1>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="gradient-coin rounded-2xl p-6 text-center mb-6 shadow-lg"
      >
        <p className="text-sm font-semibold opacity-80">CC Balance</p>
        <p className="text-4xl font-extrabold">🪙 {coins}</p>
        <p className="text-xs opacity-70 mt-1">CloudCrop Coins</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground font-semibold">Total Earned</p>
          <p className="text-xl font-extrabold text-growth">+{totalEarned}</p>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground font-semibold">Total Spent</p>
          <p className="text-xl font-extrabold text-destructive">-{totalSpent}</p>
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
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 bg-card border rounded-xl p-3">
              <span className="text-xl">{tx.type === 'earn' ? '📈' : '📉'}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={`font-bold text-sm ${tx.type === 'earn' ? 'text-growth' : 'text-destructive'}`}>
                {tx.type === 'earn' ? '+' : '-'}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
