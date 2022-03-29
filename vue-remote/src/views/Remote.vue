<template>
    <div>
        <transition name="search" mode="out-in" appear>
            <SearchWrapper 
                v-on:fetch-videos="fetchVideos" 
            />
        </transition>
        <transition name="results" mode="out-in" appear>
            <ResultsWrapper 
                :videos="found_videos"
            />
        </transition>
        <ToastModal />
        <transition name="modal" appear >
            <LoginModal v-if="loginModalVisible" />
        </transition>
        <transition name="modal" appear >
            <LoadModal :message="loadModalMessage" :opacity="70" v-if="loadModalVisible && !loginModalVisible" />
        </transition>
    </div>
</template>


<script setup>
import SearchWrapper from '@/components/SearchWrapper.vue'
import ResultsWrapper from '@/components/ResultsWrapper.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import LoadModal from '@/components/modals/LoadModal.vue'
import ToastModal from '@/components/modals/ToastsModal.vue'
import { initializeSocket, killSocket, fetchVideosSocket } from '@/js/remote_socket'
import { eventBus } from '@/js/eventbus'
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

const loginModalVisible = ref(true);
const loadModalVisible = ref(false);
const loadModalMessage = ref("");
const found_videos = ref([]);

onMounted(() => {
    mountListeners();
    initializeSocket();
});

onUnmounted(() => {
    unMountListeners();
});

// purposely kill socket on page leave to prevent duplicate sockets
onBeforeUnmount(() =>{
    killSocket();
});

// Only use an eventlistener once and mount it when the page mounts 
// and unmount it when the page unmounts
function mountListeners(){
    //intercept events for modal toggling
    eventBus.on('to-remote-from-remotesocket-toggle-loginmodal-visibility', (visible) => {
        loginModalVisible.value = visible;
        loadModalVisible.value = false;
    });
}

function unMountListeners(){
    eventBus.off('to-remote-from-remotesocket-toggle-loginmodal-visibility');
}

async function fetchVideos(search_string){
    loadModalVisible.value = true;
    loadModalMessage.value = `Searching for ${search_string}...`;
    found_videos.value = await fetchVideosSocket(search_string);
    loadModalVisible.value = false;
}
    
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