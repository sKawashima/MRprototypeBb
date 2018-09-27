import 'reset-css'
import './style.sass'

import E3 from './sound/E3.wav'
import G3 from './sound/G3.wav'
import A3 from './sound/A3.wav'
import B3 from './sound/B3.wav'
import C4 from './sound/C4.wav'
import D4 from './sound/D4.wav'
import E4 from './sound/E4.wav'

import Tone from 'tone'
import isMobile from 'ismobilejs'
import Pressure from 'pressure'

console.log('hello')

const app = []
const tone = []
const user = []

// Thousand Dreamsの旋律
const soundList = ['E3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4']
const songScore = ['D4', 'C4', 'A3', 'G3', 'G3', 'A3', 'C4', 'D4', 'E4', 'D4', 'C4', 'A3', 'G3', 'A3', 'C4', 'B3', 'G3', 'E3', 'D4', 'C4', 'A3', 'G3', 'G3', 'A3', 'C4', 'D4', 'E4', 'D4', 'C4', 'A3', 'G3', 'A3', 'C4', 'B3', 'G3', 'A3']
let scoreN = -1

// init
window.onload = () => {
  console.log('onload')
  // setup c
  app.c = document.getElementById('app')
  app.c.width = window.innerWidth
  app.c.height = window.innerHeight
  // setup ctx
  app.ctx = app.c.getContext('2d')
  app.ctx.beginPath()
  // setup tone
  tone['E3'] = new Tone.Player(E3).toMaster()
  tone['G3'] = new Tone.Player(G3).toMaster()
  tone['A3'] = new Tone.Player(A3).toMaster()
  tone['B3'] = new Tone.Player(B3).toMaster()
  tone['C4'] = new Tone.Player(C4).toMaster()
  tone['D4'] = new Tone.Player(D4).toMaster()
  tone['E4'] = new Tone.Player(E4).toMaster()
  console.log(tone)
  // setup methods
  if (isMobile.any) {
    app.c.addEventListener('touchstart', touchstart)
    app.c.addEventListener('touchmove', touchmove)
    app.c.addEventListener('touchend', touchend)
    console.log('mobile')
  } else {
    app.c.addEventListener('mousedown', playSound)
    app.c.addEventListener('mouseup', stopSound)
    app.c.onmousedown =
    console.log('not mobile')
  }
  // setup Pressure
  app.force = 0
  Pressure.set('#app', {
    change: (force) => {
      if (force > app.force) {
        app.force = force
        changeSoundVolume()
      }
    }
  })
}

const touchstart = (ev) => {
  user['x'] = ev.touches[ev.touches.length - 1].pageX
  user['y'] = ev.touches[ev.touches.length - 1].pageY
  console.log(user)
  playSound()
}

const touchmove = (ev) => {
  const diffX = Math.abs(user['x'] - ev.touches[ev.touches.length - 1].pageX)
  const diffY = user['y'] - ev.touches[ev.touches.length - 1].pageY
  changeSoundPitch(diffX, -diffY)
}

const touchend = (ev) => {
  if (ev.touches.length === 0) {
    stopSound()
  }
}

const playSound = () => {
  console.log('play')
  // update scoreN
  scoreN = nextScore(scoreN)
  // stop other sound
  soundList.forEach((val, id) => {
    if (songScore[scoreN] !== val) {
      tone[val].stop()
    }
  })
  // play sound
  tone[songScore[scoreN]].playbackRate = 1
  tone[songScore[scoreN]].restart()
}

const changeSoundVolume = () => {
  tone[songScore[scoreN]].volume.value = -(1 - app.force) * 10
}

const changeSoundPitch = (x, y) => {
  tone[songScore[scoreN]].playbackRate = 1 + x / 2000 + y / 3000
}

const stopSound = () => {
  tone[songScore[scoreN]].stop()
  app.force = 0
  changeSoundVolume()
}

const nextScore = (scoreN) => {
  scoreN++
  if (scoreN === songScore.length) {
    scoreN = 0
  }
  return scoreN
}
