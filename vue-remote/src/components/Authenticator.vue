<template>
    <div> 
        <transition name="modal" appear>
            <LoadModal v-if="authModalVisible" message="Authenticating..." :opacity="100" />
        </transition>

        <NoCookieModal v-if="noCookieModal"/>

        <transition name="modal" appear>
            <ErrorModal v-if="errormessage" :message="errormessage" :key="errormessage" />
        </transition>

    </div>
</template>

<script setup>
import LoadModal from '../components/modals/LoadModal.vue'
import NoCookieModal from '../components/modals/NoCookieModal.vue'
import ErrorModal from '../components/modals/ErrorModal.vue'
import { defineProps, ref } from 'vue'
import { eventBus } from '../eventbus'
import { connectAdminSocket } from '../admin_socket'
import { connectUserSocket } from '../user_socket'

const authModalVisible = ref(false);
const noCookieModal = ref(true);
const errormessage = ref(false);

const props = defineProps({
  admin: {
      type: Boolean, 
      default: false
    }
});

checkForSessionCookie();

// check if the session contains a proto_session cookie, if so, attempt to connect
function checkForSessionCookie(){
    console.log(props.admin);
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++){
        let cookie = cookies[i].split('=');
        if( cookie[0].includes('proto_session')){
            authModalVisible.value = true;
            noCookieModal.value = false;
            if(props.admin){
                connectAdminSocket(cookie[1]);
                return;
            }
            connectUserSocket(cookie[1]);
            return;
        }
    }
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