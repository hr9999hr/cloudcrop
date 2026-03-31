import fenceH from "@/assets/farm/fence-h.png";

interface FarmDecorationsProps {
  weather: string;
}

export function FarmDecorations({ weather }: FarmDecorationsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      {/* Top fence */}
      <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden">
        <img src={fenceH} alt="" className="w-full h-full object-cover object-top opacity-90" draggable={false} />
      </div>
      {/* Bottom fence */}
      <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
        <img src={fenceH} alt="" className="w-full h-full object-cover object-bottom opacity-90 scale-y-[-1]" draggable={false} />
      </div>
      {/* Left fence */}
      <div className="absolute top-0 bottom-0 left-0 w-8 overflow-hidden">
        <img src={fenceH} alt="" className="h-full w-auto object-cover opacity-90 rotate-90 origin-top-left translate-x-8" draggable={false} style={{ minHeight: '100%' }} />
      </div>
      {/* Right fence */}
      <div className="absolute top-0 bottom-0 right-0 w-8 overflow-hidden">
        <img src={fenceH} alt="" className="h-full w-auto object-cover opacity-90 -rotate-90 origin-top-right -translate-x-8" draggable={false} style={{ minHeight: '100%' }} />
      </div>
    </div>
  );
}
