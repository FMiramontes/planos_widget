console.log('Running OCR...')

// Register listener for successful scan event to obtain results
const t1 = document.getElementById('scan-titular1')

// scan-titular1

t1.addEventListener('scanSuccess', (ev) => {
    // Since UI component uses custom events, data is placed in `detail` property
    console.log('Results', ev.detail)

    testOCR.getDetails(ev.detail.recognizer)
})

// ###################
// scan-titular2

const t2 = document.getElementById('scan-titular2')

t2.addEventListener('scanSuccess', (ev) => {
    // Since UI component uses custom events, data is placed in `detail` property
    console.log('Results', ev.detail)

    testOCR.getDetails2(ev.detail.recognizer)
})

const testOCR = {
    getDetails(ocr) {
        const documentCountry = ocr.classInfo.countryName
        const splitLastName = ocr.lastName.split(' ')
        let apellidos = ''

        if (splitLastName.length > 1) {
            splitLastName.shift()

            apellidos = splitLastName
                .map((a) => {
                    return a
                })
                .join(' ')
        } else if (splitLastName.length === 1) {
            apellidos = ''
        }

        /* Nombre */
        const First_Name = ocr.firstName || ocr.fullName
        const Apellido_Paterno = ocr.fathersName || splitLastName[0]
        const Apellido_Materno = ocr.mothersName || apellidos

        /* Nacimiento */
        const Lugar_de_nacimiento = ocr.placeOfBirth
        const diaNacimiento =
            ocr.dateOfBirth.day < 10
                ? `0${ocr.dateOfBirth.day}`
                : ocr.dateOfBirth.day
        const mesNacimiento =
            ocr.dateOfBirth.month < 10
                ? `0${ocr.dateOfBirth.month}`
                : ocr.dateOfBirth.month
        const a_oNacimiento = ocr.dateOfBirth.year
        const Date_of_Birth = `${a_oNacimiento}-${mesNacimiento}-${diaNacimiento}`

        const CURP = ocr.personalIdNumber
        const address = ocr.address
        const splitAddress = address.split('\n')

        let calle, Colonia, Mailing_Zip, Mailing_City
        /* Domicilio */
        if (documentCountry.includes('MEX')) {
            calle = splitAddress[0]
            Colonia = splitAddress[1].replace(/\d+/g, '')
            Mailing_Zip = splitAddress[1].replace(/\D+/g, '')
            Mailing_City = splitAddress[2].split(' ,')[0]
        } else if (documentCountry.includes('UNITED STATES')) {
            calle = splitAddress[0]
            let tempAdd = splitAddress[1].split(',')[1]
            Mailing_Zip = tempAdd.replace(/\D+/g, '')
            Mailing_City = splitAddress[1].substr(
                0,
                splitAddress[1].indexOf(',')
            )
        }

        const data = {
            First_Name,
            Apellido_Paterno,
            Apellido_Materno,
            calle,
            Colonia,
            Mailing_Zip,
            Mailing_City,
            Lugar_de_nacimiento,
            Date_of_Birth,
            CURP,
        }
        testOCR.paintDataInForm(data)
    },
    getDetails2(ocr) {
        const documentCountry = ocr.classInfo.countryName
        const splitLastName = ocr.lastName.split(' ')
        let apellidos = ''

        if (splitLastName.length > 1) {
            splitLastName.shift()

            apellidos = splitLastName
                .map((a) => {
                    return a
                })
                .join(' ')
        } else if (splitLastName.length === 1) {
            apellidos = ''
        }

        /* Nombre */
        const Nombre2 = ocr.firstName || ocr.fullName
        const ApellidoP2 = ocr.fathersName || ocr.lastName
        const Apellido_Materno_2 = ocr.mothersName || apellidos

        /* Nacimiento */
        const LUGAR_DE_NACIMIENTO_2 = ocr.placeOfBirth
        const diaNacimiento =
            ocr.dateOfBirth.day < 10
                ? `0${ocr.dateOfBirth.day}`
                : ocr.dateOfBirth.day
        const mesNacimiento =
            ocr.dateOfBirth.month < 10
                ? `0${ocr.dateOfBirth.month}`
                : ocr.dateOfBirth.month
        const a_oNacimiento = ocr.dateOfBirth.year
        const Fecha_Nacimiento2 = `${a_oNacimiento}-${mesNacimiento}-${diaNacimiento}`

        const address = ocr.address
        const splitAddress = address.split('\n')

        let Calle2, Colonia2, Zip_SegundoCliente, Ciudad2
        /* Domicilio */
        if (documentCountry.includes('MEX')) {
            Calle2 = splitAddress[0]
            Colonia2 = splitAddress[1].replace(/\d+/g, '')
            Zip_SegundoCliente = splitAddress[1].replace(/\D+/g, '')
            Ciudad2 = splitAddress[2].split(' ,')[0]
        } else if (documentCountry.includes('UNITED STATES')) {
            Calle2 = splitAddress[0]
            let tempAdd = splitAddress[1].split(',')[1]
            Zip_SegundoCliente = tempAdd.replace(/\D+/g, '')
            Ciudad2 = splitAddress[1].substr(0, splitAddress[1].indexOf(','))
        }

        const CURP2 = ocr.personalIdNumber

        const data = {
            Nombre2,
            ApellidoP2,
            Apellido_Materno_2,
            Calle2,
            Colonia2,
            Zip_SegundoCliente,
            Ciudad2,
            LUGAR_DE_NACIMIENTO_2,
            Fecha_Nacimiento2,
            CURP2,
        }
        testOCR.paintDataInForm(data)
    },
    async paintDataInForm(data) {
        // pintar informacion en Formulario
        const Keys = this.getKeysForm()
        const CRMData = data

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
}
