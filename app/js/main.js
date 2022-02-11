import UI from './UI.js'

const searchBtn = document.querySelector('#search-contact')

ZOHO.embeddedApp.on('PageLoad', async function (data) {
    ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
        const user = document.getElementById('user')

        const img_user = document.createElement('img')
        img_user.setAttribute('src', data.users[0].image_link)
        user.lastElementChild.innerText = data.users[0].full_name
        user.firstElementChild.appendChild(img_user)
    })
})

ZOHO.embeddedApp.init().then(function () {
    UI.loadMenuLateral()
})

searchBtn.addEventListener('click', () => {
    UI.searchContact()
})

document.addEventListener('click', (e) => {
    if (e.target.matches('[data-record]')) {
        UI.selectContact(e.target.dataset)
    }
})

// UI.viewModal(true, '0')

const containerModal = document.getElementById('container-modal')
containerModal.addEventListener('click', (e) => {
    if (e.target.id == 'container-modal') {
        UI.viewModal(false)
    }
})
