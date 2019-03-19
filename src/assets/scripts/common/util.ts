import jsonpLib from 'jsonp'


export function jsonp(url: string, cbName: string): Promise<{}> {
        const p = new Promise((resolve, reject) => {
            const opt: object = {
                name:cbName,
                timeout: 10000
            }
            jsonpLib(url, opt, (err, data) => {
                if(err) reject(err)
                resolve(data)
            })
        })
        return p
        
    }

