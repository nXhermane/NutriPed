export interface CreatePropsDto<T> {
    data: Omit<T, "id" | "createdAt" | "updatedAt">;
 }
 