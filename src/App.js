import {
  Center,
  Heading,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { IconButton } from "@mui/material"

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTable,  usePagination, useGlobalFilter, useSortBy } from "react-table";
import { GlobalFilter } from './GlobalFilter';
const url = "https://ixonotest.herokuapp.com/api/User/get-profiles";

const tableColumn = [
  {
    Header: "Submit Data",
    columns: [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "mobileNum",
        accessor: "mobileNum",
      },
    ],
  },
];

const App = () => {
  const [users, setUsers] = useState([]);

  const columns = useMemo(() => tableColumn, []);
  const data = useMemo(() => users, [users]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    nextPage,
    prevPage,
    pageCount,
    pageOptions,
    setPageSize,
    setGlobalFilter,
    state,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,



  );

const {globalFilter} = state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(url);
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
  console.log(users);

  if (users.length === 0)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
      <Heading justify-content="center" gap="100">React Table </Heading>
      <Table   {...getTableProps()} style ={{border: 'solid 1px black' }}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{
                         borderBottom: 'solid 3px red',
                         color: 'black',
                       }} >
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  {}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);

            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}
                  style={{
                             padding: '10px',
                             border: 'solid 1px gray',
                           }}>{cell.render("Cell")}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justify="space-between"  m={4} align="center">
        <Flex gap="4">
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              icon={<ArrowLeftIcon h="3" w="3" />}
            >First</IconButton>
          </Tooltip>
          <Tooltip label="Prev Page">
            <IconButton
              onClick={prevPage}
              icon={<ChevronLeftIcon h="3" w="3" />}
            >Prev</IconButton>
          </Tooltip>
        </Flex>
        <Flex align="center">
          <Flex align="center" gap="4">
            Page={""}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>
            of
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Flex>

        <NumberInput w={35} h={20} min={1} max={pageOptions.length} 
        
        onChange={(value) => {
          const page = value ? value - 1 : 0;
          gotoPage(page);
          }} 
          defaultValue={pageIndex}
          >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper ></NumberIncrementStepper>
            <NumberDecrementStepper ></NumberDecrementStepper>
          </NumberInputStepper>
        </NumberInput>
        </Flex>
        
        <Select w="29" value={pageSize} gap="4" onChange={
          (e)=>{
            setPageSize(Number(e.target.value))
          }
        }
        >
          {[5,10,15,20,25,50,100].map((pageSize) => (<option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
          ))}
        </Select>

        <Flex gap="4">
          <Tooltip label="Next Page">
            <IconButton
              onClick={nextPage}
              icon={<ChevronRightIcon h="3" w="3" />}
            >Next</IconButton>
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => {
                gotoPage(pageCount - 1);
              }}
              icon={<ArrowRightIcon h="3" w="3" />}
            >Last</IconButton>
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
};

export default App;
