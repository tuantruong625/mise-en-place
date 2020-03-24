<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <div class="calculator">
          <div class="display">{{ current || '0' }}</div>
          <div @click="clear" class="btn">C</div>
          <div @click="percent" class="btn">%</div>
          <div @click="dot" class="btn">.</div>
          <div @click="close" class="end operator">End</div>
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
          <div @click="equal" class="btn operator">=</div>
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


<style>
.modal-fade-enter,
  .modal-fade-leave-active {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header{
    padding: 5px;
    font-size: 25px;
    color: brown;
    cursor: pointer;
    font-weight: bold;
    padding-left: 370px;
  }
  
.calculator {
  margin: 0 auto;
  width: 400px;
  font-size: 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(50px, auto);
}
.display {
  grid-column: 1 / 5;
  background-color: #333;
  color: white;
}
.zero {
  grid-column: 1 / 3;
}
.btn {
  background-color:#f8f9fa;
  border: 1px solid rgb(167, 124, 124);
  color: black;
  cursor: pointer;
  padding-left: 40px;
}
.btn:active{
    transform: scale(0.95);
}
.operator {
  background-color: rgb(5, 20, 102);
  color: rgb(8, 147, 189);
}
.end{
    background-color: rgb(255, 0, 0);
    color: rgb(0, 0, 0);
    cursor: pointer;
    padding-left: 20px;
}
.end:active{
    transform: scale(0.95);
}
</style>