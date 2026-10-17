import type { AccessibilityConfig } from './types'

type Language = AccessibilityConfig['language']

const copy = {
  english: {
    stay: 'Stay', experiences: 'Experiences', dining: 'Dining', store: 'Farm Store',
    story: 'Our Story', reviews: 'Reviews', book: 'Book a Stay', profile: 'Profile',
    settings: 'Settings', language: 'Language', home: 'Home', availability: 'Check Availability',
    appearance: 'Appearance & Accessibility', bookings: 'My Bookings', logout: 'Log out',
  },
  hindi: {
    stay: 'ठहरें', experiences: 'अनुभव', dining: 'भोजन', store: 'फार्म स्टोर',
    story: 'हमारी कहानी', reviews: 'समीक्षाएँ', book: 'ठहरने की बुकिंग करें', profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स', language: 'भाषा', home: 'होम', availability: 'उपलब्धता देखें',
    appearance: 'रूप और सुगम्यता', bookings: 'मेरी बुकिंग', logout: 'लॉग आउट',
  },
  marathi: {
    stay: 'मुक्काम', experiences: 'अनुभव', dining: 'भोजन', store: 'फार्म स्टोअर',
    story: 'आमची गोष्ट', reviews: 'अभिप्राय', book: 'मुक्काम बुक करा', profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज', language: 'भाषा', home: 'मुख्यपृष्ठ', availability: 'उपलब्धता तपासा',
    appearance: 'दृश्य आणि सुलभता', bookings: 'माझ्या बुकिंग्ज', logout: 'लॉग आउट',
  },
} as const

export type TranslationKey = keyof typeof copy.english

export function translate(language: Language, key: TranslationKey): string {
  return copy[language][key] || copy.english[key]
}
