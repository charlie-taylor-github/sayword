class Timer {
  constructor(element, onStop) {
    const radius = element.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    this.element = element;
    this.circumference = circumference;
    this.onStop = onStop;

    this.time = 0;
    this.progress = 0;
    this.active = false;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  reset() {
    this.active = false;
    this.time = 0;
    this.progress = 0;
    this.element.style.strokeDasharray = this.circumference;
    this.element.style.strokeDashoffset = 0;
  }

  addToTime(increment) {
    if (!this.active) return;
    this.time += increment * 1000;
  }

  setTime(time) {
    this.totalTime = time;
  }

  update(interval) {
    if (!this.active) return;
    let progress = this.time / this.totalTime;
    if (progress < 0) progress = 0;
    if (progress >= 1 || this.totalTime <= 0) {
      this.onStop();
      this.reset();
      return;
    }
    const progressCircumference = this.circumference * progress;
    this.element.style.strokeDashoffset = progressCircumference;
    this.time += interval;
  }
}
