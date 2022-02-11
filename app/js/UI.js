'use strict'

import crm from './Zoho.js'
import alerts from './alertas.js'
import Mapas from './mapas.js'
import maps from './mapas.js'

let desarrollo = new Array()

let beforeManzana = ''

const UI = {
    async loadMenuLateral() {
        const data = await crm.getAllFraccionamientos()

        if ((data.ok = true)) {
            const menu = document.getElementById('menu-lateral')
            data.data.forEach((i, index) => {
                // console.log(i.fraccionamientos.logo)
                let frac = document.createElement('div')
                frac.dataset.index = index
                frac.dataset.name = i.Name
                frac.dataset.id = i.id
                frac.classList = 'fracionamiento'
                frac.innerHTML = `
                                <div class="nombre-desarrollo">${i.Name}</div>
                                <div class="container-img"><img src="${i.logo}" alt=""></div>
                        `
                menu.appendChild(frac)
            })

            menu.addEventListener('click', async (e) => {
                if (e.target.matches('[data-index]')) {
                    let name = e.target.dataset.name.toLowerCase()

                    const nameSvg = name.replaceAll(' ', '-')

                    let tempDesartollo = await fetch(
                        `./desarrollos-js/${nameSvg}/${nameSvg}.json`
                    )

                    desarrollo = await tempDesartollo.json()

                    this.loadPlano(nameSvg, name, e.target.dataset.id)
                }
            })
        } else {
            if (data.type == 'warning')
                alerts.showAlert('warning', 'No hay fraccionamientos Activos.')
            if (data.type == 'danger')
                alerts.showAlert(
                    'danger',
                    'Error al cargar fraccionamientos, contactar con sistemas o recargar la página .'
                )
        }
    },
    async loadPlano(nameSvg, name, id) {
        this.getSVG(nameSvg)

        const mapa = document.getElementById('map')

        mapa.addEventListener('click', async (e) => {
            if (e.target.matches('[data-manzana]')) {
                console.log(e.target.tagName)
                let auxManzana = e.target.id.split('-')
                const manzana = auxManzana[0]
                const svgNombre = e.target.closest('svg').dataset.desarrollo

                await Mapas.loadManzana(
                    svgNombre,
                    manzana,
                    id,
                    desarrollo,
                    beforeManzana
                )
                await Mapas.getDisponiblidad(name, manzana)
                beforeManzana = manzana
            }
        })

        mapa.addEventListener('click', (e) => {
            if (e.target.matches('[data-lote]')) {
                if (e.target.dataset.disponible == 'true') {
                    console.log('disponible', e)
                    this.viewModal(true, e.target.id)
                    /*validarSesion()
                    if (sessionStorage.getItem("sesion"))
                        Login.mostrarInfoLote(loteSeleccionado)*/
                } else {
                    console.log('no disponible', e)
                    // MostrarAlerta()
                }
            }
        })
    },
    parseOuterHTML(text) {
        let tempText1 = text.normalize()
        let tempText2 = tempText1.replaceAll('&lt;', '<')
        let tempText3 = tempText2.replaceAll('&gt;', '>')
        return tempText3
    },
    async getSVG(nameSvg) {
        // console.log(desarrollo)

        const containerManzanas = document.getElementById('maps')

        desarrollo.blocks.forEach((block) => {
            block.forEach((manzana) => {
                if (manzana?.path)
                    // let path = `<g class="cls-1" id="${manzana.Numero}" data-conatiner="${manzana.Numero}" >${this.parseOuterHTML(manzana?.path)}</g>`
                    containerManzanas.insertAdjacentHTML(
                        'beforeend',
                        `<g class="cls-1" id="${
                            manzana.Numero
                        }" data-conatiner="${
                            manzana.Numero
                        }" >${this.parseOuterHTML(manzana?.path)}</g>`
                    )
            })
        })
    },
    viewModal(view, id) {
        let container_modal = document.getElementById('container-modal')
        let modal = document.getElementById('modal')

        if (view) {
            container_modal.style.display = 'flex'
            modal.dataset.item = id
        } else {
            container_modal.style.display = 'none'
            modal.dataset.item = ''
        }
    },
    async searchContact() {
        const searchValue = document.querySelector('#search-value').value
        console.log('searchValue', searchValue)
        const resultContainer = document.querySelector('#search-result')
        resultContainer.innerHTML = ''

        if (searchValue !== '' || searchValue !== undefined) {
            const searchRequest = await crm.searchContact(searchValue)

            // Check request status
            if (searchRequest.ok === true) {
                // Found records
                const records = searchRequest.data
                console.log('records: ', records)
                let df = new DocumentFragment()
                records.forEach((record) => {
                    var temp = document.createElement('template')
                    temp.innerHTML = `<div 
                    data-contact-id="${record.id}" 
                    data-record class="record">${record.Full_Name} 
                    <p data-record-email>${record.Email}</p>
                    </div>`

                    var frag = temp.content
                    df.appendChild(frag)
                })

                resultContainer.append(df)
            }
        }
    },
    selectContact(selectedOption) {
        console.log(selectedOption)
    },
}

export default UI
