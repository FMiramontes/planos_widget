'use strict'

import crm from './Zoho.js'
import alerts from './alertas.js'
import Mapas from './mapas.js'
import maps from './mapas.js'

let desarrollo = new Array()

let beforeManzana = ''

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
                    console.log('Desarrollo', name)
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
                // const svgNombre = e.target.closest('svg').dataset.desarrollo

                await Mapas.loadManzana(manzana, id, desarrollo, beforeManzana)
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

        let mapsDetails = document.getElementById('details')

        mapsDetails.innerHTML = ''

        desarrollo.details.forEach((detail) => {
            detail.forEach((d) => {
                mapsDetails.insertAdjacentHTML(
                    'beforeend',
                    this.parseOuterHTML(d)
                )
            })
        })
    },
    async paintDataInForm(contact_id, accout_id) {
        let contactData = new Array()
        let accountData = new Array()

        contactData = await crm.getContact(contact_id)

        if (contactData.ok === true) {
            console.log('Contact: ', contactData)

            // pintar informacion en Formulario
            const Keys = this.getKeysForm()
            const CRMData = contactData.data

            // console.log('Keys:', Keys)
            // console.log('CRM data:', CRMData)

            Keys.contacto.forEach((key) => {
                let input = document.querySelector(`input[name='${key}']`)

                // input.value = CRMData.get(key) !== undefined ? CRMData.get(key) : ''
                if (CRMData[key]) {
                    // console.log('value input', CRMData[key])
                    input.value = CRMData[key]
                } else {
                    console.log('-----------------------------------------')
                    console.log('input', input)
                    console.log('No value', key)
                }
            })
        }

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
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                span.children[1].value = ''
            })
        })
    },
    getDataForm() {
        let form = {}
        let contacto = {}
        let Presupuesto = {}
        const Blocks = Array.from(document.querySelectorAll('.block'))
        Blocks.forEach((block) => {
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                if (block?.dataset?.contacto)
                    if (span.children[1].value !== '')
                        contacto[span.children[1].name] = span.children[1].value
                if (block?.dataset?.presupuesto)
                    Presupuesto[span.children[1].name] = span.children[1].value
            })
        })

        console.log('contacto: ', contacto)
        form.contacto = contacto
        console.log('Presupuesto: ', Presupuesto)
        form.presupuesto = Presupuesto

        return form
    },
    getKeysForm() {
        let form = {}
        let contacto = new Array()
        let Presupuesto = new Array()
        const Blocks = Array.from(document.querySelectorAll('.block'))
        Blocks.forEach((block) => {
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                if (block?.dataset?.contacto)
                    contacto.push(span.children[1].name)

                if (block?.dataset?.presupuesto)
                    Presupuesto.push(span.children[1].name)
            })
        })

        console.log('contacto: ', contacto)
        form.contacto = contacto
        console.log('Presupuesto: ', Presupuesto)
        form.presupuesto = Presupuesto

        return form
    },
    validate(CRMData, newData) {
        const contactDiv = document.getElementById('contact')
        const contact_id = contactDiv.dataset?.contactid
            ? contactDiv.dataset?.contactid
            : false

        if (contact_id !== false) {
            let update = this.checkUpdate(CRMData, newData)
            if (update) crm.UpdateContact(newData)
        } else {
            crm.CreateContact(newData)
        }

        // crm.CrateDeal(contact_id, PoductID, Presupuesto)
    },
    checkUpdate(a, b) {
        return JSON.stringify(a) === JSON.stringify(b)
    },
    viewModal(view, id, crm_id, costoTotal, m2, dimension) {
        let container_modal = document.getElementById('container-modal')
        let modal = document.getElementById('modal')

        if (view) {
            container_modal.style.display = 'flex'
            modal.dataset.item = id
            modal.dataset.crm_id = crm_id
            this.paintDataPresupuesto(id, costoTotal, m2, dimension)
        } else {
            container_modal.style.display = 'none'
            modal.dataset.item = ''
            modal.dataset.crm_id = ''
        }
    },
    paintDataPresupuesto(id, costoTotal, costoM2, dimension) {
        // const Total = document.querySelector('input[name="Costo_Total_P"]')
        let Total = document.querySelector('input[name="Costo_Total_P"]')
        let M2 = document.querySelector('input[name="Costo_M2"]')
        let Dimension = document.querySelector('input[name="dimension"]')

        let manzana = document.querySelector('input[name="Manzana"]')
        let lote = document.querySelector('input[name="Lote"]')

        let sku = id.split('-')

        manzana.value = sku[0].replace(/\D+/, '')

        lote.value = sku[1].replace(/\D+/, '')

        Total.value = costoTotal
        M2.value = costoM2
        Dimension.value = dimension
    },
    async searchContact() {
        const searchValue = document.querySelector('#search-value').value
        const resultContainer = document.querySelector('#contact-results')
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
                    data-module="contact"
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
        const containers = document.querySelectorAll('.search-result')
        containers.forEach((c) => {
            c.innerHTML = ''
        })
    },
    selectContact(selectedOption) {
        const contactContainer = document.querySelector('#contact')
        contactContainer.innerHTML = ''

        contactContainer.classList.add('active')

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
        const contactContainer = document.querySelector('#contact')
        contactContainer.innerHTML = ''
        delete contactContainer.dataset.contactid
        delete contactContainer.dataset.accountid
    },
    async searchCampaign() {
        const searchValue = document.querySelector('#campaignValue').value
        // console.log('searchValue', searchValue)
        const campaignResultContainer =
            document.querySelector('#campaign-results')

        campaignResultContainer.classList.add('active')

        campaignResultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchCampaigns(searchValue)

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
                // console.log('records: ', records)
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')
                    temp.innerHTML = `
                    <div data-campaignid="${record.id}" data-module="campaign" class="record">
                        <span>${record.Campaign_Name}</span>
                        <p data-politica="" >${record.Tipo_de_Politica}</p>
                        <p data-formadepago="" >${record.Tipo_de_Promocion}</p>
                    </div>`

                    var frag = temp.content
                    df.appendChild(frag)
                })

                campaignResultContainer.append(df)
            }
        }
    },
    selectCampaign(selectedOption) {
        console.log('selecting campaign...')
        const campaignInput = document.querySelector('#campaignValue')
        campaignInput.value = ''
        campaignInput.value = selectedOption.children[0].textContent
        campaignInput.dataset.campaignid = selectedOption.dataset.campaignid
    },
    async searchCoordinador() {
        const searchValue = document.querySelector('#coordinadorValue').value
        // console.log('searchValue', searchValue)
        const CoordinadorResultContainer = document.querySelector(
            '#coordinador-results'
        )

        CoordinadorResultContainer.classList.add('active')

        CoordinadorResultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchCoordinador(searchValue)

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
                // console.log('records: ', records)
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')
                    temp.innerHTML = `
                    <div data-coordinador_id="${record.id}" data-module="coordinador" class="record">
                        <span>${record.Campaign_Name}</span>
                    </div>`

                    var frag = temp.content
                    df.appendChild(frag)
                })

                CoordinadorResultContainer.append(df)
            }
        }
    },
    selectCoordinador(selectedOption) {
        console.log('selecting campaign...')
        const campaignInput = document.querySelector('#campaignValue')
        campaignInput.value = ''
        campaignInput.value = selectedOption.children[0].textContent
        campaignInput.dataset.campaignid = selectedOption.dataset.campaignid
    },
    async fillCampaignDetails() {
        const campaignInput = document.querySelector('#campaignValue')
        const campaignId = campaignInput.dataset.campaignid

        if (campaignId !== null) {
            const getCampaignRequest = await crm.getCampaign(campaignId)
            if (getCampaignRequest.ok) {
                const campaignData = getCampaignRequest.data

                // Select Plazo form field
                document.querySelector(`input[name="Plazo_P"]`).value =
                    campaignData.Mensualidades

                // Check for Enganche
                if (campaignData.Tipo_de_Politica === 'Enganche') {
                    let engancheField = document.querySelector(
                        `input[name="Enganche_P"]`
                    )

                    // Asignar valor a campo Enganche
                    let engancheValue = ''
                    if (campaignData.Tipo_de_Enganche === 'Monto') {
                        engancheValue = 0
                    } else if (campaignData.Tipo_de_Enganche === 'Porcentaje') {
                        const costoTotal = document.querySelector(
                            `input[name="Costo_Total_P"]`
                        ).value
                        const porcentaje =
                            campaignData.Porcentaje_de_Enganche / 100
                        engancheValue = costoTotal * porcentaje
                    }
                    engancheField.value = engancheValue
                    engancheField.dataset.tipo_enganche =
                        campaignData.Tipo_de_Enganche
                    engancheField.dataset.enganche =
                        campaignData.Tipo_de_Enganche === 'Porcentaje'
                            ? campaignData.Porcentaje_de_Enganche
                            : campaignData.Monto_de_Enganche
                }

                // Check for Apartado
                if (campaignData.Tipo_de_Apartado !== null) {
                    let apartadoValue = ''
                    if (campaignData.Tipo_de_Apartado === 'Monto') {
                        apartadoValue = campaignData.Monto_de_Apartado
                    } else if (campaignData.Tipo_de_Apartado === 'Porcentaje') {
                        // Calcular apartado
                        const costoTotal = document.querySelector(
                            `input[name="Costo_Total_P"]`
                        ).value
                        const porcentaje =
                            campaignData.Porcentaje_de_Apartado / 100
                        apartadoValue = costoTotal * porcentaje
                    }
                    document.querySelector(`input[name="Cantidad_RA"]`).value =
                        apartadoValue
                }
            }

            document.querySelector(`input[name="Saldo_Pagar_P"]`).value =
                (
                    document.querySelector(`input[name="Costo_Total_P"]`)
                        .value -
                    document.querySelector(`input[name="Enganche_P"]`).value
                ).toFixed(2) || ''
            document.querySelector(`input[name="Pago_Mensual_P"]`).value =
                (
                    document.querySelector(`input[name="Saldo_Pagar_P"]`)
                        .value /
                    document.querySelector(`input[name="Plazo_P"]`).value
                ).toFixed(2) || ''
        }
    },
}

export default UI
