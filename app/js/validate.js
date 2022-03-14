// email validate

const btn_submit = document.getElementById('btn-submit')

const validate = {
  validateEmail(email, reqired) {
    let expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (reqired == 'required') {
      if (!expr.test(email)) {
        alert('Error: La dirección de correo ' + email + ' es incorrecta.')
        btn_submit.disabled = true
      } else {
        btn_submit.disabled = false
      }
    } else {
      if (!expr.test(email) && email != '') {
        alert('Error: La dirección de correo ' + email + ' es incorrecta.')
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

    if (cont == 3) {
      return true
    } else {
      return false
    }

    //console.log('validate form.....')
  },
}

export default validate
