import { useState, useCallback, useEffect, useRef } from "react";
import { mlApi, MealEntry, WeeklyPlan } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  ChefHat,
  BarChart3,
  ShoppingCart,
  Trash2,
  PlusCircle,
} from "lucide-react";

/*  IMPORTANT:
    This file was fully cleaned.
    Old Grocery-only UI removed.
    ML-based Budget Tracker kept.
*/

export default function EnhancedBudgetPage() {
  const { token, isAuthenticated } = useAuth();

  const [wallet, setWallet] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState("overview");

  const [weekPlan, setWeekPlan] = useState<WeeklyPlan | null>(null);
  const [allMeals, setAllMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPlan = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const plan = await mlApi.getWeeklyPlan(token);
      setWeekPlan(plan);

      const meals: MealEntry[] = [];
      plan.days.forEach((d) => {
        Object.values(d.meals).forEach((m) => {
          if (m) meals.push(m);
        });
      });

      setAllMeals(meals);
    } catch (err) {
      console.error("Failed to load plan");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) loadPlan();
  }, [isAuthenticated, loadPlan]);

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>
        💰 AI Budget Tracker
      </h1>

      {/* Tabs */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {[
          { key: "overview", label: "📊 Overview" },
          { key: "meals", label: "🍽 AI Meals" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background:
                activeTab === t.key ? "#FF6B3D" : "rgba(0,0,0,0.08)",
              color: activeTab === t.key ? "#fff" : "#333",
              fontWeight: 600,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ marginTop: 30 }}>
          <h2>Monthly Wallet: ₹{wallet}</h2>
          <p>Track your spending based on AI meal plan.</p>
        </div>
      )}

      {/* MEALS */}
      {activeTab === "meals" && (
        <div style={{ marginTop: 30 }}>
          {loading ? (
            <p>Loading AI meals...</p>
          ) : (
            allMeals.map((meal, idx) => (
              <div
                key={idx}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  border: "1px solid #eee",
                  borderRadius: 10,
                }}
              >
                <strong>{meal.dish_name}</strong>
                <div>
                  {meal.calories_kcal} kcal · {meal.protein_g}g protein
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}