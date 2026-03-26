import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  emoji: string;
  vendor: string;
  priceRM: number;
  ccDiscount: number;
  image: string;
}

const products: Product[] = [
  { id: '1', name: 'Ugly Tomatoes (1kg)', emoji: '🍅', vendor: 'Pak Ali Farm', priceRM: 5.50, ccDiscount: 2, image: '🍅' },
  { id: '2', name: 'Wonky Carrots (500g)', emoji: '🥕', vendor: 'Mak Cik Organik', priceRM: 3.80, ccDiscount: 1, image: '🥕' },
  { id: '3', name: 'Small Lettuce Bundle', emoji: '🥬', vendor: 'Green Valley', priceRM: 4.20, ccDiscount: 2, image: '🥬' },
  { id: '4', name: 'Mixed Chili Pack', emoji: '🌶️', vendor: 'Spice Garden', priceRM: 6.00, ccDiscount: 3, image: '🌶️' },
  { id: '5', name: 'Sweet Corn (3pcs)', emoji: '🌽', vendor: 'Uncle Tan Farm', priceRM: 4.50, ccDiscount: 2, image: '🌽' },
  { id: '6', name: 'Organic Spinach', emoji: '🥗', vendor: 'BioFarm MY', priceRM: 5.00, ccDiscount: 2, image: '🥗' },
];

interface CartItem extends Product {
  quantity: number;
}

export default function MarketplacePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0)
    );
  };

  const totalRM = cart.reduce((s, i) => s + i.priceRM * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Marketplace 🛒</h1>
          <p className="text-sm text-muted-foreground">Buy real "ugly" veggies & support farmers</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowCart(!showCart)}
          className="relative rounded-xl"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Button>
      </div>

      {showCart && cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-2xl p-4 mb-6"
        >
          <h3 className="font-bold text-foreground mb-3">Your Cart</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">RM {(item.priceRM * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <div>
              <p className="text-sm font-bold text-foreground">Total: RM {totalRM.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">+ RM 1.00 FPX fee</p>
            </div>
            <Button className="gradient-farm text-primary-foreground rounded-xl font-bold">
              Checkout 💳
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -2 }}
            className="bg-card border rounded-2xl p-4 flex flex-col"
          >
            <div className="text-center text-5xl py-4">{product.emoji}</div>
            <p className="font-bold text-sm text-foreground leading-tight">{product.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{product.vendor}</p>
            <div className="mt-auto pt-3 flex items-end justify-between">
              <div>
                <p className="font-extrabold text-foreground">RM {product.priceRM.toFixed(2)}</p>
                <p className="text-xs text-coin font-semibold">-{product.ccDiscount} 🪙 CC</p>
              </div>
              <Button
                size="sm"
                onClick={() => addToCart(product)}
                className="gradient-farm text-primary-foreground rounded-xl text-xs px-3"
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
