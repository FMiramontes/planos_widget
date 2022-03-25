const alerts = {
    closeAlert(e) {
        e.target.parentNode.classList.remove('show')
        setTimeout(function () {
            e.target.parentNode.remove()
        }, 650)
    },
    showAlert(type, msg) {
        const alert = document.createElement('div')
        alert.style.display = 'block'
        alert.className = `alert ${type}`

        let container = document.getElementById('container-alert')

        let message = document.createElement('div')
        message.className = 'message'
        let title = document.createElement('h2')
        title.innerText = type
        alert.appendChild(title)
        message.innerText = msg
        alert.appendChild(message)
        let close = document.createElement('span')
        close.className = 'alert-close'
        close.innerHTML = `&#10006;`
        close.addEventListener('click', this.closeAlert)
        alert.appendChild(close)
        container.appendChild(alert)

        setTimeout(function () {
            alert.classList.toggle('show')
        }, 100)
        setTimeout(function () {
            alert.classList.remove('show')
            setTimeout(function () {
                container.removeChild(alert)
            }, 500)
        }, 8500)
    },
}

export default alerts
