import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Globe2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

const LangSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Track the selected language
  const { i18n } = useTranslation();
  const languages = [
    {
      code: "en",
      lang: "en",
    },
    { code: "th", lang: "th" },
  ];

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    console.log("Selected Language:", value); // You can use this value to change the language
    i18n.changeLanguage(value);
    //     localStorage.setItem("selectedLanguage", value);
  };

  // On component mount, set language from localStorage if it exists
  useEffect(() => {
    const currentLanguage = i18n.language;
    console.log(currentLanguage);
    setSelectedLanguage(currentLanguage); // Set the language from i18next.language
  }, [i18n.language]); // Re-run on i18n change
  return (
    <div className="bg-gray-300">
      <Select onValueChange={handleLanguageChange} value={selectedLanguage}>
        <SelectTrigger className="w-fit border-none">
          <SelectValue placeholder={<Globe2Icon size={20} />} />
        </SelectTrigger>
        <SelectContent>
          {languages?.map((lg) => (
            <SelectItem value={lg.code} key={lg.code}>
              {lg.lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LangSelector;
