import UI from './UI.js'

const searchContactBtn = document.querySelector('#search-contact')
const searchCampaigntBtn = document.querySelector('#search-campaign')

let CRMData = {},
    qselector

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

searchContactBtn.addEventListener('click', () => {
    UI.searchContact()
})

searchCampaigntBtn.addEventListener('click', () => {
    UI.searchCampaign()
})

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
        UI.selectContact(e.target)
        UI.cleanForm()
    }

    if (e.target.dataset.module == 'campaign') {
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

    UI.validate(CRMData, newData)
})

document.addEventListener('dblclick', (e) => {
    if (e.target.matches('[data-lote]')) {
        if (e.target.dataset.disponible == 'true') {
            // console.log('disponible', e)
            const contactDiv = document.getElementById('contact')
            const contact_id = contactDiv.dataset?.contactid
                ? contactDiv.dataset?.contactid
                : false

            CRMData = {}

            if (contact_id !== false) {
                const accout_id = contactDiv.dataset?.accountid
                    ? contactDiv.dataset?.accountid
                    : false

                UI.paintDataInForm(contact_id, accout_id)

                CRMData = UI.getDataForm()
            }

            UI.viewModal(
                true,
                e.target?.id,
                e.target.dataset?.crm_id,
                e.target.dataset?.costototal,
                e.target.dataset?.costom2,
                e.target.dataset?.dimension
            )

            /*validarSesion()
            if (sessionStorage.getItem("sesion"))
                Login.mostrarInfoLote(loteSeleccionado)*/
        } else {
            // console.log('no disponible', e)
            // MostrarAlerta()
        }
    }
})

// UI.viewModal(true, '0')

const containerModal = document.getElementById('container-modal')
containerModal.addEventListener('click', (e) => {
    if (e.target.id == 'container-modal') {
        UI.viewModal(false, '', '', '', '')
    }
})
