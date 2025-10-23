import { TrendingSection } from "../TrendingSection";
import parliamentImage from "@assets/generated_images/Parliament_building_news_photo_fe719fd2.png";
import cricketImage from "@assets/generated_images/Cricket_match_sports_photo_ddeae4c0.png";
import startupImage from "@assets/generated_images/Startup_office_tech_photo_252c8eb3.png";
import businessImage from "@assets/generated_images/Stock_market_business_photo_8c40fd82.png";

export default function TrendingSectionExample() {
  const articles = [
    {
      title: "संसद में नए कानून पर बहस",
      excerpt: "सभी दलों ने अपनी राय रखी। विपक्ष ने कुछ संशोधनों की मांग की है।",
      category: "राष्ट्रीय",
      categorySlug: "national",
      image: parliamentImage,
      author: "रमेश वर्मा",
      readTime: 5,
      timeAgo: "2 घंटे पहले",
      slug: "parliament-debate",
    },
    {
      title: "क्रिकेट: भारत ने जीता मैच",
      excerpt: "शानदार बल्लेबाजी और गेंदबाजी के साथ टीम ने दिखाया दम।",
      category: "खेल",
      categorySlug: "sports",
      image: cricketImage,
      author: "अनिल पांडे",
      readTime: 4,
      timeAgo: "1 घंटा पहले",
      slug: "cricket-india-win",
    },
    {
      title: "टेक स्टार्टअप को मिली फंडिंग",
      excerpt: "AI पर आधारित प्रोडक्ट विकसित करने वाली कंपनी को बड़ा निवेश।",
      category: "स्टार्टअप",
      categorySlug: "startup",
      image: startupImage,
      author: "नेहा सिंह",
      readTime: 3,
      timeAgo: "4 घंटे पहले",
      slug: "startup-funding",
    },
    {
      title: "शेयर बाजार में तेजी",
      excerpt: "सेंसेक्स और निफ्टी दोनों ने नई ऊंचाई छुई।",
      category: "व्यापार",
      categorySlug: "business",
      image: businessImage,
      author: "सुरेश मेहता",
      readTime: 3,
      timeAgo: "5 घंटे पहले",
      slug: "stock-market-surge",
    },
  ];

  return (
    <div className="p-6">
      <TrendingSection articles={articles} />
    </div>
  );
}
