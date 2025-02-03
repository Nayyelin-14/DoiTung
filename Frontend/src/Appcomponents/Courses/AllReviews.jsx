import { GetReviews } from '@/EndPoints/user';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import StarRatings from "react-star-ratings";

const AllReviews = ({ AllReviews }) => {

  const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };

  return (
    <div className="w-full mx-auto overflow-auto h-[400px] my-10">
      {AllReviews.length !==0 ?
        AllReviews.map((review) => (
          <div className="mb-6" key={review.review_id}>
            <div className="flex  gap-5 items-center">
              <Avatar className="cursor-pointer font-bold">
                <AvatarImage src={review.user_profileImage} />
                <AvatarFallback>
                  {review.user_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1>{review.user_name}</h1>
              <StarRatings
                rating={review.rating}
                starRatedColor="gold"
                numberOfStars={5}
                name="rating"
                starDimension="16px"
                starSpacing="2px"
              />
            </div>
            <div className="lg:ml-[60px]">
              <p className="text-gray-500 text-base leading-8">
                {review.review_text || labels[review.rating]}
              </p>
            </div>
          </div>
        )) : <p className="text-gray-500 text-center">No Reviews yet.</p>}
    </div>
)
};

export default AllReviews;
