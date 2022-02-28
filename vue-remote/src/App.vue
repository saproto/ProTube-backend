<template>
    <div v-if="currentRoute == 'Screen' || currentRoute == 'Admin Screen'">
        <router-view />
    </div>
    <div v-else class=" xl:max-w-screen-2xl  mx-auto md:pt-8 sm:pt-0">
        <router-view />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const currentRoute = computed(() => {
    return useRoute().name
})

</script>