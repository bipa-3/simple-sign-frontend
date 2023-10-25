import { ValueType } from 'realgrid';

export const fields = [
  {
    fieldName: 'form_name',
    dataType: ValueType.TEXT,
  },
];

export const columns = [
  {
    name: '양식명',
    fieldName: 'form_name',
    width: '250',
    header: {
      text: '양식명',
    },
    sortable: false,
  },
];

export const rows = [
  {
    form_name: '휴가 신청서',
  },
  {
    form_name: '지각 사유서',
  },
  {
    form_name: '휴가 신청서',
  },
  {
    form_name: '지각 사유서',
  },
  {
    form_name: '휴가 신청서',
  },
  {
    form_name: '지각 사유서',
  },
];
