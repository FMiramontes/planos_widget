// email validate

import alerts from './alertas.js'

const btn_submit = document.getElementById('btn-submit')

const validate = {
    validateEmail(email, reqired) {
        let expr =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (reqired == 'required') {
            if (!expr.test(email)) {
                alerts.showAlert(
                    'warning',
                    'La dirección de correo ' + email + ' es incorrecta.'
                )
                btn_submit.disabled = true
            } else {
                btn_submit.disabled = false
            }
        } else {
            if (!expr.test(email) && email != '') {
                alerts.showAlert(
                    'warning',
                    'La dirección de correo ' + email + ' es incorrecta.'
                )
                btn_submit.disabled = true
            } else {
                btn_submit.disabled = false
            }
        }
    },

    validContact(existeEnCRM) {
        const inputsToDisabled = Array.from(
            document.querySelectorAll('[data-existe-en-crm]')
        )

        //console.log('validate inputsToDisabled: ', inputsToDisabled)

        inputsToDisabled.forEach((e) => {
            if (e.value != '') {
                e.disabled = existeEnCRM
                //console.log('validate e: ', e)
            } else {
                e.disabled = false
                //console.log('validate e: ', e)
            }
        })
    },

    validateForm() {
        const inputsCheckForm = Array.from(
            document.querySelectorAll('[data-existe-en-crm]')
        )
        const inputsInvalid = {}
        let contPass = 9

        const loggedUser = document.querySelector('#user')

        let campana = document.getElementById('campaignValue')

        let vendedor = document.querySelector('#vendorsValue')

        let fuentePosible = document.querySelector('[name="Lead_Source"]')

        let modoPago = document.querySelector('[name="Modo_de_pago"]')

        let coordinador = document.querySelector('[name="coordinador"]')

        let nombre2 = document.querySelector('[name="Nombre2"]')
        let apellido2 = document.querySelector('[name="ApellidoP2"]')
        let correo2 = document.querySelector('[name="Correo2"]')

        let cont = 0
        inputsCheckForm.forEach((e) => {
            if (
                e.name == 'First_Name' ||
                e.name == 'Apellido_Paterno' ||
                e.name == 'Email'
            ) {
                if (e.value != '') {
                    e.classList.remove('invalid')
                    cont += 1
                } else {
                    if (e.name == 'First_Name') {
                        inputsInvalid.fname = e.name
                    } else if (e.name == 'Apellido_Paterno') {
                        inputsInvalid.lname = e.name
                    } else if (e.name == 'Email') {
                        inputsInvalid.email = e.name
                    }
                }
            }
        })

        if(nombre2.value !== '' && apellido2.value !== ''){
            if(correo2.value !== ''){
                campana.classList.remove('invalid')
                cont +=1;
            }else{
                inputsInvalid.correo2 = correo2.name
            }        
        }

        if (campana.dataset.campaignid != undefined) {
            campana.classList.remove('invalid')
            cont += 1
        } else {
            inputsInvalid.campana = campana.name
        }

        if (vendedor.value !== '') {
            vendedor.classList.remove('invalid')
            cont += 1
        } else {
            inputsInvalid.vendedor = vendedor.name
        }

        if (loggedUser.dataset.profile === 'Vendedor') {
            contPass = 8
        }

        if(fuentePosible.value !== ''){
            fuentePosible.classList.remove('invalid')
            cont += 1
        }else{
            inputsInvalid.fuentePosible = fuentePosible.name
        }

        if(modoPago.value !==''){
            modoPago.classList.remove('invalid')
            cont += 1
        }else{
            inputsInvalid.modoPago = modoPago.name
        }

        if(coordinador.value !== ''){
            coordinador.classList.remove('invalid')
        }else{
            inputsInvalid.coordinador = coordinador.name
        }

        if (cont == contPass) {
            return true
        } else {
            //pintar alertas
            this.inputsInvalid(inputsInvalid)
            return false
        }
    },

    validateDataLead() {
        const inputsCheckForm = Array.from(
            document.querySelectorAll('[data-existe-en-crm]')
        )
        const inputsInvalid = {}
        let contPass = 6

        const loggedUser = document.querySelector('#user')

        let vendedor = document.querySelector('#vendorsValue')

        let fuentePosible = document.querySelector('[name="Lead_Source"]')
        let mobile = document.querySelector('[name="Mobile"]')

        let nombre2 = document.querySelector('[name="Nombre2"]')
        let apellido2 = document.querySelector('[name="ApellidoP2"]')
        let correo2 = document.querySelector('[name="Correo2"]')

        let cont = 0
        inputsCheckForm.forEach((e) => {
            if (
                e.name == 'First_Name' ||
                e.name == 'Apellido_Paterno' ||
                e.name == 'Email'
            ) {
                if (e.value != '') {
                    e.classList.remove('invalid')
                    cont += 1
                } else {
                    if (e.name == 'First_Name') {
                        inputsInvalid.fname = e.name
                    } else if (e.name == 'Apellido_Paterno') {
                        inputsInvalid.lname = e.name
                    } else if (e.name == 'Email') {
                        inputsInvalid.email = e.name
                    }
                }
            }
        })

        if(nombre2.value !== '' && apellido2.value !== ''){
            if(correo2.value !== ''){
                campana.classList.remove('invalid')
                cont +=1;
            }else{
                inputsInvalid.correo2 = correo2.name
            }        
        }

        if (vendedor.value !== '') {
            vendedor.classList.remove('invalid')
            cont += 1
        } else {
            inputsInvalid.vendedor = vendedor.name
        }

        if (mobile.value !== '') {
            mobile.classList.remove('invalid')
            cont += 1
        } else {
            inputsInvalid.Mobile = mobile.name
        }

        if (loggedUser.dataset.profile === 'Vendedor') {
            contPass = 5
        }

        if(fuentePosible.value !== ''){
            fuentePosible.classList.remove('invalid')
            cont += 1
        }else{
            inputsInvalid.fuentePosible = fuentePosible.name
        }
        console.log('cont: ', cont, 'contPass: ', contPass)
        if (cont == contPass) {
            return true
        } else {
            //pintar alertas
            this.inputsInvalid(inputsInvalid)
            return false
        }
    },

    inputsInvalid(inputsInvalid) {
        let inputCheck = Object.values(inputsInvalid)

        inputCheck.forEach((input) => {
            //console.log(input)
            let inp = document.querySelector(`[name=${input}]`)
            inp.classList.add('invalid')
        })
    },

    validateRecursos() {
        let inputsRecursos = Array.from(
            document.querySelectorAll('[data-aporta-recursos]')
        )
        //console.log(inputsRecursos)
        let nombre_completo = document.getElementById('nombre_completo')
        let dueno_controlador = document.getElementById('dueno_controlador')

        inputsRecursos.forEach((e) => {
            e.addEventListener('change', (e) => {
                //console.log(e.target)
                let temp = document.querySelector(
                    `[data-copy=${e.target.name}]`
                )

                if (
                    e.target.name == 'First_Name' ||
                    e.target.name == 'Apellido_Paterno' ||
                    e.target.name == 'Apellido_Materno'
                ) {
                    let nn

                    if (
                        inputsRecursos[1].value == '' &&
                        inputsRecursos[2].value == ''
                    ) {
                        nn = inputsRecursos[0].value
                    } else if (inputsRecursos[2].value == '') {
                        nn =
                            inputsRecursos[0].value +
                            ' ' +
                            inputsRecursos[1].value
                    } else if (inputsRecursos[1].value == '') {
                        nn =
                            inputsRecursos[0].value +
                            ' ' +
                            inputsRecursos[2].value
                    } else {
                        nn =
                            inputsRecursos[0].value +
                            ' ' +
                            inputsRecursos[1].value +
                            ' ' +
                            inputsRecursos[2].value
                    }

                    nombre_completo.value = nn
                    dueno_controlador.value = nn
                    //console.log('nombre: ',nn)
                } else {
                    temp.value = e.target.value
                }
                //console.log('temp: ',temp)
                //console.log('e: ', e.target.value)
            })
        })

        //console.log('validateRecursos ......')
    },

    validDataLists() {
        const dataLists = Array.from(
            document.querySelectorAll('[data-datalist="true"]')
        )
        let validArray = true
        dataLists.forEach((dl) => {
            let value = dl.previousElementSibling.value
            let list = Array.from(dl.children)
            let valid = list.find((element) => element.value == value)
            console.log('valid: ', valid)
            if (valid == undefined) validArray = false
        })
        return validArray
    },

    validateApartado(inputApartado) {
        //conservar calor minimo de apartado
        let minimoApartado = parseFloat(inputApartado.dataset.minvalue)
        let mensualidad = document.querySelector('[name="Pago_Mensual_P"]')
        let enganche = document.querySelector('[name="Enganche_P"]')
        let politica = document.getElementById('campaignValue').dataset.politica

        if (politica === 'Primer Mensualidad') {
            if (parseFloat(inputApartado.value) > mensualidad.value) {
                alerts.showAlert(
                    'warning',
                    'El monto de apartado no puede ser mayor a la mensualidad.'
                )
                inputApartado.value = minimoApartado
            } else if (parseFloat(inputApartado.value) < minimoApartado) {
                alerts.showAlert(
                    'warning',
                    'El monto de apartado no puede ser menor a la mensualidad minima requerida.'
                )
                inputApartado.value = minimoApartado
            }
        } else if (politica === 'Enganche') {
            if (parseFloat(inputApartado.value) > enganche.value) {
                alerts.showAlert(
                    'warning',
                    'El monto de apartado no puede ser mayor al enganche.'
                )
                inputApartado.value = minimoApartado
            } else if (parseFloat(inputApartado.value) < minimoApartado) {
                alerts.showAlert(
                    'warning',
                    'El monto de apartado no puede ser menor al enganche minimo requerido.'
                )
                inputApartado.value = minimoApartado
            }
        }
    },

    validateMobile(inputMobile){
        if(inputMobile.value.length>10){
            alerts.showAlert(
                'warning',
                'No se permiten mas de 10 digitos.'
            )
            let digits = inputMobile.value
            let subStr =  digits.substring(0, digits.length - 1);
            inputMobile.value = subStr
        }
    },
}

export default validate
