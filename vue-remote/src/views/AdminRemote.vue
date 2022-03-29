<template>
    <div> 
        <transition name="search" mode="out-in">
            <HeaderField>
                <div class="md:flex-1">
                    <h3 class=" leading-6 font-medium text-white text-2xl">ProTube admin panel</h3>
                    <div class="mt-2 max-w-xl text-sm text-gray-200 ">
                        <p>With great power comes great responsibility</p>
                    </div>
                    <h2 class="mt-4 leading-6 font-medium text-white md:text-6xl text-3xl">Welcome {{ name }}</h2>
                </div>
                <HeaderFieldButtons screen adminscreen remote/>
            </HeaderField>
        </transition>
        <transition name="results" mode="out-in" appear>
            <ContentField>
                <div class="md:flex">
                    <label class="text-gray-600 dark:text-white text-2xl absolute"> Master Controls</label>
                    <div class="w-full md:w-1/3">
                        <p class=" text-right md:text-center text-md text-gray-500 dark:text-white w-full "> Volume Slider</p>
                        <input @change="volumeSliderMoved" class="bg-proto_blue hover:bg-opacity-80 rounded-xl h-2 w-full border outline-none border-gray-500 appearance-none" type="range" min="1" max="100" :value="volumeCalculated">
                        <font-awesome-icon class="cursor-pointer text-2xl mx-2 text-gray-600 dark:text-white" icon="backward" />
                        <font-awesome-icon v-if="playing" @click="resumeProtube" class="cursor-pointer text-2xl mx-2 text-gray-600 dark:text-white" icon="pause" />
                        <font-awesome-icon v-else @click="resumeProtube" class="cursor-pointer text-2xl mx-2 text-gray-600 dark:text-white" icon="play" />
                        <font-awesome-icon @click="skipToNext" class="cursor-pointer text-2xl mx-2 text-gray-600 dark:text-white" icon="forward" />
                    </div>
                    <div class="flex">
                        <button @click="skipToNext" class="shadow-md bg-proto_blue hover:bg-opacity-80 text-white py-1 px-2 ml-5 rounded-md my-auto flex">
                            QuickSkip
                            <svg xmlns="http://www.w3.org/2000/svg" class=" h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button @click="regenScreenCode" class="shadow-md bg-proto_blue hover:bg-opacity-80 text-white py-1 px-2 ml-5 rounded-md my-auto flex">
                            New code
                        </button>
                        <button @click="resumeProtube" class="shadow-md bg-proto_blue hover:bg-opacity-80 text-white py-1 px-2 ml-5 rounded-md my-auto flex">
                            Resume ProTube
                        </button>
                        <router-link to="/screen/admin" class="text-center py-2 px-4 bg-proto_blue text-white hover:opacity-80 rounded-md">Admin screen</router-link>
                    </div>
                </div>
            </ContentField>
        </transition>
        <transition name="results" mode="out-in" appear>
            <ContentField>
                <label class="text-gray-600 dark:text-white text-2xl absolute"> Radiostations</label>
                <input minlength="1" v-model="radiofilter" class="bg-white min-w-min placeholder-gray-500  focus:placeholder-gray-600  text-gray-700 pl-2 rounded-md border border-gray-400 outline-none ml-48" placeholder="Filter"/>
                <div class="flex overflow-x-scroll pt-10 no-scrollbar">
                    <div class="flex flex-nowrap ">
                        <Suspense>
                            <template #default>
                                <RadioStations v-on:added-radio="displayToast" :radiofilter="radiofilter" />
                            </template>
                            <template #fallback>
                                <div v-for="index in 10" :key="index" class="inline-block px-3">
                                    <div class="p-4 w-48 truncate overflow-hidden rounded-lg shadow-md bg-proto_blue animate-pulse text-white hover:bg-opacity-80">
                                        <div class="bg-gray-100 rounded-md w-28 p-3 animate-pulse" />
                                    </div>
                                </div>
                            </template>
                        </Suspense>
                    </div>
                </div>
            </ContentField>
        </transition>

        <transition name="results" mode="out-in" appear>
            <ContentField>
                <label class="text-gray-600 dark:text-white text-2xl absolute"> The current Queue - {{ total_queue_duration }}</label>
                    <div class="flex overflow-x-scroll pt-10 no-scrollbar">
                        <div class="flex flex-nowrap h-full">
                            <div v-for="(result, index) in videoqueue" :result="result" :index="index" :key="result.videoId" class="inline-block px-3 w-96 h-full" >
                                <div :style='{background: "url("+result.thumbnail+")"}' style="background-repeat: no-repeat; background-size: cover; background-position: center center;" class="col-span-1 flex group flex-col text-center  border-proto_blue border-l-4 rounded-sm shadow"> <!--divide-y dark:divide-proto_green divide-gray-500-->
                                    <div class="flex-1 rounded-m border-t border-b border-r dark:border-gray-800 border-gray-400 flex flex-col px-8 py-4 bg-white dark:bg-true_gray-800 bg-opacity-80">
                                        <h3 class="font-bold dark:text-true_gray-300 text-gray-800 text-left text-md">{{ result.title }}</h3>
                                        <div class="mt-auto w-full">
                                            <div class="flex-1 text-gray-900 justify-bottom align-bottom mt-auto flex text-right ">
                                            <svg class="align flex-shrink-0 mr-1.5 h-5 w-5 dark:text-true_gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span class="text-gray-900 dark:text-true_gray-300 text-sm font-medium truncate">{{ result.author.name }}</span>
                                            </div>
                                            <div class="flex-1 text-gray-900 mt-0 flex text-right ">
                                            <svg class="flex-shrink-0 mr-1.5 h-5 w-5 dark:text-true_gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                                            </svg>
                                            <span class="text-gray-900 dark:text-true_gray-300 text-sm font-medium truncate">{{ result.timestamp }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="videoqueue.length < 1" class="text-gray-400 ml-8"> Empty queue </div>
                        </div>
                    </div>
            </ContentField>
        </transition>
        
        <div aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start">
            <div class="w-full flex flex-col items-center space-y-4">
                <transition-group name="list">
                    <Toast v-for="item in toasts" :video="item" :message="item" :key="item"/>
                </transition-group>
            </div>
        </div>

    </div>
</template>

<script setup>
import HeaderField from '@/layout/HeaderField.vue'
import HeaderFieldButtons from '@/components/HeaderFieldButtons.vue'
import ContentField from '@/layout/ContentField.vue'
import Toast from '@/components/Toast.vue'
import RadioStations from '@/components/RadioStations.vue'
import { eventBus } from '@/js/eventbus'
import { getUserData, getVideoQueue, regenScreenCode, skipNextInQueue, resumeProTube, volumeChange } from '@/js/admin_socket.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const name = ref("");
const radiofilter = ref("");
const videoqueue = ref([]);
const toasts = ref([]);
const volumeCalculated = ref(50);
const playing = ref(false);

const total_queue_duration = computed(() => {
    var totalseconds = 0;
    videoqueue.value.forEach((video) => {
        totalseconds += video.duration.seconds;
    });
    var date = new Date(null);
    date.setSeconds(totalseconds);
    return date.toISOString().substr(11, 8);
});

function displayToast(message){
    toasts.value.push(message);
    setTimeout(() => {
        var index = toasts.value.indexOf(message);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }, 2500);
}

onMounted(async () => {
    mountListeners();
    var userdata = await getUserData();
    var _videoqueue = await getVideoQueue();
    videoqueue.value = _videoqueue
    name.value = userdata.name;
});

onUnmounted(() => {
    unMountListeners();
})

async function volumeSliderMoved(event){
    console.log(event.target.value);
    if(await volumeChange(event.target.value)) displayToast("Successfully changed the volume!");
    else displayToast("Failed to change volume!");
}

async function resumeProtube(){
    if(await resumeProTube()) {
      displayToast("Successfully resumed ProTube!");
      playing.value = true;
    }
    else {
      displayToast("Failed to resume ProTube!");
      playing.value = false;
    }
}
// Only use an eventlistener once and mount it when the page mounts 
// and unmount it when the page unmounts
function mountListeners(){
    // a change in volume 
    eventBus.on('to-adminremote-from-adminsocket-new-volume', (volume) => {
        volumeCalculated.value = volume;
    });

    eventBus.on('to-adminremote-from-adminsocket-queue-update', (queue) => {
        videoqueue.value = queue;
    });

    eventBus.on('to-adminremote-from-adminsocket-screencode-update', (code) => {
        displayToast('New screen code: '+code);
    });
}
function unMountListeners(){
    eventBus.off('to-adminremote-from-adminsocket-new-volume');
    eventBus.off('to-adminremote-from-adminsocket-queue-update');
    eventBus.off('to-adminremote-from-adminsocket-screencode-update');
}

async function skipToNext(){
    if(await skipNextInQueue()){
       displayToast('Skipped first video!'); 
    } else {
        displayToast('Failed to skip first video!');
    }
}

</script>

<style>

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>