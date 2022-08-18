export class AudioPlayer {
  constructor(element, playList){
    const durationBlock = element.querySelector('.track-duration'); 

    this.playList = playList.map(item => {
      const description = `${item.title} - ${item.artist}`;
      const audio = document.createElement('audio');
     
      audio.textContent = 'Your browser doesn\'t support audio playback';
      audio.src = item.src;
      audio.preload = 'metadata';
      
      return {
        audio: audio,
        description: description,
        duration: item.duration
      };
    });

    this.widget = element;
    this.current = this.playList[0].audio;
    this.volume = 1;
  }

  play() {
    const track = this.widget.querySelector('.track');
    this.current.volume = this.volume;
    this.current.play();
    this.current.parentElement.classList.add('current-track');

    track.textContent = this.getCurrentTrack().description;
    this.showDuration();
    this.updatePlayButtons();
  }

  pause() {
    this.current.pause();
    this.updatePlayButtons();
  }

  stop() {
    this.current.pause();

    this.current.currentTime = 0;
    this.current.parentElement.classList.remove('current-track');
  }

  next() {
    const currentIndex = this.getCurrentIndex();

    this.stop()
    
    if (currentIndex < this.playList.length - 1) {
      this.current = this.playList[currentIndex + 1].audio;
    } else this.current = this.playList[0].audio;

    this.play();
  }

  prev() {
    const currentIndex = this.getCurrentIndex();

    this.stop()

    if (currentIndex != 0) {
      this.current = this.playList[currentIndex - 1].audio;
    } else this.current = this.playList[this.playList.length - 1].audio; 

    this.play();
  }

  mute() {
    if (this.volume) {
      this.volume = 0;
    } else this.volume = 1;

    this.current.volume = this.volume
  }

  isPaused() {
    return this.current.paused;
  }

  showPlayList() {
    const trackList = this.widget.querySelector('.audio-player');
    this.playList.forEach(item => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      
      li.classList.add('audio-track');
      li.textContent = item.description;
      button.classList.add('button', 'play', 'play-small');
     
      button.addEventListener('click', () => {
        if (this.current !== item.audio) {
          this.stop();
          this.current = item.audio;
        } 

        this.isPaused() ? this.play() : this.pause();
      });
      
      li.prepend(button, item.audio);
      trackList.appendChild(li);
    });

    const track = this.widget.querySelector('.track');
    track.textContent = this.getCurrentTrack().description;

    this.showDuration();
  }

  updatePlayButtons() {
    const mainPlayButton = this.widget.querySelector('.play-button-main');
    const buttons = Array.from(this.widget.querySelectorAll('.play-small'));

    mainPlayButton.classList.toggle('play');
    mainPlayButton.classList.toggle('pause');

    buttons.forEach((button, index) => {
      if (this.getCurrentIndex() === index) {
        button.classList.toggle('pause');
        button.classList.toggle('play');
      } else if (button.classList.contains('pause')){
        button.classList.toggle('pause');
        button.classList.toggle('play');
        mainPlayButton.classList.toggle('play');
        mainPlayButton.classList.toggle('pause');
      }
    });
  }

  showDuration() {
    const durationBlock = this.widget.querySelector('.track-duration'); 
    const progressLine = this.widget.querySelector('.progress');
    const duration = formatTime(this.getCurrentTrack().duration);
    const currentTime = formatTime(this.current.currentTime);

    durationBlock.textContent = `${currentTime}/${duration}`;
    progressLine.style.width = Math.floor(+this.current.currentTime/+this.getCurrentTrack().duration*100)  + '%';

    setTimeout(() => {
      this.showDuration();
    }, 1000);

    function formatTime(time) {
      const minutes = Math.floor(time / 60).toString().padStart(2, '0');
      const seconds = Math.floor(time % 60).toString().padStart(2, '0');

      return `${minutes}:${seconds}`;
    }
  }

  getCurrentIndex() {
    return this.playList.findIndex(item => item.audio === this.current);
  }

  getCurrentTrack() {
    return this.playList[this.getCurrentIndex()];
  }
} 
