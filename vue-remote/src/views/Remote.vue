<template>
    <div>
        <transition name="search" mode="out-in" appear>
            <SearchWrapper />
        </transition>
        <transition name="results" mode="out-in" appear>
            <ResultsWrapper />
        </transition>
        <ToastModal />
        <transition name="modal" appear >
            <LoginModal v-if="loginModalVisible" />
        </transition>
        <transition name="modal" appear >
            <LoadModal :opacity="70" v-if="loadModalVisible && !loginModalVisible" />
        </transition>
    </div>
</template>


<script setup>
import SearchWrapper from '../components/SearchWrapper.vue'
import ResultsWrapper from '../components/ResultsWrapper.vue'
import LoginModal from '../components/modals/LoginModal.vue'
import LoadModal from '../components/modals/LoadModal.vue'
import ToastModal from '../components/modals/ToastsModal.vue'
import { initializeSocket } from '../socket'
import { eventBus } from '../eventbus'
import { onMounted, ref } from 'vue'

const loginModalVisible = ref(true);
const loadModalVisible = ref(false);

onMounted(() => {
    initializeSocket();
});

//intercept events for modal toggling
eventBus.on('toggleLoginModalVisible', (visible) => {
    loginModalVisible.value = visible;
    loadModalVisible.value = false;
});

eventBus.on('addVideoToQueue', ()=> {
    loadModalVisible.value = true;
});

eventBus.on('displayVideos', ()=> {
    loadModalVisible.value = false;
});

eventBus.on('fetchVideos', () => {
    loadModalVisible.value = true;
});

eventBus.on('addVideoToQueue-callback', ()=> {
    loadModalVisible.value = false;
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