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

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Products',
                Type: 'criteria',
                Query: `((Nombre_Fraccionamiento:starts_with:${fracc})and(Manzana:equals:${numManzana}))`,
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
    async searchContact(searchValue) {
        try {
            const criteria = searchValue.includes('@')
                ? 'equals'
                : 'starts_with'
            const api_name = searchValue.includes('@') ? 'Email' : 'Full_Name'

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Contacts',
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
    async searchCampaigns(searchValue) {
        try {
            const criteria = 'starts_with'
            const api_name = 'Campaign_Name'

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Campaigns',
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
    async UpdateContact(data) {
        console.log('Updating contact...')
        console.log(data)
    },
    async CreateContact(data, accountId) {
        console.log('Creating contact...')
        const contacto = { ...data.contacto }
        contacto.Last_Name =
            contacto.Apellido_Paterno + contacto.Apellido_Materno
        contacto.Account_Name = { id: accountId }
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
            console.log('create contact: ', request)
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
    async createAccount(data) {
        console.log('Creating account...')
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
            let request = await ZOHO.CRM.API.insertRecord({
                Entity: 'Deals',
                APIData: data,
                Trigger: [],
            })

            console.log('create contact: ', request)
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
            //
            return {
                code: 201,
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
}

const organization_id = ''

const books = {
    async getContactByEmail(email) {
        try {
            const conn_name = 'contactobooks'
            const config = {
                method: 'GET',
                url: `https://books.zoho.com/api/v3/contacts?email=${email}&organization_id=${organization_id}`,
                headers: {
                    Authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            }
            const request = ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            console.log('Zoho - sendInvoice: ', request)
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
    async syncContact(id) {
        try {
            const conn_name = 'invoicebooks'
            const config = {
                method: 'post',
                url: `https://books.zoho.com/api/v3/crm/contact/${id}/import?organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            console.log('Zoho - sendInvoice: ', request)
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
    async getProductBySku(sku) {
        try {
            const conn_name = 'invoicebooks'
            const config = {
                method: 'GET',
                url: `https://books.zoho.com/api/v3/items?sku=${sku}&organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            console.log('Zoho - sendInvoice: ', request)
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
    async createProduct(data) {
        try {
            const conn_name = 'invoicebooks'
            const config = {
                parameters: data,
                method: 'post',
                url: `https://books.zoho.com/api/v3/items?organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = ZOHO.CRM.CONNECTION.invoke(conn_name, config)

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
    async createInvoice(data) {
        // data = {
        //     customer_id: idContactoBooks,
        //     reference_number: 'Pago Prueba Widget',
        //     date: today,
        //     due_date: fecha_vencimiento,
        //     custom_fields: [
        //         {
        //             label: 'Commerce',
        //             value: idContactoBooks,
        //         },
        //     ],
        //     line_items: [
        //         {
        //             item_id: '888587000012337389',
        //             description: 'Pago por Concepto de Apartado',
        //             quantity: 1,
        //             rate: 150,
        //         },
        //     ],
        // }
        try {
            const conn_name = 'invoicebooks'
            const config = {
                parameters: data,
                method: 'post',
                url: `https://books.zoho.com/api/v3/invoices?organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = ZOHO.CRM.CONNECTION.invoke(conn_name, config)

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
    async sendInvoice(id) {
        try {
            const conn_name = 'invoicebooks'
            const config = {
                method: 'post',
                url: `https://books.zoho.com/api/v3/invoices/${id}/status/sent?organization_id=${organization_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const request = ZOHO.CRM.CONNECTION.invoke(conn_name, config)

            console.log('Zoho - sendInvoice: ', request)
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
}

export { crm, creator, books }
