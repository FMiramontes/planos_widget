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
            console.log(error)
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
            const search = fracc == 'Alamar' ? 'equals' : 'starts_with'

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
        console.log('Updating contact...')
        console.log(data)
        let dataContacto = data.contacto

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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async CreateContact(data, accountId, ownerId) {
        console.log('Creating contact...')
        const contacto = { ...data.contacto }
        contacto.Last_Name =
            contacto.Apellido_Paterno + ' ' + contacto.Apellido_Materno
        contacto.Account_Name = { id: accountId }
        contacto.First_Name = contacto.First_Name.toUpperCase()
        contacto.Last_Name = contacto.Last_Name.toUpperCase()
        contacto.Apellido_Paterno = contacto.Apellido_Paterno.toUpperCase()
        contacto.Apellido_Materno = contacto.Apellido_Materno.toUpperCase()
        contacto.Owner = { id: ownerId }
        contacto.Widget_Planos = true
        // Marcar checkbox Segundo_Cliente si los campos tienen valor
        if (
            contacto?.Nombre2 !== undefined &&
            contacto?.ApellidoP2 !== undefined
        ) {
            contacto.Segundo_Cliente = true
        }

        try {
            const request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Contacts',
                APIData: contacto,
                Trigger: [],
            })
            console.log('Zoho create contact: ', request)
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
            console.log(error)
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateContact(data) {
        console.log('Updating contact...')
        const { contacto } = data

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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async updateProduct(productID, costoM2, costoProducto) {
        console.log('Updating product...')
        const product = {
            id: productID,
            Costo_por_M2: costoM2,
            Unit_Price: costoProducto,
            Costo_total_del_terreno: costoProducto,
            Saldo: costoProducto,
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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async removeDiscount(productID) {
        console.log('Removing discount to product in CRM...')
        const product = {
            id: productID,
            Precio_con_Descuento: null,
            Tiene_Descuento: false,
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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async createAccount(data) {
        console.log('Creating account...')
        data.Widget_Planos = true
        try {
            const request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Accounts',
                APIData: data,
                Trigger: [],
            })
            console.log('create account: ', request)
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

            console.log('Create Deal: ', request)
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

            console.log('Zoho updateDeal: ', request)
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

            console.log('Zoho - associateProduct: ', request)
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
            console.log('zoho: convert lead', request)
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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async aplicarDescuentoProducto(campanaID, productoID) {
        // CRM function
        // for testing... change second argument to a different name
        // console.log('Actual product ID', productId)
        // let productoID = '2234337000023667433'
        const functionName = 'aplicardescuentoproducto'
        try {
            const request = await ZOHO.CRM.FUNCTIONS.execute(functionName, {
                arguments: JSON.stringify({
                    campanaID,
                    productoID,
                }),
            })
            console.log('zoho function: aplicar descuento', request)
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

            console.log('Zoho getUsers: ', request)
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
        console.log('Creating Lead...')
        let data = { ...newData.contacto }
        let lead = {}
        console.log('data: ', data)
        let nombreCompleto =
            data.First_Name.toUpperCase() +
            ' ' +
            data.Apellido_Paterno.toUpperCase() +
            ' ' +
            data.Apellido_Materno.toUpperCase()
        lead.Last_Name =
            data.Apellido_Paterno.toUpperCase() +
            ' ' +
            data.Apellido_Materno.toUpperCase()
        lead.Apellido_Paterno = data.Apellido_Paterno.toUpperCase()
        lead.Apellido_Materno = data.Apellido_Materno.toUpperCase()
        lead.First_Name = data.First_Name.toUpperCase()
        lead.Interesado_en = { id: fraccionamientoId }
        lead.Lead_Source = data.Lead_Source
        lead.Lead_Status = 'Alta de Lead'
        lead.Owner = { id: ownerId }
        lead.Company = nombreCompleto
        lead.Mobile = data.Mobile
        lead.Email = data.Email
        console.log('lead: ', lead)

        try {
            const request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Leads',
                APIData: lead,
                Trigger: [],
            })
            console.log('Zoho create contact: ', request)
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
            console.log(error)
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
}

const creator = {
    async createRecord(data) {
        console.log('createRecordData', data)
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
            console.log('Zoho - associateProduct: ', request)
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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
    async getRecord(id) {
        console.log('Creator getRecordById', id)
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
            console.log('Creator get record request: ', request)
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

            console.log('Zoho - sendInvoice: ', request)
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
        console.log('Zoho syncContact id: ', id)
        try {
            const conn_name = 'syncbooks'
            const config = {
                method: 'POST',
                url: `https://books.zoho.com/api/v3/crm/contact/${id}/import?organization_id=${organization_id}`,
                // url: `https://books.zoho.com/api/v3/crm/contact/${id}/import?organization_id=651425182`,
            }
            console.log('Zoho syncContact config: ', config)
            const request = await ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            console.log('Zoho - syncContact: ', request)
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
            console.log('Zoho - getProductBySku: ', request)
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

            console.log('Zoho - createProduct: ', request)
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

            console.log('Zoho - createInvoice: ', request)
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

            console.log('Zoho - sendInvoice: ', request)
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

            console.log('Zoho - updateInvoice: ', request)
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

            console.log('Zoho - removing discount', request)
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
            console.log('requestCliq', request)
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
            return {
                code: 500,
                ok: false,
                type: 'danger',
                message: error.message,
            }
        }
    },
}

export { crm, creator, books, cliq }
