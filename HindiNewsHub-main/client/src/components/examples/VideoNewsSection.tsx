import { VideoNewsSection } from "../VideoNewsSection";
import cricketImage from "@assets/generated_images/Cricket_match_sports_photo_ddeae4c0.png";
import parliamentImage from "@assets/generated_images/Parliament_building_news_photo_fe719fd2.png";
import startupImage from "@assets/generated_images/Startup_office_tech_photo_252c8eb3.png";

export default function VideoNewsSectionExample() {
  const videos = [
    {
      title: "संसद सत्र: आज की बड़ी बहस का वीडियो",
      category: "राष्ट्रीय",
      categorySlug: "national",
      image: parliamentImage,
      slug: "parliament-video-1",
    },
    {
      title: "क्रिकेट मैच की झलकियां और विश्लेषण",
      category: "खेल",
      categorySlug: "sports",
      image: cricketImage,
      slug: "cricket-video-1",
    },
    {
      title: "स्टार्टअप फाउंडर का विशेष इंटरव्यू",
      category: "स्टार्टअप",
      categorySlug: "startup",
      image: startupImage,
      slug: "startup-video-1",
    },
  ];

  return (
    <div className="p-4 max-w-md">
      <VideoNewsSection videos={videos} />
    </div>
  );
}
