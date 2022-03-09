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
                    console.log('--------------------------------')

                    console.log('UI desarrollo:', desarrollo)

                    beforeManzana = ''

                    this.loadPlano(name, e.target.dataset.id)
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
    async loadPlano(name, id) {
        this.getSVG()

        const mapa = document.getElementById('map')

        mapa.dataset.commerceId = id

        mapa.addEventListener('click', async (e) => {
            if (e.target.matches('[data-manzana]')) {
                console.log(e.target.tagName)

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
    async getSVG() {
        const containerManzanas = document.getElementById('maps')

        containerManzanas.innerHTML = ''

        desarrollo.blocks.forEach((block) => {
            if (block !== null && block !== []) {
                block.forEach((manzana) => {
                    if (manzana?.path)
                        containerManzanas.insertAdjacentHTML(
                            'beforeend',
                            `<g class="cls-1" id="${
                                manzana.Numero
                            }" data-conatiner="${
                                manzana.Numero
                            }" >${this.parseOuterHTML(manzana?.path)}</g>`
                        )
                })
            }
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

            Keys.contacto.forEach((key) => {
                let input = document.querySelector(`input[name='${key}']`)

                if (CRMData[key]) {
                    input.value = CRMData[key]
                } else {
                    console.log('-----------------------------------------')
                    console.log('input', input)
                    console.log('No value', key)
                }
            })

            const btn_submit = document.getElementById('btn-submit')
            btn_submit.disabled = false
        }

        if (accout_id !== false) {
            console.log('UI accout_id: ', accout_id)
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
        console.time()
        const user = document.getElementById('user')
        const modal = document.getElementById('modal')
        const coo_id = document.getElementById('coordinadorValue').value
        // Datos campaña
        const campa_a = document.getElementById('campaignValue')
        const Campaign_id = campa_a.dataset?.campaignid
        const esDiferido = campa_a.dataset?.diferido
        const formadepago = campa_a.dataset?.formadepago
        const politica = campa_a.dataset?.politica

        const contactDiv = document.getElementById('contact')
        // Datos Formulario
        const checkApartado = document.querySelector('#hasApartado').checked
        const MontoTotal = document.querySelector(
            'input[name="Costo_Total_P"]'
        ).value
        const Apartado = document.querySelector(
            'input[name="Cantidad_RA"]'
        ).value
        const Enganche = document.querySelector(
            'input[name="Enganche_P"]'
        ).value

        const product_id = modal.dataset.crm_id
        const email = newData?.contacto?.Email
        const item = modal.dataset?.item
        let sku = modal.dataset?.sku
        let accountId,
            contact_id,
            accountName,
            id_contactBooks,
            productBooksId,
            Deal_id,
            creator_id,
            Consecutivo,
            plazosdiferido,
            name,
            temp_contact_id,
            temp_accout_id,
            contactName

        if (
            contactDiv.dataset?.contactid !== '' &&
            contactDiv.dataset?.contactid !== undefined &&
            contactDiv.dataset?.contactid !== 'undefined'
        ) {
            temp_contact_id = contactDiv.dataset?.contactid
            contactName = contactDiv.textContent
        } else {
            temp_contact_id = false
            contactName =
                newData.contacto.First_Name +
                ' ' +
                newData.contacto.Apellido_Paterno +
                ' ' +
                newData.contacto.Apellido_Materno
        }

        console.log('contactName', contactName)

        if (
            contactDiv.dataset?.accountid !== '' &&
            contactDiv.dataset?.accountid !== undefined &&
            contactDiv.dataset?.accountid !== 'undefined'
        ) {
            temp_accout_id = contactDiv.dataset?.accountid
        } else {
            temp_accout_id = false
        }

        // const email = 'asdfasdf@gmail.com'

        if (temp_contact_id == false) {
            console.log('if UI temp_contact_id: ', temp_contact_id)
            let conatctRequest = await crm.searchContact(email)

            console.log('UI conatctRequest: ', conatctRequest)

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

            if (conatctRequest.ok) {
                contact_id = conatctRequest.data[0].id
                // contacto existe en CRM
                console.log('Account_Name', conatctRequest.data[0].Account_Name)
                if (conatctRequest.data[0].Account_Name !== null) {
                    // Cuenta no encontrada
                    const createAccountRequest = await crm.createAccount(
                        accountData
                    )
                    console.log('UI createAccount: ', createAccountRequest)

                    accountId = createAccountRequest.data.details.id
                }
                const syncContact = await books.syncContact(contact_id)
                console.log('UI syncContact: ', syncContact)
                if (syncContact.ok) {
                    // contacto sincronizado en books
                    id_contactBooks = syncContact.data.customer_id
                }
            } else {
                // contacto no existe en CRM
                const createAccountRequest = await crm.createAccount(
                    accountData
                )

                accountId = createAccountRequest?.data?.details?.id
                // Create Contact
                const createContactRequest = await crm.CreateContact(
                    newData,
                    accountId
                )

                contact_id = createContactRequest?.data.details.id

                // validar si existe contacto en books
                if (createContactRequest.ok) {
                    const syncContact = await books.syncContact(contact_id)
                    if (syncContact.ok) {
                        // contacto sincronizado en books
                        id_contactBooks = syncContact?.data?.customer_id
                    }
                }
            }
        } else {
            console.log('else UI temp_contact_id: ', temp_contact_id)
            contact_id = temp_contact_id
            let update = this.checkUpdate(CRMData, newData)
            if (update) {
                const update = await crm.UpdateContact(newData)

                console.log('UI update: ', update)
            }
            console.log('UI temp_accout_id: ', temp_accout_id)
            if (temp_accout_id == false) {
                console.log('if UI temp_accout_id: ', temp_accout_id)
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
                const createAccountRequest = await crm.createAccount(
                    accountData
                )
                accountId = createAccountRequest.data.details.id
            } else {
                console.log('else UI temp_accout_id: ', temp_accout_id)
                accountId = temp_accout_id
                accountName = contactDiv.dataset?.accountname
            }

            let conatctRequest = await books.getContactByEmail(email)

            if (!conatctRequest.ok) {
                const syncContact = await books.syncContact(contact_id)

                id_contactBooks = syncContact.data.customer_id
            } else {
                id_contactBooks = conatctRequest.data.contact_id
            }
        }

        name = modal.dataset?.trato
        // Product
        if (sku === undefined) {
            let map = document.getElementById('map')
            const data = await crm.detailsFraccionamiento(
                map.dataset?.commerceId
            )

            let seccion = util.getSeccion(item, data.data)

            name = seccion?.item_name
            sku = seccion?.sku
        }

        const productBooksRequest = await books.getProductByName(name, sku)

        productBooksId = productBooksRequest.data.item_id

        if (!productBooksRequest.ok) {
            // Agregar Data Product

            const productData = {}
            const createProductRequest = await books.createProduct(productData)
            productBooksId = createProductRequest.data.item_id

            // Crear Producto en books
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

        const DealRequest = await crm.createDeal(DealData)
        console.log('DealRequest: ', DealRequest)
        if (DealRequest.ok) {
            Deal_id = DealRequest.data.details.id
            // validar modal.dataset.crm_id
            const productRequest = await crm.associateProduct(
                modal.dataset.crm_id,
                DealRequest.data.details.id
            )
        }

        console.log('accountId: ', accountId)
        console.log('contact_id: ', contact_id)
        console.log('id_contactBooks: ', id_contactBooks)
        console.log('productBooksId: ', productBooksId)
        console.log('Deal_id: ', Deal_id)

        if (
            accountId &&
            contact_id &&
            id_contactBooks &&
            productBooksId &&
            Deal_id
        ) {
            // Cotizacion
            const recordData = {
                data: {
                    IDOportunidad: Deal_id,
                    IDContactoCRM: contact_id,
                    NombreContacto: contactName,
                    Cuenta: accountName.toUpperCase(),
                    MododePago: 'EFECTIVO',
                    Propietario:
                        document.querySelector('.name_user').textContent,
                    EmailContacto: newData.contacto.Email,
                    Contacto: contactName,
                    // ReportarApartado: checkApartado,
                    IDProductoBooks: productBooksId,
                },
            }
            const createCotizacion = await creator.createRecord(recordData)
            console.log('createCotizacion: ', createCotizacion)
            if (createCotizacion.ok) {
                creator_id = createCotizacion.data?.ID
                const CotizacionRequest = await creator.getRecord(creator_id)

                if (CotizacionRequest.ok) {
                    let mensualidad = document.querySelector(
                        `input[name="Pago_Mensual_P"]`
                    ).value
                    let apartado = document.querySelector(
                        `input[name="Cantidad_RA"]`
                    ).value

                    Consecutivo = CotizacionRequest.data?.Consecutivo
                    const updateDeal = await crm.updateDeal({
                        id: Deal_id,
                        Numero_de_Cierre: Consecutivo,
                    })
                    plazosdiferido = Number(campa_a.dataset.plazosdiferido)

                    let today = new Date()
                    let date = util.addDate(today, 'D', 7)
                    let des = ''

                    if (formadepago == 'Contado') {
                        des = formadepago
                    } else {
                        des = politica
                    }

                    let arrInvoices = []
                    if (checkApartado) {
                        arrInvoices.push(
                            util.JSON_invoice(
                                id_contactBooks,
                                Consecutivo,
                                today,
                                productBooksId,
                                'Pago por Concepto de Apartado',
                                apartado,
                                Deal_id,
                                'No'
                            )
                        )

                        if (esDiferido === 'true') {
                            let mensualidadEnganche = Enganche / plazosdiferido
                            for (let i = 1; i <= plazosdiferido; i++) {
                                if (i == 1) {
                                    let rate = mensualidadEnganche - apartado
                                    arrInvoices.push(
                                        util.JSON_invoice(
                                            id_contactBooks,
                                            Consecutivo,
                                            date,
                                            productBooksId,
                                            'Pago por Concepto de Complemento de Enganche Diferido',
                                            rate,
                                            Deal_id,
                                            'Si'
                                        )
                                    )
                                } else {
                                    arrInvoices.push(
                                        util.JSON_invoice(
                                            id_contactBooks,
                                            Consecutivo,
                                            date,
                                            productBooksId,
                                            'Pago por Concepto de Enganche Diferido',
                                            mensualidadEnganche,
                                            Deal_id,
                                            'No'
                                        )
                                    )
                                }
                                date = util.addDate(date, 'M', 1)
                            }
                        } else {
                            let rate = 0
                            if (des == 'Enganche') {
                                rate = Enganche - apartado
                            } else if (des == 'Primer Mensualidad') {
                                rate = mensualidad - apartado
                            } else if (des == 'Contado') {
                                rate = MontoTotal - apartado
                            }

                            arrInvoices.push(
                                util.JSON_invoice(
                                    id_contactBooks,
                                    Consecutivo,
                                    date,
                                    productBooksId,
                                    `Pago por Concepto de Complemento de ${des}`,
                                    rate,
                                    Deal_id,
                                    'Si'
                                )
                            )
                        }
                    } else {
                        if (esDiferido === 'true') {
                            let rate = Enganche / plazosdiferido
                            for (let i = 1; i <= plazosdiferido; i++) {
                                arrInvoices.push(
                                    util.JSON_invoice(
                                        id_contactBooks,
                                        Consecutivo,
                                        today,
                                        productBooksId,
                                        'Pago por Concepto de Enganche Diferido',
                                        rate,
                                        Deal_id,
                                        'No'
                                    )
                                )
                                today = util.addDate(today, 'M', 1)
                            }
                        } else {
                            let rate = 0
                            if (des == 'Enganche') {
                                rate = Enganche
                            } else if (des == 'Primer Mensualidad') {
                                rate = mensualidad
                            } else if (des == 'Contado') {
                                rate = MontoTotal
                            }
                            arrInvoices.push(
                                util.JSON_invoice(
                                    id_contactBooks,
                                    Consecutivo,
                                    today,
                                    productBooksId,
                                    `Pago por Concepto de ${des}`,
                                    rate,
                                    Deal_id,
                                    'No'
                                )
                            )
                        }
                    }
                    console.table(arrInvoices)

                    for (let i = 0; i < arrInvoices.length; i++) {
                        const invoiceRequest = await books.createInvoice(
                            arrInvoices[i]
                        )
                        console.log(
                            `UI createInvoice: index ${i}', ${invoiceRequest}`
                        )
                    }

                    // Create Invoices
                    // arrInvoices.forEach(async (invoice, index) => {
                    //     const invoiceRequest = await books.createInvoice(
                    //         invoice
                    //     )
                    //     console.log(
                    //         `UI createInvoice: index ${index}', ${invoiceRequest}`
                    //     )
                    // })
                }
            }
        }
        console.timeEnd()
    },
    fechaDePago(date) {},
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
                    data-accountname="${record.Account_Name?.name}"
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
        contactContainer.dataset.accountname =
            selectedOption.dataset.accountname === undefined
                ? null
                : selectedOption.dataset.accountname

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
                        <span data-politica=${record.Tipo_de_Politica} data-formadepago=${record.Tipo_de_Promocion} data-diferido=${record.Diferido} data-plazosdiferido=${record.Plazos_Diferido}>${record.Campaign_Name}</span>
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
        console.log(selectedOption)
        campaignInput.value = ''
        campaignInput.value = selectedOption.children[0].textContent
        campaignInput.dataset.campaignid = selectedOption.dataset.campaignid
        campaignInput.dataset.politica =
            // selectedOption.children[1].dataset.politica
            selectedOption.children[1].textContent
        campaignInput.dataset.formadepago =
            selectedOption.children[0].dataset.formadepago
        campaignInput.dataset.diferido =
            selectedOption.children[0].dataset.diferido
        campaignInput.dataset.plazosdiferido =
            selectedOption.children[0].dataset.plazosdiferido
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

                // ###### PENDIENTE: AGREGAR DESCUENTO

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

        let manzana = parseInt(numManzana)
        let secciones_array = data.Secciones
        console.log('secciones_array', secciones_array)
        secciones_array.forEach((e) => {
            if (manzana >= e.init && manzana <= e.end) {
                if (e.lots != null && manzana == e.end) {
                    if (numLote >= e.lots.init && numLote <= e.lots.end) {
                        item_name = data.code + ' ' + e.name1 + ' ' + item
                        sku = item_array[0] + '' + e.symbol + '' + item_array[1]
                        seccion_id = e.id.toString()
                        if (e.name1) {
                            nombre_fracionamiento = data.Name + ' ' + e.name1
                        } else {
                            nombre_fracionamiento = data.Name
                        }
                    }
                } else {
                    item_name = data.code + ' ' + e.name1 + ' ' + item
                    sku = item_array[0] + '' + e.symbol + '' + item_array[1]
                    seccion_id = e.id.toString()
                    if (e.name1) {
                        nombre_fracionamiento = data.Name + ' ' + e.name1
                    } else {
                        nombre_fracionamiento = data.Name
                    }
                }
            }
        })
        return { item_name, sku, seccion_id, nombre_fracionamiento }
    },
    JSON_invoice(
        id_contactBooks,
        Consecutivo,
        date,
        productBooksId,
        description,
        rate,
        idOportunidad,
        complemento
    ) {
        let due_date = this.addDate(date, 'D', 7)

        const dataInvice = {
            customer_id: id_contactBooks,
            reference_number: `GC-${Consecutivo}`,
            date: date.toISOString().split('T')[0],
            due_date: due_date.toISOString().split('T')[0],
            zcrm_potential_id: idOportunidad,
            // custom_fields: [
            //     {
            //         label: 'Commerce',
            //         value: 'Widget',
            //     },
            // ],
            custom_fields: [
                {
                    label: 'Modo de Pago',
                    value: 'EFECTIVO',
                },
                {
                    label: 'Complemento',
                    value: complemento,
                },
            ],
            line_items: [
                {
                    item_id: productBooksId,
                    description: description,
                    quantity: 1,
                    rate: rate,
                },
            ],
        }
        return dataInvice
    },
    addDate(date, type, num) {
        let addMonth = new Date(date)

        console.log('Util addDate addMonth: ', addMonth)

        if (type == 'D') {
            addMonth.setDate(date.getDate() + num)
        } else if (type == 'M') {
            addMonth.setMonth(date.getMonth() + num)
        } else if (type == 'Y') {
            addMonth.setYear(date.getYear() + num)
        }
        console.log('Util addDate addMonth: ', addMonth)
        return addMonth
    },
}

export default UI
