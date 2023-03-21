import { networkInterfaces } from 'os' // Used to display (log) network addresses on local machine

class OsService {
    getThisMachineIpAddresses(): string[] {
        const interfaces = networkInterfaces()
        const ipAddresses: string[] = []
        for (const deviceName in interfaces) {
            const addresses = interfaces[deviceName]
            if (!addresses) {
                continue
            }
            for (let i = 0; i < addresses.length; i++) {
                const addressInfo = addresses[i]
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
