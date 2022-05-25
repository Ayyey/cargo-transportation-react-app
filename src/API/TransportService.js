import Service from './Service'
import config from '../Config/config'

export default {
    async fetchTransports() {
        return await Service.fetchJson(Service.root + 'vehicles', localStorage.getItem('token'))
    },

    async fetchFreeTransports() {
        return await Service.fetchJson(Service.root + 'vehicles?free=true', localStorage.getItem('token'))
    },

    async addTransports(name) {
        const startAddress = { id: config.startAdressId }
        return await Service.sendJson(Service.root + 'vehicles', {
            startAddress, name
        }, 'POST', localStorage.getItem('token'))
    },

    async changeTransports(id, name) {
        const startAddress = { id: config.startAdressId }
        return await Service.sendJson(Service.root + 'vehicles/update', {
            id, name, startAddress
        }, 'POST', localStorage.getItem('token'))
    },

    async deleteTransports(id) {
        return await Service.sendJson(Service.root + 'vehicles', {
            id
        }, 'DELETE', localStorage.getItem('token'))
    }
}