export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verifiedPurchase: boolean;
}

export const demoReviews: ProductReview[] = [
  {
    id: "review-iphone-1",
    productId: "iphone-15-pro",
    author: "Jordan M.",
    rating: 5,
    title: "A thoughtful upgrade",
    body: "The size feels just right and the camera is excellent for everyday photos. The sample review is here to demonstrate the product-page experience.",
    date: "2026-08-12",
    verifiedPurchase: true,
  },
  {
    id: "review-nike-tee-1",
    productId: "nike-dri-fit-training-tee",
    author: "Alex R.",
    rating: 4,
    title: "Comfortable for training",
    body: "Lightweight fabric and an easy fit. I would check the size chart if you prefer a closer cut.",
    date: "2026-07-18",
    verifiedPurchase: true,
  },
  {
    id: "review-harbor-coffee-1",
    productId: "harbor-roast-ethiopian-coffee",
    author: "Sam K.",
    rating: 5,
    title: "Bright and balanced",
    body: "A pleasant citrus note and a clean finish. The demonstration review helps show how product feedback will appear.",
    date: "2026-09-22",
    verifiedPurchase: true,
  },
  {
    id: "review-yamaha-guitar-1",
    productId: "yamaha-f310-acoustic-guitar",
    author: "Taylor B.",
    rating: 5,
    title: "A lovely first guitar",
    body: "Comfortable to hold and easy to practice with. The natural finish looks great in person.",
    date: "2026-08-30",
    verifiedPurchase: true,
  },
  {
    id: "review-oakline-sofa-1",
    productId: "oakline-modular-sofa",
    author: "Morgan L.",
    rating: 4,
    title: "Comfortable, considered design",
    body: "The proportions work well in our living room and the covers are practical. Delivery and assembly details are clearly shown as demo information.",
    date: "2026-06-14",
    verifiedPurchase: true,
  },
  {
    id: "review-restful-paws-1",
    productId: "restful-paws-orthopedic-bed",
    author: "Jamie P.",
    rating: 5,
    title: "Easy to keep clean",
    body: "The removable cover is useful and the bed keeps its shape after regular use.",
    date: "2026-07-02",
    verifiedPurchase: true,
  },
];

export function getDemoReviews(productId: string): ProductReview[] {
  return demoReviews.filter((review) => review.productId === productId);
}
