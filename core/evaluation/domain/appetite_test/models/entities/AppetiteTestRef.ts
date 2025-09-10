import {
  AggregateID,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
} from "@shared";
import { APPETITE_TEST_PRODUCT_TYPE } from "../constants";
import {
  AppetiteTestTableRange,
  IAppetiteTestTableRange,
} from "../valueObjects";
import { APPETITE_TEST_ERRORS } from "../../errors";
import { DATA_FIELD_CODE_TYPE } from "@/core/constants";

export interface IAppetiteTestRef extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  productType: APPETITE_TEST_PRODUCT_TYPE[];
  appetiteTestTable: AppetiteTestTableRange[];
  neededDataFields: { code: DATA_FIELD_CODE_TYPE; require: boolean }[];
}
// NOTE: on doit tenir compte de l'unité et de la taille du cupule pour chaque produit. Si tu ne te rappels pas exactement de ce que sert, va lire la note au dessous du table du test d'appetit presente dans le protocole .

export interface CreateAppetiteTestRefProps {
  name: string;
  code: string;
  productType: APPETITE_TEST_PRODUCT_TYPE[];
  appetiteTestTable: IAppetiteTestTableRange[];
  neededDataFields: { code: DATA_FIELD_CODE_TYPE; require: boolean }[];
}

export class AppetiteTestRef extends Entity<IAppetiteTestRef> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getProductType(): APPETITE_TEST_PRODUCT_TYPE[] {
    return this.props.productType;
  }
  getAppetiteTestTable(): IAppetiteTestTableRange[] {
    return this.props.appetiteTestTable.map(range => range.unpack());
  }
  getNeededFields() {
    return this.props.neededDataFields;
  }
  changeName(name: string) {
    this.props.name = name;
    this.validate();
  }
  changeProductType(productType: APPETITE_TEST_PRODUCT_TYPE[]) {
    this.props.productType = productType;
    this.validate();
  }
  changeAppetiteTable(appetiteTable: AppetiteTestTableRange[]) {
    this.props.appetiteTestTable = appetiteTable;
    this.validate();
  }
  // BETA: Implementer le reste later
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError(
        APPETITE_TEST_ERRORS.ENTITY.VALIDATION.NAME_EMPTY.message
      );
    }
    this._isValid = true;
  }

  static create(
    createProps: CreateAppetiteTestRefProps,
    id: AggregateID
  ): Result<AppetiteTestRef> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const appetiteTestTableRes = createProps.appetiteTestTable.map(
        AppetiteTestTableRange.create
      );
      const combinedRes = Result.combine([codeRes, ...appetiteTestTableRes]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, AppetiteTestRef.name));
      const appetiteTestRef = new AppetiteTestRef({
        id,
        props: {
          name: createProps.name,
          code: codeRes.val,
          productType: createProps.productType,
          appetiteTestTable: appetiteTestTableRes.map(res => res.val),
          neededDataFields: createProps.neededDataFields,
        },
      });
      return Result.ok(appetiteTestRef);
    } catch (e) {
      return handleError(e);
    }
  }
}
