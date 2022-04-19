<template>
    <div>
        <transition name="search" mode="out-in" appear>
            <SearchWrapper 
                v-on:query-videos="fetchVideos"
                v-on:query-single-video="fetchThenAddVideo"
                v-on:query-playlist="fetchThenAddPlaylist"
            />
        </transition>
        <transition name="results" mode="out-in" appear>
            <ResultsWrapper 
                v-on:display-toast="displayToast"
                :videos="foundVideos"
                :skeletonLoading="resultsWrapperSkeletons"
            />
        </transition>
        <ToastsModal :toasts="toasts"/>
        <transition name="modal" appear >
            <LoginModal v-if="loginModalVisible" />
        </transition>
        <transition name="modal" appear >
            <LoadModal :message="loadModalMessage" :opacity="70" v-if="loadModalVisible && !loginModalVisible" />
        </transition>
        <transition name="results" mode="out-in" appear>
            <CurrentQueue 
                :queueData="queueData"
                :skeletonLoading="queueSkeletonLoading"
            />
        </transition>
    </div>
</template>


<script setup>
import SearchWrapper from '@/components/SearchWrapper.vue'
import ResultsWrapper from '@/components/ResultsWrapper.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import LoadModal from '@/components/modals/LoadModal.vue'
import CurrentQueue from '@/components/CurrentQueue.vue'
import ToastsModal from '@/components/modals/ToastsModal.vue'
import { initializeSocket, fetchVideosSocket, fetchThenAddVideoSocket, fetchThenAddPlaylistSocket } from '@/js/remote_socket'
import { getUserVideoQueueSocket, socket } from '@/js/user_socket'
import { eventBus } from '@/js/eventbus'
import { onMounted, ref } from 'vue'

const loginModalVisible = ref(true);
const loadModalVisible = ref(false);
const resultsWrapperSkeletons = ref(false);
const loadModalMessage = ref("");
const foundVideos = ref([]);
const toasts = ref([]);
const queueData = ref({});
const queueSkeletonLoading = ref(true);

onMounted(async () => {
    initializeSocket();
    const queue = await getUserVideoQueueSocket();
    queueData.value = queue;
    queueSkeletonLoading.value = false;
});


// On connect sucess you can create socket listeners here
eventBus.on('remotesocket-connect-success', () => {
    setTimeout( () => {
        loginModalVisible.value = false;
        loadModalVisible.value = false;
    }, 1000);
});

// there was a change in the queue, update this on the remote
socket.on('user-queue-update', (queue) => {
    queueData.value = queue;
});

function displayToast(message){
    let toastMessage = {
        video: message,
        type: 'video',
        id: Math.random()
    };
    toasts.value.push(toastMessage);
    setTimeout(() => {
        let index = toasts.value.indexOf(toastMessage);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }, 2500);
}

// On connect sucess you can create socket listeners here
eventBus.on('remotesocket-disconnect', () => {
    loginModalVisible.value = true;
});

async function fetchThenAddVideo(videoId) {
  loadModalVisible.value = true;
  loadModalMessage.value = 'Adding video...';
  await fetchThenAddVideoSocket(videoId);
  loadModalVisible.value = false;
}

async function fetchThenAddPlaylist(playlistId) {
  loadModalVisible.value = true;
  loadModalMessage.value = 'Adding videos from playlist...';
  await fetchThenAddPlaylistSocket(playlistId);
  loadModalVisible.value = false;
}

async function fetchVideos(query){
    loadModalVisible.value = true;
    resultsWrapperSkeletons.value = true;
    loadModalMessage.value = `Searching for ${query}...`;
    foundVideos.value = await fetchVideosSocket(query);
    loadModalVisible.value = false;
    resultsWrapperSkeletons.value = false;
}
    
</script>

<style>
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