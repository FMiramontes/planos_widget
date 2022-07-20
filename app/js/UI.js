import { crm, creator, books, cliq } from './Zoho.js'
import alerts from './alertas.js'
import Mapas from './mapas.js'
import valid from './validate.js'

let desarrollo = new Array()

let beforeManzana = ''

const containerDeals = document.getElementById('container-deals')
let dealsCards
let loader = document.getElementById('loader-top')
const UI = {
    async loadMenuLateral() {
        const data = await crm.getAllFraccionamientos()

        if ((data.ok = true)) {
            const menu = document.getElementById('menu-lateral')
            data.data.forEach((i, index) => {
                let frac = document.createElement('div')
                frac.dataset.localidad = i.Localidad
                frac.dataset.index = index
                frac.dataset.name = i.Name
                frac.dataset.id = i.id

                frac.classList = 'fracionamiento'
                frac.innerHTML = `
                                <div class="nombre-desarrollo">${i.Name}</div>
                                <div class="container-img"><img src="${i.logo}" alt="" loading="lazy"></div>
                        `
                menu.appendChild(frac)
            })

            menu.addEventListener('click',util.debounce( async (e) => {
                if (e.target.matches('[data-index]')) {
                    let containerMap = document.getElementById('map')
                    let loader = document.getElementById('loader-mapa')
                    let contenedorFracc = document.getElementById('logo-fracc')

                    loader.style.display = 'flex'
                    containerMap.style.display = 'none'
                    contenedorFracc.style.display = 'none'
                    let name = e.target.dataset.name.toLowerCase()
                    const nameSvg = name.replaceAll(' ', '-')

                    let tempDesartollo = await fetch(
                        `./desarrollos-js/${nameSvg}/${nameSvg}.json`
                    )

                    desarrollo = await tempDesartollo.json()
                    let svgDesarrollo = document.querySelector('svg')
                    let viewBoxSvg = desarrollo.viewBoxSVG[0]
                    svgDesarrollo.setAttribute('viewBox', viewBoxSvg)

                    const style = document.getElementById('style')
                    style.innerHTML = `@import url(./css/desarrollos/${nameSvg}.css);`

                    data.data.forEach((i) => {
                        if (i.Name.toLowerCase() == name) {
                            contenedorFracc.innerHTML = `
                            <div class="img-fracc"><img src="${i.logo}" alt="" loading="lazy"></div>
                            `
                            let nombreFracc =
                                document.querySelector('.nombre-fracc')
                            nombreFracc.innerText = `${i.Name}`
                        }
                    })

                    beforeManzana = ''

                    this.loadPlano(e)
                    loader.style.display = 'none'
                    let bordeSvg = document.querySelector('.map svg')
                    bordeSvg.style.boxShadow =
                        'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                    containerMap.style.display = 'flex'
                    contenedorFracc.style.display = 'flex'

                    let resetButton = document.getElementById('zoom-reset')

                    resetButton.click()
                }
            }))
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
    async loadPlano(e) {
        this.getSVG()

        const mapa = document.getElementById('map')

        const id = e.target.dataset.id
        const name = e.target.dataset.name
        const localidad = e.target.dataset.localidad

        mapa.dataset.name = name
        mapa.dataset.commerceId = id
        mapa.dataset.localidad = localidad
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
                            }" >${util.parseOuterHTML(manzana?.path)}</g>`
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
                    util.parseOuterHTML(d)
                )
            })
        })
    },
    async paintDataInForm(contact_id, accout_id) {
        let contactData = new Array()
        let accountData = new Array()

        contactData = await crm.getContact(contact_id)

        if (contactData.ok === true) {
            // pintar informacion en Formulario
            const Keys = util.getKeysForm()
            const CRMData = contactData.data

            Keys.contacto.forEach((key) => {
                let input = document.querySelector(`[name='${key}']`)

                if (CRMData[key]) {
                    if (input.type === 'checkbox') {
                        input.checked = CRMData[key]
                    } else {
                        input.value = CRMData[key]
                    }
                }
            })
            this.addRecursos(CRMData)
        }

        if (accout_id !== false) {
            accountData = await crm.getAccount(accout_id)
        }
    },
    async validate(CRMData, newData) {
        loader.style.display = 'block'
        try {
            const inputSearchDeals = document.getElementById('search-deal')
            const user = document.getElementById('user')
            const modal = document.getElementById('modal')
            const coo_id = document.getElementById('coordinadorValue').value
            const vend = document.querySelector('#vendorsValue')

            // Datos campaña
            const campa_a = document.getElementById('campaignValue')
            const Campaign_id = campa_a.dataset?.campaignid
            const esDiferido = campa_a.dataset?.diferido
            const formadepago = campa_a.dataset?.formadepago
            const politica = campa_a.dataset?.politica

            const contactDiv = document.getElementById('contact')
            let tipoDeCompra = ''
            if (contactDiv?.dataset?.lead == 'true') {
                tipoDeCompra = 'Cliente nuevo'
            } else {
                tipoDeCompra = 'Recompra'
            }

            if (contactDiv.children.length == 0) tipoDeCompra = 'Cliente nuevo'
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
            const inputDescuento = document.querySelector(
                'input[name="Costo_Descuento_P"]'
            ).value

            const product_id = modal.dataset.crm_id
            const email = newData?.contacto?.Email
            const item = modal.dataset?.item
            let sku = modal.dataset?.sku
            let Deal_id
            let creator_id
            let Consecutivo
            let plazosdiferido
            let productName
            let productBooksId

            // logica de contacto **************************************
            const params = { contactDiv, user, vend, newData, CRMData, email }
            const {
                accountId,
                contact_id,
                accountName,
                id_contactBooks,
                contactName,
            } = await this.contacto(params)

            // logica de Producto  **************************************
            productName = modal.dataset?.trato

            if (sku === undefined) {
                let map = document.getElementById('map')
                const data = await crm.detailsFraccionamiento(
                    map.dataset?.commerceId
                )

                let seccion = util.getSeccion(item, data.data)

                productName = seccion?.item_name
                sku = seccion?.sku
            }

            const productBooksRequest = await books.getProductByName(
                productName,
                sku
            )

            productBooksId = productBooksRequest.data.item_id
            // agregar
            if (!productBooksRequest.ok) {
                throw new Error(
                    'Producto no creado en Books. Contactar al Administrador'
                )
            }
            // logica de Deal **************************************
            const coordinadorArray = []
            coordinadorArray.push(coo_id)

            let today = new Date()
            let date = util.addDate(today, 'D', 7)

            const tipoCompra =
                campa_a.dataset?.formadepago == 'Financiado'
                    ? 'Crédito'
                    : 'Contado'

            const DealData = {
                Deal_Name: modal.dataset.trato,
                Nombre_de_Producto: { id: product_id },
                Account_Name: { id: accountId },
                // Amount: newData.presupuesto.Saldo_Pagar_P,
                Departamento: newData.contacto.Departamento,
                Modo_de_pago: [newData.presupuesto.Modo_de_pago],
                Lead_Source: newData.contacto.Lead_Source,
                Type: tipoDeCompra,
                Tipo_de_Compra1: tipoCompra,
                Carta_Compromiso: newData.presupuesto?.Carta_Compromiso,	
                Plazo_Compromiso: newData.presupuesto?.Plazo_Compromiso,	
                Monto_Compromiso: newData.presupuesto?.Monto_Compromiso	,	
                Sucursal_de_Firma: newData.presupuesto.Sucursal_de_Firma,
                Operadores_de_Unidad_de_Venta: newData.presupuesto.Operadores_de_Unidad_de_Venta,
                Tipo_de_Venta: newData.presupuesto.Tipo_de_Venta,
                Amount:
                    inputDescuento !== ''
                        ? parseFloat(inputDescuento)
                        : MontoTotal,
                Stage: 'Presentación del Producto',
                Closing_Date: date.toISOString().split('T')[0],
                Campaign_Source: { id: Campaign_id },
                Contact_Name: { id: contact_id },
                Coordinador: coordinadorArray,
                Gerente: newData.presupuesto.Gerente,
            }

            if (user.dataset.profile === 'Vendedor') {
                // Usuario con perfil de Vendedor
                DealData.Owner = { id: user.dataset.crmuserid }
            } else {
                // No es un usuario con perfil de Vendedor
                DealData.Owner = { id: vend.dataset.vendedorid }
            }

            const DealRequest = await crm.createDeal(DealData)
            if (DealRequest.ok) {
                alerts.showAlert('success', 'Trato creado en CRM')
                Deal_id = DealRequest.data.details.id
                // validar modal.dataset.crm_id
                const productRequest = await crm.associateProduct(
                    modal.dataset.crm_id,
                    DealRequest.data.details.id
                )
            } else {
                throw new Error('No se pudo crear el trato')
            }

            // logica de descuento **************************************
            this.descuentos(product_id, productBooksId, Campaign_id)

            // Crear Cotizacion **************************************
            let des = ''

            if (formadepago == 'Contado') {
                des = formadepago
            } else {
                des = politica
            }

            const fecha = util.fechaDePago(des)

            if (
                accountId &&
                contact_id &&
                id_contactBooks &&
                productBooksId &&
                Deal_id
            ) {
                const detailsJson = {
                    IDOportunidad: Deal_id,
                    IDContactoCRM: contact_id,
                    NombreContacto: contactName,
                    Cuenta: accountName.toUpperCase() || '',
                    MododePago: 'EFECTIVO',
                    Propietario:
                        user.dataset.profile === 'Vendedor'
                            ? document.querySelector('.name_user').textContent
                            : vend.value,
                    EmailContacto: newData.contacto.Email,
                    Contacto: contactName,
                    IDProductoBooks: productBooksId,
                    Fraccionamiento:
                        document.querySelector(
                            'input[name="Fraccionamiento_P"]'
                        ).value || '',
                    ContactoZBooks: id_contactBooks,
                    Dimemsiones:
                        document.querySelector('input[name="dimension"]')
                            .value || 0,
                    Costo_M2:
                        document.querySelector('input[name="Costo_M2"]')
                            .value || 0,
                    Fecha: util.formatDate(new Date()),
                    FechadePago: util.formatDate(fecha),
                }
                const jsonCotizacion = await util.createCotizacion(
                    DealData,
                    Campaign_id,
                    detailsJson
                )

                const recordData = {
                    data: {
                        ...jsonCotizacion,
                    },
                }

                const createCotizacion = await creator.createRecord(recordData)

                if (createCotizacion.ok) {
                    alerts.showAlert('success', 'Cotizacion creada')
                    creator_id = createCotizacion.data?.ID
                    const CotizacionRequest = await creator.getRecord(
                        creator_id
                    )

                    if (CotizacionRequest.ok) {
                        // logica de facturas **************************************
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

                        // Creacion de facturas
                        const paramsObject = {
                            id_contactBooks,
                            Consecutivo,
                            date,
                            today,
                            productBooksId,
                            apartado,
                            Deal_id,
                        }
                        const factObject = {
                            checkApartado,
                            esDiferido,
                            plazosdiferido,
                            Enganche,
                            inputDescuento,
                            des,
                            mensualidad,
                            MontoTotal,
                        }
                        this.facturas(factObject, paramsObject)

                        // Cambiar estado de producto a cotizacion
                        await crm.updateProduct({
                            id: product_id,
                            Estado: 'Cotización',
                        })
                        this.refreshManzana()

                        // End of process
                        // Reset values

                        campa_a.value = ''
                        document.querySelector(
                            'input[name="Costo_Descuento_P"]'
                        ).value = ''
                        document.querySelector('#coordinadorValue').value = ''
                        vend.value = ''
                        util.removeDatasets('#campaignValue')
                        util.removeDatasets('input[name="Costo_M2"]')
                        await this.paintDeals()
                        this.searchDeals(inputSearchDeals.value.toLowerCase(), user.dataset.admin, user.dataset.crmuserid)
                        util.removeDatasets('[name="Cantidad_RA"]')
                        util.removeDatasets('#vendorsValue')
                    }
                } else {
                    throw new Error('No se pudo crear cotizacion')
                }
            }
            this.removeContact()
            alerts.showAlert('finish', 'Proceso finalizado!')
        } catch (error) {
            if (error.message == 'Proceso omitido por el usuario') {
                alerts.showAlert('warning', error.message)
            } else {
                alerts.showAlert('danger', error.message)
            }
        }
        console.timeEnd()
        loader.style.display = 'none'
    },
    async facturas(factObject, paramsObject) {
        let { date, today } = paramsObject
        const {
            id_contactBooks,
            Consecutivo,
            productBooksId,
            apartado,
            Deal_id,
        } = paramsObject
        const {
            checkApartado,
            esDiferido,
            plazosdiferido,
            Enganche,
            inputDescuento,
            des,
            mensualidad,
            MontoTotal,
        } = factObject
        let arrInvoices = new Array()
        if (checkApartado) {
            // Tiene Apartado
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
                // arrInvoices.push(
                //     util.JSON_invoice(
                //         id_contactBooks,
                //         Consecutivo,
                //         date,
                //         productBooksId,
                //         'Pago por Concepto de Enganche Diferido',
                //         mensualidadEnganche,
                //         Deal_id,
                //         'No'
                //     )
                // )

                // date = util.addDate(date, 'M', 1)
            } else {
                // Factura de Complemento
                let rate = 0
                if (des == 'Enganche') {
                    rate = Enganche - apartado
                } else if (des == 'Primer Mensualidad') {
                    rate = mensualidad - apartado
                } else if (des == 'Contado') {
                    const tempRate =
                        inputDescuento !== ''
                            ? parseFloat(inputDescuento)
                            : MontoTotal
                    rate = tempRate - apartado
                    // rate = MontoTotal - apartado
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
            // Facturas de diferido
            if (esDiferido === 'true') {
                let rate = Enganche / plazosdiferido
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
                // today = util.addDate(today, 'M', 1)
            } else {
                // Factura directa
                let rate = 0
                if (des == 'Enganche') {
                    rate = Enganche
                } else if (des == 'Primer Mensualidad') {
                    rate = mensualidad
                } else if (des == 'Contado') {
                    const tempRate =
                        inputDescuento !== ''
                            ? parseFloat(inputDescuento)
                            : MontoTotal
                    rate = tempRate
                    // rate = MontoTotal
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
            const invoiceRequest = await books.createInvoice(arrInvoices[i])
            if (invoiceRequest.ok) {
                //Send Invoice
                const sendInvoiceRequest = await books.sendInvoice(
                    invoiceRequest.data.invoice.invoice_id
                )
                if (sendInvoiceRequest.ok) {
                    alerts.showAlert(
                        'success',
                        'Factura creada y enviada en Books'
                    )
                } else {
                    alerts.showAlert(
                        'success',
                        'Factura creada en estado borrador Books'
                    )
                }
            } else {
                alerts.showAlert(
                    'warning',
                    'Hubo un problema al intentar crear factura'
                )
            }
        }
    },
    async createLead(dataForm) {
        const createLead = confirm('Desea crear el Posible cliente ')
        loader.style.display = 'block'
        if (createLead) {
            const requestLead = await crm.searchContact(
                dataForm.contacto.Email,
                'Leads'
            )
            const requestContact = await crm.searchContact(
                dataForm.contacto.Email,
                'Contacts'
            )
            if (requestLead.ok || requestContact.ok) {
                alerts.showAlert(
                    'warning',
                    `El correo ${dataForm.contacto.Email}, ya se encuentra en crm !!`
                )
            } else {
                const modal = document.getElementById('modal')
                const fraccionamientoId = modal.dataset.fracc_id
                const user = document.getElementById('user')
                let ownerId
                if (user?.dataset?.profile === 'Vendedor') {
                    ownerId = user.dataset.crmuserid
                } else {
                    const user = document.getElementById('vendorsValue')
                    ownerId = user.dataset.vendedorid
                }

                const createLeadRequest = await crm.createLead(
                    dataForm,
                    ownerId,
                    fraccionamientoId
                )
                if (createLeadRequest.ok) {
                    alerts.showAlert('finish', 'Posible cliente creado')
                } else {
                    alerts.showAlert(
                        'danger',
                        'El posible cliente no pudo ser creado !!'
                    )
                }
            }
        }
        loader.style.display = 'none'
    },
    async cliqLoteFaltante(frac, id) {
        let msg =
            'Se intento cotizar el producto: ' +
            id +
            ' del fraccionamiento: ' +
            frac +
            ' Se requiere crearlo para continuar'
        const envio = await cliq.postToChannel('lotesfaltantes', msg)
        if (envio.ok) {
            alerts.showAlert(
                'success',
                'Se posteo correctamente dentro del canal'
            )
        }
    },
    async searchContact() {
        const searchValue = document.querySelector('#search-value').value
        const resultContainer = document.querySelector('#contact-results')
        resultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchContact(searchValue)

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
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
    async searchCustomer() {
        const searchValue = document.querySelector('#search-value').value
        const resultContainer = document.querySelector('#contact-results')
        const searchLabel = document.querySelector('.module-switch label')

        const searchModule = searchLabel.dataset.modulesearch
        resultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchContact(
                searchValue,
                searchModule
            )

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')
                    console.log('record: ', record)
                    if (searchModule === 'Contacts') {
                        temp.innerHTML = `
                        <div 
                        data-module="contact"
                        data-contactid="${record.id}" 
                        data-accountid="${record.Account_Name?.id}"
                        data-accountname="${record.Account_Name?.name}"
                        data-record="" class="record">
                                <span data-contact-name><i class="fa-solid fa-user"></i>${record.Full_Name}</span>
                                <p data-record-email="" ><i class="fa-solid fa-envelope"></i><span>${record.Email}</span></p>
                                <p data-record-mobile="" ><i class="fa-solid fa-phone"></i>${record.Mobile}</p>
                                <p data-record-phone="" ><i class="fa-solid fa-mobile-screen-button"></i>${record.Phone}</p>
                        </div>`
                    } else {
                        temp.innerHTML = `
                        <div 
                        data-module="leads"
                        data-leadid="${record.id}" 
                        data-record="" class="record">
                                <span data-contact-name><i class="fa-solid fa-user"></i>${record.Full_Name}</span>
                                <p data-record-email="" ><i class="fa-solid fa-envelope"></i><span>${record.Email}</span></p>
                                <p data-record-mobile="" ><i class="fa-solid fa-phone"></i>${record.Mobile}</p>
                                <p data-record-phone="" ><i class="fa-solid fa-mobile-screen-button"></i>${record.Phone}</p>
                        </div>`
                    }

                    var frag = temp.content
                    df.appendChild(frag)
                })

                resultContainer.append(df)
            } else {
                var temp = document.createElement('template')

                temp.innerHTML = `
                <div class="record">
                    <span data-contact-name>Sin resultados</span>
                </div>`
                var frag = temp.content
                resultContainer.append(frag)
            }
        }
    },
    async paintDeals() {
        const user = document.getElementById('user')
        let userAdmin = user.dataset.admin
        let userId = user.dataset.crmuserid
        containerDeals.innerHTML = ''
        let dataDeals
        if (userAdmin) {
            dataDeals = await crm.getAllDeals()
        } else {
            dataDeals = await crm.serchDealsByOwner(userId)
        }

        if (dataDeals.ok) {
            dealsCards = dataDeals?.data
            UI.paintCards(dataDeals?.data, userAdmin, userId)
        }
    },
    async selectLead(selectedOption) {
        const hasEmail = selectedOption.children[1].children[1].textContent
        if (hasEmail == 'null') {
            alerts.showAlert(
                'warning',
                'No tiene un correo asociado. Favor de capturar en CRM'
            )
            return
        }
        const convert = confirm('Desea convertir al Posible cliente a Contacto')
        const userID = document.getElementById('user').dataset.crmuserid
        if (convert) {
         loader.style.display= 'block';
            // Logica para convertir lead
            const leadId = selectedOption.dataset.leadid
            if (leadId !== undefined) {
                const convertLead = await crm.convertToContact(leadId, userID)
                console.log('convertLead: ', convertLead)
                if (convertLead.ok) {
                    alerts.showAlert('success', 'Lead convertido a Contacto')
                    const data = convertLead.data
                    const contactContainer = document.querySelector('#contact')
                    contactContainer.innerHTML = ''

                    const contactContainerResults =
                        document.querySelector('#contact-results')
                    contactContainerResults.classList.add('active')

                    contactContainer.dataset.contactid = data.Contacts
                    contactContainer.dataset.accountid = data.Accounts
                    contactContainer.dataset.accountname =
                        selectedOption.firstElementChild.innerText
                    contactContainer.dataset.lead = true

                    // Display contact
                    contactContainer.textContent =
                        selectedOption.firstElementChild.innerText

                    // Add remove user button
                    contactContainer.insertAdjacentHTML(
                        'beforeend',
                        `
        <button id="deleteContact" class="close-button" type="button" data-close>
        <span aria-hidden="true">&times;</span>
        </button>`
                    )

                    const deleteContact =
                        document.getElementById('deleteContact')
                    deleteContact.addEventListener('click', (e) => {
                        util.cleanForm()
                    })
                } else {
                    if (convertLead.message == 'DUPLICATE_DATA') {
                        alerts.showAlert('warning', 'Contacto Duplicado')
                    } else {
                        alerts.showAlert(
                            'warning',
                            'El contacto no se pudo sincronizar!!'
                        )
                    }
                }
            }
        }
        loader.style.display= 'none';
    },
    async searchCampaign() {
        const searchValue = document.querySelector('#campaignValue').value
        const fraccionamientoId =
            document.querySelector('#modal').dataset.fracc_id || ''

        const campaignResultContainer =
            document.querySelector('#campaign-results')

        campaignResultContainer.classList.add('active')

        campaignResultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchCampaigns(
                searchValue,
                fraccionamientoId
            )

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')
                    temp.innerHTML = `
                    <div data-campaignid="${record.id}" data-module="campaign" data-result="found" class="record">
                        <span data-politica=${record.Tipo_de_Politica} data-formadepago=${record.Tipo_de_Promocion} data-diferido=${record.Diferido} data-plazosdiferido=${record.Plazos_Diferido}>${record.Campaign_Name}</span>
                        <p data-politica="" >${record.Tipo_de_Politica}</p>
                        <p data-formadepago="" >${record.Tipo_de_Promocion}</p>
                    </div>`

                    let frag = temp.content
                    df.appendChild(frag)
                })

                campaignResultContainer.append(df)
            } else {
                let temp = document.createElement('template')

                temp.innerHTML = `
                <div data-module="campaign" data-result="not-found" class="record">
                    <span data-contact-name>Sin resultados</span>
                </div>`
                let frag = temp.content
                campaignResultContainer.append(frag)
            }
        }
    },
    async fillCampaignDetails() {
        const campaignInput = document.querySelector('#campaignValue')
        const campaignId = campaignInput.dataset.campaignid

        // Form Presupuesto fields
        const fieldCosto = document.querySelector(`input[name="Costo_Total_P"]`)
        const fieldMensualidades = document.querySelector(
            `input[name="Pago_Mensual_P"]`
        )
        const fieldEnganche = document.querySelector(`input[name="Enganche_P"]`)
        const fieldApartado = document.querySelector(
            `input[name="Cantidad_RA"]`
        )
        const fieldSaldo = document.querySelector(`input[name="Saldo_Pagar_P"]`)
        const fieldPlazo = document.querySelector(`input[name="Plazo_P"]`)
        const fieldConDescuento = document.querySelector(
            `input[name="Costo_Descuento_P"]`
        )

        // Clear values
        fieldMensualidades.value = ''
        fieldEnganche.value = ''
        fieldApartado.value = ''
        fieldSaldo.value = ''
        fieldPlazo.value = ''
        fieldConDescuento.value = ''

        if (campaignId !== null) {
            const getCampaignRequest = await crm.getCampaign(campaignId)
            if (getCampaignRequest.ok) {
                const campaignData = getCampaignRequest.data

                // Variables
                let precioFinalProducto = 0
                let enganche = 0
                const inputCosto = document.querySelector(
                    `input[name="Costo_M2"]`
                )

                // CRM Campaign fields
                const formaDePago = campaignData.Tipo_de_Promocion
                const politicaCampana = campaignData.Tipo_de_Politica
                const tipoDeDescuento = campaignData.Tipo_de_Descuento
                // Obtener costo x m2
                const requestModule = await crm.getFraccionamiento(
                    campaignData.Fraccionamientos.id
                )
                const moduleData = requestModule.data
                inputCosto.dataset.m2_original = moduleData?.Precio_de_lista_M2
                console.log("sin_precio_de_lista: ",moduleData.sin_precio_de_lista)
                if(!moduleData.sin_precio_de_lista){
                    if (
                        campaignData.Fraccionamientos.id != null &&
                        formaDePago === 'Financiado' &&
                        politicaCampana === 'Primer Mensualidad'
                    ) {
                        const costoM2_sinEnganche =
                            moduleData.Precio_de_lista_M2_Sin_Enganche

                        inputCosto.value = costoM2_sinEnganche.toFixed(2)
                        inputCosto.dataset.m2_update = 'true'
                    } else {
                        const costoM2_Enganche = moduleData.Precio_de_lista_M2
                        const inputCosto = document.querySelector(
                            `input[name="Costo_M2"]`
                        )
                        inputCosto.value = costoM2_Enganche.toFixed(2)
                    }
                }

                // Form Product field values
                const DIMENSIONES = document.querySelector(
                    `input[name="dimension"]`
                ).value
                let COSTO_M2 = document.querySelector(
                    `input[name="Costo_M2"]`
                ).value

                // Consultar lotificacion si es esquina
                const modal = document.querySelector('#modal')
                const esEsquina = modal.dataset.esquina
                if (esEsquina !== undefined && esEsquina === 'true') {
                    // Se le agrega 10 dlls a precio x m2
                    const costo = document.querySelector(
                        `input[name="Costo_M2"]`
                    )
                    costo.dataset.m2_update = 'true'
                    const newCosto = parseFloat(costo.value) + 10
                    costo.value = newCosto.toFixed(2)
                    COSTO_M2 = newCosto.toFixed(2)

                    // Si producto es esquina, tiene una campana de contado con descuento tipo monto, no se le debe agregar 10 dlls.
                    if (
                        tipoDeDescuento === 'Monto' &&
                        formaDePago === 'Contado'
                    ) {
                        const newCosto = parseFloat(costo.value) - 10
                        costo.value = newCosto.toFixed(2)
                        COSTO_M2 = newCosto.toFixed(2)
                    }
                }

                const COSTO_PRODUCTO =
                    parseFloat(DIMENSIONES) * parseFloat(COSTO_M2)

                // Apartado
                if (campaignData.Tipo_de_Apartado != null) {
                    if (campaignData.Tipo_de_Apartado === 'Monto') {
                        fieldApartado.value = campaignData.Monto_de_Apartado
                        fieldApartado.dataset.minvalue =
                            campaignData.Monto_de_Apartado
                    } else if (campaignData.Tipo_de_Apartado === 'Porcentaje') {
                        // Calcular apartado
                        const porcentaje =
                            campaignData.Porcentaje_de_Apartado / 100
                        const apartadoValue = COSTO_PRODUCTO * porcentaje
                        fieldApartado.value = apartadoValue.toFixed(2)
                        fieldApartado.dataset.minvalue =
                            apartadoValue.toFixed(2)
                    }
                }

                // Calcular descuento
                if (tipoDeDescuento != null) {
                    if (tipoDeDescuento == 'Monto') {
                        let montoDeDescuento = campaignData.Monto_Descuento
                        let costo_temp = COSTO_M2 - montoDeDescuento
                        precioFinalProducto = costo_temp * DIMENSIONES
                    } else if (tipoDeDescuento == 'Porcentaje') {
                        let porcentajeDescuento =
                            campaignData.Porcentaje_Descuento / 100
                        let descuentoPorcentaje =
                            DIMENSIONES * COSTO_M2 * porcentajeDescuento
                        precioFinalProducto =
                            DIMENSIONES * COSTO_M2 - descuentoPorcentaje
                    }
                    // Assign value to 'descuento' field when discount is applicable
                    fieldConDescuento.value = precioFinalProducto.toFixed(2)
                } else {
                    precioFinalProducto = COSTO_PRODUCTO
                }

                if (formaDePago != 'Contado') {
                    // Financiado
                    if (politicaCampana == 'Primer Mensualidad') {
                        // Assign values
                        fieldCosto.value = precioFinalProducto.toFixed(2)
                        const mensualidad =
                            precioFinalProducto / campaignData.Mensualidades
                        fieldMensualidades.value = mensualidad.toFixed(2)
                        fieldPlazo.value = campaignData.Mensualidades
                    } else if (politicaCampana == 'Enganche') {
                        const tipoEnganche = campaignData.Tipo_de_Enganche

                        if (tipoEnganche == 'Monto') {
                            enganche = campaignData.Monto_de_Enganche
                        } else if (tipoEnganche == 'Porcentaje') {
                            const porcEnganche =
                                campaignData.Porcentaje_de_Enganche / 100
                            enganche = COSTO_PRODUCTO * porcEnganche
                        }

                        // Assign values
                        const saldoPagar = precioFinalProducto - enganche

                        fieldEnganche.value = enganche.toFixed(2)
                        fieldSaldo.value = saldoPagar.toFixed(2)
                        const mensualidad =
                            saldoPagar / campaignData.Mensualidades
                        fieldMensualidades.value = mensualidad.toFixed(2)
                        fieldPlazo.value = campaignData.Mensualidades
                    }
                } else {
                    // Contado
                    // Assign values
                    // fieldCosto.value = precioFinalProducto.toFixed(2)
                }

                // Assign Unit Price to field
                fieldCosto.value = COSTO_PRODUCTO.toFixed(2)

                //util.removeDatasets('#campaignValue')
                const aux11 = valid.validateCampaing(campaignData)
                console.log('return: ', aux11)
                if (aux11 == false) {
                    util.removeDatasets('#campaignValue')
                    alerts.showAlert(
                        'warning',
                        'La campaña no tiene los datos correctos, contactar con administrador.'
                    )
                }
            }
        }
    },
    async getUsers(type) {
        let end = true
        let users = new Array()
        let cont = 1
        let page = 1
        do {
            let request = await crm.getUsers(page, 200)
            if (request.ok) {
                if (request?.data?.info?.more_records) {
                    page++
                    end = true
                } else {
                    end = false
                }

                users = users.concat(request?.data?.users)
            } else {
                end = false
            }
            if (cont > 5) end = false
            cont++
        } while (end)
        const value = users.filter((user) => {
            if (user.profile.name == type) return user
        })
        return value
    },
    async userVendors(data) {
        const VendedorContainer = document.getElementById('vendedor')
        if (data.profile.name !== 'Vendedor') {
            const users = await this.getUsers('Vendedor')
            const vendorSelect = document.getElementById('list-vendedores')
            users.forEach((user) => {
                let option = document.createElement('option')
                option.dataset.idvendedor = user.id
                option.textContent = user.full_name
                vendorSelect.appendChild(option)
            })
        } else {
            VendedorContainer.style = 'display: none;'
        }
    },
    async descuentos(product_id, productBooksId, Campaign_id) {
        const checkCostoM2 = document.querySelector(`input[name="Costo_M2"]`)
        const m2Original = parseFloat(checkCostoM2.dataset.m2_original)

        // Quitar valores de descuento
        const removeDiscountRequestCRM = await crm.removeDiscount(
            product_id,
            m2Original
        )
        const removeDiscountRequestBooks = await books.removeDiscountBooks(
            productBooksId
        )

        // Revisar si se modifico costo por M2
        if (checkCostoM2.dataset.m2_update !== undefined) {
            // Actualizar el costo x m2 al producto
            const costoM2 = checkCostoM2.value

            const DIMENSIONES = document.querySelector(
                `input[name="dimension"]`
            ).value

            let costoProducto = (parseFloat(DIMENSIONES) * costoM2).toFixed(2)

            const updateProductCRM = await crm.updateProduct({
                id: product_id,
                Costo_por_M2: costoM2,
                Unit_Price: costoProducto,
                Costo_total_del_terreno: costoProducto,
                Saldo: costoProducto,
            })

            const updateProductBooks = await books.updateProduct(
                productBooksId,
                {
                    rate: costoProducto,
                }
            )
            if (updateProductCRM.ok) {
                alerts.showAlert('success', 'Costo x M2 actualizado en CRM')
            }

            if (updateProductBooks.ok) {
                alerts.showAlert('success', 'Costo x M2 actualizado en Books')
            }
        }

        // Aplicar descuento a Producto
        const discountRequest = await crm.aplicarDescuentoProducto(
            Campaign_id,
            product_id
        )
        if (discountRequest.ok && discountRequest.data.code === 200) {
            // Descuento aplicado
            alerts.showAlert('success', 'Descuento aplicado a Producto')
        } else if (discountRequest.ok && discountRequest.data.code === 400) {
            // No cuenta con descuento...
        } else {
            alerts.showAlert(
                'warning',
                'No se aplico descuento a Producto. Favor de hacerlo manualmente'
            )
        }
    },
    async contacto(params) {
        const { contactDiv, user, vend, newData, CRMData, email } = params
        let accountId
        let contact_id
        let accountName
        let id_contactBooks
        let temp_contact_id
        let temp_accout_id
        let contactName

        let updateAccountName = false
        let newAccountName = ''

        try {
            if (
                contactDiv.dataset?.contactid !== '' &&
                contactDiv.dataset?.contactid !== undefined &&
                contactDiv.dataset?.contactid !== 'undefined'
            ) {
                temp_contact_id = contactDiv.dataset?.contactid
                contactName = contactDiv.children[0].textContent
            } else {
                temp_contact_id = false
                contactName =
                    newData.contacto.First_Name +
                    ' ' +
                    newData.contacto.Apellido_Paterno +
                    (newData.contacto.Apellido_Materno !== undefined
                        ? ' ' + newData.contacto.Apellido_Materno
                        : '')
            }

            if (
                contactDiv.dataset?.accountid !== '' &&
                contactDiv.dataset?.accountid !== undefined &&
                contactDiv.dataset?.accountid !== 'undefined'
            ) {
                temp_accout_id = contactDiv.dataset?.accountid
            } else {
                temp_accout_id = false
            }

            if (temp_contact_id == false) {
                let conatctRequest = await crm.searchContact(email, 'Contacts')

                // Create account
                accountName =
                    newData.contacto.First_Name +
                    ' ' +
                    newData.contacto.Apellido_Paterno +
                    (newData.contacto.Apellido_Materno !== undefined
                        ? ' ' + newData.contacto.Apellido_Materno
                        : '')

                // // data for accounts
                const accountData = {
                    Account_Name: accountName.toUpperCase(),
                    Correo_electr_nico_1: email,
                    Owner: {
                        id:
                            user.dataset.profile === 'Vendedor'
                                ? user.dataset.crmuserid
                                : vend.dataset.vendedorid,
                    },
                }

                if (conatctRequest.ok) {
                    const convert = confirm(
                        'El correo ya esta registrado en CRM'
                    )
                    if (!convert)
                        throw new Error('Proceso omitido por el usuario')
                    contact_id = conatctRequest.data[0].id
                    // contacto existe en CRM
                    if (conatctRequest.data[0].Account_Name?.name == null) {
                        // Cuenta no encontrada
                        const createAccountRequest = await crm.createAccount(
                            accountData
                        )

                        accountId = createAccountRequest.data.details.id
                    } else {
                        accountId = conatctRequest.data[0].Account_Name?.id
                    }
                    const syncContact = await books.syncContact(contact_id)
                    if (syncContact.ok) {
                        // contacto sincronizado en books
                        id_contactBooks = syncContact.data.customer_id
                    } else {
                        throw new Error('Error al crear cliente en books')
                    }
                } else {
                    // contacto no existe en CRM
                    const createAccountRequest = await crm.createAccount(
                        accountData
                    )

                    accountId = createAccountRequest?.data?.details?.id
                    let ownerId =
                        user.dataset.profile === 'Vendedor'
                            ? user.dataset.crmuserid
                            : vend.dataset.vendedorid
                    // Create Contact
                    const createContactRequest = await crm.CreateContact(
                        newData,
                        accountId,
                        ownerId
                    )

                    contact_id = createContactRequest?.data.details.id

                    // validar si existe contacto en books
                    if (createContactRequest.ok) {
                        const syncContact = await books.syncContact(contact_id)
                        if (syncContact.ok) {
                            // contacto sincronizado en books
                            alerts.showAlert(
                                'success',
                                'Contacto creado y sincronizado con Zoho Books'
                            )
                            id_contactBooks = syncContact?.data?.customer_id
                        }
                    } else {
                        throw new Error('Contacto no se pudo crear en CRM')
                    }
                }
            } else {
                contact_id = temp_contact_id
                let update = util.checkUpdate(CRMData, newData)
                if (!update) {
                    // Revisar si se agrego apellido materno
                    const contact = await crm.getContact(contact_id)
                    if (
                        contact.data.Apellido_Materno == null &&
                        newData.contacto?.Apellido_Materno
                    ) {
                        newData.contacto.Apellido_Materno =
                            newData.contacto.Apellido_Materno.toUpperCase()
                        const apellidos = `${
                            contact.data.Apellido_Paterno
                        } ${newData.contacto.Apellido_Materno.toUpperCase()}`
                        newData.contacto.Last_Name = apellidos
                        newAccountName = `${
                            contact.data.Full_Name
                        } ${newData.contacto.Apellido_Materno.toUpperCase()}`
                        updateAccountName = true
                    }

                    // Revisar si el segundo cliente tambien se le debe agregar apellito materno
                    if (
                        contact.data.Apellido_Materno_2 == null &&
                        newData.contacto?.Apellido_Materno_2
                    ) {
                        newData.contacto.Apellido_Materno_2 =
                            newData.contacto.Apellido_Materno_2.toUpperCase()
                        newAccountName = `${
                            contact.data.Full_Name
                        } ${newData.contacto.Apellido_Materno.toUpperCase()} / ${
                            contact.data.Nombre2
                        } ${
                            contact.data.ApellidoP2
                        } ${newData.contacto.Apellido_Materno_2.toUpperCase()}`
                        updateAccountName = true
                    }

                    const updateRequest = await crm.UpdateContact(
                        newData,
                        contact_id
                    )
                    // agregar alerta
                }
                if (temp_accout_id == false) {
                    accountName =
                        newData.contacto.First_Name +
                        ' ' +
                        newData.contacto.Apellido_Paterno +
                        (newData.contacto.Apellido_Materno !== undefined
                            ? ' ' + newData.contacto.Apellido_Materno
                            : '')

                    // // data for accounts
                    const accountData = {
                        Account_Name: accountName.toUpperCase(),
                        Correo_electr_nico_1: email,
                        Owner: {
                            id:
                                user.dataset.profile === 'Vendedor'
                                    ? user.dataset.crmuserid
                                    : vend.dataset.vendedorid,
                        },
                    }
                    const createAccountRequest = await crm.createAccount(
                        accountData
                    )
                    accountId = createAccountRequest.data.details.id
                } else {
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

            // Actualizar cuenta si se agrego nombre paterno
            if (updateAccountName) {
                const accountData = {
                    id: accountId,
                    Account_Name: newAccountName,
                }
                await crm.updateAccount(accountData)
            }

            return {
                id_contactBooks,
                accountId,
                contact_id,
                accountName,
                id_contactBooks,
                temp_contact_id,
                temp_accout_id,
                contactName,
            }
        } catch (error) {
            if (error.message == 'Proceso omitido por el usuario') {
                alerts.showAlert('warning', error.message)
            } else {
                alerts.showAlert('danger', error.message)
            }
        }
    },
    refreshManzana() {
        const fracionamiento = document.querySelector(
            'input[name="Fraccionamiento_P"]'
        ).value
        const manzana = document.querySelector('input[name="Manzana"]').value
        Mapas.getDisponiblidad(fracionamiento, manzana)
        this.viewModal(false, '', '', '', '')
    },
    showDomicilio(check, dataset) {
        const blocks = Array.from(document.querySelectorAll(`div[${dataset}]`))

        console.log('check: ', check)
        if (check) {
            console.log('direccion americana')
            // direccion americana
            blocks[0].classList.add('hide')
            blocks[1].classList.remove('hide')
        } else {
            // direccion americana
            console.log('direccion mexicana')
            blocks[0].classList.remove('hide')
            blocks[1].classList.add('hide')
        }
    },
    paintCards(data, userAdmin, userId) {
        const colors = {
            'Presentación del Producto': '#de9f27',
            Cotización: '#b5512a',
            'Cita en el Fraccionamiento': '#7de38e',
            'Asistencia del Cliente Al Fraccionamiento': '#398afa',
            'Pago de Apartado': '#6908c9',
            'Pago de Enganche': '#2e2e2e',
            'Primer mensualidad': '#f8c15b',
            'Cerrado (ganado)': '#4f9b40',
            'Cerrado (perdido)': '#d44141',
            Cancelado: '#ff2e2e',
        }
        containerDeals.innerHTML = ''
        data.forEach((deal) => {
            if (userAdmin || deal.Owner.id == userId) {
                let stage = deal.Stage
                let url = `https://creatorapp.zoho.com/sistemas134/cotizador1/view-embed/Preliminar/IDOportunidad=${deal.id}`
                let urlMenu = `https://creatorapp.zoho.com/sistemas134/cotizador1/view-embed/Menu_Cotizador/IDOportunidad=${deal.id}`
                let urlDeal = `https://crm.zoho.com/crm/org638248503/tab/Potentials/${deal.id}`
                let urlContact = `https://crm.zoho.com/crm/org638248503/tab/Contacts/${deal.Contact_Name?.id}`
                let card = `
                    <section class="titulo-trato">${deal.Deal_Name}</section>
                    <section class="trato-cont" data-dealid='${deal.id}' data-numcierre='${deal.Numero_de_Cierre}' data-dealname='${deal.Deal_Name}'>
                        <a href=${url} target="_blank" class="btn-trato"><i class="fa-solid fa-file"></i></a>
                        <a href=${urlMenu} target="_blank" class="btn-trato"><i class="fa-solid fa-grip"></i></a>
                        <a data-cerrar class="btn-trato ${deal.Stage == "Primer mensualidad" || deal.Stage == "Pago de Enganche" ? "" : "hide"}"><i class="fa-solid fa-thumbs-up"></i></a>
                        <div data-file="true" class="btn-trato"><i class="fa-solid fa-file-pdf"></i></div>
                        <a href=${urlDeal} target="_blank" class="btn-trato"><i class="fa-solid fa-handshake"></i></a>
                        <a data-uif class="btn-trato ${deal.Stage == "Cerrado (ganado)" ? "" : "hide"}"><i class="fa-solid fa-arrow-rotate-right"></i></a>
                    </section>
                    <p><b>Vendedor: </b><b>${deal.Owner.name}</b></p>
                    <p><b>Cliente: </b><a href=${urlContact} target="_blank" class="client"><b>${deal.Contact_Name?.name}</b></a></p>
                    <div class='deal-stage' style="background-color: ${colors[stage]}">${stage}</div>
                `
                let section = document.createElement('section')
                section.classList = 'card-trato'
                section.innerHTML = card
                containerDeals.appendChild(section)
            }
        })
    },
    viewModal(view, id, dataset, paint) {
        const {
            crm_id,
            trato,
            crm: existeCRM,
            sku,
            fracc_id,
            esquina,
        } = dataset
        let modal = document.getElementById('modal')
        let containerWrap = document.querySelector('.container-wrap')
        if (view) {
            containerWrap.classList.add('show')
            modal.dataset.item = id
            modal.dataset.crm_id = crm_id
            modal.dataset.trato = trato
            modal.dataset.existecrm = existeCRM
            modal.dataset.sku = sku
            modal.dataset.fracc_id = fracc_id
            modal.dataset.esquina = esquina
            if (paint) this.paintDataPresupuesto(id, dataset)
            // container_modal.style.display = 'flex'
        } else {
            // container_modal.style.display = 'none'
            containerWrap.classList.remove('show')
            modal.dataset.item = ''
            modal.dataset.crm_id = ''
            util.removeInvalid()
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
        const spanName = document.createElement('span')
        spanName.textContent = selectedOption.children[0].textContent
        spanName.dataset.contactname = selectedOption.children[0].textContent
        contactContainer.appendChild(spanName)

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
            util.cleanForm()
        })
    },
    removeContact() {
        const contactContainer = document.querySelector('#contact')
        contactContainer.innerHTML = ''
        delete contactContainer.dataset.contactid
        delete contactContainer.dataset.accountid
        delete contactContainer.dataset.accountname
        if (contactContainer?.dataset?.lead)
            delete contactContainer?.dataset?.lead
    },
    selectCampaign(selectedOption) {
        const campaignInput = document.querySelector('#campaignValue')
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
    addRecursos(dcontacto) {
        const inputRecursos = Array.from(
            document.querySelector('[data-recursos]').children
        )

        let cname = dcontacto['First_Name'] + ' ' + dcontacto['Last_Name']

        inputRecursos[0].children[1].value = cname //nombre completo
        inputRecursos[1].children[1].value = dcontacto['Empresa_en_labora'] //empresa donde trabaja
        inputRecursos[2].children[1].value = dcontacto['INGRESO_MENSUAL'] //ingreso mensual
        inputRecursos[3].children[1].value = cname //duenyo controlador
        inputRecursos[4].children[1].value = ''
        inputRecursos[5].children[1].value = dcontacto['A_os_Laborados'] //tiempo laborado
    },
    refreshForm(){
        util.cleanForm()
        UI.removeContact()
        UI.viewModal(false, '', '', '', '')
        let inputSearch = document.getElementById('search-value')
        inputSearch.value = ''

        alerts.showAlert('success', 'Formulario refrescado.')
    },
    addDataList(list, ListId) {
        console.log('list: ', list)
        const select = document.getElementById(`list-${ListId}`)

        list.forEach((coo) => {
            let option = document.createElement('option')
            option.value = coo
            option.textContent = coo
            select.appendChild(option)
        })
    },
    searchDeals(search, userAdmin, userId) {
        if (search == '') {
            this.paintCards(dealsCards, userAdmin, userId)
        } else {
            const valid = dealsCards.filter((d) => {
                const { Deal_Name, Owner, Contact_Name, Stage } = d
                // console.log(search)
                // console.log({ Deal_Name, Owner, Contact_Name, Stage })
                return (
                    Deal_Name.toLowerCase().match(search) ||
                    Owner?.name.toLowerCase().match(search) ||
                    Contact_Name?.name.toLowerCase().match(search) ||
                    Stage.toLowerCase().match(search)
                )
            })
            // dealsCards

            this.paintCards(valid, userAdmin, userId)
        }
    },
    searchFracc(search) {
        const cardsF = Array.from(document.querySelectorAll('.fracionamiento'))

        if (search !== '') {
            cardsF.forEach((i) => {
                console.log(i)
                if (i.innerText.toLowerCase().match(search)) {
                    console.log(true)
                    i.style.display = 'block'
                } else {
                    console.log(false)
                    i.style.display = 'none'
                }
            })
        } else {
            cardsF.forEach((i) => {
                i.style.display = 'block'
            })
        }
    },
    async cerrarTrato(folio, IDOportunidad) {
        console.log(folio, IDOportunidad)
        const dealData = await creator.getRecordByFolio(folio, IDOportunidad)
        console.log('cerrarTrato dealData: ', dealData)
        if (dealData.ok) {
            const presupuestoId = dealData?.data?.ID
            console.log('UI.cerrarTrato - presupuestoId: ', presupuestoId)
            console.log('UI.cerrarTrato - TipodePolitica: ', dealData?.data?.TipodePolitica)
            // Revisar tipo de politica
            if(dealData?.data?.TipodePolitica == "Primer Mensualidad") {
                if(dealData?.data?.MensualidadRecibida == '') {
                    alerts.showAlert('warning', 'No se ha realizado pago de factura')
                    return
                }
            }else if(dealData?.data?.TipodePolitica == "Enganche"){
                if(dealData?.data?.EngancheRecibido == '') {
                    alerts.showAlert('warning', 'No se ha realizado pago de factura')
                    return
                }
            }

            const fechas = util.fechasCierre(dealData?.data?.TipodePolitica, dealData?.data?.PlazoAcordado, dealData?.data?.Plazos_Diferido)
            const cerrarTrato = await creator.updateRecord(presupuestoId, fechas)
            if(cerrarTrato.ok){
                alerts.showAlert('success', 'Facturas creadas')
                this.refreshManzana()
            }else{
                alerts.showAlert('warning', 'Se inicio generación de facturas')
                if(cerrarTrato.type == 'danger') alerts.showAlert(cerrarTrato.type, cerrarTrato.message)
            }
            alerts.showAlert('finish', 'Trato Cerrado( Ganado )')
            this.refreshManzana()
        }
    },
}

const util = {
    removeDatasets(selector) {
        const elem = document.querySelector(selector)
        const datasets = Object.keys(elem.dataset)

        datasets.forEach((key) => {
            delete elem.dataset[key]
        })
    },
    navegador() {
        let details = navigator.userAgent
        let regexp = /android|iphone|kindle|ipad/i
        let isMobileDevice = regexp.test(details)
        let objetReturn = {}

        if (isMobileDevice) {
            objetReturn.device = 'Mobile'
        } else {
            objetReturn.device = 'Web'
        }

        let es_chrome = details.toLowerCase().indexOf('chrome') > -1
        let es_firefox = details.toLowerCase().indexOf('firefox') > -1
        let es_opera = details.toLowerCase().indexOf('opr') > -1
        let es_safari = details.toLowerCase().indexOf('safari') > -1

        if (es_chrome) {
            objetReturn.browser = 'chrome'
        }
        if (es_firefox) {
            objetReturn.browser = 'firefox'
        }
        if (es_opera) {
            objetReturn.browser = 'opera'
        }
        if (es_safari) {
            objetReturn.browser = 'safari'
        }
        return objetReturn
    },
    dblClick(lastTap) {
        let currentTime = new Date().getTime()
        let tapLength = currentTime - lastTap
        clearTimeout(timeout)
        if (tapLength < 500 && tapLength > 0) {
            return true
        }
        return false
    },
    removeInvalid() {
        let invalidInputs = Array.from(
            document.getElementsByClassName('invalid')
        )
        invalidInputs.forEach((inp) => {
            inp.classList.remove('invalid')
        })
    },
    checkUpdate(a, b) {
        return JSON.stringify(a) === JSON.stringify(b)
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

        form.contacto = contacto
        form.presupuesto = Presupuesto

        return form
    },
    getDataForm() {
        let form = {}
        let contacto = {}
        let Presupuesto = {}
        const Blocks = Array.from(document.querySelectorAll('.block'))
        Blocks.forEach((block) => {
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                if (block?.dataset?.contacto) {
                    if (span.children[1].value !== '') {
                        contacto[span.children[1].name] = span.children[1].value
                    }
                    // sobreescribe valor con el valor del checkbox
                    if (span.children[1].type === 'checkbox') {
                        contacto[span.children[1].name] =
                            span.children[1].checked
                    }
                }

                if (block?.dataset?.presupuesto) {
                    if (span.children[1].value !== '') {
                        Presupuesto[span.children[1].name] = span.children[1].value
                    }
                    // sobreescribe valor con el valor del checkbox
                    if (span.children[1].type === 'checkbox') {
                        Presupuesto[span.children[1].name] =
                            span.children[1].checked
                            
                    }
                }
                
            })
        })

        form.contacto = contacto
        form.presupuesto = Presupuesto

        return form
    },
    cleanForm() {
        const Blocks = Array.from(document.querySelectorAll('.block'))
        Blocks.forEach((block) => {
            const spans = Array.from(block.children)
            spans.forEach((span) => {
                if (span.children[1].type === 'checkbox') {
                    span.children[1].checked = false
                } else {
                    span.children[1].value = ''
                }
            })
        })
        let divIcon = document.querySelectorAll('div[data-block-icon]')

        divIcon.forEach((div) => {
            console.log('divIcon.childElementCount', div.childElementCount)
            if (div.childElementCount > 1) {
                div.classList.remove('icon-disabled', 'icon-block')
                div.removeChild(div.lastChild)
                console.log('divIcono', div)
            }
        })
    },
    parseOuterHTML(text) {
        let tempText1 = text.normalize()
        let tempText2 = tempText1.replaceAll('&lt;', '<')
        let tempText3 = tempText2.replaceAll('&gt;', '>')
        return tempText3
    },
    fechaDePago(formaDePago) {
        const checkApartado = document.querySelector('#hasApartado').checked
        let today = new Date()
        let fechaPago, date
        if (checkApartado) {
            date = util.addDate(today, 'D', 7)
            let diaPago = this.diasDePago(date)
            let diaDate = date.getDate()
            let dias = diaPago - diaDate
            fechaPago = this.addDate(date, 'D', dias)
        } else {
            date = today
            let diaPago = this.diasDePago(date)
            let diaDate = date.getDate()
            let dias = diaPago - diaDate
            fechaPago = this.addDate(date, 'D', dias)
        }

        if (formaDePago == 'Enganche') {
            return this.addDate(fechaPago, 'M', 1)
        } else {
            return fechaPago
        }
    },
    diasDePago(date) {
        let Dia = date.getDate()
        let DiadePago = ''

        if (Dia >= 1 && Dia <= 6) {
            DiadePago = 6
        }
        if (Dia >= 7 && Dia <= 15) {
            DiadePago = 15
        }
        if (Dia >= 16 && Dia <= 21) {
            DiadePago = 21
        }
        if (Dia >= 22 && Dia <= 31) {
            DiadePago = 28
        }

        return DiadePago
    },
    getSeccion(item, data) {
        let item_name, sku, seccion_id, nombre_fracionamiento
        let item_array = item.split('-')
        let numManzana = item_array[0].replace('M', '')
        let numLote = item_array[1].replace('L', '')

        let manzana = parseInt(numManzana)
        let secciones_array = data.Secciones
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

        if (type == 'D') {
            addMonth.setDate(date.getDate() + num)
        } else if (type == 'M') {
            addMonth.setMonth(date.getMonth() + num)
        } else if (type == 'Y') {
            addMonth.setYear(date.getYear() + num)
        }

        return addMonth
    },
    formatDate(date) {
        const currentDate = new Date(date)

        let monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]

        let day = currentDate.getDate()

        let monthIndex = currentDate.getMonth()
        let monthName = monthNames[monthIndex]

        let year = currentDate.getFullYear()

        return `${day}-${monthName}-${year}`
    },
    async createCotizacion(deal, campaignId, recordData) {
        const requestCampaign = await crm.getCampaign(campaignId)
        const campaign = requestCampaign.data

        const NOMBRE_PRODUCTO = deal.Deal_Name
        const DIMENSIONES = parseFloat(recordData.Dimemsiones)
        const COSTO_M2 = parseFloat(recordData.Costo_M2)
        const COSTO_PRODUCTO = parseFloat(DIMENSIONES) * parseFloat(COSTO_M2)
        //return obj
        const reportObj = {}

        // Variables para calculos
        const formaDePago = campaign.Tipo_de_Promocion
        const politicaCampana = campaign.Tipo_de_Politica
        const tipoDeDescuento = campaign.Tipo_de_Descuento

        // Calcular Precio Total del Nuevo Producto y Mensualiad, y restar Descuento
        let montoDeDescuento = 0
        let porcentajeDescuento = 0
        let descuentoPorcentaje = 0
        let costo_temp = 0
        let precioTotalDelTerreno = 0
        let mensualidad = 0
        let montoDeEnganche = 0
        let descuentoEnganche = 0
        let porcentajeEnganche = 0
        let porcentajeDeEnganche = 0
        let precio_total = 0
        let porc_Enganche = 0
        let montoDescuento = 0
        let descuento_temp = 0
        let saldoDelTerreno = 0
        let AuxEnganche = 0
        let Concepto = ''
        let field_Tipodepolitica

        if (formaDePago != 'Contado') {
            if (politicaCampana == 'Primer Mensualidad') {
                field_Tipodepolitica = 'Primer Mensualidad'
                if (tipoDeDescuento != null) {
                    if (tipoDeDescuento == 'Monto') {
                        let montoDeDescuento = campaign.Monto_Descuento
                        reportObj.montoDescuento = campaign.Monto_Descuento
                        costo_temp = COSTO_M2 - campaign.Monto_Descuento
                        precioTotalDelTerreno = costo_temp * DIMENSIONES
                        mensualidad = (
                            precioTotalDelTerreno / campaign.Mensualidades
                        ).toFixed(2)
                    } else if (tipoDeDescuento == 'Porcentaje') {
                        porcentajeDescuento =
                            campaign.Porcentaje_Descuento / 100
                        reportObj.porcentajeDescuento =
                            campaign.Porcentaje_Descuento
                        descuentoPorcentaje =
                            DIMENSIONES * COSTO_M2 * porcentajeDescuento
                        precioTotalDelTerreno =
                            DIMENSIONES * COSTO_M2 - descuentoPorcentaje
                        mensualidad = (
                            precioTotalDelTerreno / campaign.Mensualidades
                        ).toFixed(2)
                    }
                } else {
                    precioTotalDelTerreno = DIMENSIONES * COSTO_M2
                    mensualidad = (
                        precioTotalDelTerreno / campaign.Mensualidades
                    ).toFixed(2)
                }
            } else if (politicaCampana == 'Enganche') {
                field_Tipodepolitica = 'Enganche'
                const tipoDeEnganche = campaign.Tipo_de_Enganche
                if (tipoDeEnganche == 'Monto') {
                    montoDeEnganche = campaign.Monto_de_Enganche
                    descuentoEnganche = montoDeEnganche
                } else if (tipoDeEnganche == 'Porcentaje') {
                    porcentajeEnganche = campaign.Porcentaje_de_Enganche / 100
                    porcentajeDeEnganche =
                        DIMENSIONES * COSTO_M2 * porcentajeEnganche
                    descuentoEnganche = porcentajeDeEnganche
                }
                precio_total = DIMENSIONES * COSTO_M2
                porc_Enganche = (descuentoEnganche / precio_total) * 100

                // Calcular descuento en base al costo total del terreno
                if (tipoDeDescuento == null) {
                    precioTotalDelTerreno = DIMENSIONES * COSTO_M2
                    saldoDelTerreno = DIMENSIONES * COSTO_M2 - descuentoEnganche
                } else {
                    if (tipoDeDescuento == 'Monto') {
                        montoDescuento = campaign.Monto_Descuento
                        reportObj.MontoDescuento = montoDescuento
                        descuento_temp = COSTO_M2 - montoDescuento
                        precioTotalDelTerreno = DIMENSIONES * descuento_temp
                        saldoDelTerreno =
                            precioTotalDelTerreno - descuentoEnganche
                    } else if (tipoDeDescuento == 'Porcentaje') {
                        porcentajeDescuento =
                            campaign.Porcentaje_Descuento / 100
                        reportObj.PorcentajeDescuento =
                            campaign.Porcentaje_Descuento
                        descuentoPorcentaje =
                            DIMENSIONES * COSTO_M2 * porcentajeDescuento
                        precioTotalDelTerreno =
                            DIMENSIONES * COSTO_M2 - descuentoPorcentaje
                        saldoDelTerreno =
                            precioTotalDelTerreno - descuentoEnganche
                    }
                }
                mensualidad = (
                    saldoDelTerreno / campaign.Mensualidades
                ).toFixed(2)
            }
            reportObj.Plazo = campaign.Mensualidades
            reportObj.PlazoAcordado = campaign.Mensualidades
        } else {
            //Contado
            field_Tipodepolitica = 'Contado'
            if (tipoDeDescuento != null || tipoDeDescuento != '') {
                if (tipoDeDescuento == 'Monto') {
                    montoDeDescuento = campaign.Monto_Descuento
                    reportObj.MontoDescuento = montoDeDescuento
                    costo_temp = COSTO_M2 - montoDeDescuento
                    precioTotalDelTerreno = costo_temp * DIMENSIONES
                } else if (tipoDeDescuento == 'Porcentaje') {
                    porcentajeDescuento = campaign.Porcentaje_Descuento / 100
                    reportObj.PorcentajeDescuento =
                        campaign.Porcentaje_Descuento
                    descuentoPorcentaje =
                        DIMENSIONES * COSTO_M2 * porcentajeDescuento
                    precioTotalDelTerreno =
                        DIMENSIONES * COSTO_M2 - descuentoPorcentaje
                }
            } else {
                precioTotalDelTerreno = DIMENSIONES * COSTO_M2
            }
            mensualidad = 0
        }
        // Asignar valores a obj
        reportObj.Promocion = campaign.Campaign_Name
        reportObj.FormaPago = formaDePago
        reportObj.TipodePolitica = field_Tipodepolitica
        reportObj.TipodePoliticaCampa_a = field_Tipodepolitica
        reportObj.Monto_de_Apartado = campaign.Monto_de_Apartado.toFixed(2)
        reportObj.Terrenos = deal.Deal_Name
        reportObj.PrecioTotalTerreno = precioTotalDelTerreno.toFixed(2)
        reportObj.DimensionesTerreno = DIMENSIONES
        reportObj.CostoM2Terreno = COSTO_M2
        reportObj.Desarrollo = recordData.Fraccionamiento
        reportObj.ZCRMIDTerreno = deal.Nombre_de_Producto.id
        reportObj.ZCRMIDTerreno1 = deal.Deal_Name
        reportObj.ContactoZBooks = recordData.ContactoZBooks || ''
        reportObj.IDProductoBooks = recordData.IDProductoBooks || ''
        // reportObj.MododePago = 'EFECTIVO'

        if (formaDePago != 'Contado') {
            if (politicaCampana == 'Enganche') {
                reportObj.MontoEnganche = descuentoEnganche.toFixed(2)
                reportObj.SaldoEnganche = precioTotalDelTerreno.toFixed(2)
                reportObj.Mensualidad = mensualidad
                reportObj.PorcentajeEnganche = porc_Enganche.toFixed(2)

                if (campaign.Diferido == true) {
                    reportObj.Plazos_Diferido = campaign.Plazos_Diferido
                    reportObj.Diferido = true
                    // 				NO SE LE RESTA EL APARTADO AL ENGANCHE CUANDO ES UN DIFERIDO
                    AuxEnganche = descuentoEnganche / campaign.Plazos_Diferido
                    Concepto = 'Enganche Diferido'
                    const MapaFact = {
                        IDProductoBooks: recordData.IDProductoBooks || '',
                        ContactoZBooks: recordData.ContactoZBooks || '',
                        IDOportunidad: recordData.IDOportunidad,
                        Monto: AuxEnganche,
                        Concepto: 'Enganche Diferido',
                        MododePago: 'EFECTIVO',
                        Consecutivo: reportObj.Consecutivo,
                        Propietario: reportObj.Propietario,
                    }
                    reportObj.MapaDiferido = MapaFact
                }
            } else if (politicaCampana == 'Primer Mensualidad') {
                reportObj.PrimerMensualidad = true
                reportObj.Mensualidad = mensualidad
                reportObj.saldoDelTerreno = precioTotalDelTerreno.toFixed(2)
            }
        } else {
            reportObj.SaldoTerreno = 0
        }

        return {
            ...reportObj,
            ...recordData,
        }
    },
    debounce(func, delay = 500) {
        let debounceTimer
        return function () {
            const context = this
            const args = arguments
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => func.apply(context, args), delay)
        }
    },
    fechasCierre(TipodePolitica, Plazo, PlazosDiferido) {

        PlazosDiferido = PlazosDiferido == null ? 0 : PlazosDiferido
        
        let Hoy = new Date()
        if(TipodePolitica == "Enganche" && PlazosDiferido == 0) Hoy = this.addDate(Hoy, "M", 1)
        
        let dias = this.diasDePago(Hoy)
        
        let AuxFecha = Hoy.setDate(dias)
        
        let FechadePago = this.formatDate(AuxFecha)
        
        let FechaProximoPago
		let FechaUltimoPago

        
        if(PlazosDiferido > 0) {
          AuxFecha = this.addDate(new Date(AuxFecha), "M", PlazosDiferido -1)
          FechaProximoPago = this.formatDate(this.addDate(new Date(AuxFecha), "M", 1))
          FechaUltimoPago = this.formatDate(this.addDate(new Date(AuxFecha), "M", Plazo + 1))
        }else{
          FechaProximoPago = this.formatDate( this.addDate(new Date(AuxFecha), "M", 1))
          FechaUltimoPago = this.formatDate(this.addDate(new Date(AuxFecha), "M", Plazo ))
        }
        
         	
        
        
        const fechas = {
            DiasdePago:  this.diasDePago(Hoy),
            FechadePago: FechadePago,
            FechaProximoPago: TipodePolitica == "Primer Mensualidad" ? FechadePago : FechaProximoPago,
            FechaUltimoPago: FechaUltimoPago
        }
       
        return fechas
    },
    padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    },
}

document.addEventListener(
    'click',
    util.debounce(async (e) => {
        if (e.target.matches('[data-manzana]')) {
            const map = e.target.closest('#map')
            let name = map.dataset.name
            let commerceId = map.dataset.commerceId
            let auxManzana = e.target.id.split('-')
            const manzana = auxManzana[0]
            // const svgNombre = e.target.closest('svg').dataset.desarrollo
            await Promise.all([
                Mapas.loadManzana(
                    manzana,
                    commerceId,
                    desarrollo,
                    beforeManzana
                ),
                Mapas.getDisponiblidad(name, manzana),
            ])
            let parentManzana = e.target.parentNode
            parentManzana.removeChild(e.target)
            // await Mapas.loadManzana(manzana, commerceId, desarrollo, beforeManzana)
            // await Mapas.getDisponiblidad(name, manzana)
            beforeManzana = manzana
        }
    })
)

export { UI, util }
