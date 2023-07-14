import { networkInterfaces } from 'os' // Used to display (log) network addresses on local machine

export class OsService {
    getIpAddresses(): string[] {
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
