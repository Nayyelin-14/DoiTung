import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const Content = () => {
  const isSmall = useMediaQuery({ maxWidth: 1024 });
  const [api, setApi] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const updateslider = (index) => {
    api?.scrollTo(index);
  };
  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("slidesInView", (e) => {
      setActiveIndex(e.slidesInView()[0]);
    });
  }, [api]);
  const services = [
    {
      id: 1,
      title: "Personalized Learning Plans",
      description:
        "Get tailored learning paths to reach your career goals with expert guidance.",
      image: (
        <DotLottieReact src="https://lottie.host/19412375-0744-46e1-9a7c-e049561156de/FD2hCjl8MK.lottie" />
      ),
    },

    {
      id: 2,
      title: "Online Mentorship",
      description:
        "Connect with experienced mentors to guide you through your learning journey.",
      image: (
        <DotLottieReact src="https://lottie.host/8141331a-9639-4c10-b350-0de1bb65be82/cVhQLpFqJg.lottie" />
      ),
    },

    {
      id: 3,
      title: "Community Learning Circles",
      description:
        "Join supportive learning circles where you collaborate with others to build skills and solve real-world problems together.",
      image: (
        <DotLottieReact src="https://lottie.host/7911de72-97fe-4ef3-8d74-89aec04b23f9/P0dyEg1XcK.lottie" />
      ),
    },

    {
      id: 4,
      title: "Empowerment & Support",
      description:
        "Receive mentorship and guidance to help you develop your leadership potential and find meaningful work in your community.",
      image: (
        <DotLottieReact src="https://lottie.host/1be4bed7-cab8-4d79-a3b2-b68ce336c2ee/OBwhrZNec3.lottie" />
      ),
    },
  ];
  return (
    <div className="py-12 px-4 bg-white">
      {isSmall ? (
        <div>
          {" "}
          <Carousel setApi={setApi}>
            <CarouselContent>
              {services.map((service) => (
                <CarouselItem key={service.id} className="text-center">
                  {/* Lottie Animation or Image */}
                  <div className="animate__animated animate__fadeIn">
                    {service.image}
                  </div>
                  <h3 className="font-semibold text-lg mt-4">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {service.description}
                  </p>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center mt-4">
            {services.map((service, index) => (
              <div
                onClick={() => updateslider(index)}
                key={service.id}
                className={`w-3 h-3 mx-1 rounded-full bg-black cursor-pointer ${
                  activeIndex === index ? "opacity-100" : "opacity-20"
                }`}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8  animate__animated animate__fadeIn">
          {services.map((service) => (
            <div key={service.id} className="text-center">
              {/* Use Lottie instead of img */}
              <div className=" animate__animated animate__fadeIn">
                {service.image} {/* Render the Lottie component */}
              </div>
              <h3 className="font-semibold text-lg mt-4">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Content;
