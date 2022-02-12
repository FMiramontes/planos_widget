import UI from './UI.js'

const searchBtn = document.querySelector('#search-contact')

ZOHO.embeddedApp.on('PageLoad', async function (data) {
    ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
        const user = document.getElementById('user')

        const img_user = document.createElement('img')
        img_user.setAttribute('src', data.users[0].image_link)
        user.lastElementChild.innerText = data.users[0].full_name
        user.firstElementChild.appendChild(img_user)
    })
})

ZOHO.embeddedApp.init().then(function () {
    UI.loadMenuLateral()
})

searchBtn.addEventListener('click', () => {
    UI.searchContact()
})

// Close search result
document.addEventListener('click', (e) => {
    if (
        !e.target.matches('#search-result') &&
        document.querySelector('#search-result').innerHTML !== ''
    ) {
        // console.log('hide results', true)
        UI.hideResults()
    }
})

// # Assign contact to #contact element
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-record]')) {
        UI.selectContact(e.target)
        UI.cleanForm()
    }
})

// Remove selected contact from #contact element
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) {
        UI.removeContact()
    }
})

document.getElementById('btn-submit').addEventListener('click', (e) => {
    UI.getDataForm()
})

document.addEventListener('dblclick', (e) => {
    if (e.target.matches('[data-lote]')) {
        if (e.target.dataset.disponible == 'true') {
            // console.log('disponible', e)
            UI.paintDataInForm()
            UI.viewModal(true, e.target.id)
            /*validarSesion()
            if (sessionStorage.getItem("sesion"))
                Login.mostrarInfoLote(loteSeleccionado)*/
        } else {
            // console.log('no disponible', e)
            // MostrarAlerta()
        }
    }
})

UI.viewModal(true, '0')

const containerModal = document.getElementById('container-modal')
containerModal.addEventListener('click', (e) => {
    if (e.target.id == 'container-modal') {
        UI.viewModal(false)
    }
})
