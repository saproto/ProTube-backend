<template>
    <div v-for="radio in filteredRadioStations" :key="radio" class="inline-block px-3">
        <button @click="set_radio" :id="radio.id" class="p-4 w-48 truncate overflow-hidden rounded-lg shadow-md bg-proto_blue text-white hover:bg-opacity-80">
            {{ radio.name }}
        </button>
    </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const radiostations = ref([]);
const props = defineProps({
    radiofilter: String
});

const filteredRadioStations = computed(() => {
    return radiostations.value.filter((station) => station.name.toLowerCase().includes(props.radiofilter.toLowerCase()));
})

await getRadioStations();

async function getRadioStations(){
    var all_radiostations = await fetch(`https://prod.radio-api.net/stations/local?count=100`);
    all_radiostations = await all_radiostations.json();

    var all_radiostations_dupe = JSON.parse(JSON.stringify(all_radiostations));

    all_radiostations_dupe.playables.forEach((station, index) => {
        if(!station.playable || station.streams.length == 0){
            all_radiostations.playables.splice(index, 1);
            console.log(station);
        }
    })

    radiostations.value = all_radiostations.playables;
    return true;
} 

function set_radio(event){
    var requested_radio = event.target.id;
    console.log(requested_radio);
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