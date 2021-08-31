<template>
    <Result v-for="result in results" :key="result.id" :result="result" />
</template>

<script>
//import { ref } from "vue";
import Result from './Result.vue'

export default {
  name: "Results",
  components: { Result },
  data () {
      return {
          results: [
              { name: "naam"},
              { name: "naam2"},
        ]
      }
  }
    // async setup() {
    //     const videos = ref(null);
    //     results.value = [
    //         { name: "naam",
    //           id: "23"
    //         },
    //         { name: "naam2",
    //           id: "28"
    //         }
    //     ];
    //     console.log(results)
    //     return results;
    // }
}
</script>

<style>

</style>