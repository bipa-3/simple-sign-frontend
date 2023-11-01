import { ItemBox, TextComp, SelectComp } from '../components/SearchItem';
import { useFormManage } from '../../../../contexts/FormManageContext';

export default function SearchStatusBox() {
  const { setData, setSearchDataById } = useFormManage();
  return (
    <ItemBox
      children={
        <>
          <TextComp text={'사용여부'} />
          <SelectComp
            width={'170px'}
            options={setData.statusList}
            id={'status'}
            dataHandler={setSearchDataById}
          />
        </>
      }
    ></ItemBox>
  );
}
