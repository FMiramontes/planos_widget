import UI from './UI.js'
import maps from './mapas.js'
import valid from './validate.js'
import './zoom.js'

const searchContactBtn = document.querySelector('#search-contact')
const searchCampaigntBtn = document.querySelector('#search-campaign')
const searchCoordinadorBtn = document.querySelector('#search-coordinador')
const switchSearch = document.querySelector('#switch-search')
const searchLabel = document.querySelector('.module-switch label')
const modal = document.getElementById('modal')

let CRMData = {},
    qselector

ZOHO.embeddedApp.on('PageLoad', async function (data) {
    ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
        const user = document.getElementById('user')
        UI.userVendors(data.users[0])
        const img_user = document.createElement('img')
        user.dataset.crmuserid = data.users[0].id
        img_user.setAttribute('src', data.users[0].image_link)
        user.lastElementChild.innerText = data.users[0].full_name
        user.firstElementChild.appendChild(img_user)
    })
})

ZOHO.embeddedApp.init().then(function () {
    UI.loadMenuLateral()
    UI.coordinador()
})

searchContactBtn.addEventListener('click', () => {
    UI.searchCustomer()
})

switchSearch.addEventListener('change', () => {
    if (switchSearch.checked) {
        searchLabel.dataset.modulesearch = 'Leads'
        searchLabel.textContent = 'Leads'
    } else {
        searchLabel.dataset.modulesearch = 'Contacts'
        searchLabel.textContent = 'Contacts'
    }
})

searchCampaigntBtn.addEventListener('click', () => {
    UI.searchCampaign()
})

// searchCoordinadorBtn.addEventListener('click', () => {
//     UI.searchCoordinador()
// })

// Close search result
// let qselector = ''
document.addEventListener('click', (e) => {
    qselector = document.querySelector(
        `[data-module="${e.target.dataset.module}"]`
    )
    // console.log(qselector)
    // if(qselector !== null){
    if (
        (!e.target.matches('.search-result') && qselector?.innerHTML !== '') ||
        e.target.matches('[data-module]')
    ) {
        // console.log('hide results', true)
        UI.hideResults()
    }
    // }else{
    //     UI.hideResults()
    // }
})

// # Assign contact to #contact element
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-record]')) {
        const modulo = searchLabel.dataset.modulesearch
        if (modulo !== undefined) {
            if (modulo === 'Contacts') {
                UI.selectContact(e.target)
                UI.cleanForm()
            } else {
                UI.selectLead(e.target)
                UI.cleanForm()
            }
        }
    }

    if (
        e.target.dataset.module == 'campaign' &&
        e.target.dataset.result == 'found'
    ) {
        console.log(e.target.dataset.module)
        UI.selectCampaign(e.target)
        UI.fillCampaignDetails(e.target)
    }
})

// Remove selected contact from #contact element
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) {
        UI.removeContact()
    }
})

document.getElementById('btn-submit').addEventListener('click', (e) => {
    const newData = UI.getDataForm()

    if (valid.validateForm()) {
        UI.validate(CRMData, newData)
    } else {
        alert('Informacion Incompleta')
    }
})

document.addEventListener('dblclick', (e) => {
    if (e.target.matches('[data-lote]')) {
        if (e.target.dataset.disponible == 'true') {
            // console.log('disponible', e)
            const contactDiv = document.getElementById('contact')
            const contact_id =
                contactDiv.dataset?.contactid === undefined
                    ? false
                    : contactDiv.dataset?.contactid

            CRMData = {}

            if (contact_id === false || contact_id === undefined) {
                valid.validContact(false)
            } else {
                const accout_id =
                    contactDiv.dataset?.accountid === undefined
                        ? false
                        : contactDiv.dataset?.accountid

                console.log('main contact_id: ', contact_id)

                console.log('main accout_id: ', accout_id)
                UI.paintDataInForm(contact_id, accout_id).then(() =>
                    valid.validContact(true)
                )

                //console.log('validating contact...')
                CRMData = UI.getDataForm()
            }

            UI.viewModal(true, e.target?.id, e.target.dataset, true)

            /*validarSesion()
            if (sessionStorage.getItem("sesion"))
                Login.mostrarInfoLote(loteSeleccionado)*/
        } else {
            // console.log('no disponible', e)
            // MostrarAlerta()
        }
    }
})

