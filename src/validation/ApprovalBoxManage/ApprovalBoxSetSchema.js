import { object, string, number, array, mixed } from 'yup';

const docSearchSchema = object().shape({
  sortOrder: mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() === '')
        return null;
      return value;
    })
    .test('is-number', '숫자만 입력 가능합니다.', (value) => {
      if (value === null || value === '') return true;
      return !isNaN(value) && value >= 0;
    })
    .test('max-length', '최대 길이는 5 입니다', (value) => {
      if (value === null || value === '') return true;
      return String(value).length <= 5;
    }),
  viewItems: array()
    .min(1, '조회항목을 선택해 주세요')
    .test('unique', '중복된 항목이 있습니다', (list) => {
      if (!list) return true;
      const set = new Set(list);
      return set.size === list.length;
    }),
  approvalBoxName: string()
    .min(1, '명칭을 입력해 주세요')
    .max(50, '명칭은 최대 50글자입니다.'),
  compId: number(),
});

const checkBoxCreateData = (data) => {
  console.log(data);
  return docSearchSchema.validate(data, { abortEarly: false });
};

export { checkBoxCreateData };
