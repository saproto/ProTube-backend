<template>
    <div> 
        <HeaderField>
            <UserDetails :username="username" />
        </HeaderField>
        
        <ContentField>
            t
        </ContentField>
        
        <Authenticator :admin="true" />
    </div>
</template>

<script setup>
import Authenticator from '@/components/Authenticator.vue'
import HeaderField from '@/layout/HeaderField.vue'
import ContentField from '@/layout/ContentField.vue'
import UserDetails from '@/components/UserDetails.vue'
import { eventBus } from '../eventbus'
import { getUserData } from '@/admin_socket.js'
import { ref } from 'vue'

const username = ref("");

eventBus.on('admin-socket-connect-success', async () => {
    var userdata = await getUserData();
    username.value = userdata.username;
});
</script>

<style>
</style>