
import { Card, CardContent } from '@/components/ui/card';
import { Tag, Hash, Palette, Calendar } from 'lucide-react';

interface CategoryStatsProps {
  totalCategories: number;
  activeCategories: number;
  colors: number;
  recentCategories: number;
}

export function CategoryStats({ totalCategories, activeCategories, colors, recentCategories }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total catégories</p>
              <p className="text-2xl font-bold text-neutral-900">{totalCategories}</p>
            </div>
            <Tag className="h-8 w-8 text-[#6A9C89]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Catégories actives</p>
              <p className="text-2xl font-bold text-success">{activeCategories}</p>
            </div>
            <Hash className="h-8 w-8 text-success" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Couleurs utilisées</p>
              <p className="text-2xl font-bold text-blue-600">{colors}</p>
            </div>
            <Palette className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Nouvelles (7j)</p>
              <p className="text-2xl font-bold text-orange-600">{recentCategories}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
