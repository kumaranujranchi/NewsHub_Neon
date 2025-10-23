// Category definitions
// - name: Hindi display name
// - dbValue: Value stored in database (Hindi)
// - urlSlug: English slug used in URLs for SEO
export const categories = [
  { name: "राष्ट्रीय", dbValue: "राष्ट्रीय", urlSlug: "national" },
  { name: "राज्य", dbValue: "राज्य", urlSlug: "state" },
  { name: "मनोरंजन", dbValue: "मनोरंजन", urlSlug: "entertainment" },
  { name: "व्यापार", dbValue: "व्यापार", urlSlug: "business" },
  { name: "तकनीक", dbValue: "तकनीक", urlSlug: "tech" },
  { name: "खेल", dbValue: "खेल", urlSlug: "sports" },
  { name: "पोलिटिक्स", dbValue: "पोलिटिक्स", urlSlug: "politics" },
  { name: "स्टार्टअप", dbValue: "स्टार्टअप", urlSlug: "startup" },
];

export const getCategoryByUrlSlug = (urlSlug: string) => {
  return categories.find(cat => cat.urlSlug === urlSlug);
};

export const getCategoryByDbValue = (dbValue: string) => {
  return categories.find(cat => cat.dbValue === dbValue);
};
