export interface Order {
    id?: string,
    categoria?: string,
    comments?: string[],
    link?: string,
    quantity: number,
    service?: string,
    total?: number,
}
