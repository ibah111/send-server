import { Dict } from '@contact/models';

export interface GetAllResponse {
  debt_reject_statuses: number[];
  dict_for_debt: Dict[];
  law_act_reject_statuses: string[];
  dict_for_law_act: Dict[];
}
