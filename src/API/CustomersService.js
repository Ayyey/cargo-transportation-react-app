import Service from './Service'

export default {
  async fetchCustomers() {
    return await Service.fetchJson(Service.root + 'customers', localStorage.getItem('token'))
  },

  async addCustomer(name, phoneNumber) {
    return await Service.sendJson(Service.root + 'customers', {
      name, phoneNumber
    }, 'POST', localStorage.getItem('token'))
  },

  async changeCustomer(id, name, phoneNumber) {
    return await Service.sendJson(Service.root + 'customers/update', {
      id, name, phoneNumber
    }, 'POST', localStorage.getItem('token'))
  },

  async deleteCustomer(id) {
    return await Service.sendJson(Service.root + 'customers', {
      id
    }, 'DELETE', localStorage.getItem('token'))
  }
}