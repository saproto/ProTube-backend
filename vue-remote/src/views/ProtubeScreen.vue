<template>
  <RadioModal v-show="currentRadio" :radio="currentRadio" class="z-0"/>
  <div v-show="screenCodeIsVisible" :class="screenCodeIsVisible ? 'z-10' : ''" aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start">
    <div class="w-full flex flex-col items-center space-y-4">
      <div class="max-w-sm bg-white dark:bg-proto_secondary_gray-dark shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex text-2xl text-center dark:text-white">
            {{ screenCode }}
          </div>
        </div>
      </div>  
    </div>
  </div>
  <div class="min-w-screen min-h-screen" id='yt-player' />
</template>

  
<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { eventBus } from '@/js/eventbus.js';
import RadioModal from '@/components/modals/RadioModal.vue'
import { onYouTubeIframeAPIReady, resetYTplayer, killSocket } from '@/js/screen_socket.js'

const currentRadio = ref("");
const screenCodeIsVisible = ref(true);

const props = defineProps({
  screenCode: {
    type: Number,
    default: -1
  }
})

onMounted(() => {
  mountListeners();
  if(props.screenCode === -1) screenCodeIsVisible.value = false;
  mountScripts();
})

const scripts = [
    'http://localhost:3000/socket.io/socket.io.min.js',
    'https://www.youtube.com/iframe_api',
];

// purposely kill socket on page leave to prevent duplicate sockets
onBeforeUnmount(() =>{
    killSocket();
});

onUnmounted(() => {
    unMountListeners();
})

function mountScripts(){
  for(let i = 0; i < scripts.length; i++){
    let script = document.getElementById(`script_${i}`);
    if(script){
        window.YT.ready(() =>{
            resetYTplayer();
            onYouTubeIframeAPIReady();
        });
        return;
    }

    let externalScript = document.createElement('script');
    externalScript.setAttribute('src', scripts[i]);
    externalScript.setAttribute('id', `script_${i}`);
    document.head.appendChild(externalScript);
  }
}
// Only use an eventlistener once and mount it when the page mounts 
// and unmount it when the page unmounts
function mountListeners(){
  eventBus.on('to-protubescreen-from-screensocket-radio-playing', (radio) => {
    currentRadio.value = radio;
    screenCodeIsVisible.value = false;
  });

  eventBus.on('to-protubescreen-from-screensocket-show-screencode', () => {
    if(props.screenCode == -1) return;
    screenCodeIsVisible.value = true;
  });
}

function unMountListeners(){
    eventBus.off('to-protubescreen-from-screensocket-show-screencode')
    eventBus.off('to-protubescreen-from-screensocket-radio-playing')
}
</script>