import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkillLevelChip from '/components/atoms/SkillLevelChip.vue';
import { nextTick } from 'vue';

const black = 'rgb(0, 0, 0)';

describe('SkillLevelChip', () => {
  describe('Display SkillLevelChip', () => {
    const skillLevel = {
      modelValue: ['beginner'],
      title: 'beginner',
      color: black,
    };

    it('Render Correctly', () => {
      const wrapper = createSkillLevelChip(skillLevel);
      expect(wrapper.find('label').exists()).toBeTruthy();
      expect(wrapper.text()).toMatch(wrapper.vm.capitalizeFirstLetter);
    });

    it('Render Incorrectly', async () => {
      const incompleteSkillLevel = {};
      const wrapper = createSkillLevelChip(incompleteSkillLevel);
      expect(wrapper.find('label').exists()).toBeFalsy();
    });

    it('Verify SkillLevelChip Is Active', () => {
      const wrapper = createSkillLevelChip(skillLevel);
      const label = wrapper.find('label');
      expect(wrapper.vm.isSelected).toBeTruthy();
      expect(label.classes()).toContain('checked');
    });

    it('Verify GenreSelector Is Inactive', () => {
      const inactiveSkillLevel = { ...skillLevel, title: 'intermediate' };
      const wrapper = createSkillLevelChip(inactiveSkillLevel);
      const label = wrapper.find('label');
      expect(wrapper.vm.isSelected).toBeFalsy();
      expect(label.classes()).not.toContain('checked');
    });
  });

  describe('Behavior', () => {
    const skillLevel = {
      modelValue: [],
      title: 'beginner',
      color: black,
    };

    it('Verify v-model', async () => {
      const wrapper = createSkillLevelChip(skillLevel);
      const input = wrapper.find('input');
      const label = wrapper.find('label');
      expect(input.exists()).toBeTruthy();
      expect(label.classes()).not.toContain('checked');

      expect(wrapper.vm.isSelected).toBeFalsy();
      expect((input.element as HTMLInputElement).checked).toBeFalsy();
      await input.trigger('click');
      await input.trigger('change');
      await nextTick();
      expect((input.element as HTMLInputElement).checked).toBeTruthy();

      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([
        [skillLevel.title],
      ]);
      expect(wrapper.vm.isSelected).toBeTruthy();
      expect(label.classes()).toContain('checked');
    });

    it('Verify To Inactivate', async () => {
      const activeGenreSelector = {
        ...skillLevel,
        modelValue: [skillLevel.title],
      };
      const wrapper = createSkillLevelChip(activeGenreSelector);
      const input = wrapper.find('input');
      const label = wrapper.find('label');
      expect(input.exists()).toBeTruthy();
      expect(label.classes()).toContain('checked');

      expect(wrapper.vm.isSelected).toBeTruthy();
      expect((input.element as HTMLInputElement).checked).toBeTruthy();
      await input.trigger('click');
      await input.trigger('change');
      await nextTick();
      expect((input.element as HTMLInputElement).checked).toBeFalsy();

      expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[]]);
      expect(label.classes()).not.toContain('checked');
      expect(wrapper.vm.isSelected).toBeFalsy();
    });
  });
});

interface SkillLevelChipData {
  modelValue?: string[];
  title?: string;
  color?: string;
  fontSize?: number;
  width?: number;
}

const createSkillLevelChip = (skillLevelChipData: SkillLevelChipData) => {
  return mount(SkillLevelChip, {
    props: skillLevelChipData,
  });
};
