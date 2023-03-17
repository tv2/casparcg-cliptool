import os from 'os' // Used to display (log) network addresses on local machine

class OsService {
    getThisMachineIpAddresses(): string[] {
        let interfaces = os.networkInterfaces()
        let ipAddresses: string[] = []
        for (let deviceName in interfaces) {
            let addresses = interfaces[deviceName]
            for (let i = 0; i < addresses.length; i++) {
                let addressInfo = addresses[i]
                if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                    ipAddresses.push(addressInfo.address)
                }
            }
        }
        return ipAddresses
    }
}

const osService = new OsService()
export default osService
