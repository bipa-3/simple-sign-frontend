import { object, string, number, array } from 'yup';

const replyCreateSchema = object().shape({
  replyContent: string()
    .required('댓글 내용을 입력해주세요.')
    .max(10000, '글자수가 너무 많습니다.'),
});

const checkReplyCreateData = (data) => {
  console.log(data);
  return replyCreateSchema.validate(data);
};

export { checkReplyCreateData };
