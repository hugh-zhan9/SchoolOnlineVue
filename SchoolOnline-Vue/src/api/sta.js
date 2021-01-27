import request from '@/utils/request'


export default{
    createDaily(date){
        return request({
            url:`edu/statistics/createDaily/${date}`,
            method:'post'
        })
    },
    getDaily(type,begin,end){
        return request({
            url:`edu/statistics/showData/${type}/${begin}/${end}`,
            method:'get'
        })
    },

}