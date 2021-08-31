<template>
  <div name="test" class="mx-2 outline-none mx-auto">
    <input
      :id="generateInputId(index)"
      :ref="generateInputId(index)"
      :type="inputType(onlyNumber)"
      maxlength="1"
      inputmode="numeric"
      :style="{
        fontSize: fkFontSize,
        borderBottom: fkInputColor(index),
        color: fontColor,
        width: fkWidth,
      }"
      :class="{
          'mx-2': true,
          'outline-none': true,
          'text-center': true,
      }"
      v-model="inputValues[index]"
      @keydown="handleKeydown($event, index)"
      @keyup="handleInputFocus(index)"
      @paste.prevent="handlePastedValues"
      @input="returnFullString()"
      contenteditable="true"
      :key="index"
      v-for="(input, index) in length"
    />
  </div>
</template>

<script>
let inputIsEmpty;
export default {
  name: 'vue-fake-input',
  props: {
    length: {
      type: Number,
      required: true,
    },
    fontSize: {
      type: Number,
      default: 22,
      required: false,
    },
    inputColor: {
      type: String,
      default: '#42b983',
      required: false,
    },
    fontColor: {
      type: String,
      default: '#444444',
      required: false,
    },
    allowPaste: {
      type: Boolean,
      default: true,
      required: false,
    },
    onlyNumber: {
      type: Boolean,
      default: false,
      required: false,
    },
    pinCode: String
  },
  data() {
    return {
      inputValues: [],
    };
  },
  computed: {
    fkFontSize() {
      return `${this.fontSize}px`;
    },
    fkWidth() {
      const width = this.fontSize + 8;
      return `${width}px`;
    },
  },
  methods: {
    inputType(numberOnly){
        return numberOnly ? "number" : "text";
    },
    handleKeydown(event, index) {
      if (!this.onlyNumber) {
        return;
      }
      const key = event.charCode || event.keyCode || 0;
      if(key === 8){
          if(this.$refs[`fk_${index+1}`].value){
            inputIsEmpty = false;
          } else {
            inputIsEmpty = true;
          }
      }
      if (
        !(
          key === 8
          || key === 46
          || key === 86
          || key === 91
          || (key >= 48 && key <= 57)
          || (key >= 96 && key <= 105)
        )
      ) {
        event.preventDefault();
      } else{
          if (this.inputValues[index] && this.inputValues[index] !== '' && index < this.length - 1) {
            console.log("nextinput focus");
            this.$refs[`fk_${index + 2}`].focus();
        } else if (index > 0 && (!this.inputValues[index] || this.inputValues[index] === '')) {
            if(inputIsEmpty){
                this.$refs[`fk_${index}`].focus();
            }
        }
        if(index === 3 && !inputIsEmpty && key !== 8){
            event.preventDefault();
            return;
        }
      }
    },
    generateInputId(index) {
      return `fk_${index + 1}`;
    },
    fkInputColor(index) {
      const color = this.inputValues[index] ? this.inputColor : '#eeeeee';
      return `3px solid ${color}`;
    },
    handleInputFocus(index) {
        console.log(index);
    //   if (this.inputValues[index] && this.inputValues[index] !== '' && index < this.length - 1) {
    //     console.log("nextinput focus");
    //     this.$refs[`fk_${index + 2}`].focus();
    //   } else if (index > 0 && (!this.inputValues[index] || this.inputValues[index] === '')) {
    //     if(inputIsEmpty){
    //         this.$refs[`fk_${index}`].focus();
    //     }
    //   }
    },
    handlePastedValues(event) {
      if (this.allowPaste) {
        const pastedValue = event.clipboardData.getData('text/plain');
        const splitValues = pastedValue.split('');
        let canPaste = true;
        if (this.onlyNumber) {
          const regx = new RegExp(`^\\d{${this.length}}$`);
          canPaste = regx.test(pastedValue);
        }
        if (canPaste) {
          for (let i = 0; i < this.length; i++) {
            this.updateInputValue(i, splitValues[i]);
          }
          const [lastInput] = this.$refs[`fk_${this.length}`];
          lastInput.focus();
          this.returnFullString();
        }
      }
    },
    updateInputValue(index, value) {
      this.$set(this.inputValues, index, value);
    },
    returnFullString() {
      this.$emit('update:pinCode', this.inputValues.join(''));
    },
  },
};
</script>

<style>
</style>