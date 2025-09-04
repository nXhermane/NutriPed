import { DomainDate } from "../../core/shared/domain/shared/valueObjects/Date";
import { Result } from "../../core/shared/core/Result";
import { SystemCode, UnitCode } from "@shared";
import {
  AnthropometricData,
  CreateAnthropometricData,
} from "../../core/evaluation/domain/anthropometry/models/valueObjects/AnthropometricData";

/**
 * Builders pour les tests unitaires
 * Ces builders permettent de créer facilement des objets de test
 */

export class DateBuilder {
  private date: string = "2023-01-01";

  withDate(date: string): DateBuilder {
    this.date = date;
    return this;
  }

  build(): DomainDate {
    return DomainDate.create(this.date).val;
  }

  buildResult(): Result<DomainDate> {
    return DomainDate.create(this.date);
  }
}

export class SystemCodeBuilder {
  private code: string = "TEST_CODE";

  withCode(code: string): SystemCodeBuilder {
    this.code = code;
    return this;
  }

  build(): SystemCode {
    return SystemCode.create(this.code).val;
  }

  buildResult(): Result<SystemCode> {
    return SystemCode.create(this.code);
  }
}

export class UnitCodeBuilder {
  private code: string = "kg";

  withCode(code: string): UnitCodeBuilder {
    this.code = code;
    return this;
  }

  build(): UnitCode {
    return UnitCode.create(this.code).val;
  }

  buildResult(): Result<UnitCode> {
    return UnitCode.create(this.code);
  }
}

export class AnthropometricDataBuilder {
  private measures: { code: string; value: number; unit: string }[] = [
    { code: "WEIGHT", value: 10, unit: "kg" },
    { code: "HEIGHT", value: 100, unit: "cm" },
  ];

  withMeasures(
    measures: { code: string; value: number; unit: string }[]
  ): AnthropometricDataBuilder {
    this.measures = measures;
    return this;
  }

  addMeasure(
    code: string,
    value: number,
    unit: string
  ): AnthropometricDataBuilder {
    this.measures.push({ code, value, unit });
    return this;
  }

  build(): AnthropometricData {
    const props: CreateAnthropometricData = {
      anthropometricMeasures: this.measures,
    };
    return AnthropometricData.create(props).val;
  }

  buildResult(): Result<AnthropometricData> {
    const props: CreateAnthropometricData = {
      anthropometricMeasures: this.measures,
    };
    return AnthropometricData.create(props);
  }
}
