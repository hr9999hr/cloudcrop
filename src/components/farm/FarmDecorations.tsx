interface FarmDecorationsProps {
  weather: string;
}

export function FarmDecorations({ weather }: FarmDecorationsProps) {
  // No emoji decorations - just clean fences rendered via CSS in the parent
  return null;
}
