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
import { logInUser, logInAdmin } from '@/js/authenticator'
import { defineProps, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { eventBus } from '@/js/eventbus'

const noCookieModal = ref(false);
const errormessage = ref(false);

const props = defineProps({
    targetPath: String,
    requests_admin: Boolean
});
const router = useRouter();

onMounted(() => {
    console.log("onmounted");
    logInUser();
    mountListeners();
});

onUnmounted(() => {
    unMountListeners();
})
// Only use an eventlistener once and mount it when the page mounts 
// and unmount it when the page unmounts
function mountListeners(){
    eventBus.on('to-loginpage-from-adminsocket-socket-connect-error', (reason) => {
        if(reason.reason == "Login error!"){
            noCookieModal.value = true;
            errormessage.value = "";
        } else {
            errormessage.value = reason.reason;
        }
    });

    eventBus.on('to-loginpage-from-adminsocket-socket-connect-success', () => {
        router.push({ name: props.targetPath } )
        errormessage.value = "";
    });

    eventBus.on('to-loginpage-from-usersocket-socket-connect-success', () => {
        if(props.requests_admin) logInAdmin();
        else router.push({ name: props.targetPath || "Remote"} );
        errormessage.value = "";
    });

    eventBus.on('to-loginpage-from-usersocket-socket-connect-error', (reason) => {
        if(reason.reason == "Login error!"){
            noCookieModal.value = true;
        } else {
            errormessage.value = reason.reason;
        }
    });
}

function unMountListeners(){
    eventBus.off('to-loginpage-from-adminsocket-socket-connect-error');
    eventBus.off('to-loginpage-from-adminsocket-socket-connect-success');
    eventBus.off('to-loginpage-from-usersocket-socket-connect-success');
    eventBus.off('to-loginpage-from-usersocket-socket-connect-error');
}
</script>