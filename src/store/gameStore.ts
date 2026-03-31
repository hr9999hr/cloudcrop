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

// 10 Malaysian crops — demo-scaled times
const SEED_OPTIONS = [
  { id: 1, name: 'Kangkung', emoji: '🥬', costCC: 10, durationMs: 3 * 60 * 1000, yieldCoins: 30, description: 'The ultimate beginner crop. Fast and cheap.' },
  { id: 2, name: 'Sawi', emoji: '🥗', costCC: 15, durationMs: 4 * 60 * 1000, yieldCoins: 40, description: 'Low risk, steady income for casual players.' },
  { id: 3, name: 'Bayam', emoji: '🌿', costCC: 15, durationMs: 4 * 60 * 1000, yieldCoins: 40, description: 'Similar to Sawi, adds visual variety to your bag.' },
  { id: 4, name: 'Timun', emoji: '🥒', costCC: 20, durationMs: 5 * 60 * 1000, yieldCoins: 55, description: 'Mid-tier crop. Good balance of time and profit.' },
  { id: 5, name: 'Bendi', emoji: '🫛', costCC: 25, durationMs: 5 * 60 * 1000, yieldCoins: 65, description: 'Mid-tier crop with solid returns.' },
  { id: 6, name: 'Tomato', emoji: '🍅', costCC: 30, durationMs: 6 * 60 * 1000, yieldCoins: 80, description: 'Kids love growing these — they turn bright red at 100%!' },
  { id: 7, name: 'Kacang Panjang', emoji: '🫘', costCC: 35, durationMs: 7 * 60 * 1000, yieldCoins: 90, description: 'Takes a full week. Good for daily log-in players.' },
  { id: 8, name: 'Cili Padi', emoji: '🌶️', costCC: 40, durationMs: 7 * 60 * 1000, yieldCoins: 100, description: 'High-value, iconic Malaysian crop.' },
  { id: 9, name: 'Terung', emoji: '🍆', costCC: 50, durationMs: 10 * 60 * 1000, yieldCoins: 130, description: 'Premium crop. Requires patience but pays out heavily.' },
  { id: 10, name: 'Labu', emoji: '🎃', costCC: 80, durationMs: 14 * 60 * 1000, yieldCoins: 250, description: 'The "Boss" crop! Takes two weeks but massive payout.' },
];

export { SEED_OPTIONS };

const LEVEL_CONFIG = [
  { level: 1, slots: 3, harvestsNeeded: 0 },
  { level: 2, slots: 6, harvestsNeeded: 5 },
  { level: 3, slots: 9, harvestsNeeded: 15 },
];

export { LEVEL_CONFIG };

// ---- SRS-Aligned Growth Constants ----
// Watering cycle = scaled "day" for demo (1 real day → ~60s demo cycle)
function calcWateringInterval(durationMs: number): number {
  // Each "day" in demo = durationMs / number_of_cycles
  // Aim for ~4-8 cycles per crop growth
  const totalMin = durationMs / 60000;
  return Math.round((35 + totalMin * 3) * 1000); // 38s–77s per cycle
}

function calcWateringsNeeded(durationMs: number): number {
  const interval = calcWateringInterval(durationMs);
  return Math.max(3, Math.ceil(durationMs / interval));
}

