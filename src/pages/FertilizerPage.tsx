import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { toast } from "sonner";
import fertilizerBag from "@/assets/fertilizer-bag.png";

const packages = [
  { qty: 1, price: 'RM 2.00', label: '1 Bag', icons: 1 },
  { qty: 5, price: 'RM 8.00', label: '5 Bags', badge: 'Popular', icons: 2 },
  { qty: 10, price: 'RM 14.00', label: '10 Bags', badge: 'Best Value', icons: 3 },
];

export default function FertilizerPage() {
  const { addToInventory } = useGameStore();

  const handleBuy = (qty: number) => {
    addToInventory({
      name: 'Fertilizer',
      emoji: '💊',
      category: 'fertilizers',
      quantity: qty,
      description: 'Skip 24 hours of growth time',
    });
    toast.success(`Added ${qty} fertilizer bag${qty > 1 ? 's' : ''} to inventory!`);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Fertilizer Shop 💊</h1>
      <p className="text-sm text-muted-foreground mb-6">Speed up your crops with premium fertilizer</p>

      <div className="space-y-4">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.qty}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card border rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
          >
            <div className="flex items-end -space-x-2">
              {Array.from({ length: pkg.icons }).map((_, i) => (
                <img key={i} src={fertilizerBag} alt="" className="w-9 h-9 object-contain" />
              ))}
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{pkg.label}</p>
              <p className="text-sm text-muted-foreground">Skip 24h growth per use</p>
            </div>
            <div className="text-right flex flex-col items-center">
              {pkg.badge && (
                <span className="gradient-farm text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                  {pkg.badge}
                </span>
              )}
              <p className="font-extrabold text-foreground">{pkg.price}</p>
              <Button
                size="sm"
                onClick={() => handleBuy(pkg.qty)}
                className="mt-1 gradient-farm text-primary-foreground rounded-xl text-xs"
              >
                Buy Now
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted rounded-xl p-4 mt-6">
        <p className="text-xs text-muted-foreground">
          💡 <span className="font-semibold">Tip:</span> Fertilizer is stored in your inventory and can be used on any growing plant to skip 24 hours of growth!
        </p>
      </div>
    </div>
  );
}
