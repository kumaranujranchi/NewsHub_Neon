import { PopularPostsSection } from "../PopularPostsSection";
import parliamentImage from "@assets/generated_images/Parliament_building_news_photo_fe719fd2.png";
import cricketImage from "@assets/generated_images/Cricket_match_sports_photo_ddeae4c0.png";
import startupImage from "@assets/generated_images/Startup_office_tech_photo_252c8eb3.png";
import businessImage from "@assets/generated_images/Stock_market_business_photo_8c40fd82.png";

export default function PopularPostsSectionExample() {
  const posts = [
    {
      title: "संसद में नए कानून की चर्चा",
      category: "राष्ट्रीय",
      categorySlug: "national",
      image: parliamentImage,
      slug: "parliament-1",
    },
    {
      title: "क्रिकेट टीम की जीत",
      category: "खेल",
      categorySlug: "sports",
      image: cricketImage,
      slug: "cricket-1",
    },
    {
      title: "स्टार्टअप को फंडिंग",
      category: "स्टार्टअप",
      categorySlug: "startup",
      image: startupImage,
      slug: "startup-1",
    },
    {
      title: "शेयर बाजार में तेजी",
      category: "व्यापार",
      categorySlug: "business",
      image: businessImage,
      slug: "business-1",
    },
  ];

  return (
    <div className="p-6">
      <PopularPostsSection posts={posts} />
    </div>
  );
}
