import { useState } from "react";
import { useGameStore, InventoryItem } from "@/store/gameStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const categories = [
  { key: 'seeds', label: 'Seeds', emoji: '🌱' },
  { key: 'fruits', label: 'Fruits', emoji: '🍎' },
  { key: 'vegetables', label: 'Vegetables', emoji: '🥦' },
  { key: 'fertilizers', label: 'Fertilizers', emoji: '💊' },
] as const;

export default function InventoryPage() {
  const { inventory } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<string>('seeds');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filtered = inventory.filter((i) => i.category === activeCategory);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Inventory 🎒</h1>
      <p className="text-sm text-muted-foreground mb-6">All your farming goodies in one place</p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setSelectedItem(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat.key
                ? 'gradient-farm text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-sm">Nothing here yet!</p>
            </div>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedItem?.id === item.id ? 'bg-primary/10 border border-primary/20' : 'bg-card border border-border hover:bg-muted'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className="bg-muted px-2 py-1 rounded-lg text-xs font-bold text-muted-foreground">x{item.quantity}</span>
              </motion.div>
            ))
          )}
        </div>

        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border rounded-2xl p-6 text-center"
          >
            <span className="text-6xl block mb-3">{selectedItem.emoji}</span>
            <h3 className="font-extrabold text-lg text-foreground">{selectedItem.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{selectedItem.description}</p>
            <p className="text-xs font-bold text-muted-foreground mb-4">Quantity: {selectedItem.quantity}</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full rounded-xl" size="sm">
                Use Item
              </Button>
              <Button variant="outline" className="w-full rounded-xl" size="sm">
                Sell for 🪙
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
