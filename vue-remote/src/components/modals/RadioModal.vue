<template>
    <div class="fixed z-50 inset-0 overflow-y-auto sm:-to" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center h-4/6 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-proto_background_gray-dark transition-opacity" aria-hidden="true"></div>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block text-center transform transition-all align-middle ">
              <label class="text-white text-8xl"> {{ radio.o }} </label>
              <br />
              <audio id="radio" autoplay :src="radio.m" frameborder="0" width="400" height="200"></audio>
              <!--<iframe allow="autoplay" :src="radio.m" id="radio" width="400" height="200"></iframe> -->
              <button v-if="playButton" class="shadow-md bg-proto_blue hover:bg-opacity-80 text-white py-1 px-2 ml-5 rounded-md my-auto flex" @click="playClick"> play audio </button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, watch } from 'vue';

const playButton = ref(false);
const props = defineProps({
    radio: Object,
    volume: {
        type: Number,
        default: -1
  }
});

if(navigator.userAgent.indexOf("Firefox")){
    playButton.value = true;
}

// if already playing hide play button
onMounted(() => {
    document.getElementById('radio').onloadstart = function() {
        setTimeout(() => {
            if(!document.getElementById('radio').paused){
            playButton.value = false;
        }
        }, 2000);
    }

    // enabling volume control via prop watcher
    if(props.volume > -1){
        document.getElementById('radio').volume = props.volume/100;
        // eslint-disable-next-line
        watch(() => props.volume, (to, from) => {
            const newVolume = to/100; //Volume ranges 0-100, audio tag accepts 0-1
            document.getElementById('radio').volume = newVolume;
        });
    }
});

function playClick(){
    document.getElementById('radio').play();
    playButton.value = false;
}
</script>
