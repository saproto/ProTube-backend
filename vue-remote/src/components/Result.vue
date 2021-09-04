<template >
<transition @before-enter="beforeEnter" @enter="enter" appear>
    <li class="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
    <div class="flex-1 flex flex-col px-8 pt-8 pb-4">
      <!-- ToDo: bij image per breakpoint hoogte instellen -->
      <img class="w-full h-40 object-cover flex-shrink-0 mx-auto rounded-md shadow-md" :src="result.thumbnail" alt="">
      <h3 class="mt-4 font-bold text-gray-900 text-md">{{ result.title }}</h3>
      <h3 class="text-gray-700 text-sm font-medium truncate">{{ result.author.name }}</h3>
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
          <button :disabled="(videoStatusCode == 0) ? false : true" @click="addVideoToQueue()" :class="generateClasses" class=" group relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm font-medium rounded-b-lg ">
            <!-- Heroicon name: +/nothing -->
            <svg v-show="videoStatusCode == 0" class="h-5 w-5 text-gray-400 group-hover:rotate-90 transform transition group-hover:ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <!-- Heroicon name: check/success -->
            <svg v-show="videoStatusCode == 1" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>

            <!-- Heroicon name: warning/duplicate -->
            <svg v-show="videoStatusCode == 2" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>

            <!-- Heroicon name: cross/error -->
            <svg v-show="videoStatusCode == 3" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="ml-3 text-md">{{ videoStatusMessage }}</span>
          </button>
        </div>
      </div>
    </div>
  </li> 
</transition>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import { eventBus } from '../socket'
import gsap from 'gsap'

const _result = defineProps({
  result: Object,
  index: Number
});

const videoStatusCode = ref(0); //0 = nothing, 1= success, 2=duplicate, 3= error
const videoStatusMessage = ref("Add to playlist");
const loading = ref(false);

const generateClasses = computed(() => {
  if(loading.value){
    return "bg-custom_blue2 text-custom_gray";
  }
  switch (videoStatusCode.value) {
    case 0: //default
      return "text-gray-700 hover:bg-custom_blue2 hover:text-custom_gray";
    case 1: //success
      return "bg-green-700 text-green-500";
    case 2: //duplicate
      return "bg-yellow-400 text-yellow-700";
    case 3: //error
      return "bg-red-500 text-red-900";
  }
  return "text-gray-700 hover:bg-custom_blue2 hover:text-custom_gray";
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

function addVideoToQueue(){
  loading.value = true;
  eventBus.emit('addVideoToQueue', _result.result);
}
eventBus.on('addVideoToQueue-callback', response => {
  loading.value = false;
  if(response.videoId == _result.result.videoId){
    videoStatusCode.value = response.result ? 1 : 2;
    videoStatusMessage.value = response.message;
  }
});


//animations
const beforeEnter = ((el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(-50px)';
});

const enter = ((el, done) => {
  gsap.to(el, {
    opacity: 1,
    ease: "back.out(1.4)",
    y: 0,
    duration: 0.5,
    onComplete: done,
    delay: 0.1*_result.index
  });
});

</script>

<style>

</style>