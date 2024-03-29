import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import BookList from '@/components/organisms/BookList.vue';
import { createTestingPinia } from '@pinia/testing';
import { deviceSize } from '@/assets/js/device-size';
import Spinner from '@/components/global/Spinner.vue';

const books = [
  {
    title: 'まとめて学ぶ Python＆JavaScript',
    author: '伊尾木 将之',
    isbn: '000001',
    price: 3520,
    thumbnail:
      'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0252/9784296200252_1_2.jpg?_ex=200x200',
    publisher: '日経BP',
    publish_date: '2022年11月18日頃',
    description: '',
    rating: 0,
  },
  {
    title: 'Python／JavaScriptによるOpen AIプログラミング',
    author: '掌田津耶乃',
    isbn: '000002',
    price: 2420,
    thumbnail:
      'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5416/9784899775416_1_2.jpg?_ex=200x200',
    publisher: 'ラトルズ',
    publish_date: '2023年08月22日頃',
    description:
      '最強の武器“ＯｐｅｎＡＩ　ＡＰＩ”であなたのプログラムをＡＩ化しよう！ＣｈａｔＧＰＴ開発元が提供するＡＩモデル利用のためのＡＰＩを使い、アプリやサービスに高度なＡＩ機能をＰｙｔｈｏｎ／ＪａｖａＳｃｒｉｐｔによるプログラミングで組み込む方法を分かりやすく解説。また、Ｐｏｗｅｒ　Ａｕｔｏｍａｔｅ、ＰｏｗｅｒＡｐｐｓ、Ａｐｐｓｈｅｅｔ、ＣｌｉｃｋなどのノーコードツールやＥｘｃｅｌ／ＯｆｆｉｃｅスクリプトやＧｏｏｇｌｅ　Ａｐｐ　ＳｃｒｉｐｔからＡＰＩを利用する方法も解説します。プログラマからオフィスユーザーまで幅広く利用して頂ける書籍です。',
    rating: 3,
  },
  {
    title: 'Python と JavaScriptではじめるデータビジュアライゼーション',
    author: 'Kyran Dale/嶋田 健志/木下 哲也',
    isbn: '000003',
    price: 4180,
    thumbnail:
      'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8086/9784873118086.jpg?_ex=200x200',
    publisher: 'オライリー・ジャパン',
    publish_date: '2017年08月25日頃',
    description:
      'Ｗｅｂからデータを取得して、効率よく整理、分析を行い効果的な可視化を実現するには、さまざまなツールとテクニックが必要です。本書ではＰｙｔｈｏｎとＪａｖａＳｃｒｉｐｔを使い分け、それぞれの言語の強みを最大限利用します。ＰｙｔｈｏｎのＢｅａｕｔｉｆｕｌＳｏｕｐとＳｃｒａｐｙでデータを取得、ｐａｎｄａｓ、Ｍａｔｐｌｏｔｌｉｂ，Ｎｕｍｐｙでデータ処理を行い、Ｆｌａｓｋフレームワークを使ってデータを配信、ＪａｖａＳｃｒｉｐｔのＤ３．ｊｓを使ってインタラクティブなＷｅｂ可視化を実現します。データの収集からアウトプットまでの全体を視野に入れて解説しているので、実際にコードを追いながら、この一冊でデータ分析プロセスの全体像を理解できます。',
    rating: 3.5,
  },
];

for (let i = 0; i < 8; i++) {
  books.push(...books);
}

