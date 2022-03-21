<template>
    <div> 
        <transition name="modal" appear>
            <LoadModal v-if="authModalVisible" message="Authenticating..." :opacity="100" />
        </transition>

        <NoCookieModal v-if="noCookieModal"/>

        <transition name="modal" appear>
            <ErrorModal v-if="errormessage" :key="errormessage" >
                {{ errormessage }}
            </ErrorModal>
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

const authModalVisible = ref(true);
const noCookieModal = ref(false);
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
    if(props.admin){
        connectAdminSocket();
    } else {
        connectUserSocket();
    }
}

eventBus.on('admin-socket-connect-error', (reason) => {
    if(reason.reason == "Login error!"){
        noCookieModal.value = true;
    } else {
        errormessage.value = reason.reason;
    }
    authModalVisible.value = false;
});

eventBus.on('admin-socket-connect-success', () => {
    authModalVisible.value = false;
    errormessage.value = "";
});

eventBus.on('user-socket-connect-success', () => {
    authModalVisible.value = false;
    errormessage.value = "";
});

eventBus.on('user-socket-connect-error', (reason) => {
    if(reason.reason == "Login error!"){
        noCookieModal.value = true;
    } else {
        errormessage.value = reason.reason;
    }
});

</script>

<style>
</style>