import { ItemBox, TextComp, InputComp } from '../components/SearchItem';
import { useFormManage } from '../../../../contexts/FormManageContext';

export default function SearchFormBox() {
  const { setData, setSearchDataById } = useFormManage();
  return (
    <ItemBox
      children={
        <>
          <TextComp text={'양식명'} />
          <InputComp id={'formName'} dataHandler={setSearchDataById} />
        </>
      }
    ></ItemBox>
  );
}
