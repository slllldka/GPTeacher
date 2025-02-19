import axios from "axios";

export const account_api = axios.create({
    baseURL: 'http://localhost:8000'
})

export const problem_api = axios.create({
    baseURL: 'http://localhost:8001'
})

function getAccessToken(){
    return localStorage.getItem('access_token')
}

async function refreshAccessToken(){
    try{
        const response = await axios.post('http://localhost:8000/account/refresh', {refresh:localStorage.getItem('refresh_token')})
        if(response.status == 200){
            localStorage.setItem('access_token', response.data.access)
            return response.data.access
        }
        else{
            return null
        }
    }catch(error){
        if (error.response.status == 401){
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }
        console.log(error.response.data.error)
        console.log(error.message)

        return null
    }
}

account_api.interceptors.request.use(
    (config)=>{
        const access_token = getAccessToken()
        if (access_token){
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

account_api.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const original = error.config
        if (error.response.status == 401 && !original._retry){
            original._retry = true

            const new_access_token = await refreshAccessToken()
            if (new_access_token){
                original.headers.Authorization = `Bearer ${new_access_token}`
                return account_api(original)
            }
        }

        return Promise.reject(error);
    }
)

account_api.interceptors.request.use(
    (config)=>{
        const access_token = getAccessToken()
        if (access_token){
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

account_api.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const original = error.config
        if (error.response.status == 401 && !original._retry){
            original._retry = true

            const new_access_token = await refreshAccessToken()
            if (new_access_token){
                original.headers.Authorization = `Bearer ${new_access_token}`
                return account_api(original)
            }
        }
        
        return Promise.reject(error);
    }
)

problem_api.interceptors.request.use(
    (config)=>{
        const access_token = getAccessToken()
        if (access_token){
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

problem_api.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const original = error.config
        if (error.response.status == 401 && !original._retry){
            original._retry = true

            const new_access_token = await refreshAccessToken()
            if (new_access_token){
                original.headers.Authorization = `Bearer ${new_access_token}`
                return account_api(original)
            }
        }
        
        return Promise.reject(error);
    }
)