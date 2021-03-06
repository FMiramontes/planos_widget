// email validate

import alerts from './alertas.js'
import {crm} from './Zoho.js'

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
                let divIcon = e.nextSibling.nextElementSibling;
                if(divIcon.childElementCount < 2)
                {
                    divIcon.classList.add('icon-disabled', 'icon-block')
                    divIcon.dataset.blockIcon = 'true'
                    const iconBlock = document.createElement('i')
                    iconBlock.classList.add('fa-solid', 'fa-lock')
                    divIcon.appendChild(iconBlock)
                }
                
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

    removeInvalid(){
        let inputsInvalid = document.querySelectorAll('input[class="invalid"]')
        inputsInvalid.forEach((i) => {
            console.log(i)
            i.classList.remove('invalid')
        })
    },

    inputsInvalid(inputsInvalid) {
        for (const inp in inputsInvalid) {
            let input = document.querySelector(
                `[name=${inputsInvalid[inp].name}]`
            )
            input.classList.add('invalid')
        }
    },

    validateRecursos(input) {

        if (input.name == 'First_Name' || input.name == 'Apellido_Paterno' || input.name == 'Apellido_Materno') {
            //input[name="Cantidad_RA"]
            let nombre = document.querySelector('input[name="First_Name"')
            let apellidoP = document.querySelector('input[name="Apellido_Paterno"')
            let apellidoM = document.querySelector('input[name="Apellido_Materno"')

            let nombre_completo = document.getElementById('nombre_completo')
            let dueno_controlador = document.getElementById('dueno_controlador')
            let nn

            if(apellidoP.value == '' && apellidoP.value == ''){
                nn = nombre.textContent
            }else if(apellidoM.value == ''){
                nn = nombre.value + ' ' + apellidoP.value
            }else if(apellidoP.value == ''){
                nn = nombre.value + ' ' + apellidoM.value
            }else{
                nn = nombre.value + ' ' + apellidoP.value + ' ' + apellidoM.value
            }

            nombre_completo.value = nn
            dueno_controlador.value = nn
        }else{
            let inputCopy = document.querySelector(`[data-copy=${input.name}]`)
            inputCopy.value = input.value
        }
    },

    validDataLists(modo) {
        this.removeInvalid()
        const dataLists = Array.from(
            document.querySelectorAll('[data-datalist="true"]')
        )

        const loggedUser = document.querySelector('#user')

        if (modo === 'lead') {
            if (loggedUser.dataset.profile === 'Vendedor') {
                dataLists.splice(1, 7)
            } else {
                dataLists.splice(1, 1)
                dataLists.splice(2, 6)
            }
        } else if (modo === 'submit') {
            if (loggedUser.dataset.profile === 'Vendedor') {
                dataLists.splice(2, 1)
            }
        }

        let validArray = true




        // let value
        dataLists.forEach((dl) => {


            
            let value = dl.previousElementSibling.previousElementSibling.value
            let list = Array.from(dl.children)
            let valid = list.find((element) => element.textContent.match(value))
            if (valid == undefined){
                validArray = false 
                dl.previousElementSibling.previousElementSibling.className.add('invalid')
            } 

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

    async validProduct(){
        const modal = document.getElementById('modal')
        const ProductId = modal.dataset.crm_id

        const requestProduct = await crm.checkDisponible(ProductId)

        if(requestProduct.ok ){
            console.log("valid requestProduct: ", requestProduct)
            return requestProduct.data?.disponible
        }
        return false
    },

    validateCampaing(campaignData){

        console.log(campaignData)

        let aux = true
        //validar datos de campanya 

        if(campaignData.Tipo_de_Promocion == "Financiado"){
            if(campaignData.Tipo_de_Politica == "Primer Mensualidad"){ 
                if(aux)aux = campaignData.Primer_Mensualida != false ? true:false
            }else if(campaignData.Tipo_de_Politica == "Enganche"){
                if(campaignData.Tipo_de_Enganche == "Monto"){
                    if(aux)aux = campaignData.Monto_de_Enganche != null ? true:false
                }else if(campaignData.Tipo_de_Enganche == "Porcentaje"){
                    if(aux)aux = campaignData.Porcentaje_de_Enganche != null ? true:false
                }
                if(campaignData.Diferido){
                    if(aux)aux = campaignData.Plazos_Diferido > 0 ? true:false
                }
            }
        }

        if(campaignData.Tipo_de_Apartado == "Monto"){
            if(aux)aux = campaignData.Monto_de_Apartado != null ? true:false
        }else if(campaignData.Tipo_de_Apartado == "Porcentaje"){
            if(aux)aux = campaignData.Porcentaje_de_Apartado != null ? true:false
        }

        if(campaignData.Tipo_de_Descuento == "Monto"){
            if(aux)aux = campaignData.Monto_Descuento != null ? true:false
        }else if(campaignData.Tipo_de_Descuento == "Porcentaje"){
            if(aux)aux = campaignData.Porcentaje_Descuento	 != null ? true:false
        }
        
        return aux
    },
}

export default validate
