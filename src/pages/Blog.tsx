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

const FOOD_IMG = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop&auto=format'
const BIRDS_IMG = 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&h=500&fit=crop&auto=format'
const FARM_INDIA = 'https://images.unsplash.com/photo-1772512799691-004541bc2f7c?w=800&h=500&fit=crop&auto=format'
const TRAIL_IMG = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&auto=format'
const FARMING_IMG = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format'
const VEG_IMG = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=500&fit=crop&auto=format'

const posts = [
  {
    id: 'b1',
    title: 'The Joy of Farm-to-Table Living',
    date: 'Sep 20, 2026',
    author: 'GaonGetaway Team',
    category: 'Farm Experiences',
    img: FOOD_IMG,
    excerpt: 'Discover how eating fresh, locally grown food transforms your relationship with nature, community, and your own wellbeing.',
    content: `There's something profound about picking a vegetable from the earth and eating it hours later. At GaonGetaway, farm-to-table isn't a marketing phrase — it's how we live.

Every meal served at our farm kitchen uses ingredients harvested the same day. The tomatoes come from the kitchen garden. The lentils from the fields. The ghee from our cows. The honey from our beehives. Nothing travels more than 500 metres from soil to plate.

**Why it matters**

When we eat local food, we eat seasonally. We eat what the land provides at its best. This reconnects us with the natural cycles of agriculture — the monsoon planting, the winter harvest, the summer abundance.

For urban visitors, this is often a revelation. Many of our guests — especially children — have never seen vegetables growing. They've never smelled soil after rain. They've never understood that food has a provenance, a season, a story.

**The experience**

Our farm-to-table dining experience begins in the fields. Guests accompany our farmers during the morning harvest, selecting the freshest produce for the day's meals. Then, in our farm kitchen, our cooks prepare traditional Maharashtra dishes using recipes passed down through three generations.

The result is food that tastes like food is supposed to taste. Not transported, not refrigerated, not processed. Just honest, nourishing, delicious.

**More than a meal**

Farm-to-table at GaonGetaway is also about community. Meals are shared at long tables, with guests from different cities and backgrounds sitting together, breaking bread (or bhakri) together.

These shared meals often become the most memorable part of a stay — the conversations, the laughter, the moment when a child tastes fresh sugarcane juice for the first time and their face lights up with pure joy.

Come taste the difference.`,
    readTime: '5 min read',
    tags: ['Food', 'Farm Life', 'Culture'],
  },
  {
    id: 'b2',
    title: 'A Beginner\'s Guide to Bird Watching',
    date: 'Sep 12, 2026',
    author: 'GaonGetaway Team',
    category: 'Nature',
    img: BIRDS_IMG,
    excerpt: 'The Western Ghats foothills are home to remarkable birds. Here\'s how to spot the best species on our nature trails.',
    content: `Bird watching is one of those activities that starts as a curiosity and becomes a lifelong obsession. And few places are better for beginners than the countryside around GaonGetaway.

**What you'll see**

The farm and surrounding forests are home to over 80 bird species. Some highlights our guests regularly spot:

- **Purple Sunbird** — The tiny, iridescent jewel of the garden
- **Indian Roller** — Spectacular blue flash in flight
- **Brahminy Kite** — Soaring red-brown against the blue sky
- **White-throated Kingfisher** — Perched brilliantly near the pond
- **Oriental Magpie Robin** — The soundtrack of our mornings
- **Indian Grey Hornbill** — The ambassador of our forest trail

**Tips for first-time bird watchers**

The golden hours — the first two hours after sunrise and the hour before sunset — are when birds are most active and visible. Wear muted earth tones, move quietly, and let your ears guide you before your eyes.

We provide binoculars for all our nature walks. Our guides are patient naturalists who understand that the joy of bird watching is in the process of discovery, not just the final count.

**Our bird watching walks**

Our 2.5-hour guided bird watching walks operate from 6:30 AM. We follow gentle trails through the farm's edge habitats — the most productive zones for bird diversity. The walks are designed to be gentle and accessible.

No experience needed. Just bring curiosity.`,
    readTime: '4 min read',
    tags: ['Nature', 'Wildlife', 'Activities'],
  },
  {
    id: 'b3',
    title: 'Why Rural Tourism Matters for India',
    date: 'Sep 5, 2026',
    author: 'GaonGetaway Team',
    category: 'Rural Travel',
    img: FARM_INDIA,
    excerpt: 'Agri-tourism is creating sustainable livelihoods and preserving traditional culture while offering travellers something money can\'t buy.',
    content: `India's villages are quietly losing their populations. Young people move to cities for opportunities. Traditional crafts fade. Ancient farming knowledge goes unrecorded. Rural tourism is not just a business — it's a form of cultural preservation.

**The economic case**

When a family from Mumbai visits a farm in Maharashtra for a weekend, they spend locally. They eat at local restaurants. They buy local crafts. They support a local farming family directly.

Compare this to international tourism, where a significant portion of every tourist dollar leaks out of the local economy. Rural tourism, almost by definition, is high-retention: the money stays where it's spent.

**The cultural case**

Rural India is extraordinarily rich. Traditional recipes refined over centuries. Agricultural knowledge developed in intimate partnership with specific soil, climate, and crop varieties. Folk music. Craft traditions. Community rituals.

All of this is at risk of disappearing within a generation. Rural tourism creates an economic incentive to preserve it.

**The psychological case**

For urban Indians, the village represents roots, memory, and a slower pace of life that modern cities have abandoned. A weekend on a farm is not just recreation — it's restoration. Guests report feeling calmer, more grounded, and more connected after even a short rural stay.

**At GaonGetaway**

We are one part of a larger movement to make rural India valued, visited, and supported. We invite you to visit not just as a tourist but as a participant in a community's story.`,
    readTime: '6 min read',
    tags: ['Travel', 'Culture', 'Sustainability'],
  },
  {
    id: 'b4',
    title: 'Seasonal Farming: Life by the Monsoon Calendar',
    date: 'Aug 28, 2026',
    author: 'GaonGetaway Team',
    category: 'Sustainable Agriculture',
    img: FARMING_IMG,
    excerpt: 'Understanding how the seasons shape farming at GaonGetaway, and what you\'ll experience depending on when you visit.',
    content: `Farming in Maharashtra follows the monsoon. The rains arrive, the fields transform, and the farming calendar begins. Understanding this rhythm helps visitors choose when to visit and what they'll experience.

**Monsoon Season (June–September)**

The farm comes alive in monsoon. Fields are planted with sorghum, millet, and pulses. The air smells of wet earth — petrichor, the scent that city-dwellers most miss and most cherish when they rediscover it.

Monsoon visits are beautiful but require preparation. The fields can be muddy. The sky is often dramatic. Morning mists roll across the hills. For photography enthusiasts, there is no better time.

**Post-Monsoon Harvest (October–January)**

This is the golden season. Fields of ripening grain. The harvest begins and continues through winter. October and November are particularly magical — every activity from harvesting to threshing to winnowing can be experienced.

This is when our Farm-to-Table dining reaches its peak, with an abundance of fresh seasonal produce.

**Summer (February–May)**

Summer on the farm means mango season, vegetable gardens, and the preparation of fields for the next monsoon. Summers are warm but evenings are pleasant. Bird watching is excellent as migratory birds visit.`,
    readTime: '5 min read',
    tags: ['Agriculture', 'Seasons', 'Farm Life'],
  },
  {
    id: 'b5',
    title: 'Accessible Travel: Our Promise to Every Guest',
    date: 'Aug 15, 2026',
    author: 'GaonGetaway Team',
    category: 'Accessibility',
    img: TRAIL_IMG,
    excerpt: 'How GaonGetaway is making authentic farm experiences accessible for elderly visitors, wheelchair users, and guests with diverse needs.',
    content: `When we talk about inclusive design at GaonGetaway, we mean something specific: every guest should be able to participate in the core experience of the farm.

This includes elderly visitors who may walk slowly. Wheelchair users who need level pathways. Guests with hearing impairments who need captions. Visitors with vision impairments who benefit from audio guidance. Families with very young children who need safe environments.

**What we've done**

We have redesigned pathways and activity areas to be navigable by wheelchair users. Our farm tour follows a specifically designed accessible route that takes in all the key farm areas on level or gently graded surfaces.

Our dining hall is fully accessible. Our accommodation includes ground-floor options with wide doorways and accessible bathroom facilities. All our guided tours are available with audio transcripts and captioning on request.

**The ongoing journey**

Accessibility is not a one-time project — it's a continuous commitment. We regularly consult with visitors about their experiences and make improvements.

We believe that a farm holiday should be available to everyone, regardless of age or ability. That belief shapes every decision we make.

Contact us in advance of your visit so we can prepare the specific support your group needs.`,
    readTime: '4 min read',
    tags: ['Accessibility', 'Inclusive Design'],
  },
  {
    id: 'b6',
    title: 'Fresh from the Farm: What to Buy in October',
    date: 'Aug 8, 2026',
    author: 'GaonGetaway Team',
    category: 'Farm Experiences',
    img: VEG_IMG,
    excerpt: 'The October harvest brings an abundance of fresh organic produce to our Farm Store. Here\'s what to look for this season.',
    content: `October is arguably the richest month in our farm store. The post-monsoon harvest has begun, and the fields are producing in abundance. Here's what's fresh this month.

**Vegetables**

- Fresh turmeric rhizomes — bright orange, aromatic, incomparably fresh
- Bitter gourd (karela) at its best
- Ridge gourd, cluster beans, field beans
- Tomatoes, red and ripe on the vine

**Grains & Pulses**

- Newly harvested local sorghum (jowar)
- Heritage rice varieties just out of the paddy fields
- Fresh toor dal (pigeon pea) before drying

**From Our Bee Hives**

October is our secondary honey harvest. Our beehives produce a distinctive wildflower honey at this time of year — amber-coloured and deeply floral. Available in limited quantities.

**Homemade Products**

Our kitchen team prepares seasonal preserves during October:
- Mango pickle (from summer mangoes, now perfectly matured)
- Dried herb blends from our kitchen garden
- Seasonal chutney from farm-grown ingredients

All products are available for direct purchase at the farm or can be ordered for home delivery. Orders above ₹500 get free shipping across Maharashtra.`,
    readTime: '3 min read',
    tags: ['Farm Store', 'Seasonal', 'Food'],
  },
]

