import { Milk } from "@core/nutrition_care";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { MilkPersistenceDto } from "../mappers";

export class MilkInfraMapper implements InfrastructureMapper<Milk, MilkPersistenceDto> {
   toPersistence(entity: Milk): MilkPersistenceDto {
      return {
         id: entity.id as string,
         name: entity.getName(),
         type: entity.getType(),
         condition: entity.getCondition(),
         doseFormula: entity.getDoseFormula(),
         recommendationPerRanges: entity.getRanges(),
         recommendedMilkPerDay: entity.getRecommendedMilkPerDay(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: MilkPersistenceDto): Milk {
      const milkRes = Milk.create(record, record.id);
      if (milkRes.isFailure) throw new InfraMapToDomainError(formatError(milkRes, MilkInfraMapper.name));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, updatedAt, createdAt, ...props } = milkRes.val.getProps();
      return new Milk({ id, props, updatedAt: record.updatedAt, createdAt: record.createdAt });
   }
}
