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
    async searchCoordinador() {
        try {
            const criteria = 'starts_with'
            const api_name = 'Campaign_Name'

            const request = await ZOHO.CRM.API.searchRecord({
                Entity: 'Campaigns',
                Type: 'criteria',
                Query: `((${api_name}:${criteria}:${searchValue}) && (api:))`,
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
    async CreateContact(data) {
        console.log('Creating contact...')
        console.log(data)

        // try {
        //     const request = await ZOHO.CRM.API.insertRecord({
        //         Entity: 'Contacts',
        //         APIData: data,
        //         Trigger: ['workflow'],
        //     })

        //     if (request.status !== 200) {
        //         return {
        //             code: request.status,
        //             ok: false,
        //             data: null,
        //             type: 'warning',
        //             message: request.statusText,
        //         }
        //     }

        //     // Record found
        //     return {
        //         code: 200,
        //         ok: true,
        //         data: request.data[0],
        //         type: 'success',
        //     }
        // } catch (error) {
        //     return {
        //         code: 500,
        //         ok: false,
        //         type: 'danger',
        //         message: error.message,
        //     }
        // }
    },
}

export default crm
