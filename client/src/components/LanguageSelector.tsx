import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">Language</span>
      </div>

      <Select value={currentLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-40 glass-card border-indigo-500/30 text-white">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{currentLang.flag}</span>
              <span>{currentLang.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="glass-card-dark border-indigo-500/30">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
