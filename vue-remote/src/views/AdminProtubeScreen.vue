<template>
    <ProtubeScreen :screenCode="screenCode" />
</template>

<script setup>
import ProtubeScreen from '@/views/ProtubeScreen.vue'
// import Authenticator from '@/components/Authenticator.vue'
import { eventBus } from '@/js/eventbus.js'
import { getScreenCode } from '@/js/admin_socket.js'
import { ref, onMounted, onUnmounted } from 'vue'

const screenCode = ref('0000');

onMounted(async () => {
    screenCode.value = await getScreenCode();
    mountListeners();
})

onUnmounted(() => {
    unMountListeners();
})
// Only use an eventlistener once and mount it when the page mounts 
// and unmount it when the page unmounts
function mountListeners(){
    eventBus.on('to-adminprotubescreen-from-screensocket-new-screencode', (screencode) => {
        screenCode.value = screencode;
    });
}

function unMountListeners(){
    eventBus.off('to-adminprotubescreen-from-screensocket-new-screencode')
}

</script>