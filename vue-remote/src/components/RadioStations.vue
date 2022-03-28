<template>
    <div v-for="radio in filteredRadioStations" :key="radio" class="inline-block px-3">
        <button @click="set_radio" :id="radio.z" :name="radio.o" class="p-4 w-48 truncate overflow-hidden rounded-lg shadow-md bg-proto_blue text-white hover:bg-opacity-80">
            {{ radio.o }}
        </button>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onBeforeMount } from 'vue'
import { setRadio } from '@/js/admin_socket';


const radiostations = ref([]);
const props = defineProps({
    radiofilter: String
});

const emit = defineEmits(['video-added']);

const filteredRadioStations = computed(() => {
    return radiostations.value.filter((station) => station.o.toLowerCase().includes(props.radiofilter.toLowerCase()));
})

onBeforeMount(async () => {
    // load in the script file that contains all the radio stations
    if(! document.getElementById('radiostations')){
        let externalScript = document.createElement('script');
        externalScript.setAttribute('src', 'https://www.nederland.fm/common/radio/zenders/nederland.js');
        externalScript.setAttribute('id', 'radiostations');
        document.head.appendChild(externalScript);
        externalScript.onload = async () => {
            await getRadioStations();
        }
        return;
    }
    await getRadioStations();
})

async function getRadioStations(){
    let stations = window.zenders;
    radiostations.value = stations.items;
}

async function set_radio(event){
    var requested_radio = event.target.id;
    if(await setRadio(requested_radio)){
        emit('added-radio', `Started playing: ${event.target.name} `)
    } else {
        emit('added-radio', `Failed to start: ${event.target.name} `)
    }
}
</script>

<style>
</style>