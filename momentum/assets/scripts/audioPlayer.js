export class AudioPlayer {
  constructor(playList){
    this.playList = playList.map(item => {
      const description = `${item.title} - ${item.artist}`;
      const audio = document.createElement('audio');

      audio.textContent = 'Your browser don\'t support audio playback';
      audio.src = item.src;
      return {
        audio: audio,
        description: description
      };
    });

    this.current = this.playList[0].audio;
  }

  play() {
    this.current.play();
    this.current.parentElement.classList.add('current-track');
  }

  pause() {
    this.current.pause();
  }

  stop() {
    this.pause();
    this.current.currentTime = 0;
    this.current.parentElement.classList.remove('current-track');
  }

  next() {
    const currentIndex = this.#getCurrentIndex();

    this.stop()
    
    if (currentIndex < this.playList.length - 1) {
      this.current = this.playList[currentIndex + 1].audio;
    } else this.current = this.playList[0].audio;

    this.play();
  }

  prev() {
    const currentIndex = this.#getCurrentIndex();

    this.stop()

    if (currentIndex != 0) {
      this.current = this.playList[currentIndex - 1].audio;
    } else this.current = this.playList[this.playList.length - 1].audio; 

    this.play();
  }

  isPaused() {
    return this.current.paused;
  }

  showPlayList(element) {
    this.playList.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.description;
      li.appendChild(item.audio);
      element.appendChild(li);
    });
  }

  #getCurrentIndex() {
    return this.playList.findIndex(item => item.audio === this.current);
  }
} 
