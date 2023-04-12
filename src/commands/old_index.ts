import { TableType } from "../@types/tables";
import {
  RelationalOperator,
  ConditionData,
  Priority,
  TypeJoin,
  Exec,
} from "../types";

import {
  formatConditionBase,
  formatConditionWithPriority,
  prepareColumns,
  prepareColumnsWithValues,
  prepareValues
} from "../utils";

class Table<TableSchema> {
  private database;
  private _name;
  private query: string = '';

  constructor( name: string, database: string ) {
    this._name = name;
    this.database = database;
  };

  public get name() {
    return this._name;
  };

  insert( data: TableSchema ) {
    const columns = prepareColumns<TableSchema>( data );
    const values = prepareValues<TableSchema>( data );

    this.query = `INSERT INTO ${ this.database }.${ this._name } (${ columns }) VALUES (${ values })`;

    return {
      exec: () => this.query,
    };
  };

  update( data: Partial<TableSchema>) {
    const values = prepareColumnsWithValues<TableSchema>( data );

    this.query = `UPDATE ${ this.database }.${ this._name } SET ${ values }`;

    return {
      where: this.prepareWhere(),
    };
  };

  delete() {
    this.query = `DELETE FROM ${ this.database }.${ this._name }`;

    return {
      where: this.prepareWhere(),
    };
  };

  select( ...columns: Array<keyof TableSchema>) {
    this.query = `SELECT ${ columns.length> 0 ? columns.join(', ') : '*'} FROM  ${ this.database }.${ this._name }`;

    return {
      exec: () => this.query,
      join: this.prepareJoin(),
      where: this.prepareWhere(),
    };
  };

  private prepareJoin() {
    interface Join {
      type: TypeJoin;
      table: TableType;
      on: {
        leftColumn: keyof TableSchema;
        rightColumn: string;
      };
    };

    return ({
      type,
      table,
      on: {
        leftColumn,
        rightColumn,
      }
    }: Join ) => {
      this.query = this.query.concat(` ${ type } JOIN ${ table } ON ${ this.database }.${ this._name }.${ leftColumn as string } = ${ this.database }.${ table }.${ rightColumn }`);

      return {
        exec: () => this.query,
        where: this.prepareWhere(),
      };
    };
  };

  getColumnNameForJoin( column: keyof TableSchema ) {
    return column as string;
  };

  private prepareWhere() {
    interface Condition {
      column: keyof TableSchema;
      operator: RelationalOperator;
      data: ConditionData;
    };

    return ({ column, operator, data }: Condition ) => {
      const conditionBase = formatConditionBase({
        column,
        operator,
        data,
      });

      this.query = this.query.concat(` WHERE ${ conditionBase }`);

      return {
        exec: () => this.query,
        and: this.prepareAnd(),
        or: this.prepareOr(),
      };
    };
  };

  private prepareOr() {
    interface Condition {
      column: keyof TableSchema;
      operator: RelationalOperator;
      data: ConditionData;
      priority?: Priority;
    };

    return ({ column, operator, data, priority }: Condition ) => {
      const conditionBase = formatConditionBase({
        column,
        operator,
        data,
      });

      this.query = formatConditionWithPriority({
        query: this.query,
        conditionBase,
        priority,
        logicalOperator: 'OR',
      });

      return {
        exec: () => this.query,
        and: this.prepareAnd(),
        or: this.prepareOr(),
      };
    };
  };

  private prepareAnd() {
    interface Condition {
      column: keyof TableSchema;
      operator: RelationalOperator;
      data: ConditionData;
      priority?: Priority;
    };

    return ({ column, operator, data, priority }: Condition ) => {
      const conditionBase = formatConditionBase({
        column,
        operator,
        data,
      });

      this.query = formatConditionWithPriority({
        query: this.query,
        conditionBase,
        priority,
        logicalOperator: 'AND',
      });

      return {
        exec: () => this.query,
        and: this.prepareAnd(),
        or: this.prepareOr(),
      };
    };
  };
};

export default Table;
