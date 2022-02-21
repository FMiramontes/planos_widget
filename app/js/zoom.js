//SVG ZOOM

var zoom = 1

document.getElementById('zoom-in').addEventListener('click', function (e) {
    zoom += 0.1
    resize()
})

document.getElementById('zoom-out').addEventListener('click', function (e) {
    if (zoom > 0.6) {
        zoom -= 0.1
        resize()
    }
})

document.getElementById('zoom-reset').addEventListener('click', function (e) {
    zoom = 1
    resize()
})

function resize() {
    const target = document.querySelector('[id="svg-map"]')
    target.style.transform = 'scale(' + zoom + ')'
}

//SVG DRAGGABLE

mapDragg(document.getElementById('map'))

function dragElement(map) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0
    if (document.getElementById(map.id + 'header')) {
        document.getElementById(map.id + 'header').onmousedown = dragMouseDown
    } else {
        map.onmousedown = dragMouseDown
    }
}

function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    //mouse pos
    pos3 = e.clientX
    pos4 = e.clientY
}

function mapDrag(e) {
    e = e || window.event
    e.preventDefault()
    //calculate new pos
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    //new pos
    map.style.top = map.offsetTop - pos2 + 'px'
    map.style.top = map.offsetLeft - pos1 + 'px'
}

function closeMapDrag() {
    document.onmouseup = null
    document.onmousemove = null
}
