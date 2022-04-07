<template>
    <div> 
        <transition name="modal">
            <LoadModal message="Authenticating..." :opacity="100" />
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
import LoadModal from '@/components/modals/LoadModal.vue'
import NoCookieModal from '@/components/modals/NoCookieModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import { logInUser, logInAdmin, socketDetails } from '@/js/authenticator'
import { defineProps, ref, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { eventBus } from '@/js/eventbus'

const noCookieModal = ref(false);
const errormessage = ref(false);

const props = defineProps({
    'targetPath': String,
    'requests_admin': Boolean
});
const router = useRouter();

// bug: op /remote/login krijgt ie smh nog een redirect naar undefined

// executed each time the screen is shown again
onActivated(() => {
    //if usersocket is already present we can still upgrade to admin sockets
    let socketData = socketDetails();
    if(!socketData.user_socket.connected) return logInUser();
    else if(props.requests_admin) logInAdmin();
})


eventBus.on('adminsocket-connect-error', (reason) => {
    logInError(reason);
});

eventBus.on('usersocket-connect-error', (reason) => {
    logInError(reason);
});

eventBus.on('adminsocket-connect-success', () => {
    router.push({ name: props.targetPath } )
    errormessage.value = "";
});

eventBus.on('usersocket-connect-success', () => {
    if(props.requests_admin) logInAdmin();
    else router.push({ name: props.targetPath || "Remote"} );
    errormessage.value = "";
});


function logInError(reason){
    if(reason == "Login error!"){
        noCookieModal.value = true;
        errormessage.value = "";
    } else {
        errormessage.value = reason;
    }
}
</script>