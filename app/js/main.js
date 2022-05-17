import UI from './UI.js'
import maps from './mapas.js'
import valid from './validate.js'
import alerts from './alertas.js'
import './zoom.js'
import camera from './camera.js'

const searchContactBtn = document.querySelector('#search-contact')
const searchCampaigntBtn = document.querySelector('#search-campaign')
const searchCoordinadorBtn = document.querySelector('#search-coordinador')
const switchSearch = document.querySelector('#switch-search')
const searchLabel = document.querySelector('.module-switch label')
const modal = document.getElementById('modal')
const menuForm = document.querySelector('.menu-form')
const vendedoresInput = document.querySelector('#vendorsValue')
const searchDeals = document.getElementById('search-deal')
let inputApartado = document.querySelector(`input[name="Cantidad_RA"]`)
const tabs = document.querySelectorAll('[data-tab-target]')
let posicionY = 0
let posicionX = 0
let mapa = document.querySelector('.map')

let CRMData = {},
    qselector

ZOHO.embeddedApp.on('PageLoad', async function (data) {
    ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
        const user = document.getElementById('user')
        UI.userVendors(data.users[0])
        UI.addfuentes()
        UI.addSucursales()
        UI.addDepartamentos()
        UI.addZona()
        UI.coordinador()
        const img_user = document.createElement('img')
        user.dataset.crmuserid = data.users[0].id
        user.dataset.profile = data.users[0].profile.name
        if (data.users[0].profile.name === 'Vendedor') {
            document.querySelector('#vendorsValue').value = data.users[0].id
        }
        img_user.setAttribute('src', data.users[0].image_link)
        user.lastElementChild.innerText = data.users[0].full_name
        user.firstElementChild.appendChild(img_user)
        UI.paintDeals()
    })
})

searchDeals.addEventListener('input', (e) => {
    console.log(e.target.value)
    UI.searchDeals(e.target.value.toLowerCase())
})

ZOHO.embeddedApp.init().then(function () {
    UI.loadMenuLateral()
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

document.addEventListener('click', (e) => {
    qselector = document.querySelector(
        `[data-module="${e.target.dataset.module}"]`
    )

    if (
        (!e.target.matches('.search-result') && qselector?.innerHTML !== '') ||
        e.target.matches('[data-module]')
    ) {
        UI.hideResults()
    }
})

inputApartado.addEventListener('change', (e) => {
    valid.validateApartado(e.target)
})

document.addEventListener('click', (e) => {
    console.log('document: ', e)
    const modalArchivos = document.getElementById('modal-archivos')
    if (e.target.matches('[data-file]')) {
        modalArchivos.children[0].dataset.dealId =
            e.target.parentNode.dataset.dealid
        modalArchivos.children[0].dataset.dealname =
            e.target.parentNode.dataset.dealname
        camera.autoPlay()
        modalArchivos.classList.add('show')
    } else if (e.target.matches('[data-archivos]')) {
        modalArchivos.children[0].dataset.dealId = ''
        modalArchivos.children[0].dataset.dealname = ''
        modalArchivos.classList.remove('show')
        camera.autoStop()
    }
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
    if (valid.validateForm() && valid.validDataLists('submit')) {
        UI.validate(CRMData, newData)
    } else {
        alerts.showAlert('warning', 'Informacion Incompleta.')
    }
})

document.getElementById('btn-cratelead').addEventListener('click', (e) => {
    const dataForm = UI.getDataForm()

    if (valid.validateDataLead() && valid.validDataLists('lead')) {
        UI.createLead(dataForm)
    } else {
        alerts.showAlert('warning', 'Informacion Incompleta.')
    }
})

const input_frac = document.querySelector('input[name="Fraccionamiento_P"]')
const input_location = document.querySelector('input[name="Localizacion_P"]')
const map = document.getElementById('map')
let navegador = UI.navegador()
console.log('navegador: ', navegador)
if (
    (navegador.browser === 'chrome' ||
        navegador.browser === 'firefox' ||
        navegador.browser === 'safari') &&
    navegador.device === 'Mobile'
) {
    mostrarTooltip('touchstart')
    hideTooltip('touchend')

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            fadeIn(document.getElementById('container-blocks'), 1000)
            tabs.forEach((tab) => {
                tab.classList.remove('active')
            })
            tab.classList.add('active')
            scrollToBottom()
        })
    })
} else {
    modal.style.scrollBehavior = 'smooth'
    showTooltip('mouseover')
    hideTooltip('mouseout')
}
// Scroll Modal Celular
function scrollToBottom() {
    modal.scrollIntoView(false)
}

// Animacion modal

