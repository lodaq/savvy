import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Clerk from '@clerk/clerk-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function detectLanguage(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[a-zA-Z]/;

  if (arabicRegex.test(text)) {
    return 'arabic';
  } else if (englishRegex.test(text)) {
    return 'english';
  } else {
    return 'unknown';
  }
}

export async function openUserProfile() {
  const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  await clerk.load();
  clerk.openUserProfile();
}
