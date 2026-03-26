import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore, InventoryItem, SEED_OPTIONS } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowRight, Minus, Plus } from "lucide-react";
import { SeedDetailPopup } from "@/components/SeedDetailPopup";
import ccCoin from "@/assets/cc-coin.png";
import { toast } from "sonner";

const categories = [
  { key: 'seeds', label: 'Seeds' },
  { key: 'fruits', label: 'Fruits' },
  { key: 'vegetables', label: 'Vegetables' },
  { key: 'fertilizers', label: 'Fertilizers' },
] as const;

export default function InventoryPage() {
  const navigate = useNavigate();
  const { inventory, addCoins, removeFromInventory } = useGameStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['seeds', 'fruits', 'vegetables', 'fertilizers']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'quantity' | 'az'>('quantity');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sellQty, setSellQty] = useState(1);
  const [seedDetailOpen, setSeedDetailOpen] = useState(false);
  const [seedDetailName, setSeedDetailName] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
    setSelectedItem(null);
  };

  const filtered = inventory
    .filter((i) => selectedCategories.includes(i.category))
    .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'quantity' ? b.quantity - a.quantity : a.name.localeCompare(b.name));

  // Group by category
  const grouped = selectedCategories
    .map((catKey) => {
      const cat = categories.find((c) => c.key === catKey);
      const items = filtered.filter((i) => i.category === catKey);
      return cat ? { ...cat, items, count: items.reduce((s, i) => s + i.quantity, 0) } : null;
    })
    .filter((g) => g !== null);

  const isSeed = selectedItem?.category === 'seeds';
  const isSellable = selectedItem && !isSeed;

  const seedOption = selectedItem ? SEED_OPTIONS.find((s) => selectedItem.name.includes(s.name)) : null;

  const handleSell = (qty: number) => {
    if (!selectedItem) return;
    const pricePerUnit = seedOption?.yieldCoins ?? 5;
    const totalCoins = pricePerUnit * qty;
    addCoins(totalCoins, `Sold ${qty}x ${selectedItem.name}`);
    removeFromInventory(selectedItem.id, qty);
    toast.success(`Sold ${qty}x ${selectedItem.name} for ${totalCoins} CC!`);
    if (selectedItem.quantity - qty <= 0) {
      setSelectedItem(null);
    } else {
      setSelectedItem({ ...selectedItem, quantity: selectedItem.quantity - qty });
    }
    setSellQty(1);
  };

  const handlePlantSeed = () => {
    if (!selectedItem) return;
    setSeedDetailName(selectedItem.name);
    setSeedDetailOpen(true);
  };

  const confirmPlantSeed = () => {
    setSeedDetailOpen(false);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Inventory 🎒</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-6">
        {/* Left: Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl bg-card"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-foreground" />
              <h3 className="font-extrabold text-foreground">Filter</h3>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.key} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                  <Checkbox
                    checked={selectedCategories.includes(cat.key)}
                    onCheckedChange={() => toggleCategory(cat.key)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Item grid grouped by category */}
        <div className="space-y-5">
          <div className="flex justify-end">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'quantity' | 'az')}>
              <SelectTrigger className="w-[140px] rounded-xl bg-card text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="az">A - Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {grouped.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-extrabold text-foreground">{group.label}</h3>
                <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">{group.count}</span>
              </div>
              {group.items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic bg-muted/50 rounded-xl px-4 py-3">You don't own any of these.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedItem(item); setSellQty(1); }}
                      className={`relative w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-colors border ${
                        selectedItem?.id === item.id
                          ? 'bg-primary/15 border-primary/40 shadow-md'
                          : 'bg-card border-border hover:bg-muted'
                      }`}
                    >
                      {item.emoji}
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Detail panel */}
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card border border-border rounded-2xl p-5 h-fit"
            >
              <h3 className="font-extrabold text-lg text-foreground mb-4">
                {selectedItem.name}
              </h3>

              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center text-5xl">
                  {selectedItem.emoji}
                </div>
              </div>

              {isSeed && seedOption && (
                <>
                  {/* Seed to plant visual */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="bg-muted rounded-lg p-2 flex flex-col items-center">
                      <span className="text-2xl">🌱</span>
                      <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Seedling</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="bg-muted rounded-lg p-2 flex flex-col items-center">
                      <span className="text-2xl">{seedOption.emoji}</span>
                      <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{seedOption.name} Plant</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mb-1">
                    {(seedOption.durationMs / 60000).toFixed(1)} minutes
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
                    <span>1 {seedOption.name} =</span>
                    <img src={ccCoin} alt="CC" className="w-3.5 h-3.5" />
                    <span className="font-bold text-foreground">{seedOption.yieldCoins} CC</span>
                  </div>

                  <Button
                    onClick={handlePlantSeed}
                    className="w-full rounded-xl gradient-farm text-primary-foreground font-bold"
                  >
                    Plant it 🌱
                  </Button>
                </>
              )}

              {isSellable && (
                <>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                    <img src={ccCoin} alt="CC" className="w-4 h-4" />
                    <span className="font-bold text-foreground">{seedOption?.yieldCoins ?? 5} CC</span>
                    <span>per unit</span>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setSellQty(Math.max(1, sellQty - 1))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-extrabold text-foreground text-lg w-8 text-center">{sellQty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setSellQty(Math.min(selectedItem.quantity, sellQty + 1))}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSell(sellQty)}
                      className="w-full rounded-xl gradient-farm text-primary-foreground font-bold"
                    >
                      Sell {sellQty} for {(seedOption?.yieldCoins ?? 5) * sellQty} CC
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSell(selectedItem.quantity)}
                      className="w-full rounded-xl font-bold"
                    >
                      Sell All ({selectedItem.quantity})
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-2xl p-6 h-fit text-center"
            >
              <span className="text-4xl block mb-2">👆</span>
              <p className="text-sm text-muted-foreground">Select an item to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SeedDetailPopup
        open={seedDetailOpen}
        seedName={seedDetailName}
        onConfirm={confirmPlantSeed}
        onClose={() => setSeedDetailOpen(false)}
      />
    </div>
  );
}
