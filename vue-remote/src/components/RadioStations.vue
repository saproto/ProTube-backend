<template>
    <div v-for="radio in filteredRadioStations" :key="radio" class="inline-block px-3">
        <button @click="setRadio" :id="radio.z" :name="radio.o" class="p-4 w-48 truncate overflow-hidden rounded-lg shadow-md bg-proto_blue text-white hover:bg-opacity-80">
            {{ radio.o }}
        </button>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { setRadioSocket, getRadioStationsSocket } from '@/js/admin_socket';


const radioStations = ref(await getRadioStationsSocket());
const props = defineProps({
    radiofilter: String
});

const emit = defineEmits(['video-added']);

const filteredRadioStations = computed(() => {
    return radioStations.value.filter((station) => station.o.toLowerCase().includes(props.radiofilter.toLowerCase()));
});

async function setRadio(event){
    var requested_radio = event.target.id;
    if(await setRadioSocket(requested_radio)){
        emit('added-radio', `Started playing: ${event.target.name} `)
    } else {
        emit('added-radio', `Failed to start: ${event.target.name} `)
    }
}
</script>

<style>
</style>