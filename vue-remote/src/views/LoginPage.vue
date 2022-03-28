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
// import { logInUser, logInAdmin } from '@/js/authenticator'
import { defineProps, onMounted, ref } from 'vue'
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
    eventBus.emit('authenticator-user-connect-attempt');
})

eventBus.on('admin-socket-connect-error', (reason) => {
    if(reason.reason == "Login error!"){
        noCookieModal.value = true;
        errormessage.value = "";
    } else {
        errormessage.value = reason.reason;
    }
});

eventBus.on('admin-socket-connect-success', () => {
    router.push({ name: props.targetPath } )
    errormessage.value = "";
});

eventBus.on('user-socket-connect-success', () => {
    if(props.requests_admin) eventBus.emit('authenticator-admin-connect-attempt');
    else router.push({ name: props.targetPath || "Remote"} );
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