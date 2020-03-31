<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header"/>
          </div>

          <div class="modal-body">
            <slot name="body"/>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="close-button" @click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
};
</script>

<style scoped lang="scss">
    .modal-mask {
        position: fixed;
        z-index: 9998;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.2);
        transition: opacity .3s ease;
    }

    .modal-container {
      color: #495057;
      width: 350px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      transition: all .3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0.25rem 0;
    }

    .modal-body {
      margin: 20px 0;
      width: 100%;
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

  .close-button {
    width: 100%;
    color: $grey-6;
    border: 1px solid $grey-1;
    box-shadow: $shadow-xs;
    height: 2.5rem;
    border-radius: 5px;
    background: $white;
  }

</style>
