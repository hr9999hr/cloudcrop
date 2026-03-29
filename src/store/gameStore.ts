import { create } from 'zustand';

export type PlantStatus = 'empty' | 'growing' | 'ready' | 'dead';
export type WeatherType = 'sunny' | 'rainy' | 'heatwave' | 'monsoon';

export interface PlantSlot {
  id: number;
  status: PlantStatus;
  plantName: string | null;
  plantEmoji: string | null;
  plantedAt: number | null;
  growthDurationMs: number;
  progress: number;
  yieldCoins: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  category: 'seeds' | 'fruits' | 'vegetables' | 'fertilizers';
  quantity: number;
  description: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  source?: string;
  timestamp: number;
  items?: { name: string; emoji: string; quantity: number; price: number; paymentType: 'coins' | 'money' }[];
}

export type DeliveryStatus = 'processing' | 'in_progress' | 'on_the_road' | 'completed';

export interface DeliveryOrder {
  id: string;
  items: { name: string; emoji: string; quantity: number }[];
  address: string;
  status: DeliveryStatus;
  createdAt: number;
  estimatedMinutes: number;
  completedAt?: number;
}
export interface CartItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  vendor: string;
  price: number;
  paymentType: 'coins' | 'money';
  condition?: string;
  quantity: number;
}

