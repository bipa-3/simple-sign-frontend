import { object, string, number, array, date } from 'yup';

const boxCreateSchema = object().shape({
  startDate: date().nullable().typeError('유효한 날짜 형식이어야 합니다.'),
  endDate: date().nullable().typeError('유효한 날짜 형식이어야 합니다.'),
  searchWriter: string().nullable(),
  searchApprovUser: string().nullable(),
  searchApprovState: number()
    .nullable()
    .typeError('결재상태는 숫자 형식이어야 합니다 .'),
  searchDocForm: string().nullable(),
  searchDocNumber: number()
    .transform((value, originalValue) => {
      // originalValue가 빈 문자열인 경우 null로 변환
      return originalValue === '' ? null : value;
    })
    .nullable(),
});

const checkDocSearchData = (data) => {
  console.log(data);
  return boxCreateSchema.validate(data);
};

export { checkDocSearchData };
