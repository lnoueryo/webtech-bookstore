<script setup lang="ts">
  import { ref, defineEmits, watch, watchEffect, computed } from 'vue';
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'var(--color-sub-black)',
    },
    fontSize: Number,
    width: Number,
  });
  const emit = defineEmits(['update:modelValue']);
  const uniqueId = Math.random().toString(36).substr(2, 9) + props.title;
  const selectedSkillLevels = ref(props.modelValue);
  const capitalizeFirstLetter = computed(
    () => props.title.charAt(0).toUpperCase() + props.title.slice(1)
  );
  watchEffect(() => (selectedSkillLevels.value = props.modelValue));
  watch(selectedSkillLevels, newSelectedSkillLevels =>
    emit('update:modelValue', newSelectedSkillLevels)
  );

  const labelStyle = computed(() => {
    return {
      fontSize: `${props.fontSize || 12}px`,
      backgroundColor: isSelected.value ? props.color : 'transparent',
      color: isSelected.value ? 'white' : props.color,
      border: `2px solid  ${props.color}`,
      borderRadius: '10px',
      display: 'block',
      width: `${props.width || 100}px`,
    };
  });

  const isSelected = computed(() =>
    selectedSkillLevels.value.includes(props.title)
  );
</script>

<template>
  <div class="chip text-center" v-if="props.title">
    <input
      :id="uniqueId"
      type="checkbox"
      :value="props.title"
      v-model="selectedSkillLevels"
    />
    <label :for="uniqueId" :style="labelStyle">
      {{ capitalizeFirstLetter }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
  .skill-level-form {
    .chip {
      margin: 4px;
    }
    input[type='checkbox'] {
      display: none;
    }
    label {
      position: relative;
      color: #fff;
      cursor: pointer;
      padding: 5px;
      transition: var(--hover-transition);
    }
  }

  @media (hover: hover) and (pointer: fine) {
    .skill-level-form label:hover {
      opacity: var(--opacity-light);
      transition: var(--hover-transition);
    }
  }
</style>