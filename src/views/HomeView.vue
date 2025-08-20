<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import HeroSection from '../components/HeroSection.vue'

const featuredProducts = ref([
  {
    id: 1,
    name: 'Classic Labubu Pink',
    price: 89.99,
    originalPrice: 109.99,
    image: '/images/labubu-pink.webp',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true
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
    isNew: false
  },
  {
    id: 3,
    name: 'Labubu Ocean Blue',
    price: 84.99,
    originalPrice: 99.99,
    image: '/images/photo-5581.webp',
    rating: 4.7,
    reviews: 156,
    inStock: false,
    isNew: false
  },
  {
    id: 4,
    name: 'Limited Edition Gold Labubu',
    price: 149.99,
    originalPrice: null,
    image: '/images/generated-image-01.webp',
    rating: 5.0,
    reviews: 67,
    inStock: true,
    isNew: true
  },
  {
    id: 5,
    name: 'Labubu Rainbow Edition',
    price: 99.99,
    originalPrice: 119.99,
    image: '/images/labubu.webp',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    isNew: false
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
    isNew: false
  }
])
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Featured Products Section -->
    <section class="py-16 px-4 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Featured Labubu Collection</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our curated selection of the most beloved Labubu characters. Each one brings joy and personality to
          your collection.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-gradient-to-r from-pink-500 to-purple-600 py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-3xl font-bold text-white mb-4">Stay Updated with New Releases</h3>
        <p class="text-pink-100 mb-8 text-lg">
          Be the first to know about new Labubu arrivals, exclusive collections, and special offers.
        </p>
        <div class="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
          <input type="email" placeholder="Enter your email"
            class="flex-1 px-6 py-3 rounded-lg border-0 focus:ring-4 focus:ring-pink-300 focus:outline-none text-gray-900" />
          <button
            class="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
