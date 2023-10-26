import { object, string, number, array } from 'yup';

const scopeSchema = object().shape({
  category: string().required('분류 항목이 없습니다.'),
  useId: number().required('분류 코드가 없습니다.'),
});

const formCreateSchema = object().shape({
  compId: number().required('회사는 필수 선택 사항입니다.'),
  formName: string()
    .required('양식명은 필수 입력 사항입니다.')
    .min(3, '양식명은 최소 3글자입니다.')
    .max(20, '양식명은 최대 20글자입니다.'),
  scope: array().of(scopeSchema),
  mainForm: string().max(10000, '기본 파일이 최대 크기를 초과했습니다.'),
  defaultForm: string().max(10000, '본문 파일이 최대 크기를 초과했습니다.'),
  status: number()
    .required('사용여부는 필수 선택 사항입니다.')
    .integer('사용여부는 정수여야 합니다.'),
  formExplain: string().max(50, '양식설명은 최대 50글자입니다.'),
});

const formUpdateSchema = object().shape({
  code: number().required('선택된 양식이 없습니다.'),
  formName: string()
    .required('양식명은 필수 입력 사항입니다.')
    .min(3, '양식명은 최소 3글자입니다.')
    .max(20, '양식명은 최대 20글자입니다.'),
  scope: array().of(scopeSchema),
  mainForm: string(),
  defaultForm: string().min(1, '기본파일은 필수 입력 사항입니다.'),
  status: number()
    .required('사용여부는 필수 선택 사항입니다.')
    .integer('사용여부는 정수여야 합니다.'),
  formExplain: string().max(50, '양식설명은 최대 50글자입니다.'),
});

const checkFormCreateData = (data) => {
  console.log(data);
  return formCreateSchema.validate(data);
};

const checkFormUpdateData = (data) => {
  console.log(data);
  return formUpdateSchema.validate(data);
};

export { checkFormCreateData, checkFormUpdateData };
