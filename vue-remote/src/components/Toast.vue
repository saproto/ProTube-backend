<template>
    <div class="max-w-sm w-full bg-white dark:bg-proto_secondary_gray-dark shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div class="p-4">
        <div class="flex items-center">
          <div class="w-0 flex-1 flex justify-between">
            <!-- Heroicon name: check/success -->
            <div v-if="data.type === 'video'"> 
              <svg v-show="data.video.result == 1" class="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>

              <!-- Heroicon name: warning/duplicate -->
              <svg v-show="data.video.result == 0" class="w-5 h-5 mr-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>

              <!-- Heroicon name: cross/error -->
              <svg v-show="data.video.result == -1 && video.result != 1" class="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>

            <p class="w-0 flex-1 text-sm font-medium text-gray-900 dark:text-gray-50">
              {{ textMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>    
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  data: Object
});

const textMessage = ref("");

onMounted(() => {
  switch(props.data.type) {
    case 'message':
      textMessage.value = props.data.message;
      break;
    case 'video':
      textMessage.value = props.data.video.message;
      break;
  }
});

</script>
