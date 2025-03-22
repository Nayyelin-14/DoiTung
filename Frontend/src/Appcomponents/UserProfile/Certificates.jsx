import { GetCertificate } from "@/EndPoints/user";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Certificates = ({ userId }) => {
  const [certificate, setCertificate] = useState([]);

  const getCertificate = async () => {
    try {
      const response = await GetCertificate(userId);
      console.log("API Response:", response); // Debugging
      setCertificate(response.certificates || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getCertificate();
    }
  }, [userId]);

  return (
    <>
    <h1 className="text-[18px] text-center pt-4">My Certificates</h1>
      <div className="bg-pale rounded-xl h-auto w-full my-7 overflow-y-auto">
        
        {certificate.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 p-4">
            {certificate.map((item, index) => (
              <div key={index} className="w-full flex flex-col items-center justify-center text-center gap-4 h-[200px] rounded-xl bg-white p-4">
                <div className="h-[180px] flex items-center text-center">
                  <p className="font-semibold text-base">{item.course_name || "Course Name Missing"}</p>
                </div>
      
                <a href={item.certificate_url} target="_blank" rel="noopener noreferrer" className="text-white w-full">
                <Button className="w-full">View Certificate</Button>
                </a>
      
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">Nothing to show</div>
        )}
      </div>
    </>
  );
};

export default Certificates;

