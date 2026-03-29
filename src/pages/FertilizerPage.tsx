import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { toast } from "sonner";
import fertilizerBag from "@/assets/fertilizer-bag.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const packages = [
  { qty: 1, priceRM: 2.00, label: '1 Bag', icons: 1 },
  { qty: 5, priceRM: 8.00, label: '5 Bags', badge: 'Popular', icons: 2 },
  { qty: 10, priceRM: 14.00, label: '10 Bags', badge: 'Best Value', icons: 3 },
];

export default function FertilizerPage() {
  const { addToInventory, spendRealMoney, realMoney } = useGameStore();
  const [confirmQty, setConfirmQty] = useState<number | null>(null);

  const getPrice = (qty: number) => packages.find(p => p.qty === qty)?.priceRM || 0;

  const handleBuy = (qty: number) => {
    const price = getPrice(qty);
    if (!spendRealMoney(price, `Bought ${qty} Fertilizer bag${qty > 1 ? 's' : ''}`, [
      { name: 'Fertilizer', emoji: '💊', quantity: qty, price, paymentType: 'money' }
    ], 'Fertilizer Shop')) {
      toast.error(`Not enough RM! Need RM ${price.toFixed(2)} but you have RM ${realMoney.toFixed(2)}.`);
      return;
    }
    addToInventory({
      name: 'Fertilizer',
      emoji: '💊',
      category: 'fertilizers',
      quantity: qty,
      description: 'Skip 24 hours of growth time',
    });
    toast.success(`Added ${qty} fertilizer bag${qty > 1 ? 's' : ''} to inventory!`);
    setConfirmQty(null);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <img src={fertilizerBag} alt="Fertilizer" className="w-8 h-8 object-contain" />
        <h1 className="text-2xl font-extrabold text-foreground">Fertilizer Shop</h1>
      </div>
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
                onClick={() => setConfirmQty(pkg.qty)}
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

      <AlertDialog open={confirmQty !== null} onOpenChange={(open) => !open && setConfirmQty(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Buy {confirmQty} fertilizer bag{confirmQty && confirmQty > 1 ? 's' : ''} for {confirmQty === 1 ? 'RM 2.00' : confirmQty === 5 ? 'RM 8.00' : 'RM 14.00'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="gradient-farm text-primary-foreground rounded-xl" onClick={() => confirmQty && handleBuy(confirmQty)}>
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
