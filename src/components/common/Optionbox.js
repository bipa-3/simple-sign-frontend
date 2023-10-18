import OptionboxItem from './OptionboxItem';
import { BiSolidUser, BiSolidFolder, BiBuildings } from 'react-icons/bi';
import { AiFillFolder } from 'react-icons/ai';
import React from 'react';

function Optionbox(props) {
  // console.log('inidt:', initData);
  let icon = null;
  let initData = props.initData;
  let id = props.id;
  let name = '';
  let category = initData.category;
  let useId = '';

  if (props.category === 'null') {
  } else if (category === 'U') {
    icon = <BiSolidUser />;
    name = initData.name || initData.user;
    useId = initData.useId || initData.userId;
  } else if (category === 'D') {
    icon = <BiSolidFolder />;
    name = initData.name || initData.department;
    useId = initData.useId || initData.deptId;
  } else if (category === 'C') {
    icon = <BiBuildings />;
    name = initData.name || initData.company;
    useId = initData.useId || initData.compId;
  } else if (category === 'E') {
    icon = <AiFillFolder />;
    name = initData.name || initData.establishment;
    useId = initData.useId || initData.estId;
  }

  return (
    <div>
      <OptionboxItem
        icon={icon}
        name={name}
        id={id}
        category={category}
        useId={useId}
        onValueChange={props.dataHandler}
      ></OptionboxItem>
    </div>
  );
}
export default Optionbox;