export default function Blog({ navigate, goBack, pageData }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(pageData?.selectedId || null)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]
  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory)
  const selected = selectedId ? posts.find(p => p.id === selectedId) : null

  if (selected) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 24px 80px' }}>
          <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2B5219', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', padding: '8px 0' }}>
            ← Back to Blog
          </button>

          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', background: '#C8DEB0', marginBottom: '32px' }}>
            <img src={selected.img} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {selected.tags.map(tag => (
              <span key={tag} style={{ padding: '4px 12px', background: '#E8F4E0', color: '#2B5219', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{tag}</span>
            ))}
          </div>

          <p style={{ fontSize: '0.85rem', color: '#8A7860', marginBottom: '12px' }}>📅 {selected.date} · ✍️ {selected.author} · ⏱ {selected.readTime}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#2B5219', marginBottom: '24px', lineHeight: 1.2 }}>
            {selected.title}
          </h1>

          <div style={{ borderLeft: '3px solid #C8DEB0', paddingLeft: '20px', marginBottom: '28px' }}>
            <p style={{ fontSize: '1.1rem', color: '#4A3A28', lineHeight: 1.7, fontStyle: 'italic' }}>{selected.excerpt}</p>
          </div>

          <div style={{ fontSize: '1rem', color: '#4A3A28', lineHeight: 1.9 }}>
            {selected.content.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.endsWith('**')) {
                return <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#2B5219', margin: '32px 0 12px' }}>{para.replace(/\*\*/g, '')}</h2>
              }
              if (para.startsWith('-')) {
                return (
                  <ul key={i} style={{ margin: '8px 0 16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {para.split('\n').map((li, j) => (
                      <li key={j} style={{ color: '#4A3A28' }}>{li.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )
              }
              const processed = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              return <p key={i} style={{ marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: processed }} />
            })}
          </div>

          <div style={{ borderTop: '1px solid #E8DCC8', paddingTop: '24px', marginTop: '40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={() => setSelectedId(null)} style={{ padding: '12px 24px', background: 'transparent', color: '#2B5219', border: '2px solid #2B5219', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              ← Back to Blog
            </button>
            <button onClick={() => navigate('ai-planner')} style={{ padding: '12px 24px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
              ✨ Plan My Rural Trip
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #5A7A3A, #2B5219)', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: '16px' }}>From the Blog</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Stories from the farm, travel tips, seasonal guides, and reflections on rural life.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }} role="group" aria-label="Filter by category">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory === cat}
              style={{ padding: '9px 20px', borderRadius: '30px', border: `2px solid ${activeCategory === cat ? '#2B5219' : '#D4C4A0'}`, background: activeCategory === cat ? '#2B5219' : 'white', color: activeCategory === cat ? 'white' : '#4A3A28', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s ease' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post (first) */}
        {activeCategory === 'All' && (
          <button onClick={() => setSelectedId(posts[0].id)} className="card-hover"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(212,196,160,0.4)', boxShadow: '0 8px 32px rgba(43,82,25,0.08)', marginBottom: '40px', width: '100%', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            aria-label={`Featured: Read ${posts[0].title}`}>
            <div style={{ minHeight: '260px', background: '#C8DEB0' }}>
              <img src={posts[0].img} alt={posts[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '260px' }} />
            </div>
            <div style={{ padding: '36px' }}>
              <span style={{ background: '#E8F4E0', color: '#2B5219', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginBottom: '16px' }}>⭐ Featured</span>
              <p style={{ fontSize: '0.85rem', color: '#8A7860', marginBottom: '10px' }}>📅 {posts[0].date} · ⏱ {posts[0].readTime}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#2B5219', marginBottom: '14px', lineHeight: 1.2 }}>{posts[0].title}</h2>
              <p style={{ color: '#6A5840', lineHeight: 1.7, marginBottom: '20px' }}>{posts[0].excerpt}</p>
              <span style={{ color: '#2B5219', fontWeight: 700 }}>Read More →</span>
            </div>
          </button>
        )}

        {/* Post grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
          {(activeCategory === 'All' ? filtered.slice(1) : filtered).map(post => (
            <button key={post.id} onClick={() => setSelectedId(post.id)} className="card-hover"
              style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', textAlign: 'left', cursor: 'pointer', padding: 0, border: '1px solid rgba(212,196,160,0.4)', boxShadow: '0 4px 16px rgba(43,82,25,0.06)' }}
              aria-label={`Read: ${post.title}`}>
              <div style={{ aspectRatio: '16/9', background: '#C8DEB0' }}>
                <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ background: '#F5EFE0', color: '#7A4828', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>{post.category}</span>
                  <span style={{ fontSize: '0.78rem', color: '#8A7860' }}>{post.readTime}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#9A8870', marginBottom: '8px' }}>📅 {post.date}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#2A2015', marginBottom: '10px', lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#6A5840', lineHeight: 1.6, marginBottom: '16px' }} className="line-clamp-2">{post.excerpt}</p>
                <span style={{ color: '#2B5219', fontWeight: 700, fontSize: '0.9rem' }}>Read More →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
