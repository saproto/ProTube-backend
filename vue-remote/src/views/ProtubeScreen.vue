<template>
  <div>
    <div id="yt-player"></div>
    protube screen
  </div>
  <div id='player' />
</template>

  
<script setup>
  let scripts = [
    'https://www.youtube.com/iframe_api',
    'http://localhost:3000/protube/screen/screen.js',
    'http://localhost:3000/socket.io/socket.io.min.js'
  ];
  for(let i = 0; i < scripts.length; i++){
    let externalScript = document.createElement('script');
    externalScript.setAttribute('src', scripts[i]);
    document.head.appendChild(externalScript);
  }
</script>