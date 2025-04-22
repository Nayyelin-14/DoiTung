import React, { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const LangSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: "en", lang: "EN" },
    { code: "th", lang: "TH" },
  ];

  const handleLanguageChange = useCallback(
    (value) => {
      if (value !== i18n.language) {
        setSelectedLanguage(value);

        i18n.changeLanguage(value);
      }
    },
    [i18n]
  );

  useEffect(() => {
    if (selectedLanguage !== i18n.language) {
      setSelectedLanguage(i18n.language);
    }
  }, [i18n.language, selectedLanguage]);

  return (
    <div>
      <Select onValueChange={handleLanguageChange} value={selectedLanguage}>
        <SelectTrigger className="w-fit border-none gap-2">
          <Globe size={20} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lg) => (
            <SelectItem value={lg.code} key={lg.code}>
              {lg.lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default React.memo(LangSelector);
