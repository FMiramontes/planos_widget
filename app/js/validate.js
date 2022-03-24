// email validate

import alerts from './alertas.js'

const btn_submit = document.getElementById('btn-submit')

const validate = {
  validateEmail(email, reqired) {
    let expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
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

    let campana = document.getElementById('campaignValue')

    let cont = 0
    inputsCheckForm.forEach((e) => {
      if (
        e.name == 'First_Name' ||
        e.name == 'Apellido_Paterno' ||
        e.name == 'Email'
      ) {
        if (e.value != '') {
          //console.log(e.name + ' encontrado')
          cont += 1
        }
      }
    })
    if (campana.dataset.campaignid != undefined) {
      cont += 1
    }
    console.log('validateform count', cont)
    if (cont == 4) {
      return true
    } else {
      return false
    }

    //console.log('validate form.....')
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
        let temp = document.querySelector(`[data-copy=${e.target.name}]`)

        if (
          e.target.name == 'First_Name' ||
          e.target.name == 'Apellido_Paterno' ||
          e.target.name == 'Apellido_Materno'
        ) {
          let nn

          if (inputsRecursos[1].value == '' && inputsRecursos[2].value == '') {
            nn = inputsRecursos[0].value
          } else if (inputsRecursos[2].value == '') {
            nn = inputsRecursos[0].value + ' ' + inputsRecursos[1].value
          } else if (inputsRecursos[1].value == '') {
            nn = inputsRecursos[0].value + ' ' + inputsRecursos[2].value
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
}

export default validate
