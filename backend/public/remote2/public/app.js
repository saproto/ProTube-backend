import { ref } from "@vue/reactivity";

const results = ref();

console.log(results);

function addResult(){
    results += { name: "ltt"};
    console.log("added result");
}