// SRS FUN-007 penalty constants
const NEGLECT_PENALTY_CC = 15;           // missed_water_penalty = missed × 15 CC
const HEATWAVE_YIELD_PENALTY = 0.30;     // 30% yield loss per heatwave failure
const MONSOON_YIELD_PENALTY = 0.30;      // 20-40% (we use 30%) per monsoon day
// FUN-014: Fertilizer skips time
const FERTILIZER_TIME_SKIP_MS = 60_000;  // skip 60s of growth (≈1 demo day)

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
              health: Math.min(100, (p.health ?? 100) + WATER_HEALTH_RESTORE),
              lastWateredAt: now,
              wateredThisCycle: true,
              totalWaterings: newTotalWaterings,
              lastHealthDecayAt: now,
            }
          : p
      ),
    });
  },

  fertilizePlant: (slotId) => set((s) => {
    const fertItem = s.inventory.find((i) => i.category === 'fertilizers' && i.quantity > 0);
    if (!fertItem) return s;
    const now = Date.now();
    return {
      inventory: s.inventory.map((i) =>
        i.id === fertItem.id ? { ...i, quantity: i.quantity - 1 } : i
      ).filter((i) => i.quantity > 0),
      plants: s.plants.map((p) =>
        p.id === slotId && p.status === 'growing'
          ? { ...p, fertilizedUntil: now + FERTILIZER_BOOST_DURATION_MS }
          : p
      ),
    };
  }),

  harvestPlant: (slotId, action) => {
    const s = get();
    const plant = s.plants.find((p) => p.id === slotId);
    if (!plant || plant.status !== 'ready') return { coins: 0, plantName: '', emoji: '', quantity: 0 };

    const baseYield = plant.yieldCoins;
    const neglectLoss = plant.neglectPenalty;
    const healthFactor = Math.max(0.3, (plant.health ?? 100) / 100);
    const adjustedYield = Math.max(0, Math.floor((baseYield - neglectLoss) * healthFactor));

    const harvestQty = Math.max(1, Math.floor(plant.progress / 20));
    const finalQty = adjustedYield <= 0 ? 0 : Math.max(1, Math.floor(harvestQty * healthFactor));

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

    if (adjustedYield <= 0) {
      set({ plants: newPlants, totalHarvests: newTotalHarvests, farmerLevel: newLevel });
      return { coins: 0, plantName: plant.plantName || '', emoji: plant.plantEmoji || '', quantity: 0 };
    }

    if (action === 'sell') {
      set({
        coins: s.coins + adjustedYield,
        plants: newPlants,
        totalHarvests: newTotalHarvests,
        farmerLevel: newLevel,
        transactions: [
          { id: Date.now().toString(), type: 'earn', amount: adjustedYield, description: `Sold ${finalQty}x ${plant.plantName}`, source: 'Garden', timestamp: Date.now() },
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
    return { coins: action === 'sell' ? adjustedYield : 0, plantName: plant.plantName || '', emoji: plant.plantEmoji || '', quantity: finalQty };
  },

  updateProgress: () => set((s) => {
    const now = Date.now();
    const isRainy = s.weather === 'rainy';
    const isMonsoon = s.weather === 'monsoon';
    const isHeatwave = s.weather === 'heatwave';
    const autoWatered = isRainy || isMonsoon; // rain/monsoon auto-water

    const updatedPlants = s.plants.map((p) => {
      if (p.status !== 'growing' || !p.plantedAt) return p;

      let newHealth = p.health ?? 100;
      let newNeglectPenalty = p.neglectPenalty ?? 0;
      const lastDecay = p.lastHealthDecayAt || p.plantedAt;
      const secsSinceDecay = (now - lastDecay) / 1000;

      // --- Health Decay ---
      const sinceWatered = now - (p.lastWateredAt || p.plantedAt);
      const overdueMs = sinceWatered - (p.wateringIntervalMs || 45000);

      if (overdueMs > 0 && !autoWatered) {
        // Plant is overdue for watering — health decays
        let decayRate = HEALTH_DECAY_PER_SEC;
        if (isHeatwave) decayRate *= HEATWAVE_DECAY_MULTIPLIER;
        const decayAmount = decayRate * secsSinceDecay;
        newHealth = Math.max(0, newHealth - decayAmount);
      }

      // Monsoon: root rot passive damage even though auto-watered
      if (isMonsoon) {
        newHealth = Math.max(0, newHealth - MONSOON_ROT_PER_SEC * secsSinceDecay);
      }

      // Rain: slowly restore health
      if (isRainy && newHealth < 100) {
        newHealth = Math.min(100, newHealth + RAIN_HEALTH_RESTORE * secsSinceDecay / 10);
      }

      // Neglect penalty accumulates when health < 40
      if (newHealth < 40 && newHealth > 0 && overdueMs > 0) {
        newNeglectPenalty = Math.min(p.yieldCoins, newNeglectPenalty + Math.floor(secsSinceDecay * 0.2));
      }

      // Plant dies at 0 health
      if (newHealth <= 0) {
        return { ...p, status: 'dead' as PlantStatus, health: 0, neglectPenalty: newNeglectPenalty, lastHealthDecayAt: now };
      }

      // --- Growth Progress ---
      // Time-based growth, but rate depends on health
      const healthRate = Math.max(0.1, newHealth / 100); // min 10% speed at low health
      const isFertilized = (p.fertilizedUntil || 0) > now;
      const fertMultiplier = isFertilized ? FERTILIZER_GROWTH_MULTIPLIER : 1.0;

      const elapsedSincePlant = now - p.plantedAt;
      // Base progress = time elapsed / total duration
      // But we scale by average health over time (approximated by current health)
      const rawProgress = (elapsedSincePlant / p.growthDurationMs) * 100;
      // Apply health factor and fertilizer to the growth rate
      // Use incremental approach: advance from current progress
      const timeDelta = secsSinceDecay; // seconds since last update
      const growthPerSec = (100 / (p.growthDurationMs / 1000)) * healthRate * fertMultiplier;
      let newProgress = Math.min(100, p.progress + growthPerSec * timeDelta);

      // Auto-water from rain refreshes the watered state
      const newWateredThisCycle = autoWatered ? true : p.wateredThisCycle;
      const newLastWateredAt = autoWatered && overdueMs > 0 ? now : p.lastWateredAt;

      const isReady = newProgress >= 100;

      return {
        ...p,
        progress: newProgress,
        health: newHealth,
        neglectPenalty: newNeglectPenalty,
        lastHealthDecayAt: now,
        wateredThisCycle: newWateredThisCycle,
        lastWateredAt: newLastWateredAt,
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
