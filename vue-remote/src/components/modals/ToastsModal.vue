<template>
    <div aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start">
        <div class="w-full flex flex-col items-center space-y-4">
            <transition-group name="list">
                <Toast v-for="videoUpdate in statusUpdates" :video="videoUpdate" :key="videoUpdate.videoId"/>
            </transition-group>
        </div>
    </div>
</template>

<script setup>
import Toast from '@/components/Toast.vue'
import { eventBus } from '@/js/eventbus'
import { ref, onMounted, onUnmounted } from 'vue'

const statusUpdates = ref([]);

onMounted(() => {
  mountListeners();
});

onUnmounted(() => {
  unMountListeners();
})

// Only use an eventlistener once and mount it when the page mounts 
// and unmount it when the page unmounts
function mountListeners(){
  eventBus.on('to-toastsmodal-from-result-add-toast', response => {
      statusUpdates.value.push(response);
      setTimeout(() => {
          for( var i = 0; i < statusUpdates.value.length; i++){ 
              if ( statusUpdates.value[i].videoId === response.videoId) statusUpdates.value.splice(i, 1); 
          }
      }, 2500);
  });
}

function unMountListeners(){
  eventBus.off('to-toastsmodal-from-result-add-toast');
}
</script>

<style>
   /* list transitions */
  .list-enter-from {
    opacity: 0;
    transform: scale(0.6);
  }
  .list-enter-active {
    transition: all 0.4s ease;
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(0.6);
  }
  .list-leave-active {
    transition: all 0.4s ease;
    position: absolute; /* for move transition after item leaves */
  }
  .list-move {
    transition: all 0.3s ease;
  }
</style>