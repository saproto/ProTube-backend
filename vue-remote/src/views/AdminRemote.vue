<template>
    <div> 
        <HeaderField>
            <UserDetails />
        </HeaderField>
        
        <ContentField>
            t
        </ContentField>
        

        <transition name="modal" appear>
            <LoadModal v-if="authModalVisible" message="Authenticating..." opacity=100 />
        </transition>

        <transition name="modal" appear>
            <NoCookieModal v-if="noCookieModal"/>
        </transition>

        <transition name="modal" appear>
            <ErrorModal v-if="errormessage" :message="errormessage" :key="errormessage" />
        </transition>

    </div>
</template>

<script setup>
import HeaderField from '@/layout/HeaderField.vue'
import UserDetails from '@/components/UserDetails.vue'
import ContentField from '@/layout/ContentField.vue'
import LoadModal from '../components/modals/LoadModal.vue'
import NoCookieModal from '../components/modals/NoCookieModal.vue'
import ErrorModal from '../components/modals/ErrorModal.vue'
import { onMounted, ref } from 'vue'
import { eventBus } from '../eventbus'
import { connectSocket } from '../admin_socket'

const authModalVisible = ref(true);
const noCookieModal = ref(false);
const errormessage = ref(false);

onMounted(() => {
    checkForSessionCookie();
});

// check if the session contains a proto_session cookie, if so, attempt to connect
function checkForSessionCookie(){
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++){
        let cookie = cookies[i].split('=');
        if( cookie[0].includes('proto_session')){
            connectSocket(cookie[1]);
            return;
        }
    }
    noCookieModal.value = true;
    authModalVisible.value = false;
}

eventBus.on('admin-socket-connect-error', (reason) => {
    errormessage.value = reason.reason;
});

eventBus.on('admin-socket-connect-success', () => {
    authModalVisible.value = false;
});

</script>

<style>
</style>