import { QuickLinksSection } from "../QuickLinksSection";

export default function QuickLinksSectionExample() {
  const links = [
    { title: "महाराष्ट्र", count: 45, slug: "maharashtra" },
    { title: "उत्तर प्रदेश", count: 38, slug: "uttar-pradesh" },
    { title: "दिल्ली", count: 32, slug: "delhi" },
    { title: "राजस्थान", count: 28, slug: "rajasthan" },
    { title: "गुजरात", count: 25, slug: "gujarat" },
  ];

  return (
    <div className="p-4 max-w-md">
      <QuickLinksSection links={links} />
    </div>
  );
}
