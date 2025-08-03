export class DateAxis {
    private readonly MS_PER_DAY = 1000 * 60 * 60 * 24
    constructor(private readonly start: Date) {
        this.start.setHours(24, 0, 0, 0)
    }
    dateToX(date: Date): number {

        const normalized = new Date(date)
        normalized.setHours(24, 0, 0, 0)
        return Math.floor((normalized.getTime() - this.start.getTime()) / this.MS_PER_DAY)
    }
    xToDate(x: number): Date {
        return new Date(this.start.getTime() + x * this.MS_PER_DAY)
    }
    generateDateRange(end: Date, grap: number = 1): { x: number, date: Date }[] {
        const days = this.dateToX(end);
        const result = []
        for (let i = 0; i <= days; i += grap) {
            result.push({ x: i, date: this.xToDate(i) })
        }
        return result
    }
}