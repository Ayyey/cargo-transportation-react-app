import Service from "./Service"
export default {
  async fetchOrders() {
    return await Service.fetchJson(Service.root + 'orders', localStorage.getItem('token'))
  },

  async fetchOrdersById(id) {
    return await Service.fetchJson(Service.root + 'orders/' + id, localStorage.getItem('token'))
  },

  async addOrder(addresses, customerId) {
    const customer = { id: customerId }

    return await Service.sendJson(Service.root + 'orders', {
      customer, addresses
    }, 'POST', localStorage.getItem('token'))
  },

  async changeOrder(id, addresses, customerId) {
    const customer = { id: customerId }
    return await Service.sendJson(Service.root + 'orders/update', {
      id, customer, addresses
    }, 'POST', localStorage.getItem('token'))
  },

  async deleteOrder(id) {
    return await Service.sendJson(Service.root + 'orders', {
      id
    }, 'DELETE', localStorage.getItem('token'))
  }
}