modal.addEventListener('change', (e) => {
    if (e.target.matches('[data-email]')) {
        valid.validateEmail(e.target.value, e.target.dataset.email)
    } else if (e.target.matches('[data-aporta-recursos]')) {
        valid.validateRecursos()
    }
})

// modal.addEventListener('onchange', (e) => {
//     if (e.target.matches('[data-email]')) {
//         valid.validateEmail(e.target.value, e.target.dataset.email)
//     }
// })

// UI.viewModal(true, '0', '0', false)

const containerModal = document.getElementById('container-modal')
containerModal.addEventListener('click', (e) => {
    if (e.target.id == 'container-modal') {
        UI.viewModal(false, '', '', '', '')
    }
})

let Iconmenu = document.querySelector('.btn-menu')
let menu = document.querySelector('#menu-lateral')
let btnMenuSpan = document.querySelector('.btn-menu span')
let menuFraccionamiento = document.querySelectorAll('.fracionamiento')

// let close = document.getElementById('close')

Iconmenu.addEventListener('click', () => {
    /*Abrir menu*/
    cerrarMenu()
})

function cerrarMenu() {
    menu.classList.toggle('open')
    btnMenuSpan.classList.toggle('active')
}
menuFraccionamiento.forEach((div) => div.addEventListener('click', cerrarMenu))

// tabs Modal
const tabs = document.querySelectorAll('[data-tab-target]')
console.log('tabs: ', tabs)

tabs.forEach((tab) => {
    console.log('tab:', tab)
    tab.addEventListener('click', () => {
        tabs.forEach((tab) => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
    })
})

//ZOOM
let elem = document.getElementById('svg-map')

const panzoom = Panzoom(elem)

let zoomInButton = document
    .getElementById('zoom-in')
    .addEventListener('click', panzoom.zoomIn)
let zoomOutButton = document
    .getElementById('zoom-out')
    .addEventListener('click', panzoom.zoomOut)
let resetButton = document
    .getElementById('zoom-reset')
    .addEventListener('click', panzoom.reset)

// Tooltip
const tooltip = document.getElementById('info-lote')
let mapa = document.querySelector('.map')
let posicionY = 0
let posicionX = 0

mapa.addEventListener('mouseover', (e) => {
    if (e.target.matches('[data-lote]')) {
        if (e.target.dataset.disponible == 'true') {
            tooltip.innerHTML = ''
            let lote = document.createElement('p')
            lote.textContent = e.target.id
            tooltip.appendChild(lote)
            let dimension = document.createElement('p')
            dimension.textContent =
                'Dimension: ' + e.target.dataset.dimension + ' m2'
            tooltip.appendChild(dimension)
            let costoMetro = document.createElement('p')
            costoMetro.textContent = 'Costo M2: $ ' + e.target.dataset.costom2
            tooltip.appendChild(costoMetro)
            let total = document.createElement('p')
            total.textContent = 'Costo total: $ ' + e.target.dataset.costototal
            tooltip.appendChild(total)
            posicionX = e.pageX
            posicionY = e.pageY
            e.target.style.fill = '#e5b252'
            e.target.style.cursor = 'pointer'
        } else {
            tooltip.innerHTML = ''
            let lote = document.createElement('p')
            lote.textContent = e.target.id
            tooltip.appendChild(lote)
            let estado = document.createElement('p')
            estado.textContent = 'No disponible'
            tooltip.appendChild(estado)
            posicionX = e.pageX
            posicionY = e.pageY
            e.target.style.fill = '#000'
        }
        maps.showPopup(tooltip, posicionX, posicionY)
    }
})
mapa.addEventListener('mouseout', (e) => {
    if (e.target.matches('[data-lote]')) {
        if (e.target.dataset.disponible == 'true') {
            e.target.style.fill = '#de9f27'
        } else {
            e.target.style.fill = '#1a1a1a'
        }
        maps.hidePopup(tooltip)
    }
})
