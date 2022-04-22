console.log('Running OCR...')

// Register listener for successful scan event to obtain results
const el = document.querySelector('blinkid-in-browser')
console.log(el)

el.addEventListener('scanSuccess', (ev) => {
    // Since UI component uses custom events, data is placed in `detail` property
    console.log('Results', ev.detail)

    getDetails(ev.detail.recognizer)
})

function getDetails(ocr) {
    /* Nombre */
    const First_Name = ocr.fullName
    const Apellido_Paterno = ocr.fathersName
    const Apellido_Materno = ocr.mothersName

    /* Domicilio */
    const address = ocr.address
    const splitAddress = address.split('\n')

    const calle = splitAddress[0]
    const Colonia = splitAddress[1].replace(/\d+/g, '')
    const Mailing_Zip = splitAddress[1].replace(/\D+/g, '')
    const Mailing_City = splitAddress[2].split(' ,')[0]

    /* Nacimiento */
    const diaNacimiento = ocr.dateOfBirth.day
    const mesNacimiento = ocr.dateOfBirth.month
    const a_oNacimiento = ocr.dateOfBirth.year
    const Date_of_Birth =
        ocr.succesfullyParsed == true
            ? ocr.originalString
            : `${diaNacimiento}/${mesNacimiento}/${a_oNacimiento}`

    const CURP = ocr.personalIdNumber

    const data = {
        First_Name,
        Apellido_Paterno,
        Apellido_Materno,
        calle,
        Colonia,
        Mailing_Zip,
        Mailing_City,
        Date_of_Birth,
        CURP,
    }
    testOCR.paintDataInForm(data)
}

let containerWrap = document.querySelector('.container-wrap')
const btnTest = document.getElementById('test')
btnTest.addEventListener('click', (e) => {
    containerWrap.classList.add('show')
})

let containerModal = document.querySelector('.container-modal')

containerModal.addEventListener('click', (event) => {
    if (event.target == containerModal) {
        containerWrap.classList.remove('show')
    }
})

const testOCR = {
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
