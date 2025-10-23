import { CategoryTile } from "../CategoryTile";
import { Newspaper, Trophy, Briefcase, Smartphone } from "lucide-react";

export default function CategoryTileExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <CategoryTile name="राष्ट्रीय" slug="national" icon={Newspaper} count={45} />
      <CategoryTile name="खेल" slug="sports" icon={Trophy} count={32} />
      <CategoryTile name="व्यापार" slug="business" icon={Briefcase} count={28} />
      <CategoryTile name="तकनीक" slug="tech" icon={Smartphone} count={21} />
    </div>
  );
}
