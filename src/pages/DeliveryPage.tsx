import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, DeliveryStatus, DeliveryOrder } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, CheckCircle2, Clock, ChevronDown, ChevronUp, X, Eye, Check, Pencil } from "lucide-react";
import { toast } from "sonner";

const COLLECTION_POINTS = [
  { id: 'cp1', name: 'CloudCrop Hub — Bangsar South', address: 'Level G, The Vertical, Bangsar South, 59200 Kuala Lumpur', area: 'KL' },
  { id: 'cp2', name: 'CloudCrop Hub — Mid Valley', address: 'Lot G-023, Mid Valley Megamall, 58000 Kuala Lumpur', area: 'KL' },
  { id: 'cp3', name: 'CloudCrop Hub — Sunway Pyramid', address: 'Lot LG1.05, Sunway Pyramid, 47500 Subang Jaya, Selangor', area: 'Selangor' },
  { id: 'cp4', name: 'CloudCrop Hub — IOI City Mall', address: 'Lot LG-221, IOI City Mall, 62502 Putrajaya, Selangor', area: 'Selangor' },
  { id: 'cp5', name: 'CloudCrop Hub — Gurney Plaza', address: 'Lot 170-G-07, Gurney Plaza, 10250 George Town, Penang', area: 'Penang' },
  { id: 'cp6', name: 'CloudCrop Hub — Queensbay Mall', address: 'Lot G-18, Queensbay Mall, 11900 Bayan Lepas, Penang', area: 'Penang' },
  { id: 'cp7', name: 'CloudCrop Hub — AEON Tebrau', address: 'Lot G33, AEON Tebrau City, 81100 Johor Bahru, Johor', area: 'Johor' },
  { id: 'cp8', name: 'CloudCrop Hub — Ipoh Parade', address: 'Lot LG-12, Ipoh Parade, 31400 Ipoh, Perak', area: 'Perak' },
];

