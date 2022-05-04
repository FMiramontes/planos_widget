'use strict'

import { crm, creator, books } from './Zoho.js'
import UI from './UI.js'

const maps = {
    position(num) {
        // return Math.ceil(parseInt(num) / 10) - 1
        return Math.floor(parseInt(num) / 10)
    },
    loadBlocks(desarrollo, manzana, position, beforeManzana) {
        const containerManzanas = document.getElementById('maps')

        if (beforeManzana !== '') {
            let num = beforeManzana.replace(/\D+/g, '')

            // let num = numManzana

            // console.log('num: ', num)

            let beforePosition = this.position(num)

            // console.log('beforePosition: ', beforePosition)

            let block = desarrollo.blocks[beforePosition]
            // console.log('manzana: ', manzana)
            // console.log('beforeManzana: ', beforeManzana)

            let beforeManzanaJson = block.find((m) => m.Numero == beforeManzana)
            // console.log('beforeManzanaJson: ', beforeManzanaJson)

            if (beforeManzanaJson !== undefined) {
                let ContainerBeforeManzana = document.getElementById(
                    beforeManzanaJson?.Numero
                )
                ContainerBeforeManzana.innerHTML = UI.parseOuterHTML(
                    beforeManzanaJson?.path
                )
            }
        }
        this.loadLotes(desarrollo, manzana, position)
    },
    loadLotes(desarrollo, manzana, position) {
        let ContainerManzana = document.getElementById(manzana)

        // ContainerManzana.innerHTML = ''

        let block = desarrollo.blocks[position]

        let manzanaJson = block.find((m) => m.Numero == manzana)

        console.log('Maps manzanaJson: ', manzanaJson)

        manzanaJson?.Lotes.forEach((l) => {
            // console.log('Lotes: ', l)
            ContainerManzana.insertAdjacentHTML(
                'afterbegin',
                UI.parseOuterHTML(l)
            )
        })
    },

    async loadManzana(manzana, id, desarrollo, beforeManzana) {
        // const svg = await desarrollo.json()

        // console.log('desarrollo: ', desarrollo)

        let num = manzana.replace(/\D+/g, '')

        // let num = numManzana.split('')

        let position = this.position(num)

        console.log('Maps position: ', position)

        this.loadBlocks(desarrollo, manzana, position, beforeManzana)

        // console.log('blocks: ', blocks)

        // const Lotes = await this.loadLotes(manzana, desarrollo, position)
        // console.log('Lotes: ', Lotes)
        // const frac = await crm.onamiento(id)

        // const fracc = frac.data

        // console.log('frac: ', fracc)

        // this.bloquearManzana(fracc)

        // const target = document.querySelector('[id*="Manzana"]');
        // target.style.transform = 'scale(' + zoom + ')'   
    },
    async bloquearManzana(fracc) {
        const Manzanas = document.querySelectorAll('[data-manzana]')

        Manzanas.forEach(async (m) => {
            let Manzana = m.dataset.manzana.replace('M', '')
            const seccion = fracc.Secciones.find(
                (e) => Manzana >= e.init && Manzana <= e.end
            )
            if (seccion === undefined) this.bloquear(m)
        })
    },
    bloquear(e) {
        delete e.dataset.manzana
        delete e.classList
        e.classList.add('disabled')
    },

    // Disponibilidad
    async getDisponiblidad(fraccionamiento, manzana) {
        // preloader.style.display = 'flex'
        // containerMapa.style.display = 'none'
        let Tooltip = document.getElementById('info-lote')
        try {
            //   const request = await fetch(`/server/ecommerce/crm/getDisponibilidad/${fraccionamiento}/${manzana}`)
            const data = await crm.fetchDisponibilidad(fraccionamiento, manzana)
            // console.log('peticion disponibilidad', data)

            if (data.type == 'warning' || data.type == 'success')
                this.pintarDisponibles()

            if (data.ok) {
                // console.log('Disponibilidad:', data.data)

                if (data.data.length > 0)
                    this.poblarLotificacion(await data.data)
            }
        } catch (error) {
            console.log(error)
        }
        this.hidePopup(Tooltip)
    },
    pintarDisponibles() {
        const tempLotes = document.querySelectorAll('.cls-2')
        const lostes2 = Array.from(tempLotes)

        lostes2.forEach((lote) => {
            try {
                if (lote.id.includes('L')) {
                    lote.style.fill = '#f8c15b'
                    lote.style.stroke = '#000'
                    lote.setAttribute('stroke-width', '1')
                    lote.dataset.lote = ''
                    lote.dataset.crm = false
                    lote.classList = 'login'
                    lote.dataset.disponible = true
                }
            } catch (err) {
                console.log(err)
            }
        })
        // preloader.style.display = 'none'
        // containerMapa.style.display = 'flex'
    },
    poblarLotificacion(disponibilidad) {
        disponibilidad.forEach((product) => {
            try {
                let lote = ''
                if (product.Lote_Letra == null) {
                    lote = document.getElementById(
                        `M${product.Manzana}-L${product.Lote}`
                    )
                } else {
                    lote = document.getElementById(
                        `M${product.Manzana}-L${
                            product.Lote + product.Lote_Letra
                        }`
                    )
                }

                if (lote !== null) {
                    lote.dataset.crm_id = product.id
                    lote.dataset.sku = product.Manzana_y_Lote
                    lote.dataset.trato = product.Product_Name
                    lote.dataset.crm = true
                    lote.dataset.costototal = product.Unit_Price
                    lote.dataset.dimension = product.Dimension_del_Terreno_M21
                    lote.dataset.costom2 = product.Costo_por_M2
                    lote.dataset.fracc_name = product.Fraccionamiento.name
                    lote.dataset.fracc_id = product.Fraccionamiento.id
                    lote.dataset.estado = product.Estado
                    lote.dataset.esquina = product.Es_esquina

                    lote.style.fill = this.statusColor(product.Estado)
                    lote.style.stroke = '#000'

                    if (product.Estado != 'Disponible') {
                        lote.removeAttribute('onclick')
                        lote.dataset.disponible = false
                    } else if (product.Estado == 'Disponible') {
                        lote.dataset.disponible = true
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
    },
    showPopup(e, x, y) {
        e.style.left = x + 'px'
        e.style.top = y + 'px'
        e.style.display = 'block'
    },
    hidePopup(e) {
        e.style.display = 'none'
    },
    statusColor(status) {
        const colors = [
            { status: 'Disponible', fill: '#de9f27' },
            { status: 'Apartado', fill: '#b5512a' },
            { status: 'Primer Mensualidad', fill: '#7de38e' },
            { status: 'Enganche', fill: '#398afa' },
            { status: 'Contado', fill: '#6908c9' },
            { status: 'Vendido', fill: '#5C5C5C' },
            { status: 'Bloqueado', fill: '#ff2e2e' },
            { status: 'Reubicacion', fill: '#59f4ff' },
            { status: 'P. Reubicacion', fill: '#7d7d82' },
            { status: 'No Existe', fill: '#dbdbdb' },
        ]

        const findClass = colors.find((clr) => clr.status === status)
        return findClass.fill
    },
}

export default maps
