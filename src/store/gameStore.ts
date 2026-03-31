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
  health: number;
  lastWateredAt: number | null;
  neglectPenalty: number;
  wateredThisCycle: boolean;        // watered this cycle?
  totalWaterings: number;
  wateringsNeeded: number;
  wateringIntervalMs: number;       // how often plant needs water (ms)
  lastHealthDecayAt: number;
  fertilizedUntil: number;
  // SRS penalty tracking (FUN-007)
  missedWaterings: number;          // missed normal watering cycles
  heatwaveFailures: number;         // heatwave cycles where 2nd watering missed
  monsoonDays: number;              // monsoon cycles experienced
  currentCycleStart: number;        // start of current watering cycle
  heatwaveWateredTwice: boolean;    // tracked 2nd watering in heatwave
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
  weatherChangedAt: number;
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
  addWaterDrops: (amount: number) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setWeather: (weather: WeatherType) => void;
}

// 10 Malaysian crops — real-life growth times
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const SEED_OPTIONS = [
  { id: 1, name: 'Kangkung', emoji: '🥬', costCC: 10, durationMs: 1 * DAY, yieldCoins: 30, description: 'Fast grower. Harvest in ~1 day!' },
  { id: 2, name: 'Sawi', emoji: '🥗', costCC: 15, durationMs: 2 * DAY, yieldCoins: 40, description: 'Low risk. Ready in ~2 days.' },
  { id: 3, name: 'Bayam', emoji: '🌿', costCC: 15, durationMs: 2 * DAY, yieldCoins: 40, description: 'Quick leafy green. ~2 days to harvest.' },
  { id: 4, name: 'Timun', emoji: '🥒', costCC: 20, durationMs: 3 * DAY, yieldCoins: 55, description: 'Mid-tier crop. Ready in ~3 days.' },
  { id: 5, name: 'Bendi', emoji: '🫛', costCC: 25, durationMs: 4 * DAY, yieldCoins: 65, description: 'Solid returns in ~4 days.' },
  { id: 6, name: 'Tomato', emoji: '🍅', costCC: 30, durationMs: 5 * DAY, yieldCoins: 80, description: 'Turns bright red at 100%! ~5 days.' },
  { id: 7, name: 'Kacang Panjang', emoji: '🫘', costCC: 35, durationMs: 7 * DAY, yieldCoins: 90, description: 'Takes a full week. Good for daily log-in.' },
  { id: 8, name: 'Cili Padi', emoji: '🌶️', costCC: 40, durationMs: 7 * DAY, yieldCoins: 100, description: 'High-value Malaysian icon. ~1 week.' },
  { id: 9, name: 'Terung', emoji: '🍆', costCC: 50, durationMs: 10 * DAY, yieldCoins: 130, description: 'Premium crop. ~10 days patience.' },
  { id: 10, name: 'Labu', emoji: '🎃', costCC: 80, durationMs: 14 * DAY, yieldCoins: 250, description: 'The Boss crop! ~2 weeks, massive payout.' },
];

export { SEED_OPTIONS };

const LEVEL_CONFIG = [
  { level: 1, slots: 3, harvestsNeeded: 0 },
  { level: 2, slots: 6, harvestsNeeded: 5 },
  { level: 3, slots: 9, harvestsNeeded: 15 },
];

export { LEVEL_CONFIG };

// ---- Real-Life Watering ----
// Water 2-3 times per day → cycle every 8-12 hours
function calcWateringInterval(_durationMs: number): number {
  // 8 hours = 28800000 ms (water ~3x per day)
  return 8 * HOUR;
}

function calcWateringsNeeded(durationMs: number): number {
  const interval = calcWateringInterval(durationMs);
  return Math.max(2, Math.ceil(durationMs / interval));
}

// SRS FUN-007 penalty constants
const NEGLECT_PENALTY_CC = 15;           // missed_water_penalty = missed × 15 CC
const HEATWAVE_YIELD_PENALTY = 0.30;     // 30% yield loss per heatwave failure
const MONSOON_YIELD_PENALTY = 0.30;      // 20-40% (we use 30%) per monsoon day
// FUN-014: Fertilizer skips time (24 hours)
const FERTILIZER_TIME_SKIP_MS = 24 * HOUR;

export function getWeatherInfo(weather: WeatherType) {
  switch (weather) {
    case 'sunny': return { label: '☀️ Sunny Day', waterNeeded: 1, desc: 'Normal conditions. Water once per cycle.' };
    case 'rainy': return { label: '🌦️ Light Rain', waterNeeded: 0, desc: 'No watering needed today!' };
    case 'heatwave': return { label: '🔥 Heatwave', waterNeeded: 2, desc: 'Water twice this cycle or lose 30% yield!' };
    case 'monsoon': return { label: '⛈️ Monsoon', waterNeeded: 0, desc: 'Auto-watered but 30% harvest loss from root rot.' };
  }
}

