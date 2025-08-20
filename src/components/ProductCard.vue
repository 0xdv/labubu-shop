<script setup lang="ts">
import { computed } from 'vue'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number | null
  image: string
  rating: number
  reviews: number
  inStock: boolean
  isNew: boolean
}

const props = defineProps<{
  product: Product
}>()

const discountPercentage = computed(() => {
  if (!props.product.originalPrice) return null
  return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100)
})

const starArray = computed(() => {
  const fullStars = Math.floor(props.product.rating)
  const hasHalfStar = props.product.rating % 1 !== 0
  return { fullStars, hasHalfStar }
})
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
    <!-- Product Image -->
    <div class="relative overflow-hidden">
      <img :src="product.image" :alt="product.name"
        class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />

      <!-- Badges -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <span v-if="product.isNew" class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          New
        </span>
        <span v-if="discountPercentage" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          -{{ discountPercentage }}%
        </span>
      </div>

      <!-- Stock Status -->
      <div v-if="!product.inStock" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <span class="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium">Out of Stock</span>
      </div>

      <!-- Quick Actions -->
      <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button class="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 mb-2 block">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
            </path>
          </svg>
        </button>
        <button class="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
            </path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>

      <!-- Rating -->
      <div class="flex items-center mb-3">
        <div class="flex items-center">
          <svg v-for="star in starArray.fullStars" :key="`full-${star}`" class="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg v-if="starArray.hasHalfStar" class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stop-color="currentColor" />
                <stop offset="50%" stop-color="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span class="ml-2 text-sm text-gray-600">{{ product.rating }} ({{ product.reviews }} reviews)</span>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">
            ${{ product.originalPrice.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button :disabled="!product.inStock" :class="[
        'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform',
        product.inStock
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]">
        {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