const statusConfig: Record<DeliveryStatus, { label: string; icon: React.ReactNode; color: string; step: number }> = {
  processing: { label: 'Processing', icon: <Package className="w-4 h-4" />, color: 'text-amber-500', step: 1 },
  in_progress: { label: 'In Progress', icon: <Clock className="w-4 h-4" />, color: 'text-blue-500', step: 2 },
  on_the_road: { label: 'Ready for Pickup', icon: <Truck className="w-4 h-4" />, color: 'text-primary', step: 3 },
  completed: { label: 'Collected', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-growth', step: 4 },
};

const steps: DeliveryStatus[] = ['processing', 'in_progress', 'on_the_road', 'completed'];

function generateTrackingEvents(delivery: DeliveryOrder) {
  const events: { time: string; title: string; description: string; active: boolean }[] = [];
  const created = new Date(delivery.createdAt);

  const stepData = [
    { status: 'processing', title: 'Order Placed', desc: `Order confirmed. Preparing ${delivery.items.length} item(s).` },
    { status: 'processing', title: 'Payment Verified', desc: 'Payment has been verified successfully.' },
    { status: 'in_progress', title: 'Packed by Seller', desc: 'Items packed by farmer/vendor and sent to collection point.' },
    { status: 'in_progress', title: 'Arrived at Collection Point', desc: `Parcel arrived at ${delivery.address}.` },
    { status: 'on_the_road', title: 'Ready for Pickup', desc: 'Your order is ready! Come collect it at the collection point.' },
    { status: 'completed', title: 'Collected', desc: `Order collected from ${delivery.address}.` },
  ];

  const currentStep = statusConfig[delivery.status].step;

  stepData.forEach((item, i) => {
    const itemStep = statusConfig[item.status as DeliveryStatus].step;
    const isActive = itemStep <= currentStep;
    if (!isActive && itemStep > currentStep) return;

    const eventTime = new Date(created.getTime() + i * 15 * 60 * 1000);
    events.push({
      time: eventTime.toLocaleString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      title: item.title,
      description: item.desc,
      active: isActive,
    });
  });

  return events.reverse();
}

function DeliveryTracker({ status }: { status: DeliveryStatus }) {
  const currentStep = statusConfig[status].step;
  return (
    <div className="flex items-center gap-1 w-full my-3">
      {steps.map((step, i) => {
        const config = statusConfig[step];
        const isActive = config.step <= currentStep;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                isActive ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-muted-foreground bg-card'
              }`}>
                {config.icon}
              </div>
              <span className={`text-[9px] font-semibold mt-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {config.label}
              </span>
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

function TrackingDetailModal({ delivery, onClose }: { delivery: DeliveryOrder; onClose: () => void }) {
  const events = generateTrackingEvents(delivery);
  const config = statusConfig[delivery.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Order #{delivery.id.slice(-6).toUpperCase()}</p>
            <span className={`flex items-center gap-1.5 text-sm font-bold ${config.color}`}>
              {config.icon} {config.label}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-4 pt-2">
          <DeliveryTracker status={delivery.status} />
        </div>

        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {delivery.items.map((item, i) => (
              <span key={i} className="bg-muted text-xs font-semibold px-2 py-1 rounded-lg">
                {item.emoji} {item.name} x{item.quantity}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">📍 Collection Point: {delivery.address}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h4 className="text-xs font-bold text-foreground mb-3 mt-2">Tracking Details</h4>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={i} className="flex gap-3 relative">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 z-10 ${
                    i === 0 ? 'bg-primary border-primary' : 'bg-card border-border'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-foreground'}`}>
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DeliveryPage() {
  const { deliveries, deliveryAddress, setDeliveryAddress } = useGameStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [trackingDelivery, setTrackingDelivery] = useState<DeliveryOrder | null>(null);
  const [showCollectionPoints, setShowCollectionPoints] = useState(!deliveryAddress);

  const activeDeliveries = deliveries.filter((d) => d.status !== 'completed');
  const completedDeliveries = deliveries.filter((d) => d.status === 'completed');

  const selectedPoint = COLLECTION_POINTS.find((cp) => cp.address === deliveryAddress);

  const handleSelectPoint = (cp: typeof COLLECTION_POINTS[0]) => {
    setDeliveryAddress(cp.address);
    setShowCollectionPoints(false);
    toast.success(`Collection point set: ${cp.name}`);
  };

  // Group collection points by area
  const areas = [...new Set(COLLECTION_POINTS.map((cp) => cp.area))];

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Collection Point 📍</h1>
      <p className="text-sm text-muted-foreground mb-5">Choose a pickup point & track your orders</p>

      {/* Collection Point Selector */}
      <div className="bg-card border rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Select Collection Point</h3>
        </div>

        {selectedPoint && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground">{selectedPoint.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPoint.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {areas.map((area) => (
            <div key={area}>
              <p className="text-xs font-bold text-muted-foreground mb-1.5">{area}</p>
              <div className="space-y-1.5">
                {COLLECTION_POINTS.filter((cp) => cp.area === area).map((cp) => {
                  const isSelected = deliveryAddress === cp.address;
                  return (
                    <button
                      key={cp.id}
                      onClick={() => handleSelectPoint(cp)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{cp.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{cp.address}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Deliveries */}
      {activeDeliveries.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-foreground mb-3">Active Orders</h2>
          <div className="space-y-3">
            {activeDeliveries.map((delivery) => {
              const config = statusConfig[delivery.status];
              return (
                <motion.div key={delivery.id} layout className="bg-card border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`flex items-center gap-1 text-xs font-bold ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">~{delivery.estimatedMinutes} min</span>
                  </div>

                  <DeliveryTracker status={delivery.status} />

                  <div className="flex flex-wrap gap-1 mb-2">
                    {delivery.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="bg-muted text-xs font-semibold px-2 py-1 rounded-lg">
                        {item.emoji} {item.name} x{item.quantity}
                      </span>
                    ))}
                    {delivery.items.length > 3 && (
                      <span className="bg-muted text-xs font-semibold px-2 py-1 rounded-lg text-muted-foreground">
                        +{delivery.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate flex-1">📍 {delivery.address}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTrackingDelivery(delivery)}
                      className="text-xs rounded-xl ml-2"
                    >
                      <Eye className="w-3 h-3 mr-1" /> More Details
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

      {activeDeliveries.length === 0 && (
        <div className="text-center py-8 mb-6">
          <span className="text-4xl block mb-2">📦</span>
          <p className="text-sm text-muted-foreground">No active orders</p>
          <p className="text-xs text-muted-foreground">Buy from the Supermarket to get started!</p>
        </div>
      )}

      {/* Order History */}
      <h2 className="font-bold text-foreground mb-3">Collection History</h2>
      {completedDeliveries.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No collection history yet</p>
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
                    Collected
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTrackingDelivery(delivery)}
                          className="text-xs mt-1"
                        >
                          <Eye className="w-3 h-3 mr-1" /> View Full Tracking
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {trackingDelivery && (
          <TrackingDetailModal delivery={trackingDelivery} onClose={() => setTrackingDelivery(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
