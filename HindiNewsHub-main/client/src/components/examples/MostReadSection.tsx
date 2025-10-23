import { MostReadSection } from "../MostReadSection";

export default function MostReadSectionExample() {
  const articles = [
    {
      title: "संसद में गूंजा नया विधेयक, विपक्ष ने किया विरोध",
      category: "राष्ट्रीय",
      categorySlug: "national",
      timeAgo: "2 घंटे पहले",
      slug: "parliament-bill-1",
    },
    {
      title: "भारतीय क्रिकेट टीम की शानदार जीत",
      category: "खेल",
      categorySlug: "sports",
      timeAgo: "3 घंटे पहले",
      slug: "cricket-win-1",
    },
    {
      title: "बॉलीवुड स्टार की नई फिल्म का ट्रेलर रिलीज",
      category: "मनोरंजन",
      categorySlug: "entertainment",
      timeAgo: "5 घंटे पहले",
      slug: "bollywood-trailer-1",
    },
    {
      title: "शेयर बाजार में आई तेजी, निवेशकों को फायदा",
      category: "व्यापार",
      categorySlug: "business",
      timeAgo: "6 घंटे पहले",
      slug: "stock-market-1",
    },
    {
      title: "नई तकनीक से बदलेगी शिक्षा प्रणाली",
      category: "तकनीक",
      categorySlug: "tech",
      timeAgo: "8 घंटे पहले",
      slug: "tech-education-1",
    },
  ];

  return (
    <div className="p-4 max-w-md">
      <MostReadSection articles={articles} />
    </div>
  );
}
