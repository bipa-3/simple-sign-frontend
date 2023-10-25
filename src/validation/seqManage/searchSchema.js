import { object, string, number } from 'yup';

const searchSchema = object().shape({
  compId: number()
    .required('회사번호는 필수 선택 사항입니다.')
    .integer('회사번호는 정수여야 합니다.'),
  seqName: string().max(20, '채번명은 최대 20글자입니다.'),
  code: string().max(20, '채번코드는 최대 20글자입니다.'),
});

const checkSearchData = (data) => {
  console.log(data);
  return searchSchema.validate(data);
};

export { checkSearchData };
