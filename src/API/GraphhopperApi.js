import Service from './Service'

const apiToken = '339bf083-7254-441d-bd55-e7e8901aa3c4'
const root = `https://graphhopper.com/api/1//geocode?limit=6&type=json&key=${apiToken}&locale=ru-RU&q=`
const rootOpt = `https://graphhopper.com/api/1/vrp/optimize?key=${apiToken}`

export default {
  async searchAddress(address) {
    return await Service.fetchJson(root + address)
  },

  async optimization(addresses, vehicles) {
    const vehiclesBody = []
    for (let i = 0; i < vehicles.length; i++) {
      vehiclesBody.push({
        'vehicle_id': '' + vehicles[i].vehicle.id,
        'start_address': {
          'location_id': '_start_location',
          'lon': vehicles[i].vehicle.startAddress.lon,
          'lat': vehicles[i].vehicle.startAddress.lat
        },
        'type_id': '_vtype_1'
      })
    }

    const addressBody = []
    for (let i = 0; i < addresses.length; i++) {
      addressBody.push({
        'id': '_' + i,
        'type': 'pickup',
        'name': 'maintenance ' + i,
        'address': {
          'location_id': '' + addresses[i].id,
          'lon': addresses[i].lon,
          'lat': addresses[i].lat
        }
      })
    }

    const body = {
      'algorithm': {
        'problem_type': 'min-max'
      },
      'vehicles': vehiclesBody,
      'vehicle_types': [
        {
          'type_id': '_vtype_1',
          'profile': 'car'
        }
      ],
      'services': addressBody,
      'configuration': {
        'routing': {
          'calc_points': true
        }
      }
    }

    return await Service.sendJson(rootOpt, body)
  },

  async getSolution(jobId) {
    return await Service.fetchJson(`https://graphhopper.com/api/1/vrp/solution/${jobId}?key=${apiToken}`)
  }
}