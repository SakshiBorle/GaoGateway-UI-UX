export interface ActivityDefinition {
  id: string
  name: string
  category: 'Farming' | 'Nature' | 'Farm-to-Table' | 'Culture' | 'Farm Store' | 'Leisure and Recreation'
  minutes: number
  icon: string
  description: string
  active: boolean
}

export const defaultActivities: ActivityDefinition[] = [
  { id: 'organic-farming', name: 'Organic Farming Workshop', category: 'Farming', minutes: 60, icon: '🌱', description: 'Learn practical organic growing methods with a farm host.', active: true },
  { id: 'crop-harvesting', name: 'Crop Harvesting Experience', category: 'Farming', minutes: 90, icon: '🌾', description: 'Join a seasonal harvest and learn how crops are selected.', active: true },
  { id: 'seed-planting', name: 'Seed Planting Activity', category: 'Farming', minutes: 60, icon: '◉', description: 'Prepare soil and plant seasonal seeds with guidance.', active: true },
  { id: 'farm-walk', name: 'Farm Walk', category: 'Farming', minutes: 45, icon: '♧', description: 'Take a gentle guided walk through the working farm.', active: true },
  { id: 'nature-walk', name: 'Nature Walk', category: 'Nature', minutes: 60, icon: '🌿', description: 'Explore the local landscape at an easy pace.', active: true },
  { id: 'bird-watching', name: 'Bird Watching', category: 'Nature', minutes: 60, icon: '🐦', description: 'Observe local birdlife with a guide and binoculars.', active: true },
  { id: 'forest-field-trail', name: 'Forest and Field Trail', category: 'Nature', minutes: 90, icon: '♧', description: 'Follow a guided trail through forest edges and open fields.', active: true },
  { id: 'sunrise-walk', name: 'Sunrise Nature Walk', category: 'Nature', minutes: 60, icon: '☀', description: 'Start the day with a quiet sunrise walk.', active: true },
  { id: 'farm-table', name: 'Farm-to-Table Experience', category: 'Farm-to-Table', minutes: 90, icon: '🍽️', description: 'Follow ingredients from the farm to a shared seasonal meal.', active: true },
  { id: 'food-preparation', name: 'Traditional Food Preparation', category: 'Farm-to-Table', minutes: 90, icon: '◒', description: 'Prepare traditional Maharashtrian dishes with a local cook.', active: true },
  { id: 'local-cooking', name: 'Local Cooking Experience', category: 'Farm-to-Table', minutes: 120, icon: '◒', description: 'Cook a complete local meal using seasonal produce.', active: true },
  { id: 'maharashtrian-culture', name: 'Maharashtrian Cultural Experience', category: 'Culture', minutes: 90, icon: '🏺', description: 'Discover local traditions, stories, music, and customs.', active: true },
  { id: 'warli-art', name: 'Warli Art Experience', category: 'Culture', minutes: 60, icon: '◇', description: 'Create a Warli-inspired artwork with a local artist.', active: true },
  { id: 'village-experience', name: 'Local Village Experience', category: 'Culture', minutes: 90, icon: '⌂', description: 'Meet local makers and learn about everyday village life.', active: true },
  { id: 'farm-store', name: 'Farm Store Visit', category: 'Farm Store', minutes: 30, icon: '🛒', description: 'Browse produce and goods made on the farm.', active: true },
  { id: 'produce-shopping', name: 'Local Produce Shopping', category: 'Farm Store', minutes: 30, icon: '◫', description: 'Shop for seasonal produce and locally made products.', active: true },
  { id: 'outdoor-recreation', name: 'Outdoor Recreation', category: 'Leisure and Recreation', minutes: 60, icon: '◌', description: 'Enjoy a relaxed outdoor game or group activity.', active: true },
  { id: 'relaxation', name: 'Relaxation Time', category: 'Leisure and Recreation', minutes: 60, icon: '—', description: 'Leave unstructured time to rest and recharge.', active: true },
  { id: 'garden-leisure', name: 'Garden Leisure', category: 'Leisure and Recreation', minutes: 45, icon: '❧', description: 'Spend quiet time in the garden at your own pace.', active: true },
]

const storageKey = 'gaongetaway-custom-activities'

export function getActivityLibrary(includeInactive = false): ActivityDefinition[] {
  let custom: ActivityDefinition[] = []
  try { custom = JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { custom = [] }
  const merged = [...defaultActivities, ...custom]
  return includeInactive ? merged : merged.filter(activity => activity.active)
}

export function getCustomActivities(): ActivityDefinition[] {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
}

export function saveCustomActivities(activities: ActivityDefinition[]) {
  localStorage.setItem(storageKey, JSON.stringify(activities))
  window.dispatchEvent(new Event('gaongetaway-activities-updated'))
}

export function formatActivityDuration(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`
  const hours = minutes / 60
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hour${hours === 1 ? '' : 's'}`
}
