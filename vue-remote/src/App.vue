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
// import { connectAdminSocket } from "@/js/admin_socket";
// import { connectUserSocket } from "@/js/user_socket";
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { setCurrentRoute } from '@/js/authenticator'
import { eventBus } from '@/js/eventbus'

const router = useRouter();
const currentRoute = computed(() => {
    const path = useRoute().name;
    setCurrentRoute(path);
    return path;
});

eventBus.on('authenticator-router-push', (route) => {
    router.push(route);
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