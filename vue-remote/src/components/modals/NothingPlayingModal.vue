<template>
  <div class="fixed z-40 inset-0 overflow-y-auto sm:-to" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center h-4/6 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-proto_background_gray-dark transition-opacity" aria-hidden="true"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block text-center transform transition-all align-middle ">
        <div class="dark:text-white w-full min-height-screen flex text-center text-4xl">
          Nothing currently in the queue...<br>
          Visit protu.be to add some tunes!
        </div>
      </div>
    </div>
  </div>
</template>