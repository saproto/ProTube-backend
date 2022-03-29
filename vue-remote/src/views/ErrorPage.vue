<template>
    <!-- not Found -->
    <ErrorModal v-if="errorCode == 404" opacity=100 >
        404 - Page not found!
    </ErrorModal>

    <!-- Unauthorized -->
    <ErrorModal v-if="errorCode == 401" opacity=100 >
        401 - Unauthorized!
    </ErrorModal>

    <!-- Session expired -->
    <ErrorModal v-if="errorCode == 440" opacity=100 >
        Session Expired! 
        <router-link to="/remote/admin" class="w-full sm:mt-0 mt-2 sm:ml-1 justify-center mx-auto p-2 bg-proto_green rounded-md hover:bg-opacity-80 flex" >
            Refresh
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </router-link>
    </ErrorModal>
</template>

<script setup>
import ErrorModal from '@/components/modals/ErrorModal.vue'
import { defineProps } from 'vue'

// See https://en.wikipedia.org/wiki/List_of_HTTP_status_codes for the error codes
defineProps({
    'errorCode': {
        type: Number,
        default: 404
    },
    'sourcePath': {
        type: String,
        default: '/remote'
    }
})
</script>