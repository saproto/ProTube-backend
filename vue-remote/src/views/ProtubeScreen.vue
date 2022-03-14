<template>
  <div v-if="screenCode" aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start">
    <div class="w-full flex flex-col items-center space-y-4">
      <div class="max-w-sm bg-white dark:bg-proto_secondary_gray-dark shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex text-2xl text-center">
            {{ screenCode }}
          </div>
        </div>
      </div>  
    </div>
  </div>
  <RadioModal v-show="currentRadio" :radio="currentRadio" />
  <div class="min-w-screen min-h-screen" id='yt-player' />
</template>

  
<script setup>
import { defineProps, ref } from 'vue'
import '@/screen3.js'
import { eventBus } from '@/eventbus.js';
import RadioModal from '@/components/modals/RadioModal.vue'

const currentRadio = ref("");

defineProps({
  screenCode: Number
})

let scripts = [
  'http://localhost:3000/socket.io/socket.io.min.js',
  // process.env.VUE_APP_PUBLIC_PATH + '/js/screen.js',
  'https://www.youtube.com/iframe_api'
];
for(let i = 0; i < scripts.length; i++){
  let externalScript = document.createElement('script');
  externalScript.setAttribute('src', scripts[i]);
  document.head.appendChild(externalScript);
}

eventBus.on('radio_playing', (radio) => {
  console.log("radio change");
  currentRadio.value = radio;
  console.log(currentRadio.value);
  console.log("Radio changed");
});
</script>