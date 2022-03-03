window.onload = function(){
    console.log("loaded");
    document.getElementById("youtube").contentWindow.postMessage(JSON.stringify({'event': 'command', 'func': 'playVideo', 'args': []}), "*");
};