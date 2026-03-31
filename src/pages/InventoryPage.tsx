import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore, InventoryItem, SEED_OPTIONS } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowRight, Minus, Plus, X } from "lucide-react";
import { SeedDetailPopup } from "@/components/SeedDetailPopup";
import ccCoin from "@/assets/cc-coin.png";
import fertilizerBag from "@/assets/fertilizer-bag.png";
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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'quantity' | 'az'>('quantity');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sellQty, setSellQty] = useState(1);
  const [seedDetailOpen, setSeedDetailOpen] = useState(false);
  const [seedDetailName, setSeedDetailName] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setActiveCategory(key);
    setSelectedItem(null);
  };

  const activeCats = activeCategory === 'all' ? categories.map(c => c.key) : [activeCategory];

  const filtered = inventory
    .filter((i) => activeCats.includes(i.category))
    .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'quantity' ? b.quantity - a.quantity : a.name.localeCompare(b.name));

  const grouped = activeCats
    .map((catKey) => {
      const cat = categories.find((c) => c.key === catKey);
      const items = filtered.filter((i) => i.category === catKey);
      return cat ? { ...cat, items, count: items.reduce((s, i) => s + i.quantity, 0) } : null;
    })
    .filter((g) => g !== null);

  const isSeed = selectedItem?.category === 'seeds';
  const isFertilizer = selectedItem?.category === 'fertilizers';
  const isSellable = selectedItem && !isSeed && !isFertilizer;

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

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => toggleCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => toggleCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeCategory === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search + Sort row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-card"
          />
        </div>
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

      <div className={`grid grid-cols-1 ${selectedItem ? 'lg:grid-cols-[1fr_280px]' : ''} gap-6`}>

        <div className="space-y-5">

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
                      {item.category === 'fertilizers' ? <img src={fertilizerBag} alt={item.name} className="w-8 h-8 object-contain" /> : item.emoji}
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
              className="bg-card border border-border rounded-2xl p-5 h-fit relative"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-extrabold text-lg text-foreground mb-4 pr-6">
                {selectedItem.name}
              </h3>

              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center text-5xl">
                  {selectedItem.category === 'fertilizers' ? <img src={fertilizerBag} alt={selectedItem.name} className="w-16 h-16 object-contain" /> : selectedItem.emoji}
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

              {isFertilizer && (
                <>
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    {selectedItem.description}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mb-4">
                    You have <span className="font-bold text-foreground">{selectedItem.quantity}</span> bag{selectedItem.quantity > 1 ? 's' : ''}
                  </p>
                  <Button
                    onClick={() => { setSelectedItem(null); navigate('/'); }}
                    className="w-full rounded-xl gradient-farm text-primary-foreground font-bold"
                  >
                    Use on Plant 🌱
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Go to your garden and tap a growing plant to apply fertilizer
                  </p>
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
          ) : null}
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
