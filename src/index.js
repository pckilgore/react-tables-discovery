import React from "react";
import { render } from "react-dom";

// Import React Table
import ReactTable, { ReactTableDefaults } from "react-table";
import "react-table/react-table.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";

// helpers
import dayjs from "dayjs";

// Components
import Select from "react-select";

// Data
import { dummyData } from "./test_data";

export const columns = [
  {
    Header: "Tag Name",
    accessor: "name"
  },
  {
    Header: "Created Date",
    accessor: "created",
    Cell: props => dayjs(props.value).format("MMMM D, YYYY")
  },
  {
    Header: "Used In",
    accessor: "contacts",
    Cell: props => (
      <div>
        {props.value} Contacts <span />
      </div>
    )
  }
];

const colDefaults = {
  ...ReactTableDefaults.column,
  headerStyle: {
    textAlign: "left"
  }
};

const CheckboxTable = checkboxHOC(ReactTable);
class App extends React.Component {
  constructor() {
    super();
    const data = dummyData;
    this.state = {
      data,
      columns,
      selection: [],
      selectAll: false
    };
  }

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original.id);
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  logSelection = () => {
    console.log("selection:", this.state.selection);
  };

  render() {
    const { toggleSelection, toggleAll, isSelected, logSelection } = this;
    const { data, columns, selectAll } = this.state;

    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        // someone asked for an example of a background color change
        // here it is...
        const selected = this.isSelected(r.original.id);
        return {
          style: {
            backgroundColor: selected ? "lightgreen" : "inherit"
            // color: selected ? 'white' : 'inherit',
          }
        };
      }
    };

    return (
      <div>
        <button onClick={logSelection}>Log Selection</button>
        <CheckboxTable
          ref={r => (this.checkboxTable = r)}
          data={data}
          columns={columns}
          column={colDefaults}
          sortable={false}
          keyField="id"
          className="-striped -highlight"
          {...checkboxProps}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
