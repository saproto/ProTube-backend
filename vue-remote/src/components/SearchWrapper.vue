<template>
  <HeaderField>
    <div class="flex-1">
      <h3 class=" leading-6 font-medium text-white text-2xl">ProTube playlist panel</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-200 ">
        <p>Search for any song on YouTube and add it to the ProTube playlist</p>
      </div>
      <form @submit="fetchVideos" onsubmit="return false" class="mt-5 flex  sm:items-center">
        <div class="w-full h-10 flex group md:max-w-md ">
          <input minlength="1" v-model="search_string" class="bg-white min-w-min placeholder-gray-500  focus:placeholder-gray-600  text-gray-700 pl-2 rounded-l-md border border-gray-400 outline-none w-full" placeholder="Search"/>
          <button :disabled="!search_string" :class="search_string ? 'hover:bg-search_button_background hover:border-search_button_border hover:text-white' : 'cursor-default opacity-80'" class="inline-flex items-center mx-auto justify-center p-2 border shadow-sm font-medium rounded-r-md dark:bg-search_button_background-dark dark:border-search_button_background-dark bg-search_button_background-light focus:outline-none focus:bg-search_button_background focus:text-white dark:text-white focus:border-search_button_border">
            <svg class="w-5 h-5 mx-1" id="searchIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
        
      </form>      
    </div>
    <div class="flex-shrink-0 mr-6 ml-2 justify-center mb-6 mt-auto">
      <div class="text-white text-2xl my-2"> Welcome {{ userData.name }}!</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 xl:grid-cols-4 gap-2">
        <router-link to="/remote/admin" v-if="userData.isAdmin" class="text-center py-2 px-4 bg-proto_blue text-white hover:opacity-80 rounded-md">Admin remote</router-link>
        <router-link to="/screen/admin" v-if="userData.isAdmin" class="text-center py-2 px-4 bg-proto_blue text-white hover:opacity-80 rounded-md">Admin screen</router-link>
        <router-link to="/screen/admin" v-else class="text-center py-2 px-4 bg-proto_blue text-white hover:opacity-80 rounded-md">Screen</router-link>
        <!--<router-link to="/user/statistics" v-if="logIn" class="text-center py-2 px-4 bg-proto_blue text-white hover:opacity-80 rounded-md">Your Statistics</router-link>-->
        <router-link to="/statistics" class="text-center py-2 px-4 bg-proto_blue text-white hover:opacity-80 rounded-md">Statistics</router-link>
      </div>
    </div>
    <div  class="hidden lg:block flex-shrink-0 mr-6 my-auto">
        <!--<img class="w-30 h-0 md:h-36 object-cover flex-shrink-0 mx-auto dark:hidden block" src="logo_classic.png" />
        <img class="w-30 h-0 md:h-36 object-cover flex-shrink-0 mx-auto hidden dark:block" src="logo_dark.png" />-->
        <img class="w-30 h-0 md:h-32 object-cover flex-shrink-0 mx-auto" :src="require('@/assets/logo_classic.png')" />
    </div>
  </HeaderField>
</template>

<script setup>
import { ref } from 'vue';
import { eventBus } from '@/js/eventbus.js'
import HeaderField from '@/layout/HeaderField.vue'
import { getUserData } from '@/js/user_socket.js'

const search_string = ref("");
const userData = ref({
  name: null,
  isAdmin: false
});


function fetchVideos() {
  if(search_string.value != ''){
    eventBus.emit('fetchVideos', search_string.value);
  }
}

eventBus.on('user-socket-connect-success', async () => {
  var userdata = await getUserData();
  userData.value.name = userdata.name;
  userData.value.isAdmin = userdata.isAdmin;
});

</script>
