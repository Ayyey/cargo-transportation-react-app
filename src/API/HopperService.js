import Service from "./Service"
const hopperURL = Service.root + 'hopper/calculateOrderLists'
export default {
  async optimization(addresses, drivers) {
    const driversBody = []
    for (let i = 0; i < drivers.length; i++) {
      driversBody.push({
        'id': i,
        'name': drivers[i].name + ' ' + drivers[i].patronymic + ' ' + drivers[i].surname,
        'truck': drivers[i].vehicle
      })
    }

    const ordersBody = []
    for (let i = 0; i < addresses.length; i++) {
      ordersBody.push({
        'id': i,
        'address': addresses[i].name,
        'latitude': addresses[i].lat,
        'longitude': addresses[i].lon,
        'cargoWeight': 0,
      })
    }
    const body = { 'rawOrders': ordersBody, 'drivers': driversBody }
    return await Service.sendJson(hopperURL, body).catch((err)=>{console.log({err})})
  }
}