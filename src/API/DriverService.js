import Service from './Service'

export default {
    async fetchDrivers() {
        return await Service.fetchJson(Service.root + 'drivers', localStorage.getItem('token'))
    },

    async fetchDriverbyId(id) {
        return await Service.fetchJson(Service.root + 'drivers/' + id)
    },

    async fetchDriversRoutes(id) {
        return await Service.fetchJson(Service.root + 'drivers/' + id + '/routes', localStorage.getItem('token'))
    },

    async fetchDriversById(idArrays) {
        return await Service.fetchJson(Service.root + 'drivers/selected?ids=' + encodeURIComponent(idArrays),
            localStorage.getItem('token'))
    },

    async addDrivers(name, surname, patronymic, login, password, phoneNumber, vehicleId) {
        const vehicle = { id: vehicleId }
        return await Service.sendJson(Service.root + 'drivers', {
            name, surname, patronymic, login, password, phoneNumber, vehicle
        }, 'POST', localStorage.getItem('token'))
    },

    async changeDrivers(id, name, surname, patronymic, login, password, phoneNumber, vehicleId) {
        const vehicle = { id: vehicleId }
        return await Service.sendJson(Service.root + 'drivers/update', {
            id, name, surname, patronymic, login, password, phoneNumber, vehicle
        }, 'POST', localStorage.getItem('token'))
    },

    async deleteDrivers(id) {
        return await Service.sendJson(Service.root + 'drivers', {
            id
        }, 'DELETE', localStorage.getItem('token'))
    }
}