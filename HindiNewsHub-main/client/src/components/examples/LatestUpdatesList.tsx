import { LatestUpdatesList } from "../LatestUpdatesList";
import cricketImage from "@assets/generated_images/Cricket_match_sports_photo_ddeae4c0.png";
import startupImage from "@assets/generated_images/Startup_office_tech_photo_252c8eb3.png";
import businessImage from "@assets/generated_images/Stock_market_business_photo_8c40fd82.png";

export default function LatestUpdatesListExample() {
  const updates = [
    {
      title: "टीम इंडिया की शानदार जीत",
      category: "खेल",
      categorySlug: "sports",
      image: cricketImage,
      timeAgo: "15 मिनट पहले",
      slug: "cricket-update-1",
    },
    {
      title: "स्टार्टअप को मिली बड़ी फंडिंग",
      category: "स्टार्टअप",
      categorySlug: "startup",
      image: startupImage,
      timeAgo: "30 मिनट पहले",
      slug: "startup-update-1",
    },
    {
      title: "शेयर बाजार में नई ऊंचाई",
      category: "व्यापार",
      categorySlug: "business",
      image: businessImage,
      timeAgo: "1 घंटा पहले",
      slug: "business-update-1",
    },
  ];

  return (
    <div className="p-4 max-w-md">
      <LatestUpdatesList updates={updates} title="ताज़ा अपडेट" />
    </div>
  );
}