const makeEmptySlot = (id: number): PlantSlot => ({
  id, status: 'empty', plantName: null, plantEmoji: null, plantedAt: null,
  growthDurationMs: 0, progress: 0, yieldCoins: 0, health: 100,
  lastWateredAt: null, neglectPenalty: 0, wateredThisCycle: false,
  totalWaterings: 0, wateringsNeeded: 0, wateringIntervalMs: 0,
  lastHealthDecayAt: 0, fertilizedUntil: 0,
  missedWaterings: 0, heatwaveFailures: 0, monsoonDays: 0,
  currentCycleStart: 0, heatwaveWateredTwice: false,
});

const getSlotsForLevel = (level: number): number => {
  const cfg = LEVEL_CONFIG.find(c => c.level === level);
  return cfg ? cfg.slots : 3;
};

const initialPlants: PlantSlot[] = [1, 2, 3].map(makeEmptySlot);

const initialInventory: InventoryItem[] = [
  { id: 'seed-kangkung', name: 'Kangkung Seed', emoji: '🥬', category: 'seeds', quantity: 1, description: 'Grows into kangkung in 3 minutes' },
];

export const useGameStore = create<GameState>((set, get) => ({
  coins: 0,
  realMoney: 50.00,
  waterDrops: 3,
  weather: 'sunny',
  weatherChangedAt: Date.now(),
  plants: initialPlants,
  inventory: initialInventory,
  transactions: [],
  deliveries: [],
  deliveryAddress: '',
  cart: [],
  hasSeenWelcome: false,
  dailyLoginClaimed: false,
  farmerLevel: 1,
  totalHarvests: 0,

  setHasSeenWelcome: (v) => set({ hasSeenWelcome: v }),

  claimDailyLogin: () => set((s) => ({
    dailyLoginClaimed: true,
    waterDrops: s.waterDrops + 1,
  })),

  plantSeed: (slotId, seedName, emoji, durationMs, yieldCoins) => set((s) => {
    const seedInv = s.inventory.find((i) => i.category === 'seeds' && i.name.includes(seedName) && i.quantity > 0);
    const newInventory = seedInv
      ? s.inventory.map((i) => i.id === seedInv.id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0)
      : s.inventory;

    const wateringsNeeded = calcWateringsNeeded(durationMs);
    const wateringIntervalMs = calcWateringInterval(durationMs);
    const now = Date.now();

    return {
      plants: s.plants.map((p) =>
        p.id === slotId
          ? {
              ...p,
              status: 'growing' as PlantStatus,
              plantName: seedName,
              plantEmoji: emoji,
              plantedAt: now,
              growthDurationMs: durationMs,
              progress: 0,
              yieldCoins,
              health: 100,
              lastWateredAt: now,
              neglectPenalty: 0,
              wateredThisCycle: false,
              totalWaterings: 0,
              wateringsNeeded,
              wateringIntervalMs,
              lastHealthDecayAt: now,
              fertilizedUntil: 0,
              missedWaterings: 0,
              heatwaveFailures: 0,
              monsoonDays: 0,
              currentCycleStart: now,
              heatwaveWateredTwice: false,
            }
          : p
      ),
      inventory: newInventory,
    };
  }),

  waterPlant: (slotId) => {
    const s = get();
    if (s.waterDrops <= 0) return;
    const plant = s.plants.find(p => p.id === slotId);
    if (!plant || plant.status !== 'growing') return;

    const now = Date.now();
    const newTotalWaterings = (plant.totalWaterings || 0) + 1;

    set({
      waterDrops: s.waterDrops - 1,
      plants: s.plants.map((p) =>
        p.id === slotId && p.status === 'growing'
          ? {
              ...p,
              lastWateredAt: now,
              wateredThisCycle: true,
              totalWaterings: newTotalWaterings,
              lastHealthDecayAt: now,
              // In heatwave, track if this is the 2nd watering
              heatwaveWateredTwice: p.wateredThisCycle && s.weather === 'heatwave' ? true : p.heatwaveWateredTwice,
            }
          : p
      ),
    });
  },

  fertilizePlant: (slotId) => set((s) => {
    const fertItem = s.inventory.find((i) => i.category === 'fertilizers' && i.quantity > 0);
    if (!fertItem) return s;
    // FUN-014: Fertilizer shifts plantedAt backward, effectively skipping time
    return {
      inventory: s.inventory.map((i) =>
        i.id === fertItem.id ? { ...i, quantity: i.quantity - 1 } : i
      ).filter((i) => i.quantity > 0),
      plants: s.plants.map((p) =>
        p.id === slotId && p.status === 'growing' && p.plantedAt
          ? { ...p, plantedAt: p.plantedAt - FERTILIZER_TIME_SKIP_MS }
          : p
      ),
    };
  }),

  harvestPlant: (slotId, action) => {
    const s = get();
    const plant = s.plants.find((p) => p.id === slotId);
    if (!plant || plant.status !== 'ready') return { coins: 0, plantName: '', emoji: '', quantity: 0 };

    // SRS FUN-007: Calculate yield with penalties
    const baseYield = plant.yieldCoins;
    const heatwavePenalty = Math.floor((plant.heatwaveFailures || 0) * HEATWAVE_YIELD_PENALTY * baseYield);
    const monsoonPenalty = Math.floor((plant.monsoonDays || 0) * MONSOON_YIELD_PENALTY * baseYield);
    const missedWaterPenalty = (plant.missedWaterings || 0) * NEGLECT_PENALTY_CC;
    const finalYield = Math.max(0, baseYield - heatwavePenalty - monsoonPenalty - missedWaterPenalty);

    const harvestQty = Math.max(1, Math.floor(plant.progress / 20));
    const yieldRatio = baseYield > 0 ? finalYield / baseYield : 1;
    const finalQty = finalYield <= 0 ? 0 : Math.max(1, Math.round(harvestQty * yieldRatio));

    const resetPlant = s.plants.map((p) =>
      p.id === slotId ? makeEmptySlot(slotId) : p
    );

    const newTotalHarvests = s.totalHarvests + 1;
    let newLevel = s.farmerLevel;
    for (const cfg of LEVEL_CONFIG) {
      if (newTotalHarvests >= cfg.harvestsNeeded) newLevel = cfg.level;
    }
    let newPlants = resetPlant;
    const targetSlots = getSlotsForLevel(newLevel);
    if (targetSlots > newPlants.length) {
      for (let i = newPlants.length + 1; i <= targetSlots; i++) {
        newPlants = [...newPlants, makeEmptySlot(i)];
      }
    }

    // SRS: Plant dies if final_yield <= 0
    if (finalYield <= 0) {
      set({ plants: newPlants, totalHarvests: newTotalHarvests, farmerLevel: newLevel });
      return { coins: 0, plantName: plant.plantName || '', emoji: plant.plantEmoji || '', quantity: 0 };
    }

    if (action === 'sell') {
      set({
        coins: s.coins + finalYield,
        plants: newPlants,
        totalHarvests: newTotalHarvests,
        farmerLevel: newLevel,
        transactions: [
          { id: Date.now().toString(), type: 'earn', amount: finalYield, description: `Sold ${finalQty}x ${plant.plantName}`, source: 'Garden', timestamp: Date.now() },
          ...s.transactions,
        ],
      });
    } else {
      const existingItem = s.inventory.find((i) => i.name === plant.plantName && i.category === 'vegetables');
      const newInventory = existingItem
        ? s.inventory.map((i) => i.name === plant.plantName && i.category === 'vegetables' ? { ...i, quantity: i.quantity + finalQty } : i)
        : [...s.inventory, { id: `harvest-${Date.now()}`, name: plant.plantName!, emoji: plant.plantEmoji!, category: 'vegetables' as const, quantity: finalQty, description: `Freshly harvested ${plant.plantName}` }];
      set({
        plants: newPlants,
        inventory: newInventory,
        totalHarvests: newTotalHarvests,
        farmerLevel: newLevel,
      });
    }
    return { coins: action === 'sell' ? finalYield : 0, plantName: plant.plantName || '', emoji: plant.plantEmoji || '', quantity: finalQty };
  },

  // SRS FUN-004: Pure time-based growth
  // SRS FUN-005/006/007: Cycle-based watering with penalty tracking
  updateProgress: () => set((s) => {
    const now = Date.now();
    const isRainy = s.weather === 'rainy';
    const isMonsoon = s.weather === 'monsoon';
    const isHeatwave = s.weather === 'heatwave';
    const autoWatered = isRainy || isMonsoon;

    const updatedPlants = s.plants.map((p) => {
      if (p.status !== 'growing' || !p.plantedAt) return p;

      let newMissedWaterings = p.missedWaterings || 0;
      let newHeatwaveFailures = p.heatwaveFailures || 0;
      let newMonsoonDays = p.monsoonDays || 0;
      let newWateredThisCycle = p.wateredThisCycle;
      let newHeatwaveWateredTwice = p.heatwaveWateredTwice || false;
      let newCurrentCycleStart = p.currentCycleStart || p.plantedAt;
      let newLastWateredAt = p.lastWateredAt;
      let newHealth = p.health ?? 100;

      const intervalMs = p.wateringIntervalMs || 45000;
      const cycleElapsed = now - newCurrentCycleStart;

      // Check if current watering cycle has ended
      if (cycleElapsed >= intervalMs) {
        // Evaluate the completed cycle
        if (autoWatered) {
          // Rain: no penalty, auto-watered
          // Monsoon: auto-watered but track rot penalty
          if (isMonsoon) {
            newMonsoonDays += 1;
          }
        } else if (!newWateredThisCycle) {
          // Missed watering on a non-rain day
          newMissedWaterings += 1;
          // Health drops for neglect (visual feedback)
          newHealth = Math.max(0, newHealth - 15);
        } else if (isHeatwave && !newHeatwaveWateredTwice) {
          // Heatwave: watered once but not twice
          newHeatwaveFailures += 1;
          newHealth = Math.max(0, newHealth - 10);
        }

        // Start new cycle
        newCurrentCycleStart = now;
        newWateredThisCycle = autoWatered; // auto-watered resets as true
        newHeatwaveWateredTwice = false;
        if (autoWatered) newLastWateredAt = now;
      }

      // Health visual: slowly recover if watered, slowly drop if overdue
      const sinceWatered = now - (newLastWateredAt || p.plantedAt);
      const isOverdue = sinceWatered > intervalMs && !autoWatered;
      if (isOverdue && newHealth > 0) {
        const overdueSeconds = (sinceWatered - intervalMs) / 1000;
        newHealth = Math.max(0, 100 - overdueSeconds * 1.5);
      } else if (newWateredThisCycle && newHealth < 100) {
        newHealth = Math.min(100, newHealth + 0.5);
      }

      // SRS: Check if accumulated penalties would kill the plant
      const projectedYield = p.yieldCoins
        - Math.floor(newHeatwaveFailures * HEATWAVE_YIELD_PENALTY * p.yieldCoins)
        - Math.floor(newMonsoonDays * MONSOON_YIELD_PENALTY * p.yieldCoins)
        - (newMissedWaterings * NEGLECT_PENALTY_CC);

      if (projectedYield <= 0) {
        return {
          ...p, status: 'dead' as PlantStatus, health: 0,
          missedWaterings: newMissedWaterings, heatwaveFailures: newHeatwaveFailures,
          monsoonDays: newMonsoonDays, lastHealthDecayAt: now,
        };
      }

      // FUN-004: Pure time-based growth
      const elapsed = now - p.plantedAt;
      const newProgress = Math.min(100, (elapsed / p.growthDurationMs) * 100);
      const isReady = newProgress >= 100;

      return {
        ...p,
        progress: newProgress,
        health: newHealth,
        missedWaterings: newMissedWaterings,
        heatwaveFailures: newHeatwaveFailures,
        monsoonDays: newMonsoonDays,
        currentCycleStart: newCurrentCycleStart,
        wateredThisCycle: newWateredThisCycle,
        heatwaveWateredTwice: newHeatwaveWateredTwice,
        lastWateredAt: newLastWateredAt,
        lastHealthDecayAt: now,
        neglectPenalty: newMissedWaterings * NEGLECT_PENALTY_CC,
        status: isReady ? 'ready' as PlantStatus : 'growing' as PlantStatus,
      };
    });

    return { plants: updatedPlants };
  }),

  addToInventory: (item) => set((s) => {
    const existing = s.inventory.find((i) => i.name === item.name);
    if (existing) {
      return { inventory: s.inventory.map((i) => i.name === item.name ? { ...i, quantity: i.quantity + item.quantity } : i) };
    }
    return { inventory: [...s.inventory, { ...item, id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }] };
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

  addWaterDrops: (amount) => set((s) => ({
    waterDrops: s.waterDrops + amount,
  })),

  addToCart: (item) => set((s) => {
    const existing = s.cart.find((c) => c.id === item.id);
    if (existing) {
      return { cart: s.cart.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
    }
    return { cart: [...s.cart, { ...item, quantity: 1 }] };
  }),

  updateCartQty: (id, delta) => set((s) => ({
    cart: s.cart.map((c) => c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c).filter((c) => c.quantity > 0),
  })),

  removeFromCart: (id) => set((s) => ({
    cart: s.cart.filter((c) => c.id !== id),
  })),

  clearCart: () => set({ cart: [] }),

  setWeather: (weather) => set({
    weather,
    weatherChangedAt: Date.now(),
  }),
}));
