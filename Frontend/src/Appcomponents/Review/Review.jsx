import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import * as React from "react";
import { MessageSquareQuote } from "lucide-react";
import { OrbitProgress } from "react-loading-indicators";
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative w-40 sm:w-80 cursor-pointer overflow-hidden rounded-xl border-2 border-gray-900 p-4  sm:h-[200px] flex flex-col items-start justify-center gap-6",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <span className="absolute top-7 right-7 hidden sm:block">
        <MessageSquareQuote />
      </span>
      <div className="flex flex-row items-center gap-2 relative">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const Review = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <OrbitProgress color="#32cd32" size="large" text="" textColor="" />
        </div>
      }
    >
      <section className="relative flex flex-col items-center justify-center  h-[260px] w-full p-1 overflow-hidden rounded-lg  bg-background my-3">
        <Marquee pauseOnHover className="[--duration:40s] ">
          {reviews.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </section>
    </React.Suspense>
  );
};
export default Review;
