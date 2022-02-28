<template>
    <ProtubeScreen :screenCode="screenCode" />
    <Authenticator :admin='true' />
</template>

<script setup>
import ProtubeScreen from '@/views/ProtubeScreen.vue'
import Authenticator from '@/components/Authenticator.vue'
import { eventBus } from '@/eventbus.js'
import { getScreenCode } from '@/admin_socket.js'
import { ref } from 'vue'

const screenCode = ref('0000');

eventBus.on('admin-socket-connect-success', async () => {
    screenCode.value = await getScreenCode();
});

eventBus.on('admin-newscreencode', (screencode) => {
   screenCode.value = screencode;
});

</script>