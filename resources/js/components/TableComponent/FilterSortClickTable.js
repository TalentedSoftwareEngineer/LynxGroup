import React, { useMemo } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";

const FilterSortClickTable = props => {
  const columns = [
    {
      name: "id",
      selector: row => row.id,
      sortable: true,
    //   grow: 2
    },
    {
      name: "名前",
      selector: row => row.customer_name,
      sortable: true,
      hide: "sm"
    },
    {
      name: "電話番号",
      selector: row => row.customer_tel,
      sortable: true
    },
    {
      name: "メモ",
      selector: row => row.customer_memo,
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
      striped
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
      pointerOnHover
      highlightOnHover
      onRowDoubleClicked={(row) => props.doubleClick(row.customer_name, row.customer_tel)}
    />
  );
};

export default FilterSortClickTable;