function fadeIn(element, duration = 1000) {
    element.style.display = ''
    element.style.opacity = 0
    let last = +new Date()
    let tick = function () {
        element.style.opacity =
            +element.style.opacity + (new Date() - last) / duration
        last = +new Date()
        if (+element.style.opacity < 1) {
            ;(window.requestAnimationFrame && requestAnimationFrame(tick)) ||
                setTimeout(tick, 16)
        }
    }
    tick()
}
// Celular doble click
let timeout
let lastTap = 0
document.addEventListener('touchend', function (e) {
    if (e.target.matches('[data-lote]')) {
        let currentTime = new Date().getTime()
        let tapLength = currentTime - lastTap
        clearTimeout(timeout)
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault()
            if (e.target.dataset.crm == 'true') {
                input_frac.value = map.dataset.name
                input_location.value = map.dataset.localidad

                if (e.target.dataset.disponible == 'true') {
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

                        CRMData = UI.getDataForm()
                    }
                    let banner = document.querySelector('.banner')
                    banner.innerHTML = ''
                    let trato = document.createElement('p')
                    trato.textContent = e.target.dataset.trato
                    banner.appendChild(trato)

                    UI.viewModal(true, e.target?.id, e.target.dataset, true)
                }
            } else {
                UI.cliqLoteFaltante(map.dataset.name, e.target.id)
            }
        }
        lastTap = currentTime
    }
})
document.addEventListener('dblclick', (e) => {
    if (e.target.matches('[data-lote]')) {
        if (e.target.dataset.crm == 'true') {
            input_frac.value = map.dataset.name
            input_location.value = map.dataset.localidad

            if (e.target.dataset.disponible == 'true') {
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

                    UI.paintDataInForm(contact_id, accout_id).then(() =>
                        valid.validContact(true)
                    )

                    CRMData = UI.getDataForm()
                }
                let banner = document.querySelector('.banner')
                banner.innerHTML = ''
                let trato = document.createElement('p')
                trato.textContent = e.target.dataset.trato
                banner.appendChild(trato)

                UI.viewModal(true, e.target?.id, e.target.dataset, true)
            }
        } else {
            UI.cliqLoteFaltante(map.dataset.name, e.target.id)
        }
    }
}),
    modal.addEventListener('change', (e) => {
        if (e.target.matches('[data-email]')) {
            valid.validateEmail(e.target.value, e.target.dataset.email)
        } else if (e.target.matches('[data-aporta-recursos]')) {
            valid.validateRecursos()
        }
    }),
    //Validate digits phone and mobile
    modal.addEventListener('input', (e) => {
        if (
            e.target.matches('[name="Mobile"]') ||
            e.target.matches('[name="Phone"]') ||
            e.target.matches('[name="Phone_2"]') ||
            e.target.matches('[name="Movil2"]')
        ) {
            valid.validateMobile(e.target)
        }
    })

let containerWrap = document.querySelector('.container-wrap')
let containerModal = document.querySelector('.container-modal')

containerModal.addEventListener('click', (event) => {
    if (event.target == containerModal) {
        containerWrap.classList.remove('show')
        UI.viewModal(false, '', '', '', '')
    }
})

let Iconmenu = document.querySelector('.btn-menu')
let menu = document.querySelector('#menu-lateral')
let btnMenuSpan = document.querySelector('.btn-menu span')

Iconmenu.addEventListener('click', () => {
    /*Abrir menu*/
    cerrarMenu()
})

function cerrarMenu() {
    menu.classList.toggle('open')
    btnMenuSpan.classList.toggle('active')
}

menu.addEventListener('click', (e) => {
    if (e.target.matches('[data-index]')) {
        cerrarMenu()
    }
})

/*Abrir menu tratos*/
let Iconmenu2 = document.getElementById('btn-menu-deals')
let menu2 = document.querySelector('#menu-lateral2')

Iconmenu2.addEventListener('click', () => {
    /*Abrir menu*/
    menu2.classList.toggle('open')
    // let cardColor = document.querySelector('.color-deals')
    // cardColor.classList.toggle('showCard')
})

// tabs Modal

tabs.forEach((tab) => {
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

function showTooltip(type) {
    mapa.addEventListener(`${type}`, (e) => {
        if (e.target.matches('[data-lote]')) {
            posicionX = e.pageX + 10
            posicionY = e.pageY + 13

            maps.showPopup(e, posicionX, posicionY)
        }
    })
}

function mostrarTooltip(type) {
    mapa.addEventListener(`${type}`, (e) => {
        if (e.target.matches('[data-lote]')) {
            posicionX = e.changedTouches[0].pageX + 10
            posicionY = e.changedTouches[0].pageY + 13

            maps.showPopup(e, posicionX, posicionY)
        }
    })
}

function hideTooltip(type) {
    mapa.addEventListener(`${type}`, (e) => {
        if (e.target.matches('[data-lote]')) {
            maps.hidePopup()
        }
    })
}

vendedoresInput.addEventListener('change', (event) => {
    // Remove any dataset if exists
    if ('vendedorid' in vendedoresInput.dataset) {
        delete vendedoresInput.dataset.vendedorid
    }

    const options = [...document.querySelectorAll('[data-idvendedor]')]
    const idValue = options.find((input) => input.value == event.target.value)
    if (idValue) {
        vendedoresInput.dataset.vendedorid = idValue.dataset.idvendedor
    }
})

let btnRefresh = document.getElementById('refresh-btn')

btnRefresh.addEventListener('click', () => {
    UI.paintDeals()
})

let infoColor = document.getElementById('info-colors')
infoColor.addEventListener('click', () => {
    let cardColor = document.querySelector('.color-lote')
    cardColor.classList.toggle('showCard')
})
