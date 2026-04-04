import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.100.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user client to get user id
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate input
    const body = await req.json();
    const amount = Number(body.amount);
    if (!amount || amount <= 0 || amount > 10000) {
      return new Response(JSON.stringify({ error: "Invalid amount (0.01 - 10,000)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to update real_money (bypasses trigger restriction)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get current balance
    const { data: gameState, error: fetchError } = await adminClient
      .from("game_states")
      .select("real_money, transactions")
      .eq("user_id", user.id)
      .single();

    if (fetchError || !gameState) {
      return new Response(JSON.stringify({ error: "Game state not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newBalance = Number(gameState.real_money) + amount;
    const newTransaction = {
      id: Date.now().toString(),
      type: "earn",
      amount,
      description: `[RM] Top up RM ${amount.toFixed(2)}`,
      timestamp: Date.now(),
    };

    const existingTransactions = Array.isArray(gameState.transactions) ? gameState.transactions : [];

    const { error: updateError } = await adminClient
      .from("game_states")
      .update({
        real_money: newBalance,
        transactions: [newTransaction, ...existingTransactions],
      })
      .eq("user_id", user.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Failed to update balance" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, newBalance, transaction: newTransaction }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
