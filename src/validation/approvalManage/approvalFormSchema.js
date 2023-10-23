import { object, string, number, array } from 'yup';

const formCreateSchema = object().shape({
  formCode: number(),
  approvalDocTitle: string()
    .required('제목은 필수 입력 사항입니다.')
    .min(1, '제목은 최소 1글자입니다.')
    .max(100, '제목은 최대 100글자입니다.'),
  seqCode: string().required('품의번호는 필수 입력 사항입니다.'),
  approverList: array()
    .required('결재라인을 최소 1명 이상 입력하세요.')
    .min(1, '결재라인을 최소 한 명이상 입력하세요.')
    .max(8, '최대 결재수는 8명입니다.'),
  receiveRefList: array().max(15, '수신참조는 총 15까지 등록 가능합니다.'),
});

const checkFormCreateData = (data) => {
  console.log(data);
  return formCreateSchema.validate(data);
};

export { checkFormCreateData };
