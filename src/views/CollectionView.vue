<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const categories = ref([
  { id: 'all', name: 'All Products', count: 0 },
  { id: 'classic', name: 'Classic Series', count: 0 },
  { id: 'limited', name: 'Limited Edition', count: 0 },
  { id: 'new', name: 'New Arrivals', count: 0 },
  { id: 'sale', name: 'On Sale', count: 0 }
])

const sortOptions = ref([
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
])

const selectedCategory = ref('all')
const selectedSort = ref('popular')
const searchQuery = ref('')

// Price range filters
const priceFilters = ref({
  under50: false,
  from50to100: false,
  from100to150: false,
  over150: false
})

// Availability filters
const availabilityFilters = ref({
  inStock: false,
  preorder: false,
  sale: false
})

const allProducts = ref([
  {
    id: 1,
    name: 'Classic Labubu Pink',
    price: 89.99,
    originalPrice: 109.99,
    image: '/images/labubu-pink.webp',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true,
    category: 'classic'
  },
  {
    id: 2,
    name: 'Labubu Green Forest',
    price: 94.99,
    originalPrice: null,
    image: '/images/generated-image-03.webp',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: false,
    category: 'classic'
  },
  {
    id: 3,
    name: 'Limited Edition Gold Labubu',
    price: 149.99,
    originalPrice: null,
    image: '/images/generated-image-01.webp',
    rating: 5.0,
    reviews: 67,
    inStock: true,
    isNew: true,
    category: 'limited'
  },
  {
    id: 4,
    name: 'Labubu Rainbow Edition',
    price: 99.99,
    originalPrice: 119.99,
    image: '/images/generated-image-02.webp',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    isNew: false,
    category: 'classic'
  },
  {
    id: 5,
    name: 'Labubu Ocean Blue',
    price: 84.99,
    originalPrice: 99.99,
    image: '/images/photo-5581.webp',
    rating: 4.7,
    reviews: 156,
    inStock: false,
    isNew: false,
    category: 'sale'
  },
  {
    id: 6,
    name: 'Labubu Night Sky',
    price: 87.99,
    originalPrice: null,
    image: '/images/labubu-black.webp',
    rating: 4.8,
    reviews: 91,
    inStock: true,
    isNew: false,
    category: 'classic'
  },
  {
    id: 7,
    name: 'Crystal Labubu',
    price: 179.99,
    originalPrice: null,
    image: '/images/generated-image-03.webp',
    rating: 4.9,
    reviews: 45,
    inStock: true,
    isNew: true,
    category: 'limited'
  },
  {
    id: 8,
    name: 'Labubu Winter Collection',
    price: 92.99,
    originalPrice: 115.99,
    image: '/images/generated-image-02.webp',
    rating: 4.7,
    reviews: 78,
    inStock: true,
    isNew: false,
    category: 'sale'
  }
])

// Dynamic categories with counts
const categoriesWithCounts = computed(() => {
  const counts: Record<string, number> = {
    all: allProducts.value.length,
    classic: allProducts.value.filter(p => p.category === 'classic').length,
    limited: allProducts.value.filter(p => p.category === 'limited').length,
    new: allProducts.value.filter(p => p.isNew).length,
    sale: allProducts.value.filter(p => p.originalPrice !== null).length
  }

  return categories.value.map(cat => ({
    ...cat,
    count: counts[cat.id] || 0
  }))
})

// Filtered and sorted products
const filteredProducts = computed(() => {
  let filtered = allProducts.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value !== 'all') {
    if (selectedCategory.value === 'new') {
      filtered = filtered.filter(product => product.isNew)
    } else {
      filtered = filtered.filter(product => product.category === selectedCategory.value)
    }
  }

  // Filter by price range
  const activePriceFilters = Object.entries(priceFilters.value).filter(([_, active]) => active)
  if (activePriceFilters.length > 0) {
    filtered = filtered.filter(product => {
      const price = product.price
      return activePriceFilters.some(([filter]) => {
        switch (filter) {
          case 'under50': return price < 50
          case 'from50to100': return price >= 50 && price <= 100
          case 'from100to150': return price > 100 && price <= 150
          case 'over150': return price > 150
          default: return false
        }
      })
    })
  }

  // Filter by availability
  if (availabilityFilters.value.inStock) {
    filtered = filtered.filter(product => product.inStock)
  }
  if (availabilityFilters.value.sale) {
    filtered = filtered.filter(product => product.originalPrice !== null)
  }

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    switch (selectedSort.value) {
      case 'newest':
        return b.isNew ? 1 : a.isNew ? -1 : 0
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
      default:
        return b.reviews - a.reviews
    }
  })

  return sorted
})

// Current category name
const currentCategoryName = computed(() => {
  const category = categoriesWithCounts.value.find(cat => cat.id === selectedCategory.value)
  return category?.name || 'All Products'
})

// Clear all filters function
const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedSort.value = 'popular'
  priceFilters.value = {
    under50: false,
    from50to100: false,
    from100to150: false,
    over150: false
  }
  availabilityFilters.value = {
    inStock: false,
    preorder: false,
    sale: false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl lg:text-6xl font-bold mb-4">Labubu Collection</h1>
        <p class="text-xl text-pink-100 max-w-2xl mx-auto">
          Explore our complete collection of adorable Labubu characters. From classic favorites to limited editions.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:w-1/4">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div class="relative">
                <input v-model="searchQuery" type="text" placeholder="Search Labubu..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div class="space-y-2">
                <button v-for="category in categoriesWithCounts" :key="category.id"
                  @click="selectedCategory = category.id" :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex justify-between items-center',
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]">
                  <span>{{ category.name }}</span>
                  <span class="text-sm opacity-75">({{ category.count }})</span>
                </button>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input type="checkbox" id="under50" v-model="priceFilters.under50"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="under50" class="text-gray-700">Under $50</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="50to100" v-model="priceFilters.from50to100"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="50to100" class="text-gray-700">$50 - $100</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="100to150" v-model="priceFilters.from100to150"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="100to150" class="text-gray-700">$100 - $150</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="over150" v-model="priceFilters.over150"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="over150" class="text-gray-700">Over $150</label>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input type="checkbox" id="instock" v-model="availabilityFilters.inStock"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="instock" class="text-gray-700">In Stock</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="preorder" v-model="availabilityFilters.preorder"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="preorder" class="text-gray-700">Pre-order</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" id="sale" v-model="availabilityFilters.sale"
                    class="mr-2 text-pink-600 focus:ring-pink-500">
                  <label for="sale" class="text-gray-700">On Sale</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:w-3/4">
          <!-- Sort and Results -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ currentCategoryName }}</h2>
              <p class="text-gray-600">Showing {{ filteredProducts.length }} results</p>
            </div>
            <select v-model="selectedSort"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Products Grid -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8a2 2 0 00-2-2H7a2 2 0 00-2 2v6.5">
                </path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button @click="clearAllFilters"
              class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
              Clear All Filters
            </button>
          </div>

          <!-- Load More -->
          <div class="text-center mt-12">
            <button
              class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              Load More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
