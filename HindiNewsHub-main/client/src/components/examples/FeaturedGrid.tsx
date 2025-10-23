import { FeaturedGrid } from "../FeaturedGrid";
import parliamentImage from "@assets/generated_images/Parliament_building_news_photo_fe719fd2.png";
import cricketImage from "@assets/generated_images/Cricket_match_sports_photo_ddeae4c0.png";
import startupImage from "@assets/generated_images/Startup_office_tech_photo_252c8eb3.png";
import businessImage from "@assets/generated_images/Stock_market_business_photo_8c40fd82.png";
import entertainmentImage from "@assets/generated_images/Bollywood_premiere_entertainment_photo_82768466.png";

export default function FeaturedGridExample() {
  const articles = [
    {
      title: "संसद में बड़ी बहस: नए कानून पर सभी दलों की राय",
      category: "राष्ट्रीय",
      categorySlug: "national",
      image: parliamentImage,
      slug: "parliament-featured",
      featured: true,
    },
    {
      title: "क्रिकेट: भारत की जीत",
      category: "खेल",
      categorySlug: "sports",
      image: cricketImage,
      slug: "cricket-featured",
    },
    {
      title: "टेक स्टार्टअप की सफलता",
      category: "स्टार्टअप",
      categorySlug: "startup",
      image: startupImage,
      slug: "startup-featured",
    },
    {
      title: "शेयर बाजार में उछाल",
      category: "व्यापार",
      categorySlug: "business",
      image: businessImage,
      slug: "business-featured",
    },
    {
      title: "बॉलीवुड का नया ट्रेंड",
      category: "मनोरंजन",
      categorySlug: "entertainment",
      image: entertainmentImage,
      slug: "entertainment-featured",
    },
  ];

  return (
    <div className="p-6">
      <FeaturedGrid articles={articles} title="विशेष रिपोर्ट" />
    </div>
  );
}
