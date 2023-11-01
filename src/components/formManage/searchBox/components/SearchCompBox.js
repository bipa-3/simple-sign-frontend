import { ItemBox, TextComp, SelectComp } from '../components/SearchItem';
import { useFormManage } from '../../../../contexts/FormManageContext';

export default function SearchCompBox() {
  const { setData, setSearchDataById } = useFormManage();
  return (
    <ItemBox
      children={
        <>
          <TextComp text={'회사'} />
          <SelectComp
            width={'170px'}
            options={setData.compList}
            id={'compId'}
            dataHandler={setSearchDataById}
          />
        </>
      }
    ></ItemBox>
  );
}
