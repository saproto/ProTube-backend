<template>
    <div>
        <div class=" xl:max-w-screen-2xl  mx-auto md:pt-8 sm:pt-0">
            <transition name="search" mode="out-in" appear>
                <SearchDiv />
            </transition>
            <transition name="results" mode="out-in" appear>
                <ResultsDiv />
            </transition>
        </div>
        <transition name="modal" appear >
            <LoginModal v-if="loginModalVisible" />
        </transition>
    </div>
</template>

<script setup>
import SearchDiv from './components/SearchDiv.vue'
import ResultsDiv from './components/ResultsDiv.vue'
import LoginModal from './components/LoginModal.vue'
import { eventBus, initializeSocket } from './socket'
import { onMounted, ref } from 'vue'

const loginModalVisible = ref(true);

onMounted(() => {
    initializeSocket();
});

eventBus.on('toggleLoginModalVisible', (visible) => {
    loginModalVisible.value = visible;
});


</script>

<style >
.search-enter-from {
    opacity: 0;
    transform: translateY(-100px);
}
.search-enter-to {
    opacity: 1;
    transform: translateY(0);
}
.search-enter-active {
    transition: all 1s ease;
}

.results-enter-from {
    opacity: 0;
    transform: translateY(-250px);
}
.results-enter-to {
    opacity: 1;
    transform: translateY(0);
}
.results-enter-active {
    transition: all 1s ease;
}

.modal-enter-from {
    opacity: 0;
}
.modal-enter-to {
    opacity: 1;
}
.modal-enter-active {
    transition: all .5s ease;
}
.modal-leave-from {
    opacity: 1;
}
.modal-leave-to {
    opacity: 0;
}
.modal-leave-active {
    transition: all 1s ease;
}

</style>