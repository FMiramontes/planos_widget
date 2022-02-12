'use strict'

import crm from './Zoho.js'
import alerts from './alertas.js'
import Mapas from './mapas.js'
import maps from './mapas.js'

let desarrollo = new Array()

let beforeManzana = ''
const contactContainer = document.querySelector('#contact')
const resultContainer = document.querySelector('#search-result')

const UI = {
    async loadMenuLateral() {
        const data = await crm.getAllFraccionamientos()

        if ((data.ok = true)) {
            const menu = document.getElementById('menu-lateral')
            data.data.forEach((i, index) => {
                // console.log(i.fraccionamientos.logo)
                let frac = document.createElement('div')
                frac.dataset.index = index
                frac.dataset.name = i.Name
                frac.dataset.id = i.id
                frac.classList = 'fracionamiento'
                frac.innerHTML = `
                                <div class="nombre-desarrollo">${i.Name}</div>
                                <div class="container-img"><img src="${i.logo}" alt=""></div>
                        `
                menu.appendChild(frac)
            })

            menu.addEventListener('click', async (e) => {
                if (e.target.matches('[data-index]')) {
                    let name = e.target.dataset.name.toLowerCase()

                    const nameSvg = name.replaceAll(' ', '-')

                    let tempDesartollo = await fetch(
                        `./desarrollos-js/${nameSvg}/${nameSvg}.json`
                    )

                    desarrollo = await tempDesartollo.json()

                    beforeManzana = ''

                    this.loadPlano(nameSvg, name, e.target.dataset.id)
                }
            })
        } else {
            if (data.type == 'warning')
                alerts.showAlert('warning', 'No hay fraccionamientos Activos.')
            if (data.type == 'danger')
                alerts.showAlert(
                    'danger',
                    'Error al cargar fraccionamientos, contactar con sistemas o recargar la página .'
                )
        }
    },
    async loadPlano(nameSvg, name, id) {
        this.getSVG(nameSvg)

        const mapa = document.getElementById('map')

        mapa.addEventListener('click', async (e) => {
            if (e.target.matches('[data-manzana]')) {
                // console.log(e.target.tagName)
                let auxManzana = e.target.id.split('-')
                const manzana = auxManzana[0]
                const svgNombre = e.target.closest('svg').dataset.desarrollo

                await Mapas.loadManzana(
                    svgNombre,
                    manzana,
                    id,
                    desarrollo,
                    beforeManzana
                )
                await Mapas.getDisponiblidad(name, manzana)
                beforeManzana = manzana
            }
        })

        //
    },
    parseOuterHTML(text) {
        let tempText1 = text.normalize()
        let tempText2 = tempText1.replaceAll('&lt;', '<')
        let tempText3 = tempText2.replaceAll('&gt;', '>')
        return tempText3
    },
    async getSVG(nameSvg) {
        // console.log(desarrollo)

        const containerManzanas = document.getElementById('maps')

        containerManzanas.innerHTML = ''

        desarrollo.blocks.forEach((block) => {
            block.forEach((manzana) => {
                if (manzana?.path)
                    // let path = `<g class="cls-1" id="${manzana.Numero}" data-conatiner="${manzana.Numero}" >${this.parseOuterHTML(manzana?.path)}</g>`
                    containerManzanas.insertAdjacentHTML(
                        'beforeend',
                        `<g class="cls-1" id="${
                            manzana.Numero
                        }" data-conatiner="${
                            manzana.Numero
                        }" >${this.parseOuterHTML(manzana?.path)}</g>`
                    )
            })
        })
    },
    async paintDataInForm() {
        const contactDiv = document.getElementById('contact')
        let contactData = new Array()
        let accountData = new Array()

        const contact_id = contactDiv.dataset?.contactid
            ? contactDiv.dataset?.contactid
            : false
        if (contact_id !== false) {
            contactData = await crm.getContact(contact_id)

            if (contactData.ok === true) {
                console.log('Contact: ', contactData)
            }
        }

        const accout_id = contactDiv.dataset?.accountid
            ? contactDiv.dataset?.accountid
            : false
        if (accout_id !== false) {
            accountData = await crm.getAccount(accout_id)

            if (accountData.ok === true) {
                console.log('Account: ', accountData)
            }
        }
    },
    cleanForm() {
        const Blocks = Array.from(document.querySelectorAll('.block'))
        Blocks.forEach((block) => {
            // console.log('block', block)
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                span.children[0].value = ''
            })
        })
    },
    getDataForm() {
        let inputs = {}
        const Blocks = Array.from(document.querySelectorAll('.block'))
        Blocks.forEach((block) => {
            // console.log('block', block)
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                inputs[span.children[0].name] = span.children[0].value
            })
        })

        console.log('inputs: ', inputs)
    },
    viewModal(view, id) {
        let container_modal = document.getElementById('container-modal')
        let modal = document.getElementById('modal')

        if (view) {
            container_modal.style.display = 'flex'
            modal.dataset.item = id
        } else {
            container_modal.style.display = 'none'
            modal.dataset.item = ''
        }
    },

    async searchContact() {
        const searchValue = document.querySelector('#search-value').value
        // console.log('searchValue', searchValue)
        resultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchContact(searchValue)

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
                // console.log('records: ', records)
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')
                    temp.innerHTML = `<div 
                    data-contactid="${record.id}" 
                    data-accountid="${record.Account_Name?.id}"
                    data-record="" class="record"><span data-contact-name>${record.Full_Name}</span>
                    <p data-record-email="" >${record.Email}</p>
                    </div>`

                    var frag = temp.content
                    df.appendChild(frag)
                })

                resultContainer.append(df)
            }
        }
    },
    hideResults() {
        resultContainer.innerHTML = ''
    },
    selectContact(selectedOption) {
        contactContainer.innerHTML = ''

        contactContainer.dataset.contactid = selectedOption.dataset.contactid
        contactContainer.dataset.accountid =
            selectedOption.dataset.accountid === undefined
                ? null
                : selectedOption.dataset.accountid

        // Display contact
        contactContainer.textContent = selectedOption.children[0].textContent

        // Add remove user button
        contactContainer.insertAdjacentHTML(
            'beforeend',
            `
        <button id="deleteContact" class="close-button" type="button" data-close>
        <span aria-hidden="true">&times;</span>
        </button>`
        )

        const deleteContact = document.getElementById('deleteContact')
        deleteContact.addEventListener('click', (e) => {
            this.cleanForm()
        })
    },
    removeContact() {
        contactContainer.innerHTML = ''
        delete contactContainer.dataset.contactid
        delete contactContainer.dataset.accountid
    },
}

export default UI
