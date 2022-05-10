import UI from './UI.js'

const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const img = document.getElementById('screanshot')
const cameraOptions = document.getElementById('select-camera')

const play = document.querySelector('.play')
const stop = document.querySelector('.stop')
const screanShot = document.querySelector('.screanShot')
const save = document.querySelector('.save')

let stream
let streamStarted = false
let image = ''
let blob = ''

const constrain = {
    video: {
        with: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440,
        },
    },
}

const util = {
    async getCameraSelection(){
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
        )
        const options = videoDevices.map((videoDevice) => {
            return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
        })
        cameraOptions.innerHTML = options.join('')
    },
    async startStream(constrains){
        stream = await navigator.mediaDevices.getUserMedia(constrains)
        console.log('stream: ', stream)
        streamStarted = true
        this.handlesStream(stream)
    },
    handlesStream(stream){
        window.localStream = stream
        video.srcObject = stream
        streamStarted = true
    }
}


screanShot.onclick = async () => {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    image = canvas.toDataURL('image/jpeg')

    const base64Response = await fetch(image)
    blob = await base64Response.blob()

    img.src = image
    img.classList.add('show-photo')
    setTimeout(() => {
        img.classList = ''
    }, 600)
}

save.onclick = () => {
    const dealId = '2234337000174109002'
    ZOHO.CRM.API.attachFile({
        Entity: 'Deals',
        RecordID: dealId,
        File: { Name: 'myFile.jpg', Content: blob },
    }).then(function (data) {
        console.log(data)
    })
}
util.getCameraSelection()


const camera = {
    autoPlay() {
        if (
            'mediaDevices' in navigator &&
            navigator.mediaDevices.getUserMedia
        ) {
            const updatedConstrains = {
                ...constrain,
                deviceId: {
                    exact: cameraOptions.value,
                },
            }
            util.startStream(updatedConstrains)
        }
    },

    autoStop() {
        localStream.getTracks().forEach((track) => {
            track.stop()
        })
    },
}

export default camera
