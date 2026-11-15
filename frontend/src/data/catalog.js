export const CATALOG_COLLECTIONS = [
  'All',
  'Shoes',
  'Bags',
  'Dress & Clothing',
  'Exclusive Collabs',
  'Retro Basketball',
  'Running & Lifestyle',
  'Technical Outerwear',
  'Accessories & Care',
  'Top Best Deals',
]

export const CATALOG_SIZES = [
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
  '9.5',
  '10',
  '10.5',
  '11',
  '11.5',
  '12',
  '13',
]

export const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const BAG_SIZES = ['One Size', '12L', '40L']
export const ACCESSORY_SIZES = ['Standard', 'Fits up to US 14', '140cm', '250ml']

export const getSizeGroupForCategory = (category) => {
  const c = String(category || '').toLowerCase().trim()
  if (
    c === 'dress & clothing' ||
    c === 'clothing' ||
    c === 'technical outerwear' ||
    /apparel|streetwear|hoodie|jacket/i.test(c)
  ) {
    return {
      title: 'SIZE (APPAREL)',
      type: 'apparel',
      sizes: APPAREL_SIZES,
    }
  }
  if (c === 'bags' || /bag|pack|duffle/i.test(c)) {
    return {
      title: 'SIZE / CAPACITY',
      type: 'bags',
      sizes: BAG_SIZES,
    }
  }
  if (c === 'accessories & care' || /accessories|care/i.test(c)) {
    return {
      title: 'SIZE & SPEC',
      type: 'accessories',
      sizes: ACCESSORY_SIZES,
    }
  }
  return {
    title: 'SIZE (US MEN)',
    type: 'shoes',
    sizes: CATALOG_SIZES,
  }
}

export const CATALOG_BRANDS = [
  { id: 'nike', name: 'Nike', count: 24 },
  { id: 'jordan', name: 'Jordan', count: 12 },
  { id: 'adidas', name: 'Adidas', count: 8 },
  { id: 'new-balance', name: 'New Balance', count: 4 },
]
