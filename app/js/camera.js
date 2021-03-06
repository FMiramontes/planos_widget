import { crm } from './Zoho.js'
import alerts from './alertas.js'

const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const imgs = document.getElementById('screanshots')
const cameraOptions = document.getElementById('select-camera')
// const cameraContainer = document.getElementById('camera-container')

const file = document.getElementById('file')

const addScreanShot = document.querySelector('.addScreanShot')
const screanShot = document.querySelector('.screanShot')
const save = document.querySelector('.save')

let stream
let streamStarted = false
let image = ''

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
    async getCameraSelection() {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
        )
        const options = videoDevices.map((videoDevice) => {
            return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
        })
        cameraOptions.innerHTML = options.join('')
    },
    async startStream(constrains) {
        stream = await navigator.mediaDevices.getUserMedia(constrains)
        console.log('stream: ', stream)
        streamStarted = true
        this.handlesStream(stream)
    },
    handlesStream(stream) {
        window.localStream = stream
        console.log()
        video.srcObject = stream
        streamStarted = true
    },
    addScreanShot(image) {
        // <img id="screanshot"  alt=""/>
        const div = document.createElement('div')
        div.classList.add('screanshot-img')

        const i = document.createElement('i')
        i.classList.add('fa-solid')
        i.classList.add('fa-circle-xmark')
        i.dataset.clearimg = 'true'
        div.appendChild(i)

        const img = document.createElement('img')
        img.dataset.img = 'true'
        div.appendChild(img)

        // img.classList = ''

        imgs.insertAdjacentElement('beforeend', div)

        img.src = image
        img.classList.add('show-photo')
        setTimeout(() => {
            img.classList = ''
        }, 600)
    },
    updateThumbnail(file) {
        // Show thumbnail for image files
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = () => {
                util.addScreanShot(reader.result)
            }
        }
    },
}

document.addEventListener('click', (e) => {
    if (e.target.matches('[data-clearimg]')) {
        console.log('image dblClick: ', e)
        let padre = e.target.parentNode.parentNode
        console.log(padre)
        let hijo = e.target.parentNode
        console.log(hijo)
        padre.removeChild(hijo)
    }
})

document.addEventListener('click', (e) => {
    const img = document.getElementById('visualize-img')
    const modalImg = document.getElementById('visualize')
    if (e.target.matches('[data-img="true"]')) {
        modalImg.classList.add('show')
        img.src = e.target.currentSrc
    }
    if (e.target.matches('[data-img="false"]')) {
        img.src = ''
        modalImg.classList.remove('show')
    }
})

screanShot.onclick = async () => {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    image = canvas.toDataURL('image/jpeg')

    console.log('image: ', image)

    // const base64Response = await fetch(image)
    // let blob = await base64Response.blob()

    util.addScreanShot(image)
}

save.onclick = async (e) => {
    const screanshots = Array.from(
        document.getElementById('screanshots').children
    )
    if(screanshots.length == 0) return 
    const datsets = e.target.closest('.camera-container').dataset
    const dealId = datsets.dealId
    const dealName = datsets.dealname
    const FileName = 'Document'

    console.log('datsets: ', datsets)
    console.log('dealId: ', dealId)
    console.log('dealName: ', dealName)
    console.log('FileName: ', FileName)

    screanshots.forEach(async (screanshot) => {
        let image = screanshot.children[1].src
        let base64Response = await fetch(image)
        let blob = await base64Response.blob()
        if (blob !== '') {
            const request = await crm.attachFile(dealId, FileName, blob)
            console.log('camera request: ', request)
            if (request.ok) {
                alerts.showAlert(
                    'success',
                    `${FileName} fue adjuntado con exito. En el trato ${dealName} `
                )
            } else {
                alerts.showAlert(
                    'warning',
                    `no fue posible adjuntar el documento`
                )
            }
        } else {
            alerts.showAlert(
                'warning',
                `la imagen del documento ${FileName} aun no a sido tomada`
            )
        }
    })
}
util.getCameraSelection()

const camera = {
    autoPlay() {
        if (
            'mediaDevices' in navigator &&
            navigator.mediaDevices.getUserMedia
        ) {
            console.log('autoPlay')
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
            console.log('track: ', track)
            track.stop()
        })
    },
}

const dropZoneElement = document.getElementById('camera-container')

dropZoneElement.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZoneElement.classList.add('drop-zone--over')
})

dropZoneElement.addEventListener('drop', (e) => {
    e.preventDefault()

    if (e.dataTransfer.files.length) {
        // inputElement.files = e.dataTransfer.files;
        // util.image(e.dataTransfer.files[0])
        util.updateThumbnail(e.dataTransfer.files[0])
        console.log('e: ', e)
        // console.log("files: ",e.dataTransfer.files)
        // updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove('drop-zone--over')
})

addScreanShot.onclick = async () => {
    file.click()
}

file.addEventListener('change', (e) => {
    if (file.files.length) {
        console.log(file.files)
        // let altura = file.
        util.updateThumbnail(file.files[0])
    }
})

export default camera
