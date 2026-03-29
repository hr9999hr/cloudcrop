import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGameStore } from "@/store/gameStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SAVE_DEBOUNCE_MS = 2000;

export function useGameSync() {
  const { user } = useAuth();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoaded = useRef(false);

  // Load game state when user logs in
  useEffect(() => {
    if (!user) {
      hasLoaded.current = false;
      return;
    }

    const loadGameState = async () => {
      try {
        const { data, error } = await supabase
          .from("game_states")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Failed to load game state:", error);
          return;
        }

        if (data) {
          // Restore state from DB
          useGameStore.setState({
            coins: Number(data.coins) || 0,
            realMoney: Number(data.real_money) || 50,
            waterDrops: data.water_drops ?? 3,
            farmerLevel: data.farmer_level ?? 1,
            totalHarvests: data.total_harvests ?? 0,
            plants: (data.plants as any[]) || [],
            inventory: (data.inventory as any[]) || [],
            transactions: (data.transactions as any[]) || [],
            deliveries: (data.deliveries as any[]) || [],
            deliveryAddress: data.delivery_address || "",
            hasSeenWelcome: data.has_seen_welcome ?? false,
            dailyLoginClaimed: data.daily_login_claimed ?? false,
          });
        } else {
          // First time: create a row with defaults
          const state = useGameStore.getState();
          await supabase.from("game_states").insert({
            user_id: user.id,
            coins: state.coins,
            real_money: state.realMoney,
            water_drops: state.waterDrops,
            farmer_level: state.farmerLevel,
            total_harvests: state.totalHarvests,
            plants: state.plants as any,
            inventory: state.inventory as any,
            transactions: state.transactions as any,
            deliveries: state.deliveries as any,
            delivery_address: state.deliveryAddress,
            has_seen_welcome: state.hasSeenWelcome,
            daily_login_claimed: state.dailyLoginClaimed,
          });
        }

        hasLoaded.current = true;
      } catch (err) {
        console.error("Game sync error:", err);
      }
    };

    loadGameState();
  }, [user]);

  // Subscribe to store changes and save (debounced)
  useEffect(() => {
    if (!user) return;

    const unsub = useGameStore.subscribe((state) => {
      if (!hasLoaded.current) return;

      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          const { error } = await supabase
            .from("game_states")
            .update({
              coins: state.coins,
              real_money: state.realMoney,
              water_drops: state.waterDrops,
              farmer_level: state.farmerLevel,
              total_harvests: state.totalHarvests,
              plants: state.plants as any,
              inventory: state.inventory as any,
              transactions: state.transactions as any,
              deliveries: state.deliveries as any,
              delivery_address: state.deliveryAddress,
              has_seen_welcome: state.hasSeenWelcome,
              daily_login_claimed: state.dailyLoginClaimed,
            })
            .eq("user_id", user.id);

          if (error) console.error("Save failed:", error);
        } catch (err) {
          console.error("Save error:", err);
        }
      }, SAVE_DEBOUNCE_MS);
    });

    return () => {
      unsub();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [user]);
}
