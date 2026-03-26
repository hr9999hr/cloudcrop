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
  timestamp: number;
}

interface GameState {
  coins: number;
  realMoney: number;
  waterDrops: number;
  weather: WeatherType;
  plants: PlantSlot[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  hasSeenWelcome: boolean;
  dailyLoginClaimed: boolean;

  // Actions
  setHasSeenWelcome: (v: boolean) => void;
  claimDailyLogin: () => void;
  plantSeed: (slotId: number, seedName: string, emoji: string, durationMs: number, yieldCoins: number) => void;
  waterPlant: (slotId: number) => void;
  fertilizePlant: (slotId: number) => void;
  harvestPlant: (slotId: number) => { coins: number; plantName: string; emoji: string };
  updateProgress: () => void;
  addToInventory: (item: Omit<InventoryItem, 'id'>) => void;
  removeFromInventory: (id: string, qty: number) => void;
  addCoins: (amount: number, desc: string) => void;
  spendCoins: (amount: number, desc: string) => boolean;
  addRealMoney: (amount: number, desc: string) => void;
  spendRealMoney: (amount: number, desc: string) => boolean;
}

const SEED_OPTIONS = [
  { name: 'Tomato', emoji: '🍅', durationMs: 3 * 60 * 1000, yieldCoins: 10 }, // 3 min for demo
  { name: 'Carrot', emoji: '🥕', durationMs: 2 * 60 * 1000, yieldCoins: 8 },
  { name: 'Lettuce', emoji: '🥬', durationMs: 1.5 * 60 * 1000, yieldCoins: 6 },
  { name: 'Corn', emoji: '🌽', durationMs: 4 * 60 * 1000, yieldCoins: 15 },
  { name: 'Chili', emoji: '🌶️', durationMs: 5 * 60 * 1000, yieldCoins: 20 },
];

export { SEED_OPTIONS };

const initialPlants: PlantSlot[] = [
  { id: 1, status: 'empty', plantName: null, plantEmoji: null, plantedAt: null, growthDurationMs: 0, progress: 0, yieldCoins: 0 },
  { id: 2, status: 'empty', plantName: null, plantEmoji: null, plantedAt: null, growthDurationMs: 0, progress: 0, yieldCoins: 0 },
  { id: 3, status: 'empty', plantName: null, plantEmoji: null, plantedAt: null, growthDurationMs: 0, progress: 0, yieldCoins: 0 },
];

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
  hasSeenWelcome: false,
  dailyLoginClaimed: false,

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

  harvestPlant: (slotId) => {
    const s = get();
    const plant = s.plants.find((p) => p.id === slotId);
    if (!plant || plant.status !== 'ready') return { coins: 0, plantName: '', emoji: '' };
    const earned = plant.yieldCoins;
    set({
      coins: s.coins + earned,
      plants: s.plants.map((p) =>
        p.id === slotId
          ? { ...p, status: 'empty' as PlantStatus, plantName: null, plantEmoji: null, plantedAt: null, progress: 0, yieldCoins: 0 }
          : p
      ),
      transactions: [
        { id: Date.now().toString(), type: 'earn', amount: earned, description: `Harvested ${plant.plantName}`, timestamp: Date.now() },
        ...s.transactions,
      ],
    });
    return { coins: earned, plantName: plant.plantName || '', emoji: plant.plantEmoji || '' };
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

  spendCoins: (amount, desc) => {
    const s = get();
    if (s.coins < amount) return false;
    set({
      coins: s.coins - amount,
      transactions: [{ id: Date.now().toString(), type: 'spend', amount, description: desc, timestamp: Date.now() }, ...s.transactions],
    });
    return true;
  },

  addRealMoney: (amount, desc) => set((s) => ({
    realMoney: s.realMoney + amount,
    transactions: [{ id: Date.now().toString(), type: 'earn', amount, description: `[RM] ${desc}`, timestamp: Date.now() }, ...s.transactions],
  })),

  spendRealMoney: (amount, desc) => {
    const s = get();
    if (s.realMoney < amount) return false;
    set({
      realMoney: s.realMoney - amount,
      transactions: [{ id: Date.now().toString(), type: 'spend', amount, description: `[RM] ${desc}`, timestamp: Date.now() }, ...s.transactions],
    });
    return true;
  },
}));
