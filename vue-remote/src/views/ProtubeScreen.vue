<template>
  <RadioModal :volume="volume" v-show="currentRadio" :radio="currentRadio" class="z-0"/>
  <div v-show="screenCodeIsVisible" :class="screenCodeIsVisible ? 'z-10' : ''" aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start">
    <div class="w-full flex flex-col items-center space-y-4">
      <div class="max-w-sm bg-white dark:bg-proto_secondary_gray-dark shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex text-2xl text-center dark:text-white">
            {{ screenCode }}
          </div>
        </div>
      </div>
      <div class="self-end max-w-sm bg-white dark:bg-proto_secondary_gray-dark shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex flex-col text-2xl text-center dark:text-white" v-if="currentVideo.title">
            <div>
              Now playing: <br>{{ currentVideo.title }}
            </div>
            <div class="mt-3">
              Added by: {{ addedBy }}
            </div>
          </div>
          <div class="flex text-2xl text-center dark:text-white" v-else>
            Nothing currently playing
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="min-w-screen min-h-screen" id='yt-player' />
</template>

  
<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/js/eventbus.js';
import RadioModal from '@/components/modals/RadioModal.vue'
import { onYouTubeIframeAPIReady, resetYTplayer, killSocket, getNowPlaying } from '@/js/screen_socket.js'

const currentRadio = ref("");
const currentVideo = ref({});
const addedBy = ref("");
const screenCodeIsVisible = ref(false);

const props = defineProps({
  screenCode: {
    type: Number,
    default: -1
  }, volume: {
    type: Number,
    default: -1
  }
})

onMounted(() => {
  // mountListeners();
  if(props.screenCode === -1) screenCodeIsVisible.value = false;
  mountScripts();
  currentVideo.value = getNowPlaying();

  eventBus.on('screensocket-radio-playing', (radio) => {
    currentRadio.value = radio;
    currentVideo.value = {};
    screenCodeIsVisible.value = false;
  });

  eventBus.on('screensocket-video-playing', (video) => {
    currentRadio.value = "";
    currentVideo.value = video;
    addedBy.value = video.user.name;
    if(props.screenCode !== -1) screenCodeIsVisible.value = true;
  });
});

const scripts = [
    `${process.env.VUE_APP_SOCKET_ADDRESS}/socket.io/socket.io.min.js`,
    'https://www.youtube.com/iframe_api',
];

// purposely kill socket on page leave to prevent duplicate sockets
onBeforeUnmount(() =>{
    killSocket();
});

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
</script>