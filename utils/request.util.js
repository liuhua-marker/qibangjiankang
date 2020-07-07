import { promisify } from './promise.util'
import wafer from '../vendor/wafer-client-sdk/index'

const wfRequest = promisify(wafer.request)

const normalizeError = e => {
const err = e || {}

let code = 'unknown_error'

if (typeof err.code === 'number' || typeof err.code === 'string') {
code = err.code
} else if (err instanceof wafer.LoginError) {
code = 'login_error'
} else if (err instanceof wafer.RequestError) {
code = 'request_error'
}

const desc = err.errMsg || err.desc || err.message || ""

return { code, desc }
}

const exec = params => {
if (typeof params.login === 'undefined' || params.login === null) {
params.login = true
}
return new Promise((resolve, reject) => {
wfRequest(params).then(res => {
const data = res.data || {}

if (res.statusCode === 200) {
resolve(data)
} else {
reject(normalizeError(data))
}
}).catch(err => {
reject(normalizeError(err))
})
})
}

module.exports = { exec }