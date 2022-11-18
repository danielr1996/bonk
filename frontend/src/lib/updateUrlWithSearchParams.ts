export const updateUrlWithSearchParams=(fn: (searchParams: URLSearchParams)=>URLSearchParams): void=>{
    const url = new URL(window.location.href)
    const searchParams = url.searchParams
    url.search = fn(searchParams).toString()
    history.replaceState({},'',url.href)
}
