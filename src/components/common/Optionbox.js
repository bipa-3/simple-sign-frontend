import OptionboxItem from './OptionboxItem';
import { BiSolidUser, BiSolidFolder, BiBuildings } from 'react-icons/bi';
import { AiFillFolder } from 'react-icons/ai';
import React, { useEffect } from 'react';

function Optionbox(props) {
  // console.log('inidt:', props);
  let icon = null;
  let initData = props.initData;
  let id = props.id;
  let name, category, useId;

  if (initData.category) {
    category = initData.category;

    if (category === 'U') {
      icon = <BiSolidUser />;
      name = initData.name || initData.user;
      useId = initData.useId || initData.userId;
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
    } else if (category === 'F') {
      name = initData.name;
      useId = initData.useId;
    } else {
      name = initData.name;
    }
  } else {
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
