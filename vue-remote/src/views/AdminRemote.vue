<template>
    <div> 
        <HeaderField>
            <UserDetails />
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

eventBus.on('admin-socket-connect-success', () => {
    //retrieveCurrentSetting()
});
</script>

<style>
</style>