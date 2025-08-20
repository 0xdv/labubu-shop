<script setup lang="ts">
</script>

<template>
  <section class="relative bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0"
        style="background-image: radial-gradient(circle at 25% 25%, #ec4899 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px); background-size: 60px 60px;">
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="text-center lg:text-left">
          <div
            class="inline-flex items-center bg-pink-200 text-pink-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            New Collection Available
          </div>

          <h1 class="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Discover
            <span class="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Labubu
            </span>
            Magic
          </h1>

          <p class="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Immerse yourself in the enchanting world of Labubu collectibles. Each character tells a unique story and
            brings joy to collectors worldwide.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Shop Collection
            </button>
            <button
              class="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
              Watch Story
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">50+</div>
              <div class="text-sm text-gray-600">Unique Characters</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">10K+</div>
              <div class="text-sm text-gray-600">Happy Collectors</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">4.9</div>
              <div class="text-sm text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="relative">
          <div class="relative z-10">
            <!-- Main product showcase -->
            <div
              class="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img src="/images/labubu-pink.webp" alt="Featured Labubu" class="w-full h-80 object-cover rounded-2xl" />
              <div class="mt-6">
                <h3 class="text-2xl font-bold text-gray-900">Limited Edition Pink</h3>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-3xl font-bold text-pink-600">$89.99</span>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">(124)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating elements -->
          <div
            class="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-bounce">
          </div>
          <div
            class="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-60 animate-pulse">
          </div>
          <div
            class="absolute top-1/2 -left-16 w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-70 animate-bounce"
            style="animation-delay: 1s;"></div>
        </div>
      </div>
    </div>
  </section>
</template>
