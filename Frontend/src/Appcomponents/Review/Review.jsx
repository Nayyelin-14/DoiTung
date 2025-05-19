import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import React, { useMemo } from "react";
import { MessageSquareQuote } from "lucide-react";
import { OrbitProgress } from "react-loading-indicators";
import { GetAllReviews } from "@/EndPoints/user";

import StarRatings from "react-star-ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const { Hero } = t("Home", { returnObjects: true });
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: GetAllReviews,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <OrbitProgress color="#32cd32" size="large" text="" textColor="" />
      </div>
    );
  }
  const sampleReviews = [
    {
      review_id: "sample1",
      review_text:
        "This platform is amazing! The UI is clean and easy to navigate. I highly recommend it.",
      rating: 4.5,
      user_name: "Alice Smith",
      user_profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      review_id: "sample2",
      review_text:
        "Had a great experience using this service. Everything works smoothly and efficiently.",
      rating: 4,
      user_name: "John Doe",
      user_profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      review_id: "sample3",
      review_text:
        "Support is responsive and helpful. Really satisfied with the features offered.",
      rating: 5,
      user_name: "Emily Johnson",
      user_profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];
  const finalReviews = reviews?.length > 0 ? reviews : sampleReviews;
  return (
    <>
      {finalReviews?.length > 0 && (
        <section className="relative flex flex-col items-center justify-center  h-[360px] w-full p-1 overflow-hidden rounded-lg  bg-background my-10">
          <div className=" w-[85%] mx-auto ">
            <h1 className="text-center text-xl font-semibold mb-10">
              <p className="text-red-800 font-bold">{Hero.Reviews}</p>
              {Hero.From_Clients}
            </h1>
            <Marquee pauseOnHover className="[--duration:15s] ">
              {finalReviews.map((review) => (
                <ReviewCard key={review.review_id} {...review} />
              ))}
            </Marquee>
          </div>
        </section>
      )}
    </>
  );
};
export default Review;
