<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <div class="calculator">
          <div class="display">{{ current || '0' }}</div>
          <div @click="clear" class="btn">C</div>
          <div @click="percent" class="btn">%</div>
          <div @click="dot" class="btn">.</div>
          <div @click="close" class="end operator">Close</div>
          <div @click="append('7')" class="btn">7</div>
          <div @click="append('8')" class="btn">8</div>
          <div @click="append('9')" class="btn">9</div>
          <div @click="divide" class="btn operator">÷</div>
          <div @click="append('4')" class="btn">4</div>
          <div @click="append('5')" class="btn">5</div>
          <div @click="append('6')" class="btn">6</div>
          <div @click="times" class="btn operator">x</div>
          <div @click="append('1')" class="btn">1</div>
          <div @click="append('2')" class="btn">2</div>
          <div @click="append('3')" class="btn">3</div>
          <div @click="minus" class="btn operator">-</div>
          <div @click="append('0')" class="btn zero">0</div>
          <div @click="add" class="btn operator">+</div>
          <div @click="equal" class="btn operator equal-btn">=</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'modal',
  data(){
    return {
      previous: null,
      current: '',
      operator: null,
      operatorClicked: false,
    };
  },
  methods: {
    close() {
      this.$emit('close');
      this.clear();
    },
    clear(){
      this.current = '';
    },
    percent(){
      this.current = `${parseFloat(this.current) / 100}`;
    },
    append(number) {
      if (this.operatorClicked) {
        this.current = '';
        this.operatorClicked = false;
      }
      this.current = `${this.current}${number}`;
    },
    dot() {
      if (this.current.indexOf('.') === -1) {
        this.append('.');
      }
    },
    setPrevious() {
      this.previous = this.current;
      this.operatorClicked = true;
    },
    divide() {
      this.operator = (a, b) => a / b;
      this.setPrevious();
    },
    times() {
      this.operator = (a, b) => a * b;
      this.setPrevious();
    },
    minus() {
      this.operator = (a, b) => a - b;
      this.setPrevious();
    },
    add() {
      this.operator = (a, b) => a + b;
      this.setPrevious();
    },
    equal() {
      this.current = `${this.operator(
        parseFloat(this.previous),
        parseFloat(this.current)
      )}`;
      this.previous = null;
    },
  },
};
</script>
<style lang="scss" src="./Calculator.scss" scoped></style>
