import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined | { toString: () => string }): string {
  const num = typeof price === 'string' ? parseFloat(price) :
              typeof price === 'number' ? price :
              price && typeof price.toString === 'function' ? parseFloat(price.toString()) : null
  if (!num && num !== 0) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
