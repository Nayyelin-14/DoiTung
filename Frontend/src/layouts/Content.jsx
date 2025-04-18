import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Content = () => {
  const { t } = useTranslation();
  const isSmall = useMediaQuery({ maxWidth: 1024 });
  const [api, setApi] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to update slider
  const updateslider = (index) => {
    api?.scrollTo(index);
  };

  // Effect to track active slide
  useEffect(() => {
    if (!api) return;
    api.on("slidesInView", (e) => {
      setActiveIndex(e.slidesInView()[0]);
    });
  }, [api]);

  const { Services } = t("Home", { returnObjects: true });
  // Access services from the translation file
  const services = [
    {
      id: 1,
      title: Services.personalizedLearning.title,
      description: Services.personalizedLearning.description,
      image: (
        <DotLottieReact src="https://lottie.host/19412375-0744-46e1-9a7c-e049561156de/FD2hCjl8MK.lottie" />
      ),
    },
    {
      id: 2,
      title: Services.onlineMentorship.title,
      description: Services.onlineMentorship.description,
      image: (
        <DotLottieReact src="https://lottie.host/8141331a-9639-4c10-b350-0de1bb65be82/cVhQLpFqJg.lottie" />
      ),
    },
    {
      id: 3,
      title: Services.communityLearningCircles.title,
      description: Services.communityLearningCircles.description,
      image: (
        <DotLottieReact src="https://lottie.host/7911de72-97fe-4ef3-8d74-89aec04b23f9/P0dyEg1XcK.lottie" />
      ),
    },
    {
      id: 4,
      title: Services.empowermentSupport.title,
      description: Services.empowermentSupport.description,
      image: (
        <DotLottieReact src="https://lottie.host/1be4bed7-cab8-4d79-a3b2-b68ce336c2ee/OBwhrZNec3.lottie" />
      ),
    },
  ];

  return (
    <section>
      {isSmall ? (
        <div>
          <Carousel setApi={setApi}>
            <CarouselContent>
              {services.map((service) => (
                <CarouselItem key={service.id} className="text-center">
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate__animated animate__fadeIn">
          {services.map((service) => (
            <div key={service.id} className="text-center">
              <div className="animate__animated animate__fadeIn">
                {service.image}
              </div>
              <h3 className="font-semibold text-lg mt-4">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Content;
