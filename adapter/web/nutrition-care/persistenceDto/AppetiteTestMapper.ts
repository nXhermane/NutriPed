import { AppetiteTestRef } from "@core/nutrition_care";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { AppetiteTestReferencePersistenceDto } from "../mappers";

export class AppetiteTestInfraMapper implements InfrastructureMapper<AppetiteTestRef, AppetiteTestReferencePersistenceDto> {
   toPersistence(entity: AppetiteTestRef): AppetiteTestReferencePersistenceDto {
      return {
         id: entity.id as string,
         code: entity.getCode(),
         name: entity.getName(),
         appetiteTestTable: entity.getAppetiteTestTable(),
         productType: entity.getProductType(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: AppetiteTestReferencePersistenceDto): AppetiteTestRef {
      const appetiteTestRes = AppetiteTestRef.create({ ...record, otherData: { fields: [] } }, record.id);
      if (appetiteTestRes.isFailure) throw new InfraMapToDomainError(formatError(appetiteTestRes, AppetiteTestInfraMapper.name));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, id, ...props } = appetiteTestRes.val.getProps();
      return new AppetiteTestRef({ id, props, createdAt: record.createdAt, updatedAt: record.updatedAt });
   }
}
