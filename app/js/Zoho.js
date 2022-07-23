const crm = {
    async getAllFraccionamientos() {
        try {
            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Commerces',
                Type: 'criteria',
                Query: `(planos:equals:true)`,
            })

            // No data found in 'Commerces' Module with matched criteria
            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Found data
            return {
                code: 200,
                ok: true,
                data: request.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async detailsFraccionamiento(idFracc) {
        try {
            const request = await ZOHO.CRM.API.getRecord({
                Entity: 'Commerces',
                RecordID: idFracc.toString(),
            })

            // No record found in 'Commerces' records
            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async fetchDisponibilidad(fracc, manzana) {
        try {
            const numManzana = manzana.replace(/\D+/, '')
            const search =
                fracc == 'Alamar' ||
                fracc == 'La Puerta' ||
                fracc == 'Villa Toscana'
                    ? 'equals'
                    : 'starts_with'

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Products',
                Type: 'criteria',
                Query: `((Nombre_Fraccionamiento:${search}:${fracc})and(Manzana:equals:${numManzana}))`,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Check for more records
            if (request.info.more_records) {
                let records = [...request.data]

                const request2 = await ZOHO.CRM.API.searchRecord({
                    Entity: 'Products',
                    Type: 'criteria',
                    Query: `((Nombre_Fraccionamiento:${search}:${fracc})and(Manzana:equals:${numManzana}))`,
                    page: 2,
                    per_page: 200,
                })

                if (request2.status === 204) {
                    return {
                        code: 200,
                        ok: true,
                        data: request.data,
                        type: 'success',
                    }
                }

                records = [...records, ...request2.data]

                // Records found
                return {
                    code: 200,
                    ok: true,
                    data: records,
                    type: 'success',
                }
            }

            // Records found
            return {
                code: 200,
                ok: true,
                data: request.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async checkDisponible(productId) {
        try {
            const request = await ZOHO.CRM.API.getRecord({
                Entity: 'Products',
                RecordID: productId.toString(),
            })

            // No record found in 'Commerces' records
            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data:
                    request.data[0].Estado !== 'Disponible'
                        ? { disponible: false }
                        : { disponible: true },
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async searchContact(searchValue, modulo) {
        try {
            const criteria = searchValue.includes('@')
                ? 'equals'
                : 'starts_with'
            const api_name = searchValue.includes('@') ? 'Email' : 'Full_Name'

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: modulo,
                Type: 'criteria',
                Query: `(${api_name}:${criteria}:${searchValue})`,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async searchCampaigns(searchValue, fraccionamientoId) {
        try {
            const criteria = 'starts_with'
            const api_name = 'Campaign_Name'

            const qry =
                fraccionamientoId !== undefined
                    ? `((${api_name}:${criteria}:${searchValue})and(Status:equals:Activo)and(Fraccionamientos:equals:${fraccionamientoId}))`
                    : `((${api_name}:${criteria}:${searchValue})and(Status:equals:Activo))`

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Campaigns',
                Type: 'criteria',
                // Query: `((${api_name}:${criteria}:${searchValue})and(Status:equals:Activo))`,
                Query: qry,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getContact(id) {
        try {
            const request = await ZOHO.CRM.API.getRecord({
                Entity: 'Contacts',
                RecordID: id,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getAccount(id) {
        try {
            const request = await ZOHO.CRM.API.getRecord({
                Entity: 'Accounts',
                RecordID: id,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getCampaign(id) {
        try {
            const request = await ZOHO.CRM.API.getRecord({
                Entity: 'Campaigns',
                RecordID: id,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async UpdateContact(data, contactId) {
        let dataContacto = data.contacto

        // Marcar checkbox Segundo_Cliente si los campos tienen valor
        if (
            dataContacto?.Nombre2 !== undefined &&
            dataContacto?.ApellidoP2 !== undefined
        ) {
            dataContacto.Segundo_Cliente = true
        }

        const cbDomicilio = document.querySelector(
            'input[name="DomicilioExtranjero1"]'
        )

        if (cbDomicilio.checked) {
            dataContacto.DomicilioExtranjero1 = true
        }
        const cbDomicilio2 = document.querySelector(
            'input[name="DomicilioExtranjero2"]'
        )
        if (cbDomicilio2.checked) {
            dataContacto.DomicilioExtranjero2 = true
        }

        var updateCRM = {
            Entity: 'Contacts',
            APIData: {
                id: contactId,
                ...dataContacto,
            },
            Trigger: [],
        }

        try {
            const updateRequest = await ZOHO.CRM.API.updateRecord(updateCRM)

            const request = updateRequest[0]
            if (request.code !== 'SUCCESS') {
                return {
                    code: 400,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.status,
                }
            }

            return {
                code: 200,
                ok: true,
                data: request.details,
                type: 'success',
            }
        } catch (error) {
            // Create Log
            createLog(error, 'Error', {
                args: { data, contactId },
                invoke: 'UpdateContact',
            })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async CreateContact(data, accountId, ownerId) {
        const contacto = { ...data.contacto }
        contacto.Last_Name =
            contacto.Apellido_Paterno +
            (contacto.Apellido_Materno !== undefined
                ? ' ' + contacto.Apellido_Materno
                : '')
        contacto.Account_Name = { id: accountId }
        contacto.First_Name = contacto.First_Name.toUpperCase()
        contacto.Last_Name = contacto.Last_Name.toUpperCase()
        contacto.Apellido_Paterno = contacto.Apellido_Paterno.toUpperCase()
        contacto.Apellido_Materno =
            contacto.Apellido_Materno !== undefined
                ? contacto.Apellido_Materno.toUpperCase()
                : ''
        contacto.Owner = { id: ownerId }
        contacto.Widget_Planos = true
        // Marcar checkbox Segundo_Cliente si los campos tienen valor
        if (
            contacto?.Nombre2 !== undefined &&
            contacto?.ApellidoP2 !== undefined
        ) {
            contacto.Segundo_Cliente = true
        }

        const cbDomicilio = document.querySelector(
            'input[name="DomicilioExtranjero1"]'
        )

        if (cbDomicilio.checked) {
            contacto.DomicilioExtranjero1 = true
        }
        const cbDomicilio2 = document.querySelector(
            'input[name="DomicilioExtranjero2"]'
        )
        if (cbDomicilio2.checked) {
            contacto.DomicilioExtranjero2 = true
        }

        try {
            const request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Contacts',
                APIData: contacto,
                Trigger: [],
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data, accountId, ownerId },
                invoke: 'CreateContact',
            })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateContact(data) {
        const { contacto } = data

        contacto.Account_Name =
            contacto.Account_Name != '' ? { id: accountId } : ''

        // Marcar checkbox Segundo_Cliente si los campos tienen valor
        if (
            contacto?.Nombre2 !== undefined &&
            contacto?.ApellidoP2 !== undefined
        ) {
            console.log('Planos true')
            contacto.Segundo_Cliente = true
        }

        const cbDomicilio = document.querySelector(
            'input[name="DomicilioExtranjero1"]'
        )

        if (cbDomicilio.checked) {
            contacto.DomicilioExtranjero1 = true
        }
        const cbDomicilio2 = document.querySelector(
            'input[name="DomicilioExtranjero2"]'
        )
        if (cbDomicilio2.checked) {
            contacto.DomicilioExtranjero2 = true
        }

        try {
            const request = await ZOHO.CRM.API.updateRecord({
                Entity: 'Contacts',
                APIData: contacto,
                Trigger: [],
            })

            if (request.status !== 200) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'updateContact',
            })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateProduct(data) {
        try {
            const request = await ZOHO.CRM.API.updateRecord({
                Entity: 'Products',
                APIData: data,
                Trigger: [],
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record updated
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'updateProduct',
            })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async removeDiscount(productID, m2Original) {
        const product = {
            id: productID,
            Precio_con_Descuento: null,
            Tiene_Descuento: false,
            Costo_por_M2: m2Original,
        }

        try {
            const request = await ZOHO.CRM.API.updateRecord({
                Entity: 'Products',
                APIData: product,
                Trigger: [],
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record updated
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { productID },
                invoke: 'removeDiscount',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async createAccount(data) {
        data.Widget_Planos = true

        // Revisar si el contacto tiene segundo cliente
        const nombre2 = document.querySelector('input[name="Nombre2"]').value
        const apeP2 = document.querySelector('input[name="ApellidoP2"]').value
        const apeM2 = document.querySelector(
            'input[name="Apellido_Materno_2"]'
        ).value

        if (nombre2 !== '' && apeP2 !== '') {
            const titulares = `${data.Account_Name} / ${nombre2} ${apeP2}${
                apeM2 != '' ? ' ' + apeM2 : ''
            }`
            data.Account_Name = titulares.toUpperCase()
        }

        try {
            const request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Accounts',
                APIData: data,
                Trigger: [],
            })
            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record created
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'createAccount',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateAccount(data) {
        try {
            const request = await ZOHO.CRM.API.updateRecord({
                Entity: 'Accounts',
                APIData: data,
                Trigger: [],
            })
            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record created
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'updateAccount',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async createDeal(data) {
        try {
            data.Widget_Planos = true
            let request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Deals',
                APIData: data,
                Trigger: [],
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', { args: { data }, invoke: 'createDeal' })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateDeal(data) {
        try {
            let request = await ZOHO.CRM.API.updateRecord({
                Entity: 'Deals',
                APIData: data,
                Trigger: [],
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', { args: { data }, invoke: 'updateDeal' })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async serchDealsByOwner(OwnerId) {
        try {
            const qry = `(Owner:equals:${OwnerId})`

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Deals',
                Type: 'criteria',
                Query: qry,
            })
            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getAllDeals() {
        try {
            const request = await ZOHO.CRM.API.getAllRecords({
                Entity: 'Deals',
                sort_order: 'desc',
                per_page: 200,
                page: 1,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async associateProduct(product_id, deal_id) {
        try {
            const APIData = {
                id: product_id,
            }

            const request = await ZOHO.CRM.API.updateRelatedRecords({
                Entity: 'Products',
                RecordID: product_id,
                RelatedList: 'Deals',
                RelatedRecordID: deal_id,
                APIData: APIData,
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { product_id, deal_id },
                invoke: 'associateProduct',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async convertToContact(leadId, userId) {
        // CRM function
        // const connectionName = 'moduloscrm'
        const functionName = 'convertLead'
        try {
            const request = await ZOHO.CRM.FUNCTIONS.execute(functionName, {
                arguments: JSON.stringify({
                    leadId,
                    userId,
                }),
            })

            const details = JSON.parse(request.details?.output)
            console.log('details: ', details)

            if (details.code == 'DUPLICATE_DATA') {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: details.code,
                }
            }

            if (request.code !== 'success') {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.output,
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: JSON.parse(request.details.output),
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { leadId, userId },
                invoke: 'convertToContact',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async aplicarDescuentoProducto(campanaID, productoID) {
        const functionName = 'aplicardescuentoproducto'
        try {
            const request = await ZOHO.CRM.FUNCTIONS.execute(functionName, {
                arguments: JSON.stringify({
                    campanaID,
                    productoID,
                }),
            })

            if (request.code !== 'success') {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.output,
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: JSON.parse(request.details.output),
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { campanaID, productoID },
                invoke: 'aplicarDescuentoProducto',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getUsers(page, per_page) {
        try {
            const request = await ZOHO.CRM.API.getAllUsers({
                Type: 'ActiveUsers',
                page: page,
                per_page: per_page,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async createLead(newData, ownerId, fraccionamientoId) {
        let data = { ...newData.contacto }
        let lead = {}
        let nombreCompleto

        if (data.Apellido_Materno === undefined) {
            nombreCompleto =
                data.First_Name.toUpperCase() +
                ' ' +
                data.Apellido_Paterno.toUpperCase()
            lead.Last_Name = data.Apellido_Paterno.toUpperCase()
            lead.Apellido_Materno = ''
        } else {
            nombreCompleto =
                data.First_Name.toUpperCase() +
                ' ' +
                data.Apellido_Paterno.toUpperCase() +
                ' ' +
                data.Apellido_Materno.toUpperCase()
            lead.Last_Name =
                data.Apellido_Paterno.toUpperCase() +
                ' ' +
                data.Apellido_Materno.toUpperCase()
            lead.Apellido_Materno = data.Apellido_Materno.toUpperCase()
        }

        lead.Apellido_Paterno = data.Apellido_Paterno.toUpperCase()

        lead.First_Name = data.First_Name.toUpperCase()
        lead.Interesado_en = { id: fraccionamientoId }
        lead.Lead_Source = data.Lead_Source
        lead.Lead_Status = 'Alta de Lead'
        lead.Owner = { id: ownerId }
        lead.Company = nombreCompleto
        lead.Mobile = data.Mobile
        lead.Email = data.Email
        //
        lead.Lugar_de_nacimiento = data.Lugar_de_nacimiento
        lead.Date_of_Birth = data.Date_of_Birth
        lead.CURP = data.CURP
        lead.Estado_Civil = data.Estado_Civil
        lead.Phone = data.Phone

        //
        lead.Empresa_en_labora = data.Empresa_en_labora
        lead.Puesto = data.Ocupacion
        lead.INGRESO_MENSUAL = data.INGRESO_MENSUAL
        lead.A_os_Laborados = data.A_os_Laborados

        //
        lead.Street = data.calle
        lead.City = data.Mailing_City
        lead.State = data.Mailing_State
        lead.Zip_Code = data.Mailing_Zip
        lead.Colonia = data.Colonia

        lead.Country = data.Mailing_Country
        lead.Departamento = data.Departamento
        lead.Widget_Planos = true

        try {
            const request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Leads',
                APIData: lead,
                Trigger: [],
            })

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { newData, ownerId, fraccionamientoId },
                invoke: 'createLead',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getFraccionamiento(id) {
        try {
            const request = await ZOHO.CRM.API.getRecord({
                Entity: 'Fraccionamientos',
                RecordID: id,
            })

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async attachFile(dealId, FileName, blob) {
        try {
            const request = await ZOHO.CRM.API.attachFile({
                Entity: 'Deals',
                RecordID: dealId,
                File: { Name: `${FileName}.jpg`, Content: blob },
            })

            console.log('Zoho request: ', request)

            if (request.status === 204) {
                return {
                    code: request.status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.statusText,
                }
            }

            // Record found
            return {
                code: 200,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { dealId, FileName, blob },
                invoke: 'attachFile',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateUIF(dealID) {
        const functionName = 'IMP_RefreshUIF'
        try {
            const request = await ZOHO.CRM.FUNCTIONS.execute(functionName, {
                arguments: JSON.stringify({
                    idtrato: dealID,
                }),
            })

            if (request.code !== 'success') {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.output,
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: request,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { dealID },
                invoke: 'IMP_RefreshUIF',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
}

const creator = {
    async createRecord(data) {
        const connectionName = 'creator'
        const req_data = {
            parameters: data,
            method: 'POST',
            url: 'https://creator.zoho.com/api/v2/sistemas134/cotizador1/form/Presupuesto',
        }
        try {
            const request = await ZOHO.CRM.CONNECTION.invoke(
                connectionName,
                req_data
            )
            if (
                request.code !== 'SUCCESS' ||
                request.details.statusMessage?.data?.ID === undefined
            ) {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.statusMessage.message,
                }
            }
            //
            return {
                code: 201,
                ok: true,
                data: request.details.statusMessage?.data,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'createRecord',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getRecord(id) {
        const connectionName = 'creator'
        const req_data = {
            method: 'GET',
            url: `https://creator.zoho.com/api/v2/sistemas134/cotizador1/report/Presupuesto_Report/${id}`,
        }
        try {
            const request = await ZOHO.CRM.CONNECTION.invoke(
                connectionName,
                req_data
            )
            if (
                request.code !== 'SUCCESS' ||
                request.details.statusMessage?.data?.ID === undefined
            ) {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.statusMessage.message,
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: request.details.statusMessage?.data,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getRecordByFolio(folio, IDOportunidad) {
        const connectionName = 'creator'
        const req_data = {
            method: 'GET',
            url: `https://creator.zoho.com/api/v2/sistemas134/cotizador1/report/Presupuesto_Report?Consecutivo=${folio}&IDOportunidad=${IDOportunidad}`,
        }
        try {
            const request = await ZOHO.CRM.CONNECTION.invoke(
                connectionName,
                req_data
            )

            console.log("creator.getRecordByFolio request: ",request)

            if (
                request.code !== 'SUCCESS' ||
                request.details.statusMessage?.data[0]?.ID === undefined
            ) {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.statusMessage.message,
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: request.details.statusMessage?.data[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateRecord(id, fechas) {
        const data = { data: {
            GenerarContrato : true,
            DiasdePago: fechas.DiasdePago,
            FechadePago: fechas.FechadePago,
            FechaProximoPago: fechas.FechaProximoPago,
            FechaUltimoPago: fechas.FechaUltimoPago,
        }}
        const connectionName = 'creator'
        const req_data = {
            method: 'PATCH',
            url: `https://creator.zoho.com/api/v2/sistemas134/cotizador1/report/Presupuesto_Report/${id}`,
            parameters: data,

        }
        try {
            const request = await ZOHO.CRM.CONNECTION.invoke(
                connectionName,
                req_data
            )
            console.log("creator.updateRecord request",request)

            if (
                request.code !== 'SUCCESS' ||
                request.details.statusMessage?.data?.ID === undefined
            ) {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.details.statusMessage,
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: request.details.statusMessage?.data,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { id, fechas },
                invoke: 'Creator - UpdateRecord',
            })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
}

const organization_id = 651425182

const books = {
    async getContactByEmail(email) {
        try {
            const conn_name = 'contactobooks'
            const config = {
                method: 'GET',
                url: `https://books.zoho.com/api/v3/contacts?email=${email}&organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (!request?.details?.statusMessage?.contacts[0]?.contact_id) {
                return {
                    code: '404',
                    ok: false,
                    type: 'warning',
                    message: 'Contacto no encontrado en books',
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request?.details?.statusMessage?.contacts[0],
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async syncContact(id) {
        try {
            const conn_name = 'syncbooks'
            const config = {
                method: 'POST',
                url: `https://books.zoho.com/api/v3/crm/contact/${id}/import?organization_id=${organization_id}`,
                // url: `https://books.zoho.com/api/v3/crm/contact/${id}/import?organization_id=651425182`,
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (!request?.details?.statusMessage?.data?.customer_id) {
                return {
                    code: '404',
                    ok: false,
                    type: 'warning',
                    message: 'Contacto no sincronizado',
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request?.details?.statusMessage?.data,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', { args: { id }, invoke: 'syncContact' })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getProductByName(name, sku) {
        try {
            const conn_name = 'productobooks'
            const config = {
                method: 'GET',
                url: `https://books.zoho.com/api/v3/items?name=${encodeURI(
                    name
                )}&organization_id=651425182`,
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)
            const items = request.details.statusMessage.items
            const item = items.find((item) => {
                if (item.sku === sku) return item
            })

            if (request.code !== 'SUCCESS' || item === undefined) {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: item,
                type: 'success',
            }
        } catch (error) {
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async createProduct(data) {
        try {
            const conn_name = 'productobooks'
            const config = {
                parameters: data,
                method: 'post',
                url: `https://books.zoho.com/api/v3/items?organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (request.data[0].code !== 'SUCCESS') {
                return {
                    code: request.data[0].status,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: request.data[0],
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request.data[0],
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'createProduct',
            })

            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async createInvoice(data) {
        try {
            const conn_name = 'invoicebooks'
            const config = {
                parameters: data,
                method: 'POST',
                url: `https://books.zoho.com/api/v3/invoices?organization_id=651425182`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (request.details.statusMessage.code !== 0) {
                return {
                    code: 400,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: 'Factura no creada',
                }
            }

            // Record found
            return {
                code: 201,
                ok: true,
                data: request.details.statusMessage,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { data },
                invoke: 'createInvoice',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async sendInvoice(id) {
        try {
            const conn_name = 'invoicebooks'
            const config = {
                method: 'POST',
                url: `https://books.zoho.com/api/v3/invoices/${id}/status/sent?organization_id=651425182`,
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (request.details.statusMessage.code !== 0) {
                return {
                    code: 400,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: 'Factura no enviada',
                }
            }

            // Invoice sent
            return {
                code: 200,
                ok: true,
                data: request.details.statusMessage,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', { args: { id }, invoke: 'sendInvoice' })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateProduct(item_id, data) {
        try {
            const conn_name = 'productobooks'
            const config = {
                method: 'PUT',
                url: `https://books.zoho.com/api/v3/items/${item_id}?organization_id=651425182`,
                parameters: data,
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (request.details.statusMessage.code !== 0) {
                return {
                    code: 400,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: 'Producto no actualizado',
                }
            }

            // Updated product
            return {
                code: 200,
                ok: true,
                data: request.details.statusMessage,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { item_id, data },
                invoke: 'updateProduct',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async removeDiscountBooks(item_id) {
        try {
            const conn_name = 'productobooks'

            const data = {
                custom_fields: [
                    { label: 'Precio con Descuento', value: '' },
                    { label: 'Tiene Descuento', value: false },
                ],
            }

            const config = {
                method: 'PUT',
                url: `https://books.zoho.com/api/v3/items/${item_id}?organization_id=651425182`,
                parameters: data,
            }
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (request.details.statusMessage.code !== 0) {
                return {
                    code: 400,
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: 'Producto no actualizado',
                }
            }

            // Updated product
            return {
                code: 200,
                ok: true,
                data: request.details.statusMessage,
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { item_id },
                invoke: 'removeDiscountBooks',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
}

const cliq = {
    async postToChannel(channel, msg) {
        try {
            const config = {
                method: 'POST',
                url: `https://cliq.zoho.com/api/v2/channelsbyname/${channel}/message`,
                parameters: { text: msg },
            }

            var conn_name = 'cliq'

            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            if (request.code !== 'SUCCESS') {
                return {
                    code: '400',
                    ok: false,
                    data: null,
                    type: 'warning',
                    message: 'Error al postear en el canal',
                }
            }
            //
            return {
                code: 200,
                ok: true,
                data: {},
                type: 'success',
            }
        } catch (error) {
            createLog(error, 'Error', {
                args: { channel, msg },
                invoke: 'postToChannel',
            })
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
}

async function createLog(log, status, info) {
    const connectionName = 'creator'
    let message = log?.message
    const obj = {
        data: {
            app: 'Planos',
            err: log,
            message: message,
            status,
            additional_info: info,
            log: info.invoke
        },
    }

    console.log(`Log de ${info.invoke}`)

    const req_data = {
        parameters: obj,
        method: 'POST',
        url: 'https://creator.zoho.com/api/v2/sistemas134/cotizador1/form/logs',
    }

    const response = await ZOHO.CRM.CONNECTION.invoke(connectionName, req_data)

    return response
}

export { crm, creator, books, cliq }
