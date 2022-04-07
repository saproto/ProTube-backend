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
                :videos="foundVideos"
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
import { initializeSocket, fetchVideosSocket, fetchThenAddVideoSocket, fetchThenAddPlaylistSocket} from '@/js/remote_socket'
import { eventBus } from '@/js/eventbus'
import { ref } from 'vue'

const loginModalVisible = ref(true);
const loadModalVisible = ref(false);
const loadModalMessage = ref("");
const foundVideos = ref([]);


initializeSocket();


// On connect sucess you can create socket listeners here
eventBus.on('remotesocket-connect-success', () => {
    setTimeout( () => {
        loginModalVisible.value = false;
        loadModalVisible.value = false;
    }, 1000);
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
    loadModalMessage.value = `Searching for ${query}...`;
    foundVideos.value = await fetchVideosSocket(query);
    loadModalVisible.value = false;
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