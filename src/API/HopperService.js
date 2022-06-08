import Service from "./Service"
const hopperURL = Service.root + 'hopper/routeAnnealing'
export default {
  async optimization(addresses, drivers) {
    const driversBody = []
    for (let i = 0; i < drivers.length; i++) {
      driversBody.push({
        'id': drivers[i].id,
        'name': drivers[i].name + ' ' + drivers[i].patronymic + ' ' + drivers[i].surname,
        'truck': {
          'id': drivers[i].vehicle.id,
          'maxWeight': 1000,
          'modelName': drivers[i].vehicle.name
        }
      })
    }

    const ordersBody = []
    for (let i = 0; i < addresses.length; i++) {
      ordersBody.push({
        'id': addresses[i].id,
        'address': addresses[i].name,
        'latitude': addresses[i].lat,
        'longitude': addresses[i].lon,
        'cargoWeight': 500,
      })
    }
    const body = { 'rawOrders': ordersBody, 'drivers': driversBody }
    return await Service.sendJson(hopperURL, body,
      'POST', localStorage.getItem('token'))
  }
}