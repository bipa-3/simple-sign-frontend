import { object, string, number, array } from 'yup';

const boxUseDeptSchema = object().shape({
  boxUseDept: array()
    .min(1, '메뉴 사용범위를 선택해 주세요')
    .test('unique', '중복된 항목이 있습니다', (list) => {
      if (!list) return true;

      const set = new Set(list);
      return set.size === list.length;
    }),
});

const checkBoxUseDeptData = (data) => {
  console.log(data);
  return boxUseDeptSchema.validate(data);
};

export { checkBoxUseDeptData };
