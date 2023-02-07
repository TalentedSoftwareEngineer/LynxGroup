import React, { useMemo } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";

const TherapistShiftTable = props => {
  const columns = [
    {
      id: 'id',
      name: "id",
      selector: row => row.id,
      sortable: true,
    //   grow: 2
    },
    {
      id: 'therapist_name',
      name: "セラピスト名",
      selector: row => row.therapist_name,
      sortable: true,
      hide: "sm"
    },
    {
      id: 'shift_store',
      name: "店舗",
      selector: row => row.shift_store,
      sortable: true,
      hide: "sm"
    },
    {
      id: 'shift_fromTime',
      name: "開始時間",
      selector: row => row.shift_fromTime,
      sortable: true
    },
    {
      id: 'shift_toTime',
      name: "終了時間",
      selector: row => row.shift_toTime,
      sortable: true,
      hide: "md"
    },
  ];

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );

  const filteredItems = props.data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      title={props.title}
      columns={columns}
      data={filteredItems}
      defaultSortField="id"
      defaultSortFieldId={'shift_fromTime'}
      defaultSortAsc={false}
      striped
      pagination
      paginationPerPage={50}
      paginationRowsPerPageOptions={[50, 75, 100]}
      subHeader
      subHeaderComponent={subHeaderComponent}
      pointerOnHover
      highlightOnHover
      onRowDoubleClicked={(row) => props.doubleClick(row.id, row.therapist_name, row.shift_store, row.shift_fromTime, row.shift_toTime)}
    />
  );
};

export default TherapistShiftTable;