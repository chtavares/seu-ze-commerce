import { IFindProductByName } from '../../product/etc/types';

export interface IReturnOrderData {
  id: string;
  products?: IFindProductByName[];
  total: number;
}
