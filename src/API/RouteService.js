import Service from './Service'

export default {
  async addRoute(orderId, driverId, addressesId) {
    const driver = { id: driverId }
    const order = { id: orderId }
    const addresses = addressesId.map(id => {
      return { id }
    })

    return await Service.sendJson(Service.root + 'routes', {
      driver, order, addresses,
      finished: false
    }, 'POST', localStorage.getItem('token'))
  },

  async setRouteFinished(id) {
    return await Service.sendJson(Service.root + 'routes/update', {
      id, finished: true
    }, 'POST', localStorage.getItem('token'))
  }
}