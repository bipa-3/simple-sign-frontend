import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import Label from '@mui/icons-material/Label';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { getTreeView } from '../../apis/orgAPI/getTreeView';
import { getCompId } from '../../utils/getUser';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(0),
    borderBottomRightRadius: theme.spacing(0),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
  [`& .${treeItemClasses.group} .${treeItemClasses.group}`]: {
    paddingLeft: theme.spacing(2),
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      {...other}
      ref={ref}
    />
  );
});

function renderTreeItems(data) {
  return data.map((item) => {
    let icon;
    switch (item.type) {
      case 'company':
        icon = ApartmentIcon;
        break;
      case 'businessUnit':
        icon = CorporateFareIcon;
        break;
      case 'department':
        icon = FolderOpenIcon;
        break;
      default:
        icon = Label;
        break;
    }

    return (
      <StyledTreeItem
        key={item.id}
        nodeId={item.id}
        labelText={item.name}
        labelIcon={icon}
      >
        {item.children && renderTreeItems(item.children)}
      </StyledTreeItem>
    );
  });
}

export default function OrgTreeView({ onNodeSelect }) {
  const handleNode = (e, nodeId) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  };

  const transformData = (data) => {
    const transformDepartments = (depts, compId, estId) => {
      return depts.map((dept) => {
        const baseId = compId ? `${compId}-` : '';
        const estBaseId = estId ? `${estId}-` : '';
        return {
          id: `${baseId}${estBaseId}${dept.deptId}`,
          name: dept.deptName,
          type: 'department',
          children: dept.subDepts
            ? transformDepartments(dept.subDepts, compId, estId)
            : [],
        };
      });
    };

    return data.map((company) => ({
      id: `${company.compId}`,
      name: company.compName,
      type: 'company',
      children: company.ests.map((est) => ({
        id: `${company.compId}-${est.estId}`,
        name: est.estName,
        type: 'businessUnit',
        children: transformDepartments(est.depts, company.compId, est.estId),
      })),
    }));
  };

  const [org, setOrg] = useState([]);

  useEffect(() => {
    const orgdata = async () => {
      try {
        const response = await getTreeView(getCompId());
        if (response && response.data) {
          setOrg(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    orgdata();
  }, []);

  const transformDatas = transformData(org);

  return (
    <TreeView
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      sx={{ height: 400, flexGrow: 3, maxWidth: 500, overflowY: 'auto' }}
      onNodeSelect={handleNode}
    >
      {renderTreeItems(transformDatas)}
    </TreeView>
  );
}
