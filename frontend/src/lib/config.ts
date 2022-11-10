export const getConfig = ()=>{
    //@ts-ignore
    return window._env_
}
export const getConfigValue =(key: string): string=>{
    //@ts-ignore
    return window._env_[`APP_${key}`]
}
