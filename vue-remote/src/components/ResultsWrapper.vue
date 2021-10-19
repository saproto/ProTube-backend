<template>
  <div class="bg-proto_secondary_gray dark:bg-proto_secondary_gray-dark shadow overflow-hidden md:rounded-sm mt-4"> <!--dark:bg-true_gray-700-->
        <ul role="list" :class="results.length > 0 ? 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : ''" class="grid grid-cols-1 gap-6 m-8">
          <li v-if="results.length === 0">
            <div class="block text-gray-200 ">
              <div class="flex items-center px-4 py-4 sm:px-6">
                <div class="min-w-0 mx-auto flex items-center text-3xl mb-1">
                  <span class="text-white dark:text-proto_background_gray-dark" >Start searching</span>
                  <svg :class="isLoading ? 'animate-bounce' : '' " class="w-14 h-14 mr-2 ml-10 mt-2 text-white dark:text-proto_background_gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </li>
          <Result v-for="(result, index) in results" :result="result" :index="index" :key="result.videoId" />
        </ul>
    </div>
</template>

<script setup>
import Result from './Result.vue'
import { ref } from 'vue'
import { eventBus } from '../socket'

const results = ref([]);
const isLoading = ref(false);

eventBus.on('displayVideos', (videos) => {
  results.value = videos;
  isLoading.value = false;
  return;
});

eventBus.on('fetchVideos', () => {
  isLoading.value = true;
})

</script>

<style>
</style>
