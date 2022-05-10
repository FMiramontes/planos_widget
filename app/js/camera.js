import UI from './UI.js'

const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const img = document.getElementById('screanshot')
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

const autoPlay = () =>{
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

const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter((device) => device.kind === "videoinput")
    const options = videoDevices.map((videoDevice) => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
    })
    cameraOptions.innerHTML = options.join("")
    autoPlay()
}

// stop.onclick = () => {
    
//     if(streamStarted){
//         console.log("streamStarted: ", streamStarted)
//         video.play()
//         console.log(video)
//         return
//     }
// }

// play.onclick = async () =>{
//     alert(cameraOptions.value)
//     if('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia){
//         const updatedConstrains = {
//             ...constrain,
//             deviceId: {
//                 exact: cameraOptions.value,
//             }
//         }
//         console.log("updatedConstrains",updatedConstrains)
//         startStream(updatedConstrains)
//     }
// }

const startStream = async (constrains) =>{
    const stream = await navigator.mediaDevices.getUserMedia(constrains)
    stop.onclick = () => {
    
        if(streamStarted){
            console.log("streamStarted: ", streamStarted)
            video.play()
            console.log(video)
            return
        }
    }
    console.log("stream: ",stream)
    handlesStream(stream)
}

const handlesStream = (stream) => {
    video.srcObject = stream
    streamStarted = true
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