describe('BookList', () => {
  const createPinia = state => {
    return createTestingPinia({
      initialState: {
        index: { width: deviceSize.desktop },
        books: state,
      },
    });
  };
  const createRouterInstance = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [],
    });
  };
  const createBookList = page => {
    const maxBooks = 30;
    const count = books.length;
    const page_count =
      books.length % maxBooks === 0
        ? books.length / maxBooks
        : Math.ceil(books.length / maxBooks);
    const first = 1 + maxBooks * (page - 1);
    const last = page === page_count ? count : page * maxBooks;
    return {
      bookList: {
        books,
        page,
        first,
        last,
        page_count,
        count,
      },
    };
  };
  describe('Display BookList', () => {
    it('Render Correctly', async () => {
      Element.prototype.scrollTo = () => {};
      const page = 1;
      const state = createBookList(page);
      const wrapper = mount(BookList, {
        global: {
          plugins: [createRouterInstance(), createPinia(state)],
        },
      });
      await flushPromises();
      await vi.dynamicImportSettled();
      const bookItems = wrapper.findAllComponents({ name: 'BookItem' });
      expect(bookItems.length).toBe(books.length);
      for (const [index, bookItem] of bookItems.entries()) {
        const book = books[index];
        expect(bookItem.text()).toMatch(book.title);
        expect(bookItem.text()).toMatch(book.author);
        expect(bookItem.text()).toMatch(String(book.price));
        expect(bookItem.text()).toMatch(book.publisher);
        expect(bookItem.text()).toMatch(book.publish_date);
        if (book.description) expect(bookItem.text()).toMatch(book.description);
        expect(bookItem.text()).toMatch(String(book.rating));
        const spinner = bookItem.findComponent(Spinner);
        expect(spinner.exists()).toBeTruthy();
        bookItem.vm.isLoading = false;
        await bookItem.vm.$nextTick();
        const img = bookItem.find('img');
        expect(img.element.src).toBe(book.thumbnail);
      }
      const pageInfos = wrapper.findAllComponents({ name: 'PageInfo' });
      expect(pageInfos.length).toBe(2);
      for (const pageInfo of pageInfos) {
        expect(pageInfo.vm.first).toBe(state.bookList.first);
        expect(pageInfo.vm.last).toBe(state.bookList.last);
      }
      const pagination = wrapper.findComponent({ name: 'Pagination' });
      expect(pagination.exists()).toBeTruthy();
      const firstButton = pagination.find('#page-buttons #button-1');
      expect(firstButton.text()).toBe('1');
      const lastButton = pagination.find('#page-buttons #button-4');
      expect(lastButton.text()).toBe('4');
      const jumpRightButton = pagination.find('#jump-right-button');
      expect(Number(jumpRightButton.text())).toBe(state.bookList.page_count);
    });
    it('Render No Result', async () => {
      const state = { bookList: { books: [] } };
      const wrapper = mount(BookList, {
        global: {
          plugins: [createRouterInstance(), createPinia(state)],
        },
      });
      await flushPromises();
      await vi.dynamicImportSettled();
      const bookItems = wrapper.findAllComponents({ name: 'BookItem' });
      expect(bookItems.length).toBe(0);
      const noBookResult = wrapper.findComponent({ name: 'NoBookResult' });
      expect(noBookResult.exists()).toBeTruthy();
    });
    it('Render Error', async () => {
      const errorTypes = ['offline', 'timeout', 'server'];
      const components = {
        offline: '#offline',
        timeout: '#connection-error',
        server: '#server-error',
      };
      const state = { booksData: [] };
      const wrapper = mount(BookList, {
        global: {
          plugins: [createRouterInstance(), createPinia(state)],
        },
      });
      await flushPromises();
      await vi.dynamicImportSettled();
      const bookItems = wrapper.findAllComponents({ name: 'BookItem' });
      expect(bookItems.length).toBe(0);

      for (const errorType of errorTypes) {
        wrapper.vm.booksStore.errorType = errorType;
        await vi.dynamicImportSettled();
        const errorComponent = wrapper.find(components[errorType]);
        expect(errorComponent.exists()).toBeTruthy();
      }
    });
  });
  describe('Go To Next Page', () => {
    it('Verify next page', async () => {
      Element.prototype.scrollTo = () => {};
      const path = '/books';
      const page = 1;
      const keyword = 'python';
      const state = createBookList(page);
      const router = createRouterInstance();
      await router.push({ path, query: { keyword, page } });
      const wrapper = mount(BookList, {
        global: {
          plugins: [router, createPinia(state)],
        },
      });
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page);
      await flushPromises();
      const pagination = wrapper.findComponent({ name: 'Pagination' });
      expect(pagination.exists()).toBeTruthy();
      const nextButton = pagination.find('#right-page-button button');
      expect(nextButton.exists()).toBeTruthy();
      await nextButton.trigger('click');
      await flushPromises();
      expect(pagination.emitted('updatePage')).toBeTruthy();
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page + 1);
    }, 10000);
    it('Verify previous page', async () => {
      Element.prototype.scrollTo = () => {};
      const path = '/books';
      const page = 2;
      const keyword = 'python';
      const state = createBookList(page);
      const router = createRouterInstance();
      await router.push({ path, query: { keyword, page } });
      const wrapper = mount(BookList, {
        global: {
          plugins: [router, createPinia(state)],
        },
      });
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page);
      await flushPromises();
      const pagination = wrapper.findComponent({ name: 'Pagination' });
      expect(pagination.exists()).toBeTruthy();
      const nextButton = pagination.find('#left-page-button button');
      expect(nextButton.exists()).toBeTruthy();
      await nextButton.trigger('click');
      await flushPromises();
      expect(pagination.emitted('updatePage')).toBeTruthy();
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page - 1);
    }, 10000);
    it('Verify jump to right page', async () => {
      Element.prototype.scrollTo = () => {};
      const path = '/books';
      const page = 1;
      const keyword = 'python';
      const state = createBookList(page);
      const router = createRouterInstance();
      await router.push({ path, query: { keyword, page } });
      const wrapper = mount(BookList, {
        global: {
          plugins: [router, createPinia(state)],
        },
      });
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page);
      await flushPromises();
      const pagination = wrapper.findComponent({ name: 'Pagination' });
      expect(pagination.exists()).toBeTruthy();
      const jumpToRightButton = pagination.find(
        'nav ul li ul li button[aria-label="jump to right page"]'
      );
      expect(jumpToRightButton.exists()).toBeTruthy();
      await jumpToRightButton.trigger('click');
      await flushPromises();
      expect(pagination.emitted('updatePage')).toBeTruthy();
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page + 5);
    });
    it('Verify jump to left page', async () => {
      Element.prototype.scrollTo = () => {};
      const path = '/books';
      const page = 7;
      const keyword = 'python';
      const state = createBookList(page);
      const router = createRouterInstance();
      await router.push({ path, query: { keyword, page } });
      const wrapper = mount(BookList, {
        global: {
          plugins: [router, createPinia(state)],
        },
      });
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page);
      await flushPromises();
      const pagination = wrapper.findComponent({ name: 'Pagination' });
      expect(pagination.exists()).toBeTruthy();
      const jumpToRightButton = pagination.find(
        'nav ul li ul li button[aria-label="jump to left page"]'
      );
      expect(jumpToRightButton.exists()).toBeTruthy();
      await jumpToRightButton.trigger('click');
      await flushPromises();
      expect(pagination.emitted('updatePage')).toBeTruthy();
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.query.keyword).toBe(keyword);
      expect(Number(router.currentRoute.value.query.page)).toBe(page - 3);
    });
  });
});
