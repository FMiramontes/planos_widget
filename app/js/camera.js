import UI from './UI.js'

const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const img = document.querySelector('img')
const cameraOptions = document.getElementById('select-camera')

const play = document.querySelector('.play')
const stop = document.querySelector('.stop')
const screanShot = document.querySelector('.screanShot')
const save = document.querySelector('.save')

let streamStarted = false
let image = ''

const constrain = {
    video:{
        with:{
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440, 
        }   
    }
}



const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter((device) => device.kind === "videoinput")
    const options = videoDevices.map((videoDevice) => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
    })
    cameraOptions.innerHTML = options.join("")
}

stop.onclick = () => {
    
    if(streamStarted){
        console.log("streamStarted: ", streamStarted)
        // video.play()
        video.pause()
        console.log(video)
        return
    }
}

play.onclick = async () =>{
    alert(cameraOptions.value)
    if('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia){
        const updatedConstrains = {
            ...constrain,
            deviceId: {
                exact: cameraOptions.value,
            }
        }
        startStream(updatedConstrains)
    }
}

const startStream = async (constrains) =>{
    const stream = await navigator.mediaDevices.getUserMedia(constrains)
    handlesStream(stream)
}

const handlesStream = (stream) => {
    video.srcObject = stream
    streamStarted = true
}

screanShot.onclick = () =>{
    console.log("screanShot")
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    image = canvas.toDataURL("image/png")
    console.log("image")
    console.log(image)
    img.src = image
    
    // img.classList.remove('hide')
    img.classList.add('show-photo')
    setTimeout(() => {
        img.classList = ''
    }, 600);
    // img.classList = ''
}

save.onclick = () =>{
    // const cameraContainer = document.getElementById('camera-container')
    // const dealId = cameraContainer.dataset.dealId
    const dealId = "2234337000174109002"
    ZOHO.CRM.API.attachFile({Entity:"Deals",RecordID:dealId,File:{Name:"myFile.png",Content:image}}).then(function(data){
        console.log(data);
    });
}

getCameraSelection()
// ZOHO.CRM.API.attachFile({Entity:"Deals",RecordID:"1000000031092",File:{Name:"myFile.txt",Content:image}}).then(function(data){
// 	console.log(data);
// });