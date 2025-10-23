import { ArticleCard } from "../ArticleCard";
import cricketImage from "@assets/generated_images/Cricket_match_sports_photo_ddeae4c0.png";
import startupImage from "@assets/generated_images/Startup_office_tech_photo_252c8eb3.png";

export default function ArticleCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <ArticleCard
        title="भारतीय क्रिकेट टीम ने जीता रोमांचक मैच"
        excerpt="अंतिम ओवर में शानदार प्रदर्शन के साथ टीम इंडिया ने मैच अपने नाम किया। कप्तान की पारी रही मैच की जान।"
        category="खेल"
        categorySlug="sports"
        image={cricketImage}
        author="राजेश कुमार"
        readTime={4}
        timeAgo="1 घंटा पहले"
        slug="india-cricket-win"
        variant="default"
      />
      <ArticleCard
        title="स्टार्टअप को मिली 100 करोड़ की फंडिंग"
        excerpt="नई तकनीक पर काम करने वाली कंपनी को निवेशकों से बड़ा निवेश मिला है।"
        category="स्टार्टअप"
        categorySlug="startup"
        image={startupImage}
        author="प्रिया शर्मा"
        readTime={3}
        timeAgo="3 घंटे पहले"
        slug="startup-funding"
        variant="horizontal"
      />
    </div>
  );
}
