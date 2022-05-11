// email validate

import alerts from './alertas.js'

const btn_submit = document.getElementById('btn-submit')

const validate = {
    validateEmail(email, reqired) {
        let expr =
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
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

        inputsToDisabled.forEach((e) => {
            if (e.value != '') {
                e.disabled = existeEnCRM
            } else {
                e.disabled = false
            }
        })
    },

    validateForm() {
        const loggedUser = document.querySelector('#user')

        let nombre2 = document.querySelector('[name="Nombre2"]')
        let apellido2 = document.querySelector('[name="ApellidoP2"]')

        const inputsInvalid = []

        const inputsCheckForm = [
            'First_Name',
            'Apellido_Paterno',
            'Email',
            'Campanya',
            'Lead_Source',
            'Modo_de_pago',
            'coordinador',
            'Departamento',
            'Sucursal_de_Firma',
        ]

        //Comprueba si es vendedor
        if (loggedUser.dataset.profile !== 'Vendedor') {
            inputsCheckForm.push('vendors')
        }

        //Comprueba segundo cliente
        if (nombre2.value !== '' && apellido2.value !== '') {
            //tiene segundo cliente
            inputsCheckForm.push('Correo2')
        }

        //Comprueba si estan llenos correctamente
        inputsCheckForm.forEach((e) => {
            let inputToCheck = document.querySelector(`[name=${e}]`)

            //Condicion especial dataset Campanya
            if (e !== 'Campanya') {
                if (inputToCheck.value !== '') {
                    inputToCheck.classList.remove('invalid')
                } else {
                    let inputNotValid = { name: `${e}` }
                    inputsInvalid.push(inputNotValid)
                }
            } else {
                if (inputToCheck.dataset.campaignid != undefined) {
                    inputToCheck.classList.remove('invalid')
                } else {
                    let inputNotValid = { name: `${e}` }
                    inputsInvalid.push(inputNotValid)
                }
            }
        })

        if (inputsInvalid.length === 0) {
            return true
        } else {
            //Pintar alertas
            this.inputsInvalid(inputsInvalid)
            return false
        }
    },

    validateDataLead() {
        const loggedUser = document.querySelector('#user')

        const inputsInvalid = []

        const inputsCheckForm = [
            'First_Name',
            'Apellido_Paterno',
            'Email',
            'Lead_Source',
            'Mobile',
            'vendors',
        ]

        inputsCheckForm.forEach((e) => {
            let inputToCheck = document.querySelector(`[name=${e}]`)

            if (inputToCheck.value !== '') {
                inputToCheck.classList.remove('invalid')
            } else {
                let inputNotValid = { name: `${e}` }
                inputsInvalid.push(inputNotValid)
            }
        })
        if (inputsInvalid.length === 0) {
            return true
        } else {
            //Pintar alertas
            this.inputsInvalid(inputsInvalid)
            return false
        }
    },

    inputsInvalid(inputsInvalid) {
        for (const inp in inputsInvalid) {
            let input = document.querySelector(
                `[name=${inputsInvalid[inp].name}]`
            )
            input.classList.add('invalid')
        }
    },

    validateRecursos() {
        let inputsRecursos = Array.from(
            document.querySelectorAll('[data-aporta-recursos]')
        )
        let nombre_completo = document.getElementById('nombre_completo')
        let dueno_controlador = document.getElementById('dueno_controlador')

        inputsRecursos.forEach((e) => {
            e.addEventListener('change', (e) => {
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
                } else {
                    temp.value = e.target.value
                }
            })
        })
    },

    validDataLists(modo) {
        const dataLists = Array.from(
            document.querySelectorAll('[data-datalist="true"]')
        )

        const loggedUser = document.querySelector('#user')

        if (modo === 'lead') {
            if (loggedUser.dataset.profile === 'Vendedor') {
                dataLists.splice(1, 5)
            } else {
                dataLists.splice(1, 1)
                dataLists.splice(2, 3)
            }
        } else if (modo === 'submit') {
            if (loggedUser.dataset.profile === 'Vendedor') {
                dataLists.splice(2, 1)
            }
        }

        let validArray = true
        dataLists.forEach((dl) => {
            
            let value = dl.previousElementSibling.previousElementSibling.value
            let list = Array.from(dl.children)
            let valid = list.find((element) => element.textContent == value)
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

    validateMobile(inputMobile) {
        if (inputMobile.value.length > 10) {
            alerts.showAlert('warning', 'No se permiten mas de 10 digitos.')
            let digits = inputMobile.value
            let subStr = digits.substring(0, digits.length - 1)
            inputMobile.value = subStr
        }
    },
}

export default validate
