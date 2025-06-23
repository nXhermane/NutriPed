import Fuse, { Expression, FuseIndex, FuseSearchOptions, IFuseOptions } from "fuse.js"
import { useMemo } from "react"

export type SearchParams<T> = {
    list: T[],
    options?: IFuseOptions<T>
    index?: FuseIndex<T>
    searchParams?: {
        pattern: string | Expression,
        searchOptions?: FuseSearchOptions
    },
    filterResultCallback?: (list: T[]) => T[]
}
export function useFuseSearch<T extends object>({ list, options, index, searchParams, filterResultCallback }: SearchParams<T>) {

    const fuse = useMemo(() => {
        return new Fuse(list, options, index)
    }, [list, options, index])

    const results = useMemo(() => {
        if (!searchParams) return filterResultCallback ? filterResultCallback(list) : list
        const fuseResult = fuse.search(searchParams?.pattern, searchParams?.searchOptions)
        const res = fuseResult.map(r => r.item)
        if (filterResultCallback) return filterResultCallback(res)
        return res
    }, [searchParams,filterResultCallback,list])
    return results
}