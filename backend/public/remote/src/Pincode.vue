<template>
    <div id="pinInput">
    <vue-fake-input 
    :length="4"
    :fontSize="20"
    :onlyNumber="true"
    v-model:pinCode="pincode"
    />
    <h2>Value: {{ pincode }}</h2>
  </div>
</template>

<script>
import VueFakeInput from './components/VueFakeInput.vue';

export default {
  name: 'pinInput',
  components: {
    VueFakeInput,
  },
  data() {
    return {
      pincode: '',
    };
  }
};
</script>

<style>

</style>