import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, X, Search } from "lucide-react";
import { toast } from "sonner";
import { useGameStore, SEED_OPTIONS } from "@/store/gameStore";
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
import ccCoin from "@/assets/cc-coin.png";

type PaymentType = 'coins' | 'money';
type ProductCategory = 'fruits' | 'vegetables' | 'seeds';
type ConditionType = 'Basic' | 'Good' | 'Perfect';

interface Product {
  id: string;
  name: string;
  emoji: string;
  category: ProductCategory;
  vendor: string;
  condition?: ConditionType;
  price: number;
  paymentType: PaymentType;
}

const products: Product[] = [
  // Fruits - Basic (CC or RM)
  { id: 'f1', name: 'Basic Apples (1kg)', emoji: '🍎', category: 'fruits', vendor: 'Pak Ali Farm', condition: 'Basic', price: 8, paymentType: 'coins' },
  { id: 'f2', name: 'Basic Bananas (1kg)', emoji: '🍌', category: 'fruits', vendor: 'Green Valley', condition: 'Basic', price: 5, paymentType: 'coins' },
  { id: 'f3', name: 'Basic Mangoes (500g)', emoji: '🥭', category: 'fruits', vendor: 'Tropical Harvest', condition: 'Basic', price: 12, paymentType: 'coins' },
  { id: 'f3b', name: 'Basic Watermelon (1pc)', emoji: '🍉', category: 'fruits', vendor: 'Uncle Tan Farm', condition: 'Basic', price: 10, paymentType: 'coins' },
  // Fruits - Good
  { id: 'f4', name: 'Good Apples (1kg)', emoji: '🍎', category: 'fruits', vendor: 'Pak Ali Farm', condition: 'Good', price: 12.90, paymentType: 'money' },
  { id: 'f5', name: 'Good Bananas (1kg)', emoji: '🍌', category: 'fruits', vendor: 'Green Valley', condition: 'Good', price: 8.50, paymentType: 'money' },
  { id: 'f5b', name: 'Good Oranges (1kg)', emoji: '🍊', category: 'fruits', vendor: 'Citrus Valley', condition: 'Good', price: 11.00, paymentType: 'money' },
  // Fruits - Perfect
  { id: 'f6', name: 'Premium Strawberries (250g)', emoji: '🍓', category: 'fruits', vendor: 'BioFarm MY', condition: 'Perfect', price: 18.90, paymentType: 'money' },
  { id: 'f7', name: 'Premium Grapes (500g)', emoji: '🍇', category: 'fruits', vendor: 'Tropical Harvest', condition: 'Perfect', price: 22.00, paymentType: 'money' },

  // Vegetables - Basic (CC) - Malaysian B-grade produce
  { id: 'v1', name: 'Basic Kangkung (500g)', emoji: '🥬', category: 'vegetables', vendor: 'Pak Ali Farm', condition: 'Basic', price: 250, paymentType: 'coins' },
  { id: 'v2', name: 'Basic Sawi (500g)', emoji: '🥗', category: 'vegetables', vendor: 'Mak Cik Organik', condition: 'Basic', price: 250, paymentType: 'coins' },
  { id: 'v3', name: 'Basic Bendi (300g)', emoji: '🫛', category: 'vegetables', vendor: 'Green Valley', condition: 'Basic', price: 300, paymentType: 'coins' },
  { id: 'v4', name: 'Basic Cili (100g)', emoji: '🌶️', category: 'vegetables', vendor: 'Spice Garden', condition: 'Basic', price: 150, paymentType: 'coins' },
  // Vegetables - Good (RM)
  { id: 'v5', name: 'Good Kangkung (500g)', emoji: '🥬', category: 'vegetables', vendor: 'Pak Ali Farm', condition: 'Good', price: 3.50, paymentType: 'money' },
  { id: 'v6', name: 'Good Terung (500g)', emoji: '🍆', category: 'vegetables', vendor: 'BioFarm MY', condition: 'Good', price: 4.00, paymentType: 'money' },
  { id: 'v7', name: 'Good Timun (3pcs)', emoji: '🥒', category: 'vegetables', vendor: 'Uncle Tan Farm', condition: 'Good', price: 3.00, paymentType: 'money' },
  // Vegetables - Perfect
  { id: 'v8', name: 'Organic Bayam (500g)', emoji: '🌿', category: 'vegetables', vendor: 'BioFarm MY', condition: 'Perfect', price: 5.50, paymentType: 'money' },
  { id: 'v9', name: 'Premium Tomato (1kg)', emoji: '🍅', category: 'vegetables', vendor: 'Green Valley', condition: 'Perfect', price: 9.90, paymentType: 'money' },

  // Seeds (CC coins) - matching the 10 Malaysian crops
  { id: 's1', name: 'Kangkung Seed', emoji: '🥬', category: 'seeds', vendor: 'SeedMart', price: 10, paymentType: 'coins' },
  { id: 's2', name: 'Sawi Seed', emoji: '🥗', category: 'seeds', vendor: 'SeedMart', price: 15, paymentType: 'coins' },
  { id: 's3', name: 'Bayam Seed', emoji: '🌿', category: 'seeds', vendor: 'SeedMart', price: 15, paymentType: 'coins' },
  { id: 's4', name: 'Timun Seed', emoji: '🥒', category: 'seeds', vendor: 'GreenGrow', price: 20, paymentType: 'coins' },
  { id: 's5', name: 'Bendi Seed', emoji: '🫛', category: 'seeds', vendor: 'GreenGrow', price: 25, paymentType: 'coins' },
  { id: 's6', name: 'Tomato Seed', emoji: '🍅', category: 'seeds', vendor: 'SeedMart', price: 30, paymentType: 'coins' },
  { id: 's7', name: 'Kacang Panjang Seed', emoji: '🫘', category: 'seeds', vendor: 'GreenGrow', price: 35, paymentType: 'coins' },
  { id: 's8', name: 'Cili Padi Seed', emoji: '🌶️', category: 'seeds', vendor: 'GreenGrow', price: 40, paymentType: 'coins' },
  { id: 's9', name: 'Terung Seed', emoji: '🍆', category: 'seeds', vendor: 'SeedMart', price: 50, paymentType: 'coins' },
  { id: 's10', name: 'Labu Seed', emoji: '🎃', category: 'seeds', vendor: 'GreenGrow', price: 80, paymentType: 'coins' },
];



