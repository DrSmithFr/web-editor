import { showMaxLength } from './show-max-lenght.pipe';

describe('ShowMaxLenghtPipe', () => {
  it('create an instance', () => {
    const pipe = new showMaxLength();
    expect(pipe).toBeTruthy();
  });
});
