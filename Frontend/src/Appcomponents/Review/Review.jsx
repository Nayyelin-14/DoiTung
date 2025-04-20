import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import React, { useEffect, useMemo, useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { OrbitProgress } from "react-loading-indicators";
import { GetAllReviews } from "@/EndPoints/user";
import usericon from "../../../assets/usericon.jpg";
import StarRatings from "react-star-ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReviewCard = ({ review_text, rating, user_name, user_profileImage }) => {
  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };

  const avatarFallback = useMemo(() => {
    return user_name?.slice(0, 2).toUpperCase() || "";
  }, [user_name]);
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
        <Avatar className="cursor-pointer" aria-label="User Avatar">
          <AvatarImage src={user_profileImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {user_name}
          </figcaption>
          {/* <p className="text-xs font-medium dark:text-white/40">{username}</p> */}
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            numberOfStars={5}
            name="rating"
            starDimension="16px"
            starSpacing="2px"
          />
        </div>
      </div>
      <blockquote className="mt-2 ml-12 text-sm">
        {(review_text || labels[rating]).slice(0, 100)}...
      </blockquote>
    </figure>
  );
};

const Review = () => {
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      const response = await GetAllReviews();
      if (response.isSuccess) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };
  useEffect(() => {
    getReviews();
  }, []);

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <OrbitProgress color="#32cd32" size="large" text="" textColor="" />
        </div>
      }
    >
      <section className="relative flex flex-col items-center justify-center  h-[260px] w-full p-1 overflow-hidden rounded-lg  bg-background my-3">
        {reviews.length > 0 ? (
          <>
            <Marquee pauseOnHover className="[--duration:6s] ">
              {reviews.map((review) => (
                <ReviewCard key={review.review_id} {...review} />
              ))}
            </Marquee>
          </>
        ) : (
          <>
            <p className="text-center text-gray-400">No Reviews yet.</p>
          </>
        )}
      </section>
    </React.Suspense>
  );
};
export default Review;
