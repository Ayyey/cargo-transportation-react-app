import Service from "./Service";

export default {
    async login(login, password){
        return await Service.sendJson(Service.root + 'login', {
            login,password
        })
    }
}