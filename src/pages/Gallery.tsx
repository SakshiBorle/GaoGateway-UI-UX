import { useState } from 'react'
import type { Page, BookingState, CartItem, AccessibilityConfig } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  pageData: Record<string, any>
  booking: BookingState
  setBooking: (b: BookingState) => void
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  a11y: AccessibilityConfig
}

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1772512799691-004541bc2f7c?w=800&h=600&fit=crop&auto=format', alt: 'Vibrant green agricultural fields with irrigation channels during monsoon season', cat: 'Farm', size: 'wide' },
  { id: 2, src: 'https://images.unsplash.com/photo-1694532635472-00eb7bfb720f?w=600&h=600&fit=crop&auto=format', alt: 'Peaceful green farm field with a small pond reflecting the sky', cat: 'Farm' },
  { id: 3, src: 'https://images.unsplash.com/photo-1695666403934-5929e4690900?w=600&h=600&fit=crop&auto=format', alt: 'Lush green farm fields with palm trees in the distance at GaonGetaway', cat: 'Nature' },
  { id: 4, src: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop&auto=format', alt: 'Fresh farm vegetables including tomatoes, beans, and leafy greens on a wooden table', cat: 'Food' },
  { id: 5, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop&auto=format', alt: 'A peaceful forested nature trail with sunlight filtering through the canopy', cat: 'Nature', size: 'tall' },
  { id: 6, src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop&auto=format', alt: 'A farmer carefully tending to organic crops in the morning light', cat: 'Activities' },
  { id: 7, src: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&h=600&fit=crop&auto=format', alt: 'A beautiful bird perched in natural farm habitat', cat: 'Nature' },
  { id: 8, src: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop&auto=format', alt: 'A colourful display of fresh organic vegetables from the farm market', cat: 'Food' },
  { id: 9, src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop&auto=format', alt: 'A charming rural cottage with stone walls surrounded by greenery', cat: 'Stay', size: 'wide' },
  { id: 10, src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&auto=format', alt: 'Golden farm fields bathed in warm sunset light at GaonGetaway', cat: 'Farm' },
  { id: 11, src: 'https://images.unsplash.com/photo-1698699860525-aab316ade8b6?w=600&h=600&fit=crop&auto=format', alt: 'A beautiful green meadow with trees and traditional rural scenery', cat: 'Nature' },
  { id: 12, src: 'https://images.unsplash.com/photo-1695666181238-1b69e2462899?w=600&h=600&fit=crop&auto=format', alt: 'Farm fields with palm trees creating a traditional rural landscape', cat: 'Farm' },
]

const categories = ['All', 'Farm', 'Nature', 'Food', 'Stay', 'Activities']

export default function Gallery({ navigate }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = activeCategory === 'All' ? galleryImages : galleryImages.filter(i => i.cat === activeCategory)

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null)

  return (
    <div style={{ minHeight: '100vh', background: '#2A2015' }}>
      {/* Header */}
      <div style={{ padding: '64px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: '16px' }}>Gallery</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Moments captured at GaonGetaway — from golden farm fields to morning mists and warm family gatherings.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ padding: '0 24px 32px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }} role="group" aria-label="Filter by category">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory === cat}
            style={{ padding: '9px 20px', borderRadius: '30px', border: `2px solid ${activeCategory === cat ? '#8BAD6A' : 'rgba(255,255,255,0.2)'}`, background: activeCategory === cat ? '#8BAD6A' : 'transparent', color: activeCategory === cat ? '#2A2015' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s ease' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 64px' }}>
        <div style={{ columns: '3 280px', gap: '10px' }}>
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => openLightbox(idx)}
              style={{ display: 'block', width: '100%', marginBottom: '10px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', background: '#3A3025', breakInside: 'avoid' }}
              aria-label={`View full size: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease, opacity 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; (e.currentTarget as HTMLImageElement).style.opacity = '0.85' }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}
            aria-label="Close lightbox"
          >
            ×
          </button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prevImage() }}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 101 }}>
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
            />
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '600px', lineHeight: 1.5 }}>
              {filtered[lightboxIndex].alt}
            </p>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              {lightboxIndex + 1} / {filtered.length}
            </span>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); nextImage() }}
            style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
