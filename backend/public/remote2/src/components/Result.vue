<template >
<transition name="result" appear>
    <li class="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
    <div class="flex-1 flex flex-col px-8 pt-8 pb-4">
      <!-- ToDo: bij image per breakpoint hoogte instellen -->
      <img class="w-full h-48 object-cover flex-shrink-0 mx-auto rounded-md drop-shadow-lg" :src="result.thumbnail" alt="">
      <h3 class="mt-4 font-bold text-gray-900 text-md font-medium truncate">{{ result.author.name }}</h3>
      <h3 class="text-gray-700 text-sm font-medium truncate">{{ result.title }}</h3>
      <div class=" mt-1 flex ">
        <div class="flex flex-1 justify-end">
          <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2 ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="truncate text-custom_blue2">{{ result.timestamp }}</span>
        </div>
        <span class="truncate px-2  w-8 text-center justify-center ">-</span>
        <div class="flex-1 flex text-right ">
          <svg class="align flex-shrink-0 mr-1.5 h-5 w-5 text-custom_blue2 ml-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="truncate text-custom_blue2 ">{{ viewsFormatted }}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="-mt-px flex divide-x divide-gray-200">
        <div class="w-0 flex-1 flex">
          <a @click="removeVideo" class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium rounded-b-lg hover:bg-custom_blue2 hover:text-custom_gray">
            <!-- Heroicon name: solid/mail -->
            <svg class="h-5 w-5 text-gray-400 group-hover:rotate-90 group-hover:transition group-hover:duration-200 group-hover:text-custom_blue2 group-hover:ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="ml-3 text-md">Add to playlist</span>
          </a>
        </div>
      </div>
    </div>
  </li> 
</transition>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const _result = defineProps({
  result: Object,
  index: Number
});

const viewsFormatted = computed(() => {
  const views =  _result.result.views;
  if(views > 999 && views < 1000000){
        return (views/1000).toFixed(1) + 'k';
    }else if(views > 1000000){
        return (views/1000000).toFixed(1) + 'M';
    }
  return views;
});

</script>

<style>

.result-enter-active {
  animation: bounce-in 1s ease;
}

@keyframes bounce-in {
  0% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>