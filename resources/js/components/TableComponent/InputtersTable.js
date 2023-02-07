import React, { useMemo } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";

const InputtersTable = props => {
  const columns = [
    {
      name: "id",
      selector: row => row.id,
      sortable: true,
    //   grow: 2
    },
    {
      name: "入力者名",
      selector: row => row.inputter_name,
      sortable: true,
      // hide: "sm"
    },
    {
      name: "メモ",
      selector: row => row.inputter_memo,
      sortable: true,
      // hide: "sm"
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
      striped
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
      pointerOnHover
      highlightOnHover
      onRowDoubleClicked={(row) => props.doubleClick(row.id, row.inputter_name, row.inputter_memo)}
    />
  );
};

export default InputtersTable;