import { Post } from '../posts';

const store = new Post();

describe('Book Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.index).toBeDefined();
  });

  it('create method should add a book', async () => {
    const result = await store.create('Bridge to Terabithia');
    expect(result).toEqual({
      id: 1,
      text: 'Bridge to Terabithia',
      likes: 0,
    });
  });

  it('index method should return a list of books', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        text: 'Bridge to Terabithia',
        likes: 0,
      },
    ]);
  });

  it('show method should return the correct book', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      text: 'Bridge to Terabithia',
      likes: 0,
    });
  });

  it('delete method should remove the book', async () => {
    await store.delete('1');
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
