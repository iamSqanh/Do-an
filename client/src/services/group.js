import axiosConfig from '../axiosConfig'

export const apiCreateOrOpenChat = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/group/create',
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})


export const apiGetGroupInfo = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/group/getGroup',
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetListChat = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/group/chatList',
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetGroupList = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/group/groupList/${payload}`,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetUserGroup = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/group/userGroup/${payload}`,
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})


