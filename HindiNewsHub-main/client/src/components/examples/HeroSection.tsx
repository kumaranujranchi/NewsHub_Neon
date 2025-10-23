import { HeroSection } from "../HeroSection";
import parliamentImage from "@assets/generated_images/Parliament_building_news_photo_fe719fd2.png";

export default function HeroSectionExample() {
  return (
    <HeroSection
      title="संसद में नए कानून पर बहस जारी, विपक्ष ने किया विरोध"
      category="राष्ट्रीय"
      categorySlug="national"
      image={parliamentImage}
      readTime={5}
      timeAgo="2 घंटे पहले"
      slug="parliament-new-law-debate"
    />
  );
}
