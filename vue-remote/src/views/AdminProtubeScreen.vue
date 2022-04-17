<template>
    <ProtubeScreen :screenCode="screenCode" />
</template>

<script setup>
import ProtubeScreen from '@/views/ProtubeScreen.vue'
// import Authenticator from '@/components/Authenticator.vue'
// import { eventBus } from '@/js/eventbus.js'
import { getScreenCode, socket } from '@/js/admin_socket.js'
import { ref, onMounted } from 'vue'

const screenCode = ref('0000');

onMounted(async () => {
    screenCode.value = await getScreenCode();
    // mountListeners();
})

socket.on('admin-new-screen-code', (newCode) => {
    screenCode.value = newCode;
})

// onUnmounted(() => {
//     unMountListeners();
// })
// // Only use an eventlistener once and mount it when the page mounts 
// // and unmount it when the page unmounts
// function mountListeners(){
//     eventBus.on('screensocket-new-screencode', (screencode) => {
//         screenCode.value = screencode;
//     });
// }

// function unMountListeners(){
//     eventBus.off('screensocket-new-screencode')
// }

</script>