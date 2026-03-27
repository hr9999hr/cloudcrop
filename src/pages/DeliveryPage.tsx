import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, DeliveryStatus } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Package, Truck, CheckCircle2, Clock, ChevronDown, ChevronUp, Edit2, Save } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<DeliveryStatus, { label: string; icon: React.ReactNode; color: string; step: number }> = {
  processing: { label: 'Processing', icon: <Package className="w-4 h-4" />, color: 'text-amber-500', step: 1 },
  in_progress: { label: 'In Progress', icon: <Clock className="w-4 h-4" />, color: 'text-blue-500', step: 2 },
  on_the_road: { label: 'On the Road', icon: <Truck className="w-4 h-4" />, color: 'text-primary', step: 3 },
  completed: { label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-growth', step: 4 },
};

const steps: DeliveryStatus[] = ['processing', 'in_progress', 'on_the_road', 'completed'];

function DeliveryTracker({ status }: { status: DeliveryStatus }) {
  const currentStep = statusConfig[status].step;
  return (
    <div className="flex items-center gap-1 w-full my-3">
      {steps.map((step, i) => {
        const config = statusConfig[step];
        const isActive = config.step <= currentStep;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
              isActive ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-muted-foreground bg-card'
            }`}>
              {config.icon}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded-full transition-colors ${
                statusConfig[steps[i + 1]].step <= currentStep ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DeliveryPage() {
  const { deliveries, deliveryAddress, setDeliveryAddress, updateDeliveryStatus } = useGameStore();
  const [editingAddress, setEditingAddress] = useState(!deliveryAddress);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeDeliveries = deliveries.filter((d) => d.status !== 'completed');
  const completedDeliveries = deliveries.filter((d) => d.status === 'completed');

  const handleSaveAddress = () => {
    if (!tempAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    setDeliveryAddress(tempAddress.trim());
    setEditingAddress(false);
    toast.success("Delivery address saved!");
  };

  // Simulate delivery progress
  const simulateNext = (id: string, currentStatus: DeliveryStatus) => {
    const idx = steps.indexOf(currentStatus);
    if (idx < steps.length - 1) {
      updateDeliveryStatus(id, steps[idx + 1]);
      toast.success(`Delivery updated to: ${statusConfig[steps[idx + 1]].label}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Delivery 📦</h1>
      <p className="text-sm text-muted-foreground mb-5">Track your orders from the Supermarket</p>

      {/* Delivery Address */}
      <div className="bg-card border rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Delivery Address</h3>
          </div>
          {!editingAddress && deliveryAddress && (
            <button onClick={() => { setEditingAddress(true); setTempAddress(deliveryAddress); }}>
              <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        {editingAddress ? (
          <div className="space-y-2">
            <Input
              placeholder="Enter your full delivery address..."
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              className="rounded-xl text-sm"
            />
            <Button onClick={handleSaveAddress} size="sm" className="rounded-xl gradient-farm text-primary-foreground">
              <Save className="w-3 h-3 mr-1" /> Save Address
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{deliveryAddress || 'No address set'}</p>
        )}
      </div>

      {/* Active Deliveries */}
      {activeDeliveries.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-foreground mb-3">Active Deliveries</h2>
          <div className="space-y-3">
            {activeDeliveries.map((delivery) => {
              const config = statusConfig[delivery.status];
              return (
                <motion.div
                  key={delivery.id}
                  layout
                  className="bg-card border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-xs font-bold ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ~{delivery.estimatedMinutes} min
                    </span>
                  </div>

                  <DeliveryTracker status={delivery.status} />

                  <div className="flex flex-wrap gap-1 mb-2">
                    {delivery.items.map((item, i) => (
                      <span key={i} className="bg-muted text-xs font-semibold px-2 py-1 rounded-lg">
                        {item.emoji} {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      📍 {delivery.address}
                    </p>
                    {/* Demo: simulate next step */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateNext(delivery.id, delivery.status)}
                      className="text-xs rounded-xl ml-2"
                    >
                      Next Step →
                    </Button>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-2">
                    Ordered: {new Date(delivery.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* No active deliveries */}
      {activeDeliveries.length === 0 && (
        <div className="text-center py-8 mb-6">
          <span className="text-4xl block mb-2">📦</span>
          <p className="text-sm text-muted-foreground">No active deliveries</p>
          <p className="text-xs text-muted-foreground">Buy from the Supermarket to get started!</p>
        </div>
      )}

      {/* Delivery History */}
      <h2 className="font-bold text-foreground mb-3">Delivery History</h2>
      {completedDeliveries.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No delivery history yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {completedDeliveries.map((delivery) => {
            const isExpanded = expandedId === delivery.id;
            return (
              <div key={delivery.id} className="bg-card border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : delivery.id)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-growth flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {delivery.items.map((i) => `${i.emoji} ${i.name}`).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(delivery.completedAt || delivery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-growth/10 text-growth text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-3 space-y-1">
                        {delivery.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span>{item.emoji}</span>
                            <span className="text-foreground">{item.name}</span>
                            <span className="text-muted-foreground">x{item.quantity}</span>
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground pt-1">📍 {delivery.address}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}