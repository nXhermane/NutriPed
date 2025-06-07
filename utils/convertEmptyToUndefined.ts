import { Guard } from "@/core/shared";

export function emptyToUndefined(value: any): undefined | any {
    if (typeof value === 'object') {
        const emptyProps = Object.values(value).every(v => Guard.isEmpty(v).succeeded)
        if (emptyProps) {
            return undefined
        }
    }
    return Guard.isEmpty(value).succeeded ? undefined : value

} 