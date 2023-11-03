import { object, string, number, array } from 'yup';

const scopeSchema = object().shape({
  category: string().required('분류 항목이 없습니다.'),
  useId: number().required('분류 코드가 없습니다.'),
});

const seqCreateSchema = object().shape({
  // code: number().required('선택된 채번번호가 없습니다.'),
  compId: number().required('회사번호는 필수 선택 사항입니다.'),
  seqName: string()
    .min(1, '채번명은 필수 입력 사항입니다.')
    .max(20, '채번명은 최대 20자리까지 입력 가능합니다.'),
  deptScope: array().min(1, '대상부서는 필수 입력 사항입니다.').of(scopeSchema),
  formScope: array().min(1, '대상양식은 필수 입력 사항입니다.').of(scopeSchema),
  description: string().max(40, '설명은 최대 40자까지 입력 가능합니다.'),
  seqList: array()
    .min(1, '채번값 설정은 최소 1개의 항목이 필요합니다.')
    .max(10, '채번값 설정은 최대 10개의 항목까지 허용됩니다.')
    .typeError('채번값 항목의 자리수는 필수 항목입니다.'),
  seqString: string(),
  sortOrder: number()
    .integer('정렬순서는 정수만 입력 가능합니다.')
    .typeError('정렬순서는 숫자만 입력 가능합니다.')
    .max(127, '정렬순서는 최대 127까지 입력 가능합니다.'),
});

const seqUpdateSchema = object().shape({
  // code: number().required('선택된 채번번호가 없습니다.'),
  compId: number().required('회사번호는 필수 선택 사항입니다.'),
  seqName: string()
    .min(1, '채번명은 필수 입력 사항입니다.')
    .max(20, '채번명은 최대 20자리까지 입력 가능합니다.'),
  deptScope: array().min(1, '대상부서는 필수 입력 사항입니다.').of(scopeSchema),
  formScope: array().min(1, '대상양식은 필수 입력 사항입니다.').of(scopeSchema),
  description: string().max(40, '설명은 최대 40자까지 입력 가능합니다.'),
  seqList: array()
    .min(1, '채번값 설정은 최소 1개의 항목이 필요합니다.')
    .max(10, '채번값 설정은 최대 10개의 항목까지 허용됩니다.')
    .typeError('채번값 항목의 자리수는 필수 항목입니다.'),
  seqString: string(),
  sortOrder: number()
    .integer('정렬순서는 정수만 입력 가능합니다.')
    .typeError('정렬순서는 숫자만 입력 가능합니다.')
    .max(127, '정렬순서는 최대 127까지 입력 가능합니다.'),
});

const requiredSeqItems = ['12', '13', '14', '15'];

const checkRequiredSeqItems = (arr) => {
  for (let i of requiredSeqItems) {
    if (arr.includes(i)) {
      return true;
    }
  }
  return false;
};

const checkSeqCreateData = (data) => {
  console.log(data);

  if (data.seqString !== '') {
    let splitedSeqArr = data.seqString.split(',');
    if (splitedSeqArr !== [] && checkRequiredSeqItems(splitedSeqArr)) {
      data = { ...data, seqList: data.seqString.split(',') };
    }
  } else {
    data = { ...data, seqList: [] };
  }
  return seqCreateSchema.validate(data);
};

const checkSeqUpdateData = (data) => {
  console.log(data);
  if (data.seqString !== '') {
    let splitedSeqArr = data.seqString.split(',');
    if (splitedSeqArr !== [] && checkRequiredSeqItems(splitedSeqArr)) {
      data = { ...data, seqList: data.seqString.split(',') };
    }
    // data = { ...data, seqList: data.seqString.split(',') };
  } else {
    data = { ...data, seqList: [] };
  }
  return seqUpdateSchema.validate(data);
};

export { checkSeqCreateData, checkSeqUpdateData };
