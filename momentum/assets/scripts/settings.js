const state = {
  language: 'en',
  photoSource: 'github',
  blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist'],
}


export function toggleBlock(block) {
  const element = document.querySelector(`.${block}`);
  element.classList.toggle('hidden');
}
