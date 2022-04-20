import { crm, creator, books } from './Zoho.js'
// import creator from './Zoho.js'
// import boocks from './Zoho.js'
import alerts from './alertas.js'
import Mapas from './mapas.js'
import valid from './validate.js'

let desarrollo = new Array()

let beforeManzana = ''

const coords = [
    'Carlos Lenin',
    'Coord. Claudia Noriega',
    'Coord. Gabriela Cano',
    'Coord. Edgar Trejo',
    'Coord. Mariana Fragoso',
    'Aux. Yulissa Orozco',
    'Aux. Adolfo Martinez',
    'Aux. Alejandro Cazorla',
    'Aux. Ashram Mendez',
    'Aux. Bernardo Tovar',
    'Aux. Ezequiel Espinoza',
    'Aux. Ana Lizeth Lopez',
    'Aux. Kristina Voronina',
    'Aux. Alejandra Garcia',
    'Aux. Damaris Lopez',
    'Aux. Jared Mendez',
    'Aux. Isabel Aguilar',
    'Aux. Sabrina Martinez',
    'Aux. Gabriel Hidalgo',
    'Aux. Arturo Ubiedo',
    'Aux. Nayeli Juarez',
    'Aux. Vanessa Parra',
    'Aux. Veronica Gonzalez',
    'Aux. Victoria Martin',
    'Aux. Jesica Garcia',
    'Coord. Carlos Merlo',
    'Evaristo Lizarraga',
    'Diana Hernandez',
    'Elizabeth Portillo',
    'Coord. Gabriela Solano',
    'Elizabeth Portillo y/o Gabriela Solano',
    'Elizabeth Portillo y/o Ana Lizeth Lopez',
    'Elizabeth Portillo y/o Carlos Maldonado',
    'Coordinador Prueba',
    'Coord. Fernanda Peralta',
]

const fuentesCliente = [
    'Aviso',
    'Llamada no solicitada',
    'Recomendación de empleado',
    'Recomendación externa',
    'Tienda en línea',
    'Socio',
    'Facebook',
    'Twitter',
    'Relaciones públicas',
    'Alias del correo electrónico de ventas',
    'Google+',
    'Socio de seminarios',
    'Seminario interno',
    'Exposición comercial',
    'Descargar web',
    'Investigación web',
    'Correo web',
    'Casos de la Web',
    'Chat',
    'Página Web',
    'Infomercial',
    'Carteleras',
    'Radio',
    'Periodico',
    'Referido Inverplus',
    'Volanteo',
    'Flyers',
    'Recomendados',
    'Oficinas',
    'Google AdWords',
    'Camion',
]