const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'fruits', label: 'Fruits' },
  { key: 'vegetables', label: 'Vegetables' },
  { key: 'seeds', label: 'Seeds' },
] as const;

const conditionTabs = [
  { key: 'all', label: 'All Conditions' },
  { key: 'Basic', label: 'Basic' },
  { key: 'Good', label: 'Good' },
  { key: 'Perfect', label: 'Perfect' },
] as const;

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { coins, realMoney, spendCoins, spendRealMoney, addToInventory, createDelivery, deliveryAddress, cart, addToCart: storeAddToCart, updateCartQty, removeFromCart: storeRemoveFromCart, clearCart } = useGameStore();
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentType>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .filter((p) => paymentFilter === 'all' || p.paymentType === paymentFilter)
    .filter((p) => conditionFilter === 'all' || p.condition === conditionFilter || (!p.condition && conditionFilter === 'all'))
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const addToCart = (product: Product) => {
    storeAddToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  const updateQty = (id: string, delta: number) => {
    updateCartQty(id, delta);
  };

  const removeFromCart = (id: string) => {
    storeRemoveFromCart(id);
  };

  const coinItems = cart.filter((i) => i.paymentType === 'coins');
  const moneyItems = cart.filter((i) => i.paymentType === 'money');
  const totalCoins = coinItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalRM = moneyItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!deliveryAddress) {
      toast.error("Please set your delivery address on the Delivery page first!");
      return;
    }

    if (totalCoins > coins) {
      toast.error(`Not enough CC coins! You need ${totalCoins} CC but have ${coins} CC.`);
      return;
    }
    if (totalRM > realMoney) {
      toast.error(`Not enough RM! You need RM ${totalRM.toFixed(2)} but have RM ${realMoney.toFixed(2)}.`);
      return;
    }

    const coinItemDetails = coinItems.map((i) => ({ name: i.name, emoji: i.emoji, quantity: i.quantity, price: i.price, paymentType: 'coins' as const }));
    const moneyItemDetails = moneyItems.map((i) => ({ name: i.name, emoji: i.emoji, quantity: i.quantity, price: i.price, paymentType: 'money' as const }));

    if (totalCoins > 0) {
      const success = spendCoins(totalCoins, `Supermarket purchase (${coinItems.length} items)`, coinItemDetails, 'Supermarket');
      if (!success) { toast.error("Failed to deduct CC coins."); return; }
    }
    if (totalRM > 0) {
      const success = spendRealMoney(totalRM, `Supermarket purchase (${moneyItems.length} items)`, moneyItemDetails, 'Supermarket');
      if (!success) { toast.error("Failed to deduct RM."); return; }
    }

    // Seeds go to inventory, everything else goes directly to delivery
    const seedItems = cart.filter((i) => i.category === 'seeds');
    const deliveryCartItems = cart.filter((i) => i.category !== 'seeds');

    seedItems.forEach((item) => {
      addToInventory({ name: item.name, emoji: item.emoji, category: 'seeds', quantity: item.quantity, description: `Purchased from Supermarket` });
    });

    // Create delivery for produce (no inventory storage)
    if (deliveryCartItems.length > 0) {
      createDelivery(deliveryCartItems.map((i) => ({ name: i.name, emoji: i.emoji, quantity: i.quantity })));
    }

    const seedMsg = seedItems.length > 0 ? ' Seeds added to inventory.' : '';
    const deliveryMsg = deliveryCartItems.length > 0 ? ' Produce will be delivered to your address!' : '';
    toast.success(`🎉 Purchase successful!${seedMsg}${deliveryMsg}`);
    clearCart();
    setShowCart(false);
  };

  const conditionBadge = (condition?: string) => {
    if (!condition) return null;
    const colors: Record<string, string> = {
      Basic: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Perfect: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[condition] || 'bg-muted text-muted-foreground'}`}>
        {condition}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Supermarket 🛒</h1>
          <p className="text-sm text-muted-foreground">Buy real produce & seeds — delivered to your door</p>
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

      {/* Payment Filter */}
      <div className="flex gap-2 mb-3">
        {[
          { key: 'all', label: 'All' },
          { key: 'coins', label: 'Buy with CC' },
          { key: 'money', label: 'Buy with RM' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPaymentFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${
              paymentFilter === tab.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:bg-accent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-3">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === tab.key
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Condition Filter */}
      {activeCategory !== 'seeds' && (
        <div className="flex gap-2 mb-4">
          {conditionTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setConditionFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                conditionFilter === tab.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Cart Panel */}
      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border rounded-2xl p-4 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground">Your Order</h3>
              <button onClick={() => setShowCart(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.paymentType === 'coins'
                      ? `${item.price * item.quantity} CC`
                      : `RM ${(item.price * item.quantity).toFixed(2)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-1">
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3 pt-3 border-t border-border space-y-1">
              {totalCoins > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img src={ccCoin} alt="CC" className="w-4 h-4" />
                    <span className="text-sm font-bold text-foreground">CC Total:</span>
                  </div>
                  <span className={`text-sm font-extrabold ${totalCoins > coins ? 'text-destructive' : 'text-coin'}`}>
                    {totalCoins} CC {totalCoins > coins && '(insufficient)'}
                  </span>
                </div>
              )}
              {totalRM > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">💵 RM Total:</span>
                  <span className={`text-sm font-extrabold ${totalRM > realMoney ? 'text-destructive' : 'text-money'}`}>
                    RM {totalRM.toFixed(2)} {totalRM > realMoney && '(insufficient)'}
                  </span>
                </div>
              )}
              <Button
                onClick={() => setShowCheckoutConfirm(true)}
                disabled={(totalCoins > coins) || (totalRM > realMoney)}
                className="w-full mt-2 gradient-farm text-primary-foreground rounded-xl font-bold"
              >
                Checkout & Deliver 📦
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-4xl block mb-2">🔍</span>
          <p className="text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedProduct(product)}
              className="bg-card border rounded-2xl p-4 flex flex-col cursor-pointer"
            >
              <div className="text-center text-5xl py-3">{product.emoji}</div>
              <div className="flex items-center gap-1.5 mb-1">
                {conditionBadge(product.condition)}
              </div>
              <p className="font-bold text-sm text-foreground leading-tight">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{product.vendor}</p>
              <div className="mt-auto pt-3 flex items-end justify-between">
                <div>
                  {product.paymentType === 'coins' ? (
                    <div className="flex items-center gap-1">
                      <img src={ccCoin} alt="CC" className="w-4 h-4" />
                      <span className="font-extrabold text-coin">{product.price} CC</span>
                    </div>
                  ) : (
                    <p className="font-extrabold text-money">RM {product.price.toFixed(2)}</p>
                  )}
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
      )}

      {/* Floating View Order Button */}
      {cart.length > 0 && !showCart && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 z-20"
        >
          <Button
            onClick={() => setShowCart(true)}
            className="gradient-farm text-primary-foreground rounded-2xl px-6 py-3 font-bold shadow-lg text-sm"
          >
            View Order ({totalItems}) 🛒
          </Button>
        </motion.div>
      )}

      {/* Product Detail Popup */}
      <AlertDialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          {selectedProduct && (
            <>
              <AlertDialogHeader>
                <div className="text-center text-7xl py-4">{selectedProduct.emoji}</div>
                <AlertDialogTitle className="text-center text-lg">{selectedProduct.name}</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {conditionBadge(selectedProduct.condition)}
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{selectedProduct.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Vendor: <span className="font-semibold text-foreground">{selectedProduct.vendor}</span></p>
                    <div className="bg-muted/50 rounded-xl p-3">
                      {selectedProduct.paymentType === 'coins' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <img src={ccCoin} alt="CC" className="w-5 h-5" />
                          <span className="font-extrabold text-lg text-coin">{selectedProduct.price} CC</span>
                        </div>
                      ) : (
                        <p className="font-extrabold text-lg text-money">RM {selectedProduct.price.toFixed(2)}</p>
                      )}
                    </div>
                    {selectedProduct.category === 'seeds' && (
                      <p className="text-xs text-muted-foreground">🌱 This seed will be added to your inventory after purchase.</p>
                    )}
                    {selectedProduct.category !== 'seeds' && (
                      <p className="text-xs text-muted-foreground">📦 This item will be delivered to your address after purchase.</p>
                    )}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
                <AlertDialogCancel className="rounded-xl flex-1 mt-0">Close</AlertDialogCancel>
                <AlertDialogAction
                  className="gradient-farm text-primary-foreground rounded-xl flex-1"
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add to Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              {totalCoins > 0 && <span className="block">💰 {totalCoins} CC Coins</span>}
              {totalRM > 0 && <span className="block">💵 RM {totalRM.toFixed(2)}</span>}
              <span className="block mt-1">Are you sure you want to checkout {totalItems} item{totalItems > 1 ? 's' : ''}?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="gradient-farm text-primary-foreground rounded-xl" onClick={() => { setShowCheckoutConfirm(false); handleCheckout(); }}>
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
