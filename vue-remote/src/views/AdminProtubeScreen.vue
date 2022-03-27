<template>
    <ProtubeScreen :screenCode="screenCode" />
</template>

<script setup>
import ProtubeScreen from '@/views/ProtubeScreen.vue'
// import Authenticator from '@/components/Authenticator.vue'
import { eventBus } from '@/js/eventbus.js'
import { getScreenCode } from '@/js/admin_socket.js'
import { ref, onMounted } from 'vue'

const screenCode = ref('0000');

onMounted(async () => {
    screenCode.value = await getScreenCode();
})

eventBus.on('new-screencode', (screencode) => {
   screenCode.value = screencode;
});

</script>