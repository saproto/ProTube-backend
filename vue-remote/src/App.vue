<template>
    <div v-if="currentRoute == 'Screen' || currentRoute == 'Admin Screen'">
        <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || ''">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
    <div v-else class="xl:max-w-screen-2xl mx-auto md:pt-8 sm:pt-0">
        <router-view />
    </div>
</template>

<script setup>
import { connectAdminSocket } from "@/js/admin_socket";
import { connectUserSocket } from "@/js/user_socket";
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { eventBus } from '@/js/eventbus'

const router = useRouter();
const currentRoute = computed(() => {
    return useRoute().name
});

// authenticator wants to init a socket connection
eventBus.on('authenticator-admin-connect-attempt', () => {
    connectAdminSocket();
});

// authenticator wants to init a socket connection
eventBus.on('authenticator-user-connect-attempt', () => {
    connectUserSocket();
});

// on disconnect redirect to login page to reauthenticate
eventBus.on('admin-socket-disconnect', () => {
    console.log(currentRoute);
    router.push({name: 'Login', params: {
        targetPath: currentRoute.value,
        requests_admin: true
    }})
});

// on disconnect redirect to login page to reauthenticate
eventBus.on('user-socket-disconnect', () => {
    router.push({name: 'Login', params: {
        targetPath: currentRoute.value,
        requests_admin: false
    }})
});

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>