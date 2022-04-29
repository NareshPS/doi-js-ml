import 'core-js/stable'
import 'regenerator-runtime/runtime' // Enable Vue Async/Await constructs
import {createApp} from 'vue'


const app = createApp({
  data() {
    return {
      webcamStatus: '',
      TFCAM: undefined,
    }
  },
  methods: {
    async startCam() {
      const snapshots = [0]
      this.TFCAM = this.TFCAM || await tf.data.webcam(this.$refs.webcam)
      snapshots.map(async _ => {
        const capture = await this.TFCAM.capture()

        this.imageFromCapture(capture, (dataUrl) => this.uploadDataUrl(dataUrl))
        .then(_ => this.webcamStatus = 'Started')
      })
    },

    async stopCam() {
      if (this.TFCAM) {
        this.TFCAM.stop()
        this.TFCAM = undefined

        this.webcamStatus = "Stopped"
      } else {
        this.webcamStatus = "Not started"
      }
    },

    async imageFromCapture(data, fn) {
      return  tf.browser.toPixels(data, this.$refs.hiddenCanvas)
      .then(async _ => {
        const dataUrl = this.$refs.hiddenCanvas.toDataURL('image/png')
        fn(dataUrl)
      })
    },

    uploadDataUrl(dataUrl) {
      const data = new FormData()
      data.append('image', dataUrl)

      fetch(
        '/uploadImage',
        { method:'POST', body: data}
      )
      .then(async res => this.webcamStatus = await res.text())
      .catch(err => this.webcamStatus = err)
    }
  }
})

app.mount('#app')