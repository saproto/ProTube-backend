<template>
  <div>
    <div class="bg-custom_gray shadow md:rounded-sm">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 text-2xl">Protube playlist panel</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>Search for any song on Youtube and add it to the protube playlist</p>
        </div>
        <form @submit="fetchVideos" onsubmit="return false" class="mt-5 flex lg:w-2/4 sm:items-center">
          <div class="w-full group md:max-w-md">
            <input minlength="1" v-model="search_string" class="outline-none w-full pl-2 border-b border-custom_blue2" placeholder="Title, author etc of any song"/>
          </div>
          <button :disabled="!search_string" :class="search_string ? 'hover:bg-opacity-70' : 'opacity-40'" class="-mt-1 ml-4 inline-flex items-center justify-center px-4 py-1 border border-transparent shadow-sm font-medium rounded-md text-white bg-custom_blue2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 md:ml-3 md:w-auto ">
            <svg class="w-5 h-5 mr-2" id="searchIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Search
          </button>
          <div id="searchErrorField">

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { eventBus } from '../socket'

const search_string = ref("");

function fetchVideos() {
  if(search_string.value != ''){
    eventBus.emit('fetchVideos', search_string.value);
  }
}

</script>
