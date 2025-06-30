
interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colorOptions = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6B7280', // Gray
];

export function ColorSelector({ selectedColor, onColorChange }: ColorSelectorProps) {
  return (
    <div>
      <label htmlFor="color" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Couleur</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? 'border-gray-400' : 'border-gray-200'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Couleur sélectionnée : {selectedColor}
      </p>
    </div>
  );
}
