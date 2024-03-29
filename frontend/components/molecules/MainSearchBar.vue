<script setup lang="ts">
  import {
    ref,
    watch,
    watchEffect,
    onMounted,
    computed,
    defineProps,
    defineEmits,
  } from 'vue';
  import SearchButton from '@/components/atoms/SearchButton.vue';
  import { deviceSize } from '@/assets/js/device-size';
  const props = defineProps({
    modelValue: {
      type: String,
    },
    userName: String,
    width: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['update:modelValue', 'onSearchClicked']);
  const mainSearchBar = ref(null);
  const wrapperRef = ref(null);
  const promptRef = ref(null);
  const promptPadding = ref(0);
  const searchButton = ref(null);
  const magnifyPadding = ref(0);
  const isInputSizeBelowLimit = ref(false);
  const user = ref(props.userName || 'guest');
  const searchKeyword = ref(props.modelValue);
  const wrapperLeft = ref(0);
  const promptLeft = ref(0);
  const promptWidth = ref(0);
  const leftMargin = computed(() => promptLeft.value - wrapperLeft.value);
  const promptBothSidesMargin = computed(
    () => (promptLeft.value - wrapperLeft.value) * 2
  );
  const hidePrompt = () => {
    promptPadding.value = leftMargin.value;
    isInputSizeBelowLimit.value = true;
  };
  const showPrompt = () => {
    promptPadding.value = promptWidth.value + promptBothSidesMargin.value;
  };
  // アニメーションが終わってからpropmtの長さを計測
  const afterEnter = () => {
    updateRefSize();
    showPrompt();
  };
  const updateRefSize = () => {
    const { left: wrapperLeftValue } = wrapperRef.value.getBoundingClientRect();
    const { left: promptLeftValue, width: promptWidthValue } =
      promptRef.value.getBoundingClientRect();
    if (promptLeftValue === 0) return;
    wrapperLeft.value = wrapperLeftValue;
    promptLeft.value = promptLeftValue;
    promptWidth.value = promptWidthValue;
  };

  const adjustPromptVisibility = width => {
    isInputSizeBelowLimit.value = false;
    if (width < deviceSize.tablet) return hidePrompt();
  };

  const adjustMagnifyVisibility = () => {
    const wrapperBound = wrapperRef.value.getBoundingClientRect();
    const magnifyBound = searchButton.value.children[0].getBoundingClientRect();
    const bothSidesMargin = (wrapperBound.right - magnifyBound.right) * 2;
    magnifyPadding.value = magnifyBound.width + bothSidesMargin;
  };
  const blurSearchBar = () => {
    mainSearchBar.value.blur();
    emit('onSearchClicked');
  };
  watch(
    () => props.width,
    newWidth => adjustPromptVisibility(newWidth)
  );
  watchEffect(() => (searchKeyword.value = props.modelValue));
  watch(searchKeyword, newSearchKeyword =>
    emit('update:modelValue', newSearchKeyword)
  );
  onMounted(() => {
    if (searchButton.value) adjustMagnifyVisibility();
    updateRefSize();
    if (props.width < deviceSize.tablet) return hidePrompt();
    showPrompt();
  });
</script>

<template>
  <div class="input-wrapper monospace-font h100" ref="wrapperRef">
    <transition @after-enter="afterEnter">
      <label
        for="main-search-bar"
        class="prompt"
        ref="promptRef"
        v-show="!isInputSizeBelowLimit"
        ><span style="color: var(--color-ubuntu-terminal)" aria-hidden="true"
          >WBstore@{{ user }}</span
        ><span class="path" aria-hidden="true">:~ $ </span></label
      >
    </transition>
    <input
      id="main-search-bar"
      ref="mainSearchBar"
      class="h100"
      type="text"
      :style="{
        paddingLeft: promptPadding + 'px',
        paddingRight: magnifyPadding + 'px',
      }"
      autocomplete="off"
      v-model="searchKeyword"
      @keyup.enter="blurSearchBar"
      placeholder="input book search keywords"
    />
    <div class="search-button w100 h100" ref="searchButton">
      <SearchButton :size="20" @onSearchClicked="blurSearchBar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .input-wrapper {
    position: relative;
  }

  #main-search-bar {
    position: relative;
    background: var(--color-terminal);
    color: var(--color-terminal-word);
    caret-color: var(--color-terminal-word);
    border-radius: 3px;
    width: 100%;
    z-index: 0;
    border: 2px solid var(--color-text-right-gray);
    transition:
      var(--transition-secondary),
      padding 0s;
  }

  #main-search-bar:focus-visible {
    border: 2px solid var(--color-class);
    transition: var(--transition-primary);
  }

  #main-search-bar:focus {
    outline: none;
  }

  .prompt {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%) translateX(0%);
    pointer-events: none;
    color: white;
    z-index: 1;
  }

  .search-button {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%) translateX(0%);
    color: white;
    height: calc(var(--height-content) - 8px);
    max-width: calc(calc(var(--height-content) - 8px) * 2);
  }

  .path {
    color: var(--color-text-tertiary);
  }

  ::placeholder {
    user-select: none;
    font-weight: bold;
  }
</style>
