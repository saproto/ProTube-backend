<template>
    <ErrorModal opacity>
        <span class="my-auto">
            No active session found! Please try logging in on and after refresh this page
        </span>
        <div class="sm:flex w-full mt-2">
            <a href="https://portfolio.menkeveerman.com" target="_blank" class="w-full sm:mr-1 justify-center mx-auto p-2 bg-proto_green rounded-md hover:bg-opacity-80 flex" >
                proto.utwente.nl
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
            <button @click="reloadPage" class="w-full sm:mt-0 mt-2 sm:ml-1 justify-center mx-auto p-2 bg-proto_green rounded-md hover:bg-opacity-80 flex" >
                Reload
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        </div>
    </ErrorModal>

</template>

<script setup>
import ErrorModal from '@/components/modals/ErrorModal.vue'
import { defineProps} from 'vue';

defineProps({
  opacity: {
      type: Number, 
      default: 70
    }
});

// page reload on button trigger
function reloadPage() {
    window.location.reload();
}
</script>