const UI = {
    async loadMenuLateral() {
        const data = await crm.getAllFraccionamientos()

        if ((data.ok = true)) {
            const menu = document.getElementById('menu-lateral')
            data.data.forEach((i, index) => {
                // console.log(i.fraccionamientos.logo)
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

            menu.addEventListener('click', async (e) => {
                if (e.target.matches('[data-index]')) {
                    let containerMap = document.getElementById('map')
                    let loader = document.getElementById('loader-mapa')
                    loader.style.display = 'flex'
                    containerMap.style.display = 'none'
                    let name = e.target.dataset.name.toLowerCase()
                    console.log('Desarrollo', name)
                    const nameSvg = name.replaceAll(' ', '-')

                    let tempDesartollo = await fetch(
                        `./desarrollos-js/${nameSvg}/${nameSvg}.json`
                    )

                    desarrollo = await tempDesartollo.json()
                    console.log('--------------------------------')
                    let svgDesarrollo = document.querySelector('svg')
                    let viewBoxSvg = desarrollo.viewBoxSVG[0]
                    svgDesarrollo.setAttribute('viewBox', viewBoxSvg)

                    const style = document.getElementById('style')
                    style.innerHTML = `@import url(./css/desarrollos/${nameSvg}.css);`

                    console.log('UI desarrollo:', desarrollo)

                    beforeManzana = ''

                    this.loadPlano(e)
                    loader.style.display = 'none'
                    containerMap.style.display = 'flex'

                    let resetButton = document.getElementById('zoom-reset')

                    console.log('click reset...')
                    resetButton.click()
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
    async loadPlano(e) {
        this.getSVG()

        const mapa = document.getElementById('map')

        const id = e.target.dataset.id
        const name = e.target.dataset.name
        const localidad = e.target.dataset.localidad

        mapa.dataset.name = name
        mapa.dataset.commerceId = id
        mapa.dataset.localidad = localidad

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
                let input = document.querySelector(`[name='${key}']`)

                if (CRMData[key]) {
                    if (input.type === 'checkbox') {
                        input.checked = CRMData[key]
                    } else {
                        input.value = CRMData[key]
                    }
                } else {
                    console.log('-----------------------------------------')
                    console.log('input', input)
                    console.log('No value', key)
                }
            })
            this.addRecursos(CRMData)

            //const btn_submit = document.getElementById('btn-submit')
            //btn_submit.disabled = false
            //valid.validateForm(true)
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
                if (span.children[1].type === 'checkbox') {
                    span.children[1].checked = false
                } else {
                    span.children[1].value = ''
                }
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
                    Presupuesto[span.children[1].name] = span.children[1].value
                }
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
        try {
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

            console.log('contactid: ', contactDiv?.dataset?.contactid)

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
                let conatctRequest = await crm.searchContact(email, 'Contacts')

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
                        id:
                            user.dataset.profile === 'Vendedor'
                                ? user.dataset.crmuserid
                                : vend.dataset.vendedorid,
                    },
                }

                if (conatctRequest.ok) {
                    contact_id = conatctRequest.data[0].id
                    // contacto existe en CRM
                    console.log(
                        'Account_Name',
                        conatctRequest.data[0].Account_Name
                    )
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
                console.log('else UI temp_contact_id: ', temp_contact_id)
                contact_id = temp_contact_id
                let update = this.checkUpdate(CRMData, newData)
                console.log('UI update: ', update)
                if (!update) {
                    const updateRequest = await crm.UpdateContact(
                        newData,
                        contact_id
                    )
                    console.log('UI UpdateContact: ', updateRequest)
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
                const createProductRequest = await books.createProduct(
                    productData
                )
                productBooksId = createProductRequest.data.item_id

                // Crear Producto en books
            }

            const coordinadorArray = []
            coordinadorArray.push(coo_id)

            let today = new Date()
            let date = util.addDate(today, 'D', 7)

            const DealData = {
                Deal_Name: modal.dataset.trato,
                Nombre_de_Producto: { id: product_id },
                Account_Name: { id: accountId },
                // Amount: newData.presupuesto.Saldo_Pagar_P,

                Modo_de_pago: [newData.presupuesto.Modo_de_pago],
                Lead_Source: newData.contacto.Lead_Source,
                Type: tipoDeCompra,
                Tipo_de_Compra1: campa_a.dataset?.formadepago,

                Amount:
                    inputDescuento !== ''
                        ? parseFloat(inputDescuento)
                        : MontoTotal,
                Stage: 'Presentación del Producto',
                Closing_Date: date.toISOString().split('T')[0],
                Campaign_Source: { id: Campaign_id },
                Contact_Name: { id: contact_id },
                Coordinador: coordinadorArray,
            }

            if (user.dataset.profile === 'Vendedor') {
                // Usuario con perfil de Vendedor
                DealData.Owner = { id: user.dataset.crmuserid }
            } else {
                // No es un usuario con perfil de Vendedor
                DealData.Owner = { id: vend.dataset.vendedorid }
            }

            console.log('DealData', DealData)

            const DealRequest = await crm.createDeal(DealData)
            console.log('DealRequest: ', DealRequest)
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

            // Revisar si se modifico costo por M2
            const checkCostoM2 = document.querySelector(
                `input[name="Costo_M2"]`
            )
            if (checkCostoM2.dataset.m2_update !== undefined) {
                // Actualizar el costo x m2 al producto
                console.log('actualizando costo x m2')
                const costoM2 = checkCostoM2.value

                const DIMENSIONES = document.querySelector(
                    `input[name="dimension"]`
                ).value

                let costoProducto = (parseFloat(DIMENSIONES) * costoM2).toFixed(
                    2
                )
                console.log('Costo Producto $', costoProducto)

                const updateProductCRM = await crm.updateProduct(
                    product_id,
                    costoM2,
                    costoProducto
                )

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
                    alerts.showAlert(
                        'success',
                        'Costo x M2 actualizado en Books'
                    )
                }
            }

            // Aplicar descuento a Producto
            const discountRequest = await crm.aplicarDescuentoProducto(
                Campaign_id,
                product_id
            )
            console.log('DESCUENTO:', discountRequest)
            if (discountRequest.ok && discountRequest.data.code === 200) {
                // Descuento aplicado
                alerts.showAlert('success', 'Descuento aplicado a Producto')
            } else if (
                discountRequest.ok &&
                discountRequest.data.code === 400
            ) {
                // No cuenta con descuento...
                console.log('No cuenta con descuento...')
            } else {
                alerts.showAlert(
                    'warning',
                    'No se aplico descuento a Producto. Favor de hacerlo manualmente'
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
                // const recordData = {
                //     data: {
                //         IDOportunidad: Deal_id,
                //         IDContactoCRM: contact_id,
                //         NombreContacto: contactName,
                //         Cuenta: accountName.toUpperCase() || "",
                //         MododePago: 'EFECTIVO',
                //         Propietario: DealData.Owner,
                //         EmailContacto: newData.contacto.Email,
                //         Contacto: contactName,
                //         IDProductoBooks: productBooksId,
                //         Fraccionamiento: document.querySelector('input[name="Fraccionamiento_P"]') || ""
                //     },
                // }

                // juntar informacion de registros creados para pasar a la function para crear cotizacion
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
                    Fecha: util.formatDate(),
                }
                const jsonCotizacion = await util.createCotizacion(
                    DealData,
                    Campaign_id,
                    detailsJson
                )
                console.log('json Cotizacion', jsonCotizacion)

                const recordData = {
                    data: {
                        ...jsonCotizacion,
                    },
                }
                console.log('recordData', recordData)

                const createCotizacion = await creator.createRecord(recordData)
                console.log('createCotizacion: ', createCotizacion)
                if (createCotizacion.ok) {
                    alerts.showAlert('success', 'Cotizacion creada')
                    creator_id = createCotizacion.data?.ID
                    const CotizacionRequest = await creator.getRecord(
                        creator_id
                    )

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

                        // let today = new Date()
                        // let date = util.addDate(today, 'D', 7)
                        let des = ''

                        if (formadepago == 'Contado') {
                            des = formadepago
                        } else {
                            des = politica
                        }

                        // Creacion de facturas
                        let arrInvoices = []
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
                                let mensualidadEnganche =
                                    Enganche / plazosdiferido
                                for (let i = 1; i <= plazosdiferido; i++) {
                                    if (i == 1) {
                                        let rate =
                                            mensualidadEnganche - apartado
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
                                    rate = tempRate
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
                            const invoiceRequest = await books.createInvoice(
                                arrInvoices[i]
                            )
                            console.log('INVOICE REQUEST', invoiceRequest)
                            if (invoiceRequest.ok) {
                                //Send Invoice
                                const sendInvoiceRequest =
                                    await books.sendInvoice(
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
                            console.log(
                                `UI createInvoice: index ${i}', ${invoiceRequest}`
                            )
                        }

                        // End of process
                        // Reset values
                        campa_a.value = ''
                        document.querySelector(
                            'input[name="Costo_Descuento_P"]'
                        ).value = ''
                        document.querySelector('#coordinadorValue').value = ''
                        vend.value = ''
                        this.removeDatasets('#campaignValue')
                        this.removeDatasets('input[name="Costo_M2"]')
                        this.paintDeals()
                        this.removeDatasets('[name="Cantidad_RA"]')
                        // this.removeDatasets('#vendorsValue')
                    }
                } else {
                    throw new Error('No se pudo crear cotizacion')
                }
            }
            this.removeContact()
        } catch (error) {
            console.log(error)
            alerts.showAlert('danger', error.message)
        }
        console.timeEnd()
    },
    fechaDePago(date) {},
    checkUpdate(a, b) {
        console.log('a: ', a)
        console.log('b: ', b)
        return JSON.stringify(a) === JSON.stringify(b)
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
            console.log('paint', paint)
            if (paint) this.paintDataPresupuesto(id, dataset)
            container_modal.style.display = 'flex'
        } else {
            // container_modal.style.display = 'none'
            modal.dataset.item = ''
            modal.dataset.crm_id = ''
            console.log('close modal...')
            this.removeInvalid()
        }
    },
    removeInvalid() {
        let invalidInputs = Array.from(
            document.getElementsByClassName('invalid')
        )
        //console.log({invalidInputs})
        invalidInputs.forEach((inp) => {
            inp.classList.remove('invalid')
        })
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
    async searchCustomer() {
        const searchValue = document.querySelector('#search-value').value
        const resultContainer = document.querySelector('#contact-results')
        const searchLabel = document.querySelector('.module-switch label')

        const searchModule = searchLabel.dataset.modulesearch
        // console.log('searchValue', searchValue)
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
                // console.log('records: ', records)
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')

                    if (searchModule === 'Contacts') {
                        temp.innerHTML = `<div 
            data-module="contact"
            data-contactid="${record.id}" 
            data-accountid="${record.Account_Name?.id}"
            data-accountname="${record.Account_Name?.name}"
            data-record="" class="record"><span data-contact-name>${record.Full_Name}</span>
            <p data-record-email="" >${record.Email}</p>
            </div>`
                    } else {
                        temp.innerHTML = `<div 
            data-module="leads"
            data-leadid="${record.id}" 
            data-record="" class="record"><span data-lead-name>${record.Full_Name}</span>
            <p data-record-email="" >${record.Email}</p>
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
            this.cleanForm()
        })
    },
    async selectLead(selectedOption) {
        const convert = confirm('Desea convertir al Posible cliente a Contacto')
        console.log(selectedOption)
        const userID = document.getElementById('user').dataset.crmuserid
        if (convert) {
            // Logica para convertir lead
            const leadId = selectedOption.dataset.leadid
            if (leadId !== undefined) {
                const convertLead = await crm.convertToContact(leadId, userID)
                console.log(convertLead)
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
                        this.cleanForm()
                    })
                }
            }
        }
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
    async searchCampaign() {
        const searchValue = document.querySelector('#campaignValue').value
        const fraccionamientoId =
            document.querySelector('#modal').dataset.fracc_id || ''
        console.log('searchValue', searchValue)
        console.log('fracc_id', fraccionamientoId)

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
                // console.log('records: ', records)
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
        const selectCoordinador = document.getElementById('list-coo')

        coords.forEach((coo) => {
            let option = document.createElement('option')
            option.value = coo
            option.textContent = coo
            selectCoordinador.appendChild(option)
        })
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

                // CRM Campaign fields
                const formaDePago = campaignData.Tipo_de_Promocion
                const politicaCampana = campaignData.Tipo_de_Politica
                const tipoDeDescuento = campaignData.Tipo_de_Descuento
                console.log('campana', campaignData)
                // Obtener costo x m2
                const requestModule = await crm.getFraccionamiento(
                    campaignData.Fraccionamientos.id
                )
                const moduleData = requestModule.data

                if (
                    campaignData.Fraccionamientos.id != null &&
                    formaDePago === 'Financiado' &&
                    politicaCampana === 'Primer Mensualidad'
                ) {
                    const costoM2_sinEnganche =
                        moduleData.Precio_de_lista_M2_Sin_Enganche

                    const inputCosto = document.querySelector(
                        `input[name="Costo_M2"]`
                    )
                    inputCosto.value = costoM2_sinEnganche.toFixed(2)
                    inputCosto.dataset.m2_update = 'true'
                } else {
                    const costoM2_Enganche = moduleData.Precio_de_lista_M2
                    console.log(costoM2_Enganche)

                    const inputCosto = document.querySelector(
                        `input[name="Costo_M2"]`
                    )
                    inputCosto.value = costoM2_Enganche.toFixed(2)
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
                    console.log('Producto en esquina')
                    const costo = document.querySelector(
                        `input[name="Costo_M2"]`
                    )
                    const newCosto = parseFloat(costo.value) + 10
                    console.log('costo esquina:', newCosto)
                    costo.value = newCosto.toFixed(2)
                    COSTO_M2 = newCosto.toFixed(2)
                    costo.dataset.m2_update = 'true'
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

                console.log({ enganche })
                console.log({ precioFinalProducto })
                console.log({ COSTO_PRODUCTO })
            }
        }
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

        console.log('add recustos........')
    },
    async getUsers(type) {
        let end = true
        let users = new Array()
        let cont = 1
        let page = 1
        do {
            let request = await crm.getUsers(page, 200)
            console.log('UI getUsers: ', request)
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
            console.log('end: ', end)
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
            console.log('UI userVendors users: ', users)
        } else {
            VendedorContainer.style = 'display: none;'
        }
    },
    removeDatasets(selector) {
        const elem = document.querySelector(selector)
        const datasets = Object.keys(elem.dataset)

        datasets.forEach((key) => {
            delete elem.dataset[key]
        })

        console.log(`Reset of datasets for ${selector}`, elem.dataset)
    },
    addfuentes() {
        console.log('Prueba')
        const selectFuentes = document.getElementById('list-fuente')
        console.log('selectFuentes: ', selectFuentes)
        fuentesCliente.forEach((f) => {
            let option = document.createElement('option')
            option.innerText = f
            selectFuentes.appendChild(option)
        })
    },
    async paintDeals() {
        const containerDeals = document.getElementById('container-deals')
        containerDeals.innerHTML = ''
        const user = document.getElementById('user')
        console.log('user: ', user.dataset)
        let date = new Date()
        let previusDate = util.addDate(date, 'D', -1)
        console.log('previusDate: ', previusDate)
        const dataDeals1 = await creator.getDeals(previusDate)
        console.log('dataDeals1: ', dataDeals1)

        if (dataDeals1.ok) {
            dataDeals1.data.forEach((deal) => {
                console.log(
                    'Owner: ',
                    deal.Propietario,
                    'user: ',
                    user.children[1].textContent
                )
                if (
                    deal.Propietario == user.children[1].textContent ||
                    user.children[1].textContent == 'Sistemas Concordia'
                ) {
                    let url = `https://creatorapp.zoho.com/sistemas134/cotizador1/view-embed/Preliminar/IDOportunidad=${deal.IDOportunidad}`
                    let card = `
                    <section class="card-trato">
                        <section class="titulo-trato">${deal.ZCRMIDTerreno1}</section>
                        <section class="trato-cont">
                            <a href=${url} target="_blank" class="btn-trato">Preliminar</a>
                        </section>
                    </section>`
                    containerDeals.insertAdjacentHTML('beforeend', card)
                }
            })
        }

        const dataDeals2 = await creator.getDeals(date)
        console.log('dataDeals2: ', dataDeals2)

        if (dataDeals2.ok) {
            dataDeals2.data.forEach((deal) => {
                console.log(
                    'Owner: ',
                    deal.Propietario,
                    'user: ',
                    user.children[1].textContent
                )
                if (
                    deal.Propietario == user.children[1].textContent ||
                    user.children[1].textContent == 'Sistemas Concordia'
                ) {
                    let url = `https://creatorapp.zoho.com/sistemas134/cotizador1/view-embed/Preliminar/IDOportunidad=${deal.IDOportunidad}`
                    let card = `
                        <section class="card-trato">
                            <section class="titulo-trato">${deal.ZCRMIDTerreno1}</section>
                            <section class="trato-cont">
                                <a href=${url} target="_blank" class="btn-trato">Preliminar</a>
                            </section>
                        </section>`
                    containerDeals.insertAdjacentHTML('beforeend', card)
                }
            })
        }
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
        console.log('details: ', details)

        let es_chrome = details.toLowerCase().indexOf('chrome') > -1
        let es_firefox = details.toLowerCase().indexOf('firefox') > -1
        let es_opera = details.toLowerCase().indexOf('opr') > -1

        console.log('browser', es_chrome, es_firefox, es_opera)
        if (es_chrome) {
            objetReturn.browser = 'chrome'
        }
        if (es_firefox) {
            objetReturn.browser = 'firefox'
        }
        if (es_opera) {
            objetReturn.browser = 'opera'
        }
        return objetReturn
    },
    async createLead(dataForm) {
        const createLead = confirm('Desea crear el Posible cliente ')
        if (createLead) {
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
            // console.log('dataForm: ', dataForm)
            // console.log('ownerId: ', ownerId)
            // console.log('fraccionamientoId: ', fraccionamientoId)

            const createLeadRequest = await crm.createLead(
                dataForm,
                ownerId,
                fraccionamientoId
            )
            if (createLeadRequest.ok) {
                alerts.showAlert('success', 'Posible cliente creado')
            } else {
                alerts.showAlert(
                    createLead.type,
                    'El posible cliente no pudo ser creado !!'
                )
            }
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
    formatDate() {
        const currentDate = new Date()

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
        console.log({ campaign })

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
                if (tipoDeDescuento != null || tipoDeDescuento != '') {
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
                    console.log('1 : NO TIENE DESCUENTO')
                    saldoDelTerreno = DIMENSIONES * COSTO_M2 - descuentoEnganche
                    console.log(DIMENSIONES, COSTO_M2, descuentoEnganche)
                } else {
                    console.log('2 : TIENE DESCUENTO ')
                    if (tipoDeDescuento == 'Monto') {
                        montoDescuento = campaign.Monto_Descuento
                        console.log('tiene descuento de monto', montoDescuento)
                        reportObj.MontoDescuento = montoDescuento
                        descuento_temp = COSTO_M2 - montoDescuento
                        precioTotalDelTerreno = DIMENSIONES * descuento_temp
                        saldoDelTerreno =
                            precioTotalDelTerreno - descuentoEnganche
                    } else if (tipoDeDescuento == 'Porcentaje') {
                        porcentajeDescuento =
                            campaign.Porcentaje_Descuento / 100
                        console.log(
                            'tiene descuento de porcentaje',
                            porcentajeDescuento
                        )
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
}

export default UI