interface GameState {
  coins: number;
  realMoney: number;
  waterDrops: number;
  weather: WeatherType;
  plants: PlantSlot[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  deliveries: DeliveryOrder[];
  deliveryAddress: string;
  cart: CartItem[];
  hasSeenWelcome: boolean;
  dailyLoginClaimed: boolean;
  farmerLevel: number;
  totalHarvests: number;

  // Actions
  setHasSeenWelcome: (v: boolean) => void;
  claimDailyLogin: () => void;
  plantSeed: (slotId: number, seedName: string, emoji: string, durationMs: number, yieldCoins: number) => void;
  waterPlant: (slotId: number) => void;
  fertilizePlant: (slotId: number) => void;
  harvestPlant: (slotId: number, action: 'sell' | 'bag') => { coins: number; plantName: string; emoji: string; quantity: number };
  updateProgress: () => void;
  addToInventory: (item: Omit<InventoryItem, 'id'>) => void;
  removeFromInventory: (id: string, qty: number) => void;
  addCoins: (amount: number, desc: string) => void;
  spendCoins: (amount: number, desc: string, items?: Transaction['items'], source?: string) => boolean;
  addRealMoney: (amount: number, desc: string) => void;
  spendRealMoney: (amount: number, desc: string, items?: Transaction['items'], source?: string) => boolean;
  setDeliveryAddress: (address: string) => void;
  createDelivery: (items: DeliveryOrder['items']) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
  topUpRealMoney: (amount: number) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const SEED_OPTIONS = [
  { name: 'Tomato', emoji: '🍅', durationMs: 3 * 60 * 1000, yieldCoins: 10 }, // 3 min for demo
  { name: 'Carrot', emoji: '🥕', durationMs: 2 * 60 * 1000, yieldCoins: 8 },
  { name: 'Lettuce', emoji: '🥬', durationMs: 1.5 * 60 * 1000, yieldCoins: 6 },
  { name: 'Corn', emoji: '🌽', durationMs: 4 * 60 * 1000, yieldCoins: 15 },
  { name: 'Chili', emoji: '🌶️', durationMs: 5 * 60 * 1000, yieldCoins: 20 },
];

export { SEED_OPTIONS };

const LEVEL_CONFIG = [
  { level: 1, slots: 3, harvestsNeeded: 0 },
  { level: 2, slots: 6, harvestsNeeded: 5 },
  { level: 3, slots: 9, harvestsNeeded: 15 },
];

export { LEVEL_CONFIG };

const makeEmptySlot = (id: number): PlantSlot => ({
  id, status: 'empty', plantName: null, plantEmoji: null, plantedAt: null, growthDurationMs: 0, progress: 0, yieldCoins: 0,
});

const getSlotsForLevel = (level: number): number => {
  const cfg = LEVEL_CONFIG.find(c => c.level === level);
  return cfg ? cfg.slots : 3;
};

const initialPlants: PlantSlot[] = [1, 2, 3].map(makeEmptySlot);

const initialInventory: InventoryItem[] = [
  { id: 'seed-tomato', name: 'Tomato Seed', emoji: '🍅', category: 'seeds', quantity: 1, description: 'Grows into a juicy tomato in 3 minutes' },
  { id: 'seed-carrot', name: 'Carrot Seed', emoji: '🥕', category: 'seeds', quantity: 1, description: 'Grows into a crunchy carrot in 2 minutes' },
  { id: 'seed-lettuce', name: 'Lettuce Seed', emoji: '🥬', category: 'seeds', quantity: 1, description: 'Grows into fresh lettuce in 1.5 minutes' },
];

export const useGameStore = create<GameState>((set, get) => ({
  coins: 0,
  realMoney: 50.00,
  waterDrops: 3,
  weather: 'sunny',
  plants: initialPlants,
  inventory: initialInventory,
  transactions: [],
  deliveries: [],
  deliveryAddress: '',
  hasSeenWelcome: false,
  dailyLoginClaimed: false,
  farmerLevel: 1,
  totalHarvests: 0,

  setHasSeenWelcome: (v) => set({ hasSeenWelcome: v }),

  claimDailyLogin: () => set((s) => ({
    dailyLoginClaimed: true,
    waterDrops: s.waterDrops + 1,
  })),

  plantSeed: (slotId, seedName, emoji, durationMs, yieldCoins) => set((s) => ({
    plants: s.plants.map((p) =>
      p.id === slotId
        ? { ...p, status: 'growing' as PlantStatus, plantName: seedName, plantEmoji: emoji, plantedAt: Date.now(), growthDurationMs: durationMs, progress: 0, yieldCoins }
        : p
    ),
  })),

  waterPlant: (slotId) => {
    const s = get();
    if (s.waterDrops <= 0) return;
    set({
      waterDrops: s.waterDrops - 1,
      plants: s.plants.map((p) =>
        p.id === slotId && p.status === 'growing'
          ? { ...p, progress: Math.min(100, p.progress + 10) }
          : p
      ),
    });
  },

  fertilizePlant: (slotId) => set((s) => {
    const fertItem = s.inventory.find((i) => i.category === 'fertilizers' && i.quantity > 0);
    if (!fertItem) return s;
    return {
      inventory: s.inventory.map((i) =>
        i.id === fertItem.id ? { ...i, quantity: i.quantity - 1 } : i
      ).filter((i) => i.quantity > 0),
      plants: s.plants.map((p) =>
        p.id === slotId && p.status === 'growing'
          ? { ...p, plantedAt: (p.plantedAt || Date.now()) - 24 * 60 * 60 * 1000 }
          : p
      ),
    };
  }),

  harvestPlant: (slotId, action) => {
    const s = get();
    const plant = s.plants.find((p) => p.id === slotId);
    if (!plant || plant.status !== 'ready') return { coins: 0, plantName: '', emoji: '', quantity: 0 };
    const earned = plant.yieldCoins;
    const harvestQty = Math.max(1, Math.floor(plant.progress / 20));

    const resetPlant = s.plants.map((p) =>
      p.id === slotId
        ? { ...p, status: 'empty' as PlantStatus, plantName: null, plantEmoji: null, plantedAt: null, progress: 0, yieldCoins: 0 }
        : p
    );

    // Level up logic
    const newTotalHarvests = s.totalHarvests + 1;
    let newLevel = s.farmerLevel;
    for (const cfg of LEVEL_CONFIG) {
      if (newTotalHarvests >= cfg.harvestsNeeded) newLevel = cfg.level;
    }
    // Expand slots if leveled up
    let newPlants = resetPlant;
    const targetSlots = getSlotsForLevel(newLevel);
    if (targetSlots > newPlants.length) {
      for (let i = newPlants.length + 1; i <= targetSlots; i++) {
        newPlants = [...newPlants, makeEmptySlot(i)];
      }
    }

    if (action === 'sell') {
      set({
        coins: s.coins + earned,
        plants: newPlants,
        totalHarvests: newTotalHarvests,
        farmerLevel: newLevel,
        transactions: [
          { id: Date.now().toString(), type: 'earn', amount: earned, description: `Sold ${harvestQty}x ${plant.plantName}`, source: 'Garden', timestamp: Date.now() },
          ...s.transactions,
        ],
      });
    } else {
      const existingItem = s.inventory.find((i) => i.name === plant.plantName && i.category === 'fruits');
      const newInventory = existingItem
        ? s.inventory.map((i) => i.name === plant.plantName && i.category === 'fruits' ? { ...i, quantity: i.quantity + harvestQty } : i)
        : [...s.inventory, { id: `harvest-${Date.now()}`, name: plant.plantName!, emoji: plant.plantEmoji!, category: 'fruits' as const, quantity: harvestQty, description: `Freshly harvested ${plant.plantName}` }];
      set({
        plants: newPlants,
        inventory: newInventory,
        totalHarvests: newTotalHarvests,
        farmerLevel: newLevel,
      });
    }
    return { coins: action === 'sell' ? earned : 0, plantName: plant.plantName || '', emoji: plant.plantEmoji || '', quantity: harvestQty };
  },

  updateProgress: () => set((s) => ({
    plants: s.plants.map((p) => {
      if (p.status !== 'growing' || !p.plantedAt) return p;
      const elapsed = Date.now() - p.plantedAt;
      const progress = Math.min(100, (elapsed / p.growthDurationMs) * 100);
      if (progress >= 100) {
        return { ...p, progress: 100, status: 'ready' as PlantStatus };
      }
      return { ...p, progress };
    }),
  })),

  addToInventory: (item) => set((s) => {
    const existing = s.inventory.find((i) => i.name === item.name);
    if (existing) {
      return { inventory: s.inventory.map((i) => i.name === item.name ? { ...i, quantity: i.quantity + item.quantity } : i) };
    }
    return { inventory: [...s.inventory, { ...item, id: Date.now().toString() }] };
  }),

  removeFromInventory: (id, qty) => set((s) => ({
    inventory: s.inventory.map((i) => i.id === id ? { ...i, quantity: i.quantity - qty } : i).filter((i) => i.quantity > 0),
  })),

  addCoins: (amount, desc) => set((s) => ({
    coins: s.coins + amount,
    transactions: [{ id: Date.now().toString(), type: 'earn', amount, description: desc, timestamp: Date.now() }, ...s.transactions],
  })),

  spendCoins: (amount, desc, items, source) => {
    const s = get();
    if (s.coins < amount) return false;
    set({
      coins: s.coins - amount,
      transactions: [{ id: Date.now().toString(), type: 'spend', amount, description: desc, source, timestamp: Date.now(), items }, ...s.transactions],
    });
    return true;
  },

  addRealMoney: (amount, desc) => set((s) => ({
    realMoney: s.realMoney + amount,
    transactions: [{ id: Date.now().toString(), type: 'earn', amount, description: `[RM] ${desc}`, timestamp: Date.now() }, ...s.transactions],
  })),

  spendRealMoney: (amount, desc, items, source) => {
    const s = get();
    if (s.realMoney < amount) return false;
    set({
      realMoney: s.realMoney - amount,
      transactions: [{ id: Date.now().toString(), type: 'spend', amount, description: `[RM] ${desc}`, source, timestamp: Date.now(), items }, ...s.transactions],
    });
    return true;
  },

  setDeliveryAddress: (address) => set({ deliveryAddress: address }),

  createDelivery: (items) => set((s) => ({
    deliveries: [
      {
        id: Date.now().toString(),
        items,
        address: s.deliveryAddress,
        status: 'processing',
        createdAt: Date.now(),
        estimatedMinutes: Math.floor(Math.random() * 30) + 15,
      },
      ...s.deliveries,
    ],
  })),

  updateDeliveryStatus: (id, status) => set((s) => ({
    deliveries: s.deliveries.map((d) =>
      d.id === id ? { ...d, status, ...(status === 'completed' ? { completedAt: Date.now() } : {}) } : d
    ),
  })),

  topUpRealMoney: (amount) => set((s) => ({
    realMoney: s.realMoney + amount,
    transactions: [
      { id: Date.now().toString(), type: 'earn', amount, description: `[RM] Top up RM ${amount.toFixed(2)}`, timestamp: Date.now() },
      ...s.transactions,
    ],
  })),
}));
