<template>
    <div class="fixed z-10 inset-0 overflow-y-auto sm:-to" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-proto_background_gray-dark transition-opacity" :class="background_opacity" aria-hidden="true"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block text-center transform transition-all align-middle ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="text-gray-200 text-xl mt-4 flex justify-center">
                    <span class="my-auto">
                        No active session found! Please log in on 
                    </span>
                    <a href="https://proto.utwente.nl" target="_blank" class="ml-1 p-2 bg-proto_green rounded-md hover:bg-opacity-80 flex" >
                        proto.utwente.nl
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
                <span class="text-red-600 mx-auto max-w-lg">
                    Dev-code: inspect the storage on the saproto site, go to cookies and locate the 'proto_session' cookie. <br>
                    Change the HttpOnly value to false and the domain to 'localhost'. It should then disappear on the saproto site and <br>
                    show up on the protube dev-site. Refresh this page after.
                </span>
            </div>
        </div>
    </div>
</template>