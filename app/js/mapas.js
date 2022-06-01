'use strict'

import { crm, creator, books } from './Zoho.js'
import { UI, util} from './UI.js'

const maps = {
    position(num) {
        // return Math.ceil(parseInt(num) / 10) - 1
        return Math.floor(parseInt(num) / 10)
    },
    loadBlocks(desarrollo, manzana, position, beforeManzana) {
        const containerManzanas = document.getElementById('maps')

        if (beforeManzana !== '') {
            let num = beforeManzana.replace(/\D+/g, '')

            let beforePosition = this.position(num)
            let block = desarrollo.blocks[beforePosition]
            let beforeManzanaJson = block.find((m) => m.Numero == beforeManzana)

            if (beforeManzanaJson !== undefined) {
                let ContainerBeforeManzana = document.getElementById(
                    beforeManzanaJson?.Numero
                )
                ContainerBeforeManzana.innerHTML = util.parseOuterHTML(
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

        manzanaJson?.Lotes.forEach((l) => {
            ContainerManzana.insertAdjacentHTML(
                'afterbegin',
                util.parseOuterHTML(l)
            )
        })
    },

    async loadManzana(manzana, id, desarrollo, beforeManzana) {
        // const svg = await desarrollo.json()
        let num = manzana.replace(/\D+/g, '')
        // let num = numManzana.split('')
        let position = this.position(num)

        this.loadBlocks(desarrollo, manzana, position, beforeManzana)
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

            if (data.type == 'warning' || data.type == 'success')
                this.pintarDisponibles()

            if (data.ok) {
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
        const tooltip = document.getElementById('info-lote')
        if (e.target.dataset.crm == 'true') {
            if (e.target.dataset.disponible == 'true') {
                tooltip.innerHTML = ''
                let lote = document.createElement('p')
                lote.textContent = e.target.dataset.trato
                tooltip.appendChild(lote)
                let dimension = document.createElement('p')
                dimension.textContent =
                    'Dimension: ' + e.target.dataset.dimension + ' m2'
                tooltip.appendChild(dimension)
                let costoMetro = document.createElement('p')
                costoMetro.textContent =
                    'Costo M2: $ ' + e.target.dataset.costom2
                tooltip.appendChild(costoMetro)
                let total = document.createElement('p')
                total.textContent =
                    'Costo total: $ ' + e.target.dataset.costototal
                tooltip.appendChild(total)
                // e.target.style.fill = '#e5b252'
                e.target.style.cursor = 'pointer'
            } else {
                tooltip.innerHTML = ''
                let lote = document.createElement('p')
                lote.textContent = e.target.dataset.trato
                tooltip.appendChild(lote)
                let estado = document.createElement('p')
                estado.textContent = e.target.dataset.estado
                tooltip.appendChild(estado)
                //e.target.style.fill = '#000'
            }
        } else {
            tooltip.innerHTML = ''
            let msg = document.createElement('p')
            msg.style.lineHeight = '1'
            msg.textContent =
                'Producto ' +
                e.target.id +
                ' no creado en CRM. \r\n Enviar petición'
            tooltip.appendChild(msg)
        }
        tooltip.style.left = x + 'px'
        tooltip.style.top = y + 'px'
        tooltip.style.display = 'block'
    },
    hidePopup() {
        const tooltip = document.getElementById('info-lote')
        tooltip.style.display = 'none'
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
