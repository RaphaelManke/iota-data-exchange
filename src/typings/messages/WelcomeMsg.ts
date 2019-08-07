import DateTag from '../../DateTag';
import { IHashItem } from '../HashStore';

export interface IWelcomeMsg {
  hashList: IHashItem[];
}
export interface IRequestMsg {
  startDate: DateTag;
  endDate: DateTag;
  dataType: EDataTypes;
  pubKey: IPubKey;
  nextAddress: string;
}

export interface IPubKey {}
export enum EDataTypes {
  heartRate,
}