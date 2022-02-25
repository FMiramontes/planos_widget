import { crm, creator, books } from './Zoho.js'
// import creator from './Zoho.js'
// import boocks from './Zoho.js'
import alerts from './alertas.js'
import Mapas from './mapas.js'

let desarrollo = new Array()

let beforeManzana = ''

const coordinadores = [
    {
        id: '2234337000031348022',
        name: 'Adolfo Martinez',
        email: 'amartinez@grupoconcordia.com',
    },
    {
        id: '2234337000053173001',
        name: 'Veronica Gonzalez',
        email: 'vgonzalez@grupoconcordia.com',
    },
    {
        id: '2234337000029920001',
        name: 'Nayeli Juarez',
        email: 'njuarez@grupoconcordia.com',
    },
    {
        id: '2234337000009539023',
        name: 'Alejandra Garcia',
        email: 'agarcia@grupoconcordia.com',
    },
    {
        id: '2234337000024388015',
        name: 'Mariana Fragoso',
        email: 'mfragoso@grupoconcordia.com',
    },
    {
        id: '2234337000003889001',
        name: 'Lizeth Lopez',
        email: 'alopez@grupoconcordia.com',
    },
    {
        id: '2234337000098706001',
        name: 'Fernanda Peralta',
        email: 'fperalta@grupoconcordia.com',
    },
    {
        id: '2234337000154895001',
        name: 'Alejandro Cazorla',
        email: 'alcazorla@grupoconcordia.com',
    },
    {
        id: '2234337000049017150',
        name: 'Ashram Mendez',
        email: 'asmendez@grupoconcordia.com',
    },
    {
        id: '2234337000074180001',
        name: 'Sabrina Martinez',
        email: 'smartinez@grupoconcordia.com',
    },
]

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

        mapa.dataset.commerceId = id

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
    async validate(CRMData, newData) {
        const user = document.getElementById('user')
        console.log('UI: user: ', user.dataset)
        const modal = document.getElementById('modal')
        const coo_id = document.getElementById('coordinadorValue').value
        const Campaign_id =
            document.getElementById('campaignValue').dataset.campaignid
        const contactDiv = document.getElementById('contact')
        const temp_contact_id = contactDiv.dataset?.contactid
            ? contactDiv.dataset?.contactid
            : false
        const temp_accout_id = contactDiv.dataset?.accountid
            ? contactDiv.dataset?.accountid
            : false
        let accountId = ''
        let contact_id = ''
        let accountName = ''

        if (temp_contact_id !== false) {
            contact_id = temp_contact_id
            let update = this.checkUpdate(CRMData, newData)
            if (update) {
                const update = await crm.UpdateContact(newData)
                console.log('UI: update ', update.data)
            }

            contact_id = temp_contact_id
            if (temp_accout_id !== false) accountId = temp_accout_id
            // crear const email =
            const conatctRequest = books.getContactByEmail(email)
            if (!conatctRequest.ok) books.syncContact(contact_id)
        } else {
            // Create account
            accountName =
                newData.contacto.First_Name +
                ' ' +
                newData.contacto.Apellido_Paterno +
                ' ' +
                newData.contacto.Apellido_Materno

            // // data for accounts
            const accountData = {
                Account_Name: accountName.toUpperCase(),
                Owner: {
                    id: user.dataset.crmuserid,
                },
            }
            const createAccountRequest = await crm.createAccount(accountData)
            console.log('UI: createAccount', createAccountRequest)
            accountId = createAccountRequest.data.details.id
            // Create Contact
            const createContactRequest = await crm.CreateContact(
                newData,
                accountId
            )
            console.log('UI: createContact', createContactRequest)

            contact_id = createContactRequest?.data.details.id

            // validar si existe contacto en books
            let contactBooksId = ''
            if (!createContactRequest.ok) {
                const syncContactRequest = await books.syncContact(contact_id)
                contactBooksId = syncContactRequest.data.id
            }
        }

        // Product
        const product_id = modal.dataset.crm_id
        const item = modal.dataset.item

        let sku = modal.dataset?.item

        let productBooksId = ''

        if (!modal.dataset.existecrm) {
            let map = document.getElementById('map')
            const data = crm.detailsFraccionamiento(map.dataset.id)

            let seccion = util.getSeccion(item, data)

            sku = seccion.sku
        }

        const productBooksRequest = await books.getProductBySku(sku)

        productBooksId = productBooksRequest.data.id

        if (!productBooksRequest.ok) {
            const productData = {}
            const createProductRequest = await books.createProduct(productData)
            productBooksId = createProductRequest.data.id
        }

        const DealData = {
            Owner: { id: user.dataset.crmuserid },
            Deal_Name: modal.dataset.trato,
            Nombre_de_Producto: { id: product_id },
            Account_Name: { id: accountId },
            Amount: newData.presupuesto.Saldo_Pagar_P,
            Stage: 'Presentación del Producto',
            Campaign_Source: { id: Campaign_id },
            Contact_Name: { id: contact_id },
        }
        console.log('UI: DealData', DealData)

        const DealRequest = await crm.createDeal(DealData)
        console.log('UI: DealRequest', DealRequest)

        const productRequest = await crm.associateProduct(
            modal.dataset.crm_id,
            DealRequest.data.details.id
        )
        console.log('UI: productRequest', productRequest)

        // if (email !== '') {
        //     books.getContactByEmail(email)
        // } else {
        //     books.syncContact(contact_id)
        // }

        // Cotizacion
        const recordData = {
            IDOportunidad: DealRequest.data.details.id,
            IDContactoCRM: contact_id,
            NombreContacto:
                document.querySelector('#contact').firstChild.textContent,
            Cuenta: accountName.toUpperCase(),
            MododePago: 'EFECTIVO',
            Propietario: document.querySelector('.name_user').textContent,
            EmailContacto: newData.contacto.Email,
            Contacto: document.querySelector('#contact').firstChild.textContent,
            ReportarApartado: document.querySelector('#hasApartado').checked,
        }
        const createCotizacion = await creator.createRecord(recordData)
        console.log(createCotizacion)
    },
    checkUpdate(a, b) {
        return JSON.stringify(a) === JSON.stringify(b)
    },
    viewModal(view, id, dataset, paint) {
        const { crm_id, trato, crm: existeCRM, sku } = dataset
        let container_modal = document.getElementById('container-modal')
        let modal = document.getElementById('modal')

        if (view) {
            container_modal.style.display = 'flex'
            modal.dataset.item = id
            modal.dataset.crm_id = crm_id
            modal.dataset.trato = trato
            modal.dataset.existecrm = existeCRM
            modal.dataset.sku = sku
            console.log('paint', paint)
            if (paint) this.paintDataPresupuesto(id, dataset)
        } else {
            container_modal.style.display = 'none'
            modal.dataset.item = ''
            modal.dataset.crm_id = ''
        }
    },
    paintDataPresupuesto(id, dataset) {
        const { costototal, costom2, dimension } = dataset
        // const Total = document.querySelector('input[name="Costo_Total_P"]')
        let Total = document.querySelector('input[name="Costo_Total_P"]')
        let M2 = document.querySelector('input[name="Costo_M2"]')
        let Dimension = document.querySelector('input[name="dimension"]')

        let manzana = document.querySelector('input[name="Manzana"]')
        let lote = document.querySelector('input[name="Lote"]')

        let sku = id.split('-')

        manzana.value = sku[0].replace(/\D+/, '')

        lote.value = sku[1].replace(/\D+/, '')

        Total.value = costototal
        M2.value = costom2
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

        const contactContainerResults =
            document.querySelector('#contact-results')
        contactContainerResults.classList.add('active')

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
    coordinador() {
        const selectCoordinador = document.getElementById('coordinadorValue')

        coordinadores.forEach((coo) => {
            let option = document.createElement('option')
            option.value = coo.id
            option.textContent = coo.name
            selectCoordinador.appendChild(option)
        })
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

const util = {
    getSeccion(item, data) {
        let item_name, sku, seccion_id, nombre_fracionamiento
        let item_array = item.split('-')
        let numManzana = item_array[0].replace('M', '')
        let numLote = item_array[1].replace('L', '')
        let seccion_id = ''

        let manzana = parseInt(numManzana)
        let secciones_array = data.secciones
        secciones_array.forEach((e) => {
            if (manzana >= e.init && manzana <= e.end) {
                if (e.Lotes != null && manzana == e.end) {
                    if (numLote >= e.Lotes.init && numLote <= e.Lotes.end) {
                        item_name = data.code + ' ' + e.name + ' ' + item
                        sku = item_array[0] + '' + e.symbol + '' + item_array[1]
                        seccion_id = e.id.toString()
                        if (e.name) {
                            nombre_fracionamiento =
                                data.Fraccionamiento + ' ' + e.name
                        } else {
                            nombre_fracionamiento = data.Fraccionamiento
                        }
                    }
                } else {
                    item_name = data.code + ' ' + e.name + ' ' + item
                    sku = item_array[0] + '' + e.symbol + '' + item_array[1]
                    seccion_id = e.id.toString()
                    if (e.name) {
                        nombre_fracionamiento =
                            data.Fraccionamiento + ' ' + e.name
                    } else {
                        nombre_fracionamiento = data.Fraccionamiento
                    }
                }
            }
        })
        return { item_name, sku, seccion_id, nombre_fracionamiento }
    },
}

export default UI
