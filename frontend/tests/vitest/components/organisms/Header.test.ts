import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Header from '/components/organisms/Header.vue';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';

describe('Header', () => {
  const createPinia = state => {
    return createTestingPinia({
      initialState: {
        index: state,
      },
    });
  };
  const createRouterInstance = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [],
    });
  };
  const generateRandomString = (length: number) => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  describe('Display Header', () => {
    it('Render Correctly', async () => {
      const state = { isHeaderReady: false };
      const wrapper = mount(Header, {
        global: {
          plugins: [createRouterInstance(), createPinia(state)],
        },
      });
      expect(wrapper.find('#header').exists()).toBeFalsy();

      wrapper.vm.store.width = 1200;
      await nextTick();
      expect(wrapper.vm.store.isHeaderReady).toBeTruthy();

      expect(wrapper.find('#header').exists()).toBeTruthy();
    });
  });
  describe('Search Book by Keyword', () => {
    const search = async (wrapper, length) => {
      const keyword = generateRandomString(length);
      const input = wrapper.find('input');
      await input.trigger('focus');
      await input.setValue(keyword);
      const button = wrapper.find('button');
      await button.trigger('click');
      await flushPromises();
      return keyword;
    };
    it('Verify Go To Book List Page.', async () => {
      const state = { isHeaderReady: true };
      const router = createRouterInstance();
      await router.push('/');
      const wrapper = mount(Header, {
        global: {
          plugins: [createRouterInstance(), createPinia(state)],
        },
      });
      const keyword = await search(wrapper, 1);
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, 'genre')
      ).toBeFalsy();
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, 'keyword')
      ).toBeTruthy();
      expect(wrapper.vm.route.query['keyword']).toBe(keyword);

      await router.push('/');
      const keywords = await search(wrapper, 100);
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, 'genre')
      ).toBeFalsy();
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, 'keyword')
      ).toBeTruthy();
      expect(wrapper.vm.route.query['keyword']).toBe(keywords);
    });
    it('Verify Stay Home Page.', async () => {
      const state = { isHeaderReady: true };
      const router = createRouterInstance();
      await router.push('/');
      const wrapper = mount(Header, {
        global: {
          plugins: [createRouterInstance(), createPinia(state)],
        },
      });
      await search(wrapper, 0);
      expect(wrapper.vm.route.fullPath).toBe(`/`);
    });
    it('Verify Show Up Error with Keyword More Than 100 Characters.', async () => {
      const state = { isHeaderReady: true };
      const router = createRouterInstance();
      await router.push('/');
      const wrapper = mount(Header, {
        global: {
          plugins: [router, createPinia(state)],
        },
      });

      await search(wrapper, 101);
      expect(wrapper.vm.route.fullPath).toBe(`/`);
      expect(wrapper.vm.isOpen).toBeTruthy();
    });
    it('Verify Rate and Level Parameters.', async () => {
      const query = {
        rate: 4,
        levels: ['advanced'],
        page: 1,
      };
      const state = { isHeaderReady: true };
      const router = createRouterInstance();
      await router.push({
        path: '/books',
        query: { ...query, genre: '123456789' },
      });
      const wrapper = mount(Header, {
        global: {
          plugins: [router, createPinia(state)],
        },
      });

      const keyword = await search(wrapper, 5);
      for (const key in query) {
        expect(
          Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, key)
        ).toBeTruthy();
      }
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, 'genre')
      ).toBeFalsy();
      expect(
        Object.prototype.hasOwnProperty.call(wrapper.vm.route.query, 'keyword')
      ).toBeTruthy();
      expect(wrapper.vm.route.query['keyword']).toBe(keyword);
    });
